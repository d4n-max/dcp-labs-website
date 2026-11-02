import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'
// These lifecycle events are exposed by GSAP core (and used by ScrollTrigger),
// but are absent from the bundled GSAP TypeScript declaration.
const mediaEvents = gsap as typeof gsap & {
  addEventListener(type: 'matchMediaInit', callback: () => void): void
  removeEventListener(type: 'matchMediaInit', callback: () => void): void
}

// Keep preference changes inside GSAP's revert/rebuild transaction. The scene
// hooks still own their existing timelines and breakpoint-specific choreography.
export function watchMotionPreference(
  root: HTMLElement,
  chapterSelector: string,
  setup: (reduced: boolean) => () => void,
) {
  const media = gsap.matchMedia()
  let reduced = window.matchMedia(REDUCED_QUERY).matches
  let readingPosition: { chapter: number; section: HTMLElement | null; focused: HTMLElement | null } | null = null
  let frame = 0
  let refreshFrame = 0
  let refreshFocused: HTMLElement | null = null
  let lastFocused: HTMLElement | null = null
  const rememberFocus = (event: FocusEvent) => {
    lastFocused = event.target instanceof HTMLElement ? event.target : null
  }
  const forgetFocus = () => {
    // An old pin reverting can briefly make its chapter inert before our
    // media callback runs. Retain that control across this transaction only.
    if (window.matchMedia(REDUCED_QUERY).matches === reduced) lastFocused = null
  }
  root.addEventListener('focusin', rememberFocus)
  root.addEventListener('focusout', forgetFocus)

  const chapters = () => Array.from(root.querySelectorAll<HTMLElement>(chapterSelector))
  const storyPin = () => ScrollTrigger.getAll().find(trigger =>
    trigger.pin && root.contains(trigger.pin) &&
    chapters().some(chapter => trigger.pin?.contains(chapter)),
  )
  const trackTween = (trigger: ScrollTrigger) => {
    const track = root.querySelector('[data-story-track], [data-rf-track], [data-cr-track]')
    return trigger.animation instanceof gsap.core.Timeline
      ? trigger.animation.getChildren().find((tween): tween is gsap.core.Tween =>
        tween instanceof gsap.core.Tween && tween.targets().includes(track))
      : undefined
  }

  let lastScroll = window.scrollY
  let positions: { top: number; height: number }[] = []
  let sections: { element: HTMLElement; top: number }[] = []
  let clock: { start: number; end: number; duration: number; entry: number; travel: number } | null = null
  const measure = () => {
    if (window.matchMedia(REDUCED_QUERY).matches !== reduced) return
    const items = chapters()
    const pin = storyPin()
    const tween = pin && trackTween(pin)
    clock = pin ? { start: pin.start, end: pin.end, duration: pin.animation?.duration() ?? 1, entry: tween?.startTime() ?? 0, travel: tween?.duration() ?? 1 } : null
    positions = items.map(item => { const rect = item.getBoundingClientRect(); return { top: rect.top + window.scrollY, height: rect.height } })
    sections = Array.from(root.querySelectorAll<HTMLElement>('section'))
      .filter(item => !items.some(chapter => item.contains(chapter)))
      .map(element => ({ element, top: element.getBoundingClientRect().top + window.scrollY }))
  }
  // A late automatic refresh can temporarily make the focused chapter inert
  // after the media-change restoration has already completed. Preserve the
  // control across that refresh too, without taking focus from another control.
  const captureRefreshFocus = () => {
    const active = document.activeElement
    if (active instanceof HTMLElement && root.contains(active)) refreshFocused = active
    else if (active !== document.body) refreshFocused = null
  }
  const clearRefreshFocus = () => { refreshFocused = null }
  const onRefresh = () => {
    measure()
    window.cancelAnimationFrame(refreshFrame)
    refreshFrame = window.requestAnimationFrame(() => {
      const target = refreshFocused
      refreshFocused = null
      const active = document.activeElement
      if (!target?.isConnected || !root.contains(target) || target.closest('[inert]') ||
        (active !== document.body && active !== target)) return
      const rect = target.getBoundingClientRect()
      if (rect.bottom > 72 && rect.top < window.innerHeight) target.focus({ preventScroll: true })
    })
  }
  // Cache the scroll number only, not layout, on scroll. GSAP's own media-init
  // handler reverts pins before user callbacks; old geometry must be retained.
  const rememberScroll = () => {
    if (!readingPosition && window.matchMedia(REDUCED_QUERY).matches === reduced) lastScroll = window.scrollY
  }
  const capture = () => {
    const next = window.matchMedia(REDUCED_QUERY).matches
    if (next === reduced) return
    reduced = next
    const items = chapters()
    const focused = lastFocused ?? document.activeElement
    let chapter = items.findIndex(item => focused instanceof Node && item.contains(focused))
    if (chapter < 0 && clock && lastScroll >= clock.start && lastScroll <= clock.end) {
      const time = (lastScroll - clock.start) / (clock.end - clock.start) * clock.duration
      chapter = Math.max(0, Math.min(items.length - 1, Math.round((time - clock.entry) / clock.travel * (items.length - 1))))
    }
    if (chapter < 0 && !clock) {
      chapter = positions.map((rect, index) => ({ ...rect, index }))
        .filter(rect => rect.top + rect.height > lastScroll + 72 && rect.top < lastScroll + window.innerHeight)
        .sort((a, b) => Math.abs(a.top - lastScroll - 72) - Math.abs(b.top - lastScroll - 72))[0]?.index ?? -1
    }
    const section = [...sections].sort((a, b) => Math.abs(a.top - lastScroll - 72) - Math.abs(b.top - lastScroll - 72))[0]?.element ?? null
    readingPosition = { chapter, section, focused: focused instanceof HTMLElement && root.contains(focused) ? focused : null }
  }
  window.addEventListener('scroll', rememberScroll, { passive: true })
  ScrollTrigger.addEventListener('refreshInit', captureRefreshFocus)
  ScrollTrigger.addEventListener('refresh', onRefresh)
  document.addEventListener('pointerdown', clearRefreshFocus, true)
  mediaEvents.addEventListener('matchMediaInit', capture)

  media.add({ reduced: REDUCED_QUERY, normal: '(prefers-reduced-motion: no-preference)' }, match => {
    const cleanup = setup(Boolean(match.conditions?.reduced))
    frame = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      if (!readingPosition) { measure(); rememberScroll(); return }
      const { chapter, section, focused } = readingPosition
      readingPosition = null
      const pin = storyPin()
      if (chapter >= 0 && pin) {
        const tween = trackTween(pin)
        const progress = tween && pin.animation
          ? (tween.startTime() + tween.duration() * chapter / Math.max(1, chapters().length - 1)) / pin.animation.duration()
          : chapter / Math.max(1, chapters().length - 1)
        window.scrollTo({ top: pin.start + (pin.end - pin.start) * progress, behavior: 'instant' })
      } else {
        const target = chapter >= 0 ? chapters()[chapter] : section
        if (target) window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - 84, behavior: 'instant' })
      }
      ScrollTrigger.update()
      // Settle the newly created scrub at the restored reading position.
      ScrollTrigger.getAll().filter(trigger => trigger.pin && root.contains(trigger.pin))
        .forEach(trigger => trigger.getTween()?.progress(1))
      if (focused && !focused.closest('[inert]')) {
        focused.focus({ preventScroll: true })
        const rect = focused.getBoundingClientRect()
        if (rect.top < 72 || rect.bottom > window.innerHeight) {
          focused.scrollIntoView({ block: 'center', behavior: 'instant' })
        }
      }
      measure()
      rememberScroll()
    })
    return () => {
      window.cancelAnimationFrame(frame)
      cleanup()
    }
  })

  return () => {
    window.cancelAnimationFrame(frame)
    window.cancelAnimationFrame(refreshFrame)
    mediaEvents.removeEventListener('matchMediaInit', capture)
    root.removeEventListener('focusin', rememberFocus)
    root.removeEventListener('focusout', forgetFocus)
    window.removeEventListener('scroll', rememberScroll)
    ScrollTrigger.removeEventListener('refreshInit', captureRefreshFocus)
    ScrollTrigger.removeEventListener('refresh', onRefresh)
    document.removeEventListener('pointerdown', clearRefreshFocus, true)
    media.revert()
  }
}

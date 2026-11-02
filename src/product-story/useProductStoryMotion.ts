import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { watchMotionPreference } from './watchMotionPreference'

gsap.registerPlugin(ScrollTrigger)

const DESKTOP_STORY_QUERY = '(min-width: 1200px) and (min-height: 700px)'
const VERTICAL_STORY_QUERY = '(max-width: 1199px), (max-height: 699px)'

type Composition =
  | 'split'
  | 'quote'
  | 'center'
  | 'reverse'
  | 'completion'

type MotionState = gsap.TweenVars

const entryStates: Record<
  Composition,
  { title: MotionState; details: MotionState; visual: MotionState }
> = {
  split: {
    title: { yPercent: 112 },
    details: { x: -48, y: 20, opacity: 0.24 },
    visual: { x: 110, y: 76, scale: 0.92, opacity: 0.36 },
  },
  quote: {
    title: { yPercent: -112 },
    details: { x: 46, opacity: 0.24 },
    visual: { x: -320, y: -34, scale: 0.9, opacity: 0.34 },
  },
  center: {
    title: { yPercent: 112 },
    details: { y: 46, opacity: 0.24 },
    visual: { x: -300, y: 126, scale: 0.88, opacity: 0.34 },
  },
  reverse: {
    title: { yPercent: -112 },
    details: { x: 52, opacity: 0.24 },
    visual: { x: -360, y: 62, scale: 0.92, opacity: 0.34 },
  },
  completion: {
    title: { yPercent: 112 },
    details: { y: 52, opacity: 0.24 },
    visual: { x: -300, y: 112, scale: 0.88, opacity: 0.34 },
  },
}

const exitStates: Record<
  Composition,
  { title: MotionState; details: MotionState; visual: MotionState }
> = {
  split: {
    title: { x: -68, opacity: 0.38 },
    details: { x: -86, y: -16, opacity: 0.3 },
    visual: { x: -106, y: -44, scale: 0.955, opacity: 0.42 },
  },
  quote: {
    title: { y: -48, opacity: 0.38 },
    details: { x: -58, opacity: 0.3 },
    visual: { x: -116, y: 30, scale: 0.945, opacity: 0.42 },
  },
  center: {
    title: { y: -58, opacity: 0.38 },
    details: { y: -48, opacity: 0.3 },
    visual: { y: -98, scale: 0.95, opacity: 0.42 },
  },
  reverse: {
    title: { x: 68, opacity: 0.38 },
    details: { x: 88, y: -14, opacity: 0.3 },
    visual: { x: 104, y: -42, scale: 0.955, opacity: 0.42 },
  },
  completion: {
    title: { y: -48, opacity: 0.38 },
    details: { y: -38, opacity: 0.3 },
    visual: { y: -72, scale: 0.96, opacity: 0.42 },
  },
}

function getComposition(chapter: HTMLElement): Composition {
  const composition = chapter.dataset.composition

  if (
    composition === 'quote' ||
    composition === 'center' ||
    composition === 'reverse' ||
    composition === 'completion'
  ) {
    return composition
  }

  return 'split'
}

function updateChapterProgress(
  root: HTMLElement,
  progress: number,
  chapterCount: number,
) {
  const safeProgress = Math.min(1, Math.max(0, progress))
  root.style.setProperty('--story-progress', String(safeProgress))
  const activeIndex = Math.min(
    chapterCount - 1,
    Math.max(0, Math.round(safeProgress * (chapterCount - 1))),
  )

  root
    .querySelectorAll<HTMLElement>('[data-story-progress-item]')
    .forEach((item, index) => {
      const active = index === activeIndex
      item.dataset.active = String(active)
      item.dataset.completed = String(index < activeIndex)
      if (active) {
        item.setAttribute('aria-current', 'step')
      } else {
        item.removeAttribute('aria-current')
      }
    })
}

export function useProductStoryMotion(
  rootRef: RefObject<HTMLDivElement | null>,
) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const chapters = Array.from(
      root.querySelectorAll<HTMLElement>('[data-story-chapter]'),
    )

    return watchMotionPreference(root, '[data-story-chapter]', reduced => {
      if (reduced) {
        root.dataset.motion = 'reduced'
        updateChapterProgress(root, 0, chapters.length)
        return () => {
          delete root.dataset.motion
          root.style.removeProperty('--story-progress')
        }
      }

      root.dataset.motion = 'enhanced'

      const context = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('[data-story-brand]', {
            y: 26,
            opacity: 0,
            duration: 0.48,
          })
          .from(
            '[data-story-hero-heading]',
            { yPercent: 112, duration: 0.72 },
            0.12,
          )
          .from(
            '[data-story-hero-description]',
            { x: -30, opacity: 0, duration: 0.56 },
            0.38,
          )
          .from(
            '[data-story-hero-actions]',
            { y: 22, opacity: 0, duration: 0.48 },
            0.55,
          )
          .from(
            '[data-story-hero-visual]',
            {
              x: 84,
              y: 34,
              scale: 0.94,
              opacity: 0,
              duration: 0.82,
            },
            0.2,
          )

        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '[data-story-hero]',
              start: 'top top',
              end: 'bottom top',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          })
          .to('[data-story-hero-copy]', { xPercent: -4, opacity: 0.58 }, 0)
          .to(
            '[data-story-hero-visual]',
            { xPercent: 5, yPercent: -3, scale: 1.025, opacity: 0.76 },
            0,
          )

        const mediaQueries = gsap.matchMedia()

        mediaQueries.add(DESKTOP_STORY_QUERY, () => {
          const viewport = root.querySelector<HTMLElement>(
            '[data-story-viewport]',
          )
          const track = root.querySelector<HTMLElement>('[data-story-track]')
          if (!viewport || !track || chapters.length === 0) return

          const titles = chapters.map((chapter) =>
            chapter.querySelector<HTMLElement>('[data-story-chapter-title]'),
          )
          const details = chapters.map((chapter) =>
            chapter.querySelector<HTMLElement>('[data-story-chapter-details]'),
          )
          const visuals = chapters.map((chapter) =>
            chapter.querySelector<HTMLElement>('[data-story-chapter-visual]'),
          )
          const compositions = chapters.map(getComposition)

          chapters.slice(1).forEach((_, offset) => {
            const index = offset + 1
            const entry = entryStates[compositions[index]]
            gsap.set(titles[index], entry.title)
            gsap.set(details[index], entry.details)
            gsap.set(visuals[index], entry.visual)
          })

          const horizontalDistance = () =>
            Math.max(0, track.scrollWidth - window.innerWidth)
          const scrollDistance = () =>
            Math.max(
              horizontalDistance() * 0.88,
              window.innerHeight * (chapters.length - 0.5),
            )

          const storyTimeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: viewport,
              start: 'top top',
              end: () => `+=${scrollDistance()}`,
              pin: true,
              scrub: 0.62,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                updateChapterProgress(root, self.progress, chapters.length)
              },
            },
          })

          const timelineDuration = chapters.length - 1
          storyTimeline.to(
            track,
            {
              x: () => -horizontalDistance(),
              duration: timelineDuration,
            },
            0,
          )

          chapters.forEach((_, index) => {
            const chapterLabel = `chapter-${index + 1}`
            const composition = compositions[index]
            const exit = exitStates[composition]

            storyTimeline.addLabel(chapterLabel, index)

            if (index > 0) {
              const entryAt = index - 0.68
              storyTimeline
                .to(
                  titles[index],
                  { x: 0, y: 0, yPercent: 0, opacity: 1, duration: 0.48 },
                  entryAt,
                )
                .to(
                  details[index],
                  { x: 0, y: 0, opacity: 1, duration: 0.5 },
                  entryAt + 0.08,
                )
                .to(
                  visuals[index],
                  {
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.58,
                  },
                  entryAt + 0.02,
                )
            }

            if (index < chapters.length - 1) {
              const exitAt = index + 0.38
              storyTimeline
                .to(
                  titles[index],
                  { ...exit.title, duration: 0.5 },
                  exitAt,
                )
                .to(
                  details[index],
                  { ...exit.details, duration: 0.5 },
                  exitAt + 0.04,
                )
                .to(
                  visuals[index],
                  { ...exit.visual, duration: 0.56 },
                  exitAt + 0.02,
                )
            }
          })

          updateChapterProgress(root, 0, chapters.length)
        })

        mediaQueries.add(VERTICAL_STORY_QUERY, () => {
          updateChapterProgress(root, 0, chapters.length)

          chapters.forEach((chapter, index) => {
            const title = chapter.querySelector<HTMLElement>(
              '[data-story-chapter-title]',
            )
            const details = chapter.querySelector<HTMLElement>(
              '[data-story-chapter-details]',
            )
            const visual = chapter.querySelector<HTMLElement>(
              '[data-story-chapter-visual]',
            )
            const composition = getComposition(chapter)
            const visualX = composition === 'reverse' ? -54 : 54

            gsap
              .timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                  trigger: chapter,
                  start: 'top 86%',
                  end: 'top 42%',
                  scrub: 0.38,
                  invalidateOnRefresh: true,
                  onUpdate: (self) => {
                    if (self.progress > 0.55) {
                      updateChapterProgress(
                        root,
                        index / Math.max(1, chapters.length - 1),
                        chapters.length,
                      )
                    }
                  },
                },
              })
              .fromTo(
                title,
                { yPercent: 108 },
                { yPercent: 0, duration: 0.7 },
                0,
              )
              .fromTo(
                details,
                { y: 38, opacity: 0.4 },
                { y: 0, opacity: 1, duration: 0.72 },
                0.08,
              )
              .fromTo(
                visual,
                { x: visualX, y: 58, scale: 0.96, opacity: 0.48 },
                { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.84 },
                0.04,
              )
          })
        })

        return () => {
          mediaQueries.revert()
        }
      }, root)

      let active = true
      const refreshFrame = window.requestAnimationFrame(() => {
        if (active) ScrollTrigger.refresh()
      })

      void document.fonts.ready.then(() => {
        if (active) ScrollTrigger.refresh()
      })

      return () => {
        active = false
        window.cancelAnimationFrame(refreshFrame)
        context.revert()
        delete root.dataset.motion
        root.style.removeProperty('--story-progress')
      }
    })
  }, [rootRef])
}

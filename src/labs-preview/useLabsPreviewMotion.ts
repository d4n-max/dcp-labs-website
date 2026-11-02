import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { watchMotionPreference } from '../product-story/watchMotionPreference'

gsap.registerPlugin(ScrollTrigger)

const DESKTOP_QUERY = '(min-width: 900px)'
const MOBILE_QUERY = '(max-width: 899px)'

type ProductLayers = {
  panel: HTMLElement
  heading: HTMLElement | null
  body: HTMLElement | null
  icon: HTMLElement | null
  number: HTMLElement | null
  media: HTMLElement | null
  mask: HTMLElement | null
  image: HTMLElement | null
  backdrop: HTMLElement | null
  trace: HTMLElement | null
  sheen: HTMLElement | null
}

type MotionProfile = {
  headingFrom: gsap.TweenVars
  bodyFrom: gsap.TweenVars
  iconFrom: gsap.TweenVars
  numberFrom: gsap.TweenVars
  mediaFrom: gsap.TweenVars
  maskFrom: gsap.TweenVars
  imageFrom: gsap.TweenVars
  backdropFrom: gsap.TweenVars
  traceFrom: gsap.TweenVars
  sheenFrom: gsap.TweenVars
  headingExit: gsap.TweenVars
  bodyExit: gsap.TweenVars
  mediaExit: gsap.TweenVars
  backdropExit: gsap.TweenVars
  traceExit: gsap.TweenVars
}

const motionProfiles: MotionProfile[] = [
  {
    headingFrom: { y: 72, opacity: 0.08 },
    bodyFrom: { y: 42, opacity: 0.04 },
    iconFrom: { y: 38, scale: 0.72, opacity: 0 },
    numberFrom: { y: 24, opacity: 0 },
    mediaFrom: { y: 126, scale: 0.88, opacity: 0.12 },
    maskFrom: { clipPath: 'inset(28% 0% 0% 0% round 24px)' },
    imageFrom: { scale: 1.08 },
    backdropFrom: { y: 86, scale: 0.76, opacity: 0 },
    traceFrom: { scaleX: 0, transformOrigin: 'left center', opacity: 0 },
    sheenFrom: { xPercent: -135, opacity: 0 },
    headingExit: { y: -54, opacity: 0.08 },
    bodyExit: { y: -34, opacity: 0 },
    mediaExit: { y: -64, scale: 0.9, opacity: 0.12 },
    backdropExit: { y: -88, scale: 1.08, opacity: 0 },
    traceExit: { scaleX: 0, transformOrigin: 'right center', opacity: 0 },
  },
  {
    headingFrom: { x: 148, opacity: 0.06 },
    bodyFrom: { x: 94, opacity: 0.04 },
    iconFrom: { x: 56, rotate: -12, scale: 0.72, opacity: 0 },
    numberFrom: { x: 36, opacity: 0 },
    mediaFrom: { x: -170, rotateY: -7, scale: 0.86, opacity: 0.1 },
    maskFrom: { clipPath: 'inset(0% 0% 0% 32% round 22px)' },
    imageFrom: { scale: 1.07, xPercent: -2 },
    backdropFrom: { x: -130, scale: 0.8, opacity: 0 },
    traceFrom: { scaleX: 0, transformOrigin: 'right center', opacity: 0 },
    sheenFrom: { xPercent: -145, opacity: 0 },
    headingExit: { x: -112, opacity: 0.06 },
    bodyExit: { x: -74, opacity: 0 },
    mediaExit: { x: 122, rotateY: 5, scale: 0.9, opacity: 0.1 },
    backdropExit: { x: 160, scale: 0.88, opacity: 0 },
    traceExit: { scaleX: 0, transformOrigin: 'left center', opacity: 0 },
  },
  {
    headingFrom: { y: 96, opacity: 0.04 },
    bodyFrom: { y: 70, opacity: 0.03 },
    iconFrom: { y: -46, scale: 0.64, opacity: 0 },
    numberFrom: { y: 34, opacity: 0 },
    mediaFrom: { y: 178, rotate: 3, scale: 0.76, opacity: 0.08 },
    maskFrom: { clipPath: 'inset(36% 8% 0% 8% round 28px)' },
    imageFrom: { yPercent: 4, scale: 1.1 },
    backdropFrom: { y: -96, scale: 0.66, opacity: 0 },
    traceFrom: { scaleY: 0, transformOrigin: 'center bottom', opacity: 0 },
    sheenFrom: { yPercent: -145, opacity: 0 },
    headingExit: { y: -88, opacity: 0.05 },
    bodyExit: { y: -58, opacity: 0 },
    mediaExit: { y: -126, rotate: -2, scale: 0.84, opacity: 0.08 },
    backdropExit: { y: 118, scale: 1.08, opacity: 0 },
    traceExit: { scaleY: 0, transformOrigin: 'center top', opacity: 0 },
  },
  {
    headingFrom: { x: -144, opacity: 0.05 },
    bodyFrom: { x: -92, opacity: 0.03 },
    iconFrom: { x: -62, rotate: 10, scale: 0.68, opacity: 0 },
    numberFrom: { x: -36, opacity: 0 },
    mediaFrom: { x: 188, rotate: -3, scale: 0.78, opacity: 0.08 },
    maskFrom: { clipPath: 'polygon(24% 0%, 100% 0%, 78% 100%, 0% 100%)' },
    imageFrom: { xPercent: 4, scale: 1.08 },
    backdropFrom: { x: 142, scaleX: 0.6, opacity: 0 },
    traceFrom: { scaleX: 0, transformOrigin: 'left center', opacity: 0 },
    sheenFrom: { xPercent: -142, opacity: 0 },
    headingExit: { x: 118, opacity: 0.05 },
    bodyExit: { x: 76, opacity: 0 },
    mediaExit: { x: -136, rotate: 2, scale: 0.86, opacity: 0.08 },
    backdropExit: { x: -162, scaleX: 1.08, opacity: 0 },
    traceExit: { scaleX: 0, transformOrigin: 'right center', opacity: 0 },
  },
  {
    headingFrom: { scale: 0.74, y: 42, opacity: 0.04 },
    bodyFrom: { y: 58, opacity: 0.03 },
    iconFrom: { scale: 0.42, rotate: -20, opacity: 0 },
    numberFrom: { y: 24, opacity: 0 },
    mediaFrom: { y: 92, scale: 0.62, opacity: 0.04 },
    maskFrom: { clipPath: 'circle(18% at 50% 52%)' },
    imageFrom: { scale: 1.14 },
    backdropFrom: { scale: 0.34, opacity: 0 },
    traceFrom: { scaleX: 0, transformOrigin: 'center center', opacity: 0 },
    sheenFrom: { xPercent: -138, opacity: 0 },
    headingExit: { scale: 1.12, y: -32, opacity: 0.05 },
    bodyExit: { y: -42, opacity: 0 },
    mediaExit: { y: -48, scale: 0.82, opacity: 0.08 },
    backdropExit: { scale: 1.45, opacity: 0 },
    traceExit: { scaleX: 0, transformOrigin: 'center center', opacity: 0 },
  },
  {
    headingFrom: { x: 124, y: 28, opacity: 0.05 },
    bodyFrom: { y: 68, opacity: 0.03 },
    iconFrom: { y: 48, scale: 0.7, opacity: 0 },
    numberFrom: { x: 38, opacity: 0 },
    mediaFrom: { x: -164, y: 54, scale: 0.84, opacity: 0.08 },
    maskFrom: { clipPath: 'inset(0% 28% 22% 0% round 12px)' },
    imageFrom: { xPercent: -3, scale: 1.06 },
    backdropFrom: { x: -120, y: 64, scale: 0.78, opacity: 0 },
    traceFrom: { scaleX: 0, transformOrigin: 'left center', opacity: 0 },
    sheenFrom: { xPercent: -140, opacity: 0 },
    headingExit: { x: 48, y: -38, opacity: 0.12 },
    bodyExit: { y: -36, opacity: 0.04 },
    mediaExit: { x: -50, y: -36, scale: 0.94, opacity: 0.18 },
    backdropExit: { y: -52, scale: 1.05, opacity: 0.08 },
    traceExit: { scaleX: 0, transformOrigin: 'right center', opacity: 0 },
  },
]

const clamp = (value: number) => Math.min(1, Math.max(0, value))

function getHandoffGridSpec(width: number) {
  if (width >= 1440) return { columns: 22, rows: 14 }
  if (width >= 1200) return { columns: 20, rows: 12 }
  if (width >= 900) return { columns: 16, rows: 10 }
  return { columns: 7, rows: 12 }
}

function orderHandoffTiles(
  tiles: HTMLElement[],
  columns: number,
  rows: number,
) {
  return tiles
    .map((tile, index) => {
      const row = Math.floor(index / columns)
      const column = index % columns
      const horizontalProgress = column / Math.max(1, columns - 1)
      const upwardProgress = (rows - 1 - row) / Math.max(1, rows - 1)
      const steppedRowBias = (row % 3) * 0.012
      const seededOffset = ((column * 7 + row * 11) % 5) * 0.004

      return {
        tile,
        order:
          horizontalProgress * 0.56 +
          upwardProgress * 0.44 +
          steppedRowBias +
          seededOffset,
      }
    })
    .sort((a, b) => a.order - b.order)
    .map(({ tile }) => tile)
}

function getProductLayers(panel: HTMLElement): ProductLayers {
  return {
    panel,
    heading: panel.querySelector('[data-product-heading]'),
    body: panel.querySelector('[data-product-body]'),
    icon: panel.querySelector('[data-product-icon]'),
    number: panel.querySelector('[data-product-number]'),
    media: panel.querySelector('[data-product-media]'),
    mask: panel.querySelector('[data-product-mask]'),
    image: panel.querySelector('[data-product-image]'),
    backdrop: panel.querySelector('[data-product-backdrop]'),
    trace: panel.querySelector('[data-product-trace]'),
    sheen: panel.querySelector('[data-product-sheen]'),
  }
}

function updateStoryState(
  root: HTMLElement,
  progress: number,
  manageFocus = false,
) {
  const panels = Array.from(
    root.querySelectorAll<HTMLElement>('[data-product-panel]'),
  )
  const labels = Array.from(
    root.querySelectorAll<HTMLElement>('[data-progress-label]'),
  )
  const names = Array.from(
    root.querySelectorAll<HTMLElement>('[data-progress-name]'),
  )
  const activeCount = root.querySelector<HTMLElement>('[data-active-count]')
  const lastIndex = Math.max(0, panels.length - 1)
  const activeIndex = Math.round(progress * lastIndex)

  panels.forEach((panel, index) => {
    const center = lastIndex === 0 ? 0 : index / lastIndex
    const delta = progress - center
    const phase =
      index === activeIndex
        ? 'focused'
        : delta < -0.035
          ? 'incoming'
          : delta < 0.12
            ? 'exiting'
            : 'passed'

    panel.dataset.chapterState = phase
    panel.style.setProperty(
      '--chapter-progress',
      String(clamp((progress - (center - 0.11)) / 0.22)),
    )

    if (manageFocus) {
      panel.inert = index !== activeIndex
    }
  })

  labels.forEach((label, index) => {
    if (index === activeIndex) {
      label.setAttribute('aria-current', 'step')
    } else {
      label.removeAttribute('aria-current')
    }
  })

  names.forEach((name, index) => {
    name.setAttribute('aria-hidden', index === activeIndex ? 'false' : 'true')
  })

  if (activeCount) {
    activeCount.textContent = String(activeIndex + 1).padStart(2, '0')
  }

  root.style.setProperty('--story-progress', String(progress))
  root.style.setProperty('--active-product', String(activeIndex))
}

function setFocused(layers: ProductLayers) {
  gsap.set(
    [
      layers.heading,
      layers.body,
      layers.icon,
      layers.number,
      layers.media,
      layers.backdrop,
    ],
    { x: 0, y: 0, rotate: 0, rotateY: 0, scale: 1, opacity: 1 },
  )
  gsap.set(layers.mask, {
    clipPath: 'inset(0% 0% 0% 0% round 0px)',
  })
  gsap.set(layers.image, { xPercent: 0, yPercent: 0, scale: 1 })
  gsap.set(layers.trace, {
    scaleX: 1,
    scaleY: 1,
    opacity: 0.72,
    transformOrigin: 'center center',
  })
  gsap.set(layers.sheen, { xPercent: -140, yPercent: 0, opacity: 0 })
}

function primeProduct(layers: ProductLayers, profile: MotionProfile) {
  gsap.set(layers.heading, profile.headingFrom)
  gsap.set(layers.body, profile.bodyFrom)
  gsap.set(layers.icon, profile.iconFrom)
  gsap.set(layers.number, profile.numberFrom)
  gsap.set(layers.media, profile.mediaFrom)
  gsap.set(layers.mask, profile.maskFrom)
  gsap.set(layers.image, profile.imageFrom)
  gsap.set(layers.backdrop, profile.backdropFrom)
  gsap.set(layers.trace, profile.traceFrom)
  gsap.set(layers.sheen, profile.sheenFrom)
}

function addProductChapter(
  timeline: gsap.core.Timeline,
  layers: ProductLayers,
  profile: MotionProfile,
  index: number,
  productCount: number,
) {
  const lastIndex = productCount - 1
  const center = index / lastIndex
  const enterAt = Math.max(0, center - 0.11)
  const exitAt = Math.min(0.94, center + 0.045)
  const enterDuration = index === 0 ? 0 : 0.082
  const exitDuration = index === lastIndex ? 0 : 0.078

  if (index === 0) {
    setFocused(layers)
  } else {
    timeline
      .to(
        layers.heading,
        { x: 0, y: 0, scale: 1, opacity: 1, duration: enterDuration },
        enterAt,
      )
      .to(
        layers.body,
        { x: 0, y: 0, opacity: 1, duration: enterDuration * 0.86 },
        enterAt + 0.012,
      )
      .to(
        layers.icon,
        {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          opacity: 1,
          duration: enterDuration * 0.8,
        },
        enterAt + 0.006,
      )
      .to(
        layers.number,
        { x: 0, y: 0, opacity: 1, duration: enterDuration * 0.72 },
        enterAt + 0.018,
      )
      .to(
        layers.media,
        {
          x: 0,
          y: 0,
          rotate: 0,
          rotateY: 0,
          scale: 1,
          opacity: 1,
          duration: enterDuration,
        },
        enterAt,
      )
      .to(
        layers.mask,
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          duration: enterDuration * 0.88,
        },
        enterAt + 0.006,
      )
      .to(
        layers.image,
        {
          xPercent: 0,
          yPercent: 0,
          scale: 1,
          duration: enterDuration,
        },
        enterAt,
      )
      .to(
        layers.backdrop,
        {
          x: 0,
          y: 0,
          scale: 1,
          scaleX: 1,
          opacity: 0.72,
          duration: enterDuration * 0.9,
        },
        enterAt + 0.006,
      )
      .to(
        layers.trace,
        {
          scaleX: 1,
          scaleY: 1,
          opacity: 0.72,
          duration: enterDuration * 0.8,
        },
        enterAt + 0.018,
      )
      .to(
        layers.sheen,
        {
          xPercent: 120,
          yPercent: 0,
          opacity: 0.58,
          duration: enterDuration * 0.8,
        },
        enterAt + 0.014,
      )
      .to(
        layers.sheen,
        { opacity: 0, duration: enterDuration * 0.22 },
        enterAt + enterDuration * 0.78,
      )
  }

  if (index !== lastIndex) {
    timeline
      .to(
        layers.heading,
        { ...profile.headingExit, duration: exitDuration },
        exitAt,
      )
      .to(
        layers.body,
        { ...profile.bodyExit, duration: exitDuration * 0.82 },
        exitAt + 0.006,
      )
      .to(
        layers.icon,
        { scale: 0.74, opacity: 0, duration: exitDuration * 0.68 },
        exitAt + 0.006,
      )
      .to(
        layers.number,
        { opacity: 0, duration: exitDuration * 0.54 },
        exitAt + 0.012,
      )
      .to(
        layers.media,
        { ...profile.mediaExit, duration: exitDuration },
        exitAt,
      )
      .to(
        layers.backdrop,
        { ...profile.backdropExit, duration: exitDuration },
        exitAt,
      )
      .to(
        layers.trace,
        { ...profile.traceExit, duration: exitDuration * 0.76 },
        exitAt,
      )
  }
}

export function useLabsPreviewMotion(rootRef: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const panels = Array.from(
      root.querySelectorAll<HTMLElement>('[data-product-panel]'),
    )

    return watchMotionPreference(root, '[data-product-panel]', reduced => {
      if (reduced) {
        panels.forEach((panel) => {
          panel.inert = false
          panel.dataset.chapterState = 'focused'
        })
        root.dataset.motion = 'reduced'
        return () => {
          delete root.dataset.motion
        }
      }

      root.dataset.motion = 'enhanced'

      const context = gsap.context(() => {
        gsap.set('[data-hero-line="studio"]', { yPercent: 118 })
        gsap.set('[data-hero-line="products"]', { xPercent: -108 })
        gsap.set('[data-hero-line="intent"]', {
          yPercent: 24,
          clipPath: 'inset(0% 100% 0% 0%)',
          backgroundPosition: '100% 0%',
        })
        gsap.set('[data-hero-grid]', {
          opacity: 0.18,
          scale: 1.08,
          transformPerspective: 900,
          rotateX: 4,
        })
        gsap.set('[data-hero-light]', { xPercent: 18, opacity: 0 })
        gsap.set('[data-hero-kicker]', { y: 22, opacity: 0 })
        gsap.set('[data-hero-support]', { y: 26, opacity: 0 })
        gsap.set('[data-hero-index]', { y: 22, opacity: 0 })
        gsap.set('[data-scroll-indicator]', { y: 15, opacity: 0 })

        const heroEntrance = gsap.timeline({
          defaults: { ease: 'power3.out' },
        })

        heroEntrance
          .to(
            '[data-hero-grid]',
            { opacity: 0.62, scale: 1, rotateX: 0, duration: 1.2 },
            0,
          )
          .to('[data-hero-light]', { xPercent: 0, opacity: 0.72, duration: 1.1 }, 0)
          .to(
            '[data-hero-kicker]',
            { y: 0, opacity: 1, duration: 0.42 },
            0.08,
          )
          .to(
            '[data-hero-line="studio"]',
            { yPercent: 0, duration: 0.68 },
            0.18,
          )
          .to(
            '[data-hero-line="products"]',
            { xPercent: 0, duration: 0.72 },
            0.36,
          )
          .to(
            '[data-hero-line="intent"]',
            {
              yPercent: 0,
              clipPath: 'inset(0% 0% 0% 0%)',
              backgroundPosition: '0% 0%',
              duration: 0.74,
            },
            0.58,
          )
          .to(
            '[data-hero-support]',
            { y: 0, opacity: 1, duration: 0.46 },
            0.98,
          )
          .to(
            '[data-scroll-indicator]',
            { y: 0, opacity: 1, duration: 0.36 },
            1.28,
          )
          .to(
            '[data-hero-index]',
            { y: 0, opacity: 1, duration: 0.42 },
            1.34,
          )

        const mediaQueries = gsap.matchMedia()

        const createHandoffTimeline = (
          firstPanel: HTMLElement,
          firstAmbient?: HTMLElement,
        ) => {
          const hero = root.querySelector<HTMLElement>('[data-hero]')
          const handoffGrid = root.querySelector<HTMLElement>(
            '[data-handoff-grid]',
          )
          const storyBase = root.querySelector<HTMLElement>('[data-story-base]')
          const initialAmbient =
            firstAmbient ??
            root.querySelector<HTMLElement>('[data-story-ambient]') ??
            undefined
          const allTiles = Array.from(
            root.querySelectorAll<HTMLElement>('[data-handoff-tile]'),
          )
          const { columns, rows } = getHandoffGridSpec(window.innerWidth)
          const compactHandoff = window.innerWidth < 900
          const visibleTiles = allTiles
            .filter((tile) => window.getComputedStyle(tile).display !== 'none')
            .slice(0, columns * rows)
          const orderedTiles = orderHandoffTiles(visibleTiles, columns, rows)
          const careTailTintTiles = orderedTiles.filter(
            (_, index) => index % 8 === 0,
          )

          if (
            !hero ||
            !handoffGrid ||
            !storyBase ||
            !initialAmbient ||
            orderedTiles.length === 0
          ) {
            return
          }

          gsap.set(handoffGrid, { autoAlpha: 0 })
          gsap.set(orderedTiles, { scaleY: 0.02, opacity: 0 })
          gsap.set(storyBase, { opacity: 0 })
          gsap.set(initialAmbient, { opacity: 0 })
          gsap.set('[data-story-chrome]', { y: 16, autoAlpha: 0 })
          gsap.set(firstPanel, { y: 32, autoAlpha: 0 })

          const handoffTimeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: () => `+=${hero.offsetHeight}`,
              pin: compactHandoff ? false : hero,
              pinSpacing: false,
              scrub: compactHandoff ? 0.42 : 0.55,
              anticipatePin: compactHandoff ? 0 : 1,
              invalidateOnRefresh: true,
            },
          })

          handoffTimeline
            .addLabel('heroExitStart', 0.08)
            .addLabel('mosaicStart', 0.1)
            .addLabel('mosaicMidpoint', 0.4)
            .addLabel('productEnvironmentStart', 0.54)
            .addLabel('caretailReveal', 0.7)
            .addLabel('handoffComplete', 1)
            .to(
              '[data-hero-line="studio"]',
              { xPercent: -26, yPercent: -12, duration: 0.68 },
              'heroExitStart+=0.10',
            )
            .to(
              '[data-hero-line="products"]',
              { xPercent: 24, yPercent: -2, duration: 0.68 },
              'heroExitStart+=0.10',
            )
            .to(
              '[data-hero-line="intent"]',
              { xPercent: -9, scale: 1.055, yPercent: 10, duration: 0.68 },
              'heroExitStart+=0.10',
            )
            .to(
              '[data-hero-kicker]',
              { x: -54, opacity: 0, duration: 0.32 },
              'heroExitStart',
            )
            .to(
              '[data-hero-support]',
              { y: 38, opacity: 0, duration: 0.34 },
              'heroExitStart+=0.04',
            )
            .to(
              '[data-hero-index]',
              { y: -28, opacity: 0, scaleX: 1.01, duration: 0.38 },
              'heroExitStart+=0.16',
            )
            .to(
              '[data-hero-grid]',
              { scale: 0.96, rotateX: -5, opacity: 0.12, duration: 0.72 },
              'heroExitStart',
            )
            .to(
              '[data-hero-light]',
              { xPercent: -18, scale: 1.1, opacity: 0.28, duration: 0.72 },
              'heroExitStart',
            )
            .to(
              '[data-scroll-indicator]',
              { y: 18, opacity: 0, duration: 0.28 },
              'heroExitStart+=0.04',
            )
            .set(handoffGrid, { autoAlpha: 1 }, 'mosaicStart')
            .set(
              orderedTiles,
              { willChange: 'transform, opacity' },
              'mosaicStart',
            )
            .to(
              orderedTiles,
              {
                scaleY: 1,
                opacity: 1,
                duration: compactHandoff ? 0.07 : 0.09,
                stagger: {
                  amount: compactHandoff ? 0.46 : 0.56,
                },
              },
              'mosaicStart',
            )
            .to(
              storyBase,
              { opacity: 1, duration: 0.28 },
              'productEnvironmentStart',
            )
            .to(
              initialAmbient,
              { opacity: 1, duration: 0.3 },
              'productEnvironmentStart+=0.04',
            )
            .to(
              careTailTintTiles,
              {
                backgroundColor: 'rgba(12, 24, 25, 0.992)',
                duration: 0.22,
                stagger: { amount: 0.1 },
              },
              'productEnvironmentStart+=0.04',
            )
            .to(
              '[data-story-chrome]',
              { y: 0, autoAlpha: 1, duration: 0.18 },
              'caretailReveal-=0.04',
            )
            .to(
              firstPanel,
              { y: 0, autoAlpha: 1, duration: 0.26 },
              'caretailReveal',
            )
            .to(
              handoffGrid,
              { opacity: 0, duration: 0.24 },
              'handoffComplete-=0.24',
            )
            .set(handoffGrid, { autoAlpha: 0 }, 'handoffComplete')
            .set(orderedTiles, { willChange: 'auto' }, 'handoffComplete')

          return handoffTimeline
        }

        mediaQueries.add(DESKTOP_QUERY, () => {
          const story = root.querySelector<HTMLElement>('[data-story]')
          const track = root.querySelector<HTMLElement>('[data-story-track]')
          const ambientLayers = Array.from(
            root.querySelectorAll<HTMLElement>('[data-story-ambient]'),
          )
          const progressFill =
            root.querySelector<HTMLElement>('[data-progress-fill]')
          const progressMarker =
            root.querySelector<HTMLElement>('[data-progress-marker]')

          if (!story || !track || panels.length === 0) return

          const products = panels.map(getProductLayers)
          const horizontalDistance = () =>
            Math.max(0, track.scrollWidth - window.innerWidth)
          const scrollDistance = () => {
            const choreographyRatio = window.innerWidth < 1200 ? 0.84 : 0.9
            return Math.max(
              window.innerHeight * 2.4,
              Math.round(horizontalDistance() * choreographyRatio),
            )
          }
          const setFillScale = progressFill
            ? gsap.quickSetter(progressFill, 'scaleX')
            : null
          const setMarkerX = progressMarker
            ? gsap.quickSetter(progressMarker, 'x', 'px')
            : null

          products.forEach((layers, index) => {
            if (index === 0) {
              setFocused(layers)
            } else {
              primeProduct(layers, motionProfiles[index])
            }
          })

          gsap.set(ambientLayers, { opacity: 0 })

          createHandoffTimeline(panels[0], ambientLayers[0])

          const storyTimeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: story,
              start: 'top top',
              end: () => `+=${scrollDistance()}`,
              pin: true,
              scrub: 0.62,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const progress = self.progress
                updateStoryState(root, progress, true)
                setFillScale?.(progress)

                if (progressMarker && setMarkerX) {
                  setMarkerX(
                    progress *
                      Math.max(
                        0,
                        progressMarker.parentElement!.clientWidth -
                          progressMarker.offsetWidth,
                      ),
                  )
                }
              },
            },
          })

          storyTimeline.to(track, {
            x: () => -horizontalDistance(),
            duration: 1,
          })

          products.forEach((layers, index) => {
            addProductChapter(
              storyTimeline,
              layers,
              motionProfiles[index],
              index,
              products.length,
            )
          })

          for (let index = 1; index < ambientLayers.length; index += 1) {
            const handoffAt = (index - 0.5) / (ambientLayers.length - 1)
            storyTimeline
              .to(
                ambientLayers[index - 1],
                { opacity: 0, duration: 0.11 },
                handoffAt - 0.055,
              )
              .to(
                ambientLayers[index],
                { opacity: 1, duration: 0.11 },
                handoffAt - 0.055,
              )
          }

          storyTimeline.to(
            '[data-story-chrome]',
            { y: -18, opacity: 0, duration: 0.045 },
            0.955,
          )

          updateStoryState(
            root,
            storyTimeline.scrollTrigger?.progress ?? 0,
            true,
          )

          return () => {
            panels.forEach((panel) => {
              panel.inert = false
            })
          }
        })

        mediaQueries.add(MOBILE_QUERY, () => {
          createHandoffTimeline(panels[0])

          panels.forEach((panel, index) => {
            const layers = getProductLayers(panel)
            const profile = motionProfiles[index]
            const axisIsHorizontal = index % 3 === 1

            const panelTimeline = gsap.timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                trigger: panel,
                start: 'top 86%',
                end: 'center 52%',
                scrub: 0.42,
                invalidateOnRefresh: true,
              },
            })

            panelTimeline
              .fromTo(
                layers.heading,
                axisIsHorizontal
                  ? { x: index % 2 === 0 ? -64 : 64, opacity: 0.12 }
                  : { y: 48, opacity: 0.12 },
                { x: 0, y: 0, opacity: 1 },
                0,
              )
              .fromTo(
                layers.body,
                { y: 36, opacity: 0.08 },
                { y: 0, opacity: 1 },
                0.08,
              )
              .fromTo(
                layers.media,
                {
                  x: axisIsHorizontal ? (index % 2 === 0 ? 56 : -56) : 0,
                  y: axisIsHorizontal ? 0 : 74,
                  scale: 0.9,
                  opacity: 0.18,
                },
                { x: 0, y: 0, scale: 1, opacity: 1 },
                0.04,
              )
              .fromTo(
                layers.backdrop,
                {
                  x: axisIsHorizontal ? 48 : 0,
                  y: axisIsHorizontal ? 0 : 52,
                  scale: 0.76,
                  opacity: 0,
                },
                { x: 0, y: 0, scale: 1, opacity: 0.58 },
                0.04,
              )
              .fromTo(
                layers.trace,
                profile.traceFrom,
                { scaleX: 1, scaleY: 1, opacity: 0.72 },
                0.1,
              )
          })
        })

        gsap.set('[data-final-line]', { yPercent: 116 })
        gsap.set('[data-final-detail]', { y: 26, opacity: 0 })

        const finalNames = gsap.utils.toArray<HTMLElement>('[data-final-name]')
        finalNames.forEach((name, index) => {
          gsap.set(name, {
            xPercent: index % 2 === 0 ? -18 : 18,
            opacity: 0,
          })
        })

        const finalTimeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: '[data-final]',
            start: 'top 84%',
            end: 'top 24%',
            scrub: 0.48,
            invalidateOnRefresh: true,
          },
        })

        finalTimeline
          .to(finalNames, {
            xPercent: 0,
            opacity: 0.12,
            duration: 0.48,
            stagger: 0.035,
          })
          .fromTo(
            '[data-final-content]',
            { y: 62, scale: 0.96, opacity: 0.18 },
            { y: 0, scale: 1, opacity: 1, duration: 0.62 },
            0.08,
          )
          .to(
            '[data-final-line]',
            { yPercent: 0, duration: 0.48, stagger: 0.08 },
            0.22,
          )
          .to(
            '[data-final-detail]',
            { y: 0, opacity: 1, duration: 0.34, stagger: 0.06 },
            0.54,
          )

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
        panels.forEach((panel) => {
          panel.inert = false
        })
        delete root.dataset.motion
      }
    })
  }, [rootRef])
}

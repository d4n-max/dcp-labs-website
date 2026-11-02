import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { watchMotionPreference } from '../product-story/watchMotionPreference'

gsap.registerPlugin(ScrollTrigger)

const DESKTOP_STORY_QUERY = '(min-width: 1200px) and (min-height: 700px)'
const VERTICAL_STORY_QUERY = '(max-width: 1199px), (max-height: 699px)'

type Composition =
  | 'split'
  | 'quote'
  | 'center'
  | 'reverse'
  | 'completion'

const compositionDirection: Record<Composition, number> = {
  split: 1,
  quote: -1,
  center: 1,
  reverse: -1,
  completion: 1,
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

function updateProgress(
  root: HTMLElement,
  progress: number,
  chapterCount: number,
) {
  const safeProgress = Math.min(1, Math.max(0, progress))
  const activeIndex = Math.min(
    chapterCount - 1,
    Math.max(
      0,
      Math.floor(safeProgress * (chapterCount - 1) + 0.08),
    ),
  )

  root.style.setProperty('--story-progress', String(safeProgress))
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

export function useCareTailStoryMotion(
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
        updateProgress(root, 0, chapters.length)

        return () => {
          delete root.dataset.motion
          root.style.removeProperty('--story-progress')
        }
      }

      root.dataset.motion = 'enhanced'

      const context = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: 'power2.out' } })
          .from('[data-story-brand]', {
            y: 18,
            opacity: 0,
            duration: 0.5,
          })
          .from(
            '[data-story-hero-heading]',
            {
              yPercent: 104,
              duration: 0.78,
            },
            0.1,
          )
          .from(
            '[data-story-hero-description]',
            {
              y: 18,
              opacity: 0,
              duration: 0.58,
            },
            0.34,
          )
          .from(
            '[data-story-hero-actions]',
            {
              y: 16,
              opacity: 0,
              duration: 0.5,
            },
            0.5,
          )
          .from(
            '[data-story-hero-visual]',
            {
              x: 48,
              y: 24,
              scale: 0.965,
              opacity: 0,
              duration: 0.9,
            },
            0.18,
          )

        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '[data-story-hero]',
              start: 'top top',
              end: 'bottom top',
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          })
          .to('[data-story-hero-copy]', { yPercent: -3, opacity: 0.7 }, 0)
          .to(
            '[data-story-hero-visual]',
            { xPercent: 3, yPercent: -2, scale: 1.015, opacity: 0.82 },
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
            const direction = compositionDirection[compositions[index]]
            gsap.set(titles[index], { yPercent: direction * 104 })
            gsap.set(details[index], {
              x: direction * 28,
              y: 18,
              opacity: 0.28,
            })
            gsap.set(visuals[index], {
              x: direction * 84,
              y: 46,
              scale: 0.955,
              opacity: 0.38,
            })
          })

          const horizontalDistance = () =>
            Math.max(0, track.scrollWidth - window.innerWidth)
          const scrollDistance = () =>
            Math.max(
              horizontalDistance() * 0.78,
              window.innerHeight * (chapters.length - 0.35),
            )

          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: viewport,
              start: 'top top',
              end: () => `+=${scrollDistance()}`,
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                updateProgress(root, self.progress, chapters.length)
              },
            },
          })

          timeline.to(
            track,
            {
              x: () => -horizontalDistance(),
              duration: chapters.length - 1,
            },
            0.2,
          )

          chapters.forEach((_, index) => {
            if (index > 0) {
              const entryAt = index - 0.7
              timeline
                .to(
                  titles[index],
                  {
                    x: 0,
                    y: 0,
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.52,
                  },
                  entryAt,
                )
                .to(
                  details[index],
                  {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    duration: 0.54,
                  },
                  entryAt + 0.06,
                )
                .to(
                  visuals[index],
                  {
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.62,
                  },
                  entryAt + 0.02,
                )
            }

            if (index < chapters.length - 1) {
              const exitAt = index + 0.42
              const direction = compositionDirection[compositions[index]]
              timeline
                .to(
                  titles[index],
                  {
                    x: direction * -36,
                    opacity: 0.42,
                    duration: 0.48,
                  },
                  exitAt,
                )
                .to(
                  details[index],
                  {
                    x: direction * -44,
                    y: -12,
                    opacity: 0.32,
                    duration: 0.5,
                  },
                  exitAt + 0.03,
                )
                .to(
                  visuals[index],
                  {
                    x: direction * -72,
                    y: -28,
                    scale: 0.97,
                    opacity: 0.46,
                    duration: 0.56,
                  },
                  exitAt + 0.02,
                )
            }
          })

          updateProgress(root, 0, chapters.length)
        })

        mediaQueries.add(VERTICAL_STORY_QUERY, () => {
          updateProgress(root, 0, chapters.length)

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
            const direction = compositionDirection[getComposition(chapter)]

            gsap
              .timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                  trigger: chapter,
                  start: 'top 88%',
                  end: 'top 45%',
                  scrub: 0.5,
                  invalidateOnRefresh: true,
                  onUpdate: (self) => {
                    if (self.progress > 0.52) {
                      updateProgress(
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
                { yPercent: direction * 102 },
                { yPercent: 0, duration: 0.72 },
                0,
              )
              .fromTo(
                details,
                { y: 26, opacity: 0.34 },
                { y: 0, opacity: 1, duration: 0.72 },
                0.08,
              )
              .fromTo(
                visual,
                {
                  x: direction * 42,
                  y: 38,
                  scale: 0.97,
                  opacity: 0.46,
                },
                {
                  x: 0,
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  duration: 0.86,
                },
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

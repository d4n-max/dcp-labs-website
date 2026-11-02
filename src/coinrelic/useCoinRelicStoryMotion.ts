import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { watchMotionPreference } from '../product-story/watchMotionPreference'

gsap.registerPlugin(ScrollTrigger)

const DESKTOP_QUERY = '(min-width: 1200px) and (min-height: 700px)'
const VERTICAL_QUERY = '(max-width: 1199px), (max-height: 699px)'

type Composition = 'scan' | 'detail' | 'collection' | 'archive'

const directionByComposition: Record<Composition, number> = {
  scan: 1,
  detail: -1,
  collection: 1,
  archive: -1,
}

function getComposition(chapter: HTMLElement): Composition {
  const value = chapter.dataset.crComposition
  if (
    value === 'detail' ||
    value === 'collection' ||
    value === 'archive'
  ) {
    return value
  }
  return 'scan'
}

function updateProgress(
  root: HTMLElement,
  progress: number,
  chapterCount: number,
) {
  const safeProgress = Math.min(1, Math.max(0, progress))
  const activeIndex = Math.min(
    chapterCount - 1,
    Math.max(0, Math.floor(safeProgress * chapterCount)),
  )

  root.style.setProperty('--cr-story-progress', String(safeProgress))
  root
    .querySelectorAll<HTMLElement>('[data-cr-progress-item]')
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

export function useCoinRelicStoryMotion(
  rootRef: RefObject<HTMLDivElement | null>,
) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const chapters = Array.from(
      root.querySelectorAll<HTMLElement>('[data-cr-chapter]'),
    )

    return watchMotionPreference(root, '[data-cr-chapter]', reduced => {
      if (reduced) {
        root.dataset.motion = 'reduced'
        updateProgress(root, 0, chapters.length)

        return () => {
          delete root.dataset.motion
          root.style.removeProperty('--cr-story-progress')
        }
      }

      root.dataset.motion = 'enhanced'

      const context = gsap.context(() => {
        gsap
          .timeline({
            defaults: {
              duration: 0.62,
              ease: 'power3.out',
            },
          })
          .from('[data-cr-identity]', { y: 16, opacity: 0 }, 0)
          .from('[data-cr-hero-heading]', { yPercent: 106, duration: 0.86 }, 0.08)
          .from(
            '[data-cr-hero-description]',
            { y: 24, opacity: 0 },
            0.3,
          )
          .from(
            '[data-cr-hero-actions] > *',
            { y: 18, opacity: 0, stagger: 0.08 },
            0.44,
          )
          .from(
            '[data-cr-hero-visual]',
            {
              x: 74,
              y: 20,
              scale: 0.95,
              opacity: 0,
              duration: 1.02,
            },
            0.14,
          )
          .from(
            '[data-cr-hero-visual] i',
            { scaleX: 0, transformOrigin: 'left center', duration: 0.82 },
            0.46,
          )
          .from(
            '[data-cr-hero-light]',
            { xPercent: -38, opacity: 0, duration: 1.2 },
            0.2,
          )

        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '[data-cr-hero]',
              start: 'top top',
              end: 'bottom top',
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          })
          .to('[data-cr-hero-copy]', { xPercent: -3, opacity: 0.64 }, 0)
          .to(
            '[data-cr-hero-visual]',
            { xPercent: 4, scale: 1.035, opacity: 0.72 },
            0,
          )
          .to('[data-cr-hero-light]', { xPercent: 24, opacity: 0.34 }, 0)

        const mediaQueries = gsap.matchMedia()

        mediaQueries.add(DESKTOP_QUERY, () => {
          const viewport = root.querySelector<HTMLElement>('[data-cr-viewport]')
          const track = root.querySelector<HTMLElement>('[data-cr-track]')
          const connector = root.querySelector<HTMLElement>('[data-cr-connector]')
          if (!viewport || !track || chapters.length === 0) return

          const titleNodes = chapters.map((chapter) =>
            chapter.querySelector<HTMLElement>('[data-cr-chapter-title]'),
          )
          const descriptionNodes = chapters.map((chapter) =>
            chapter.querySelector<HTMLElement>('[data-cr-chapter-description]'),
          )
          const visualNodes = chapters.map((chapter) =>
            chapter.querySelector<HTMLElement>('[data-cr-chapter-visual]'),
          )
          const traceNodes = chapters.map((chapter) =>
            chapter.querySelector<HTMLElement>('[data-cr-trace]'),
          )

          chapters.slice(1).forEach((chapter, offset) => {
            const index = offset + 1
            const direction = directionByComposition[getComposition(chapter)]
            gsap.set(titleNodes[index], { yPercent: 104 })
            gsap.set(descriptionNodes[index], { y: 38, opacity: 0.2 })
            gsap.set(visualNodes[index], {
              x: direction * 130,
              y: 28,
              scale: 0.94,
              opacity: 0.28,
            })
            gsap.set(traceNodes[index], {
              scaleY: 0,
              transformOrigin: 'top center',
            })
          })

          gsap.set(traceNodes[0], {
            scaleY: 1,
            transformOrigin: 'top center',
          })

          const horizontalDistance = () =>
            Math.max(0, track.scrollWidth - window.innerWidth)
          const scrollDistance = () =>
            Math.max(
              horizontalDistance() * 0.78,
              window.innerHeight * (chapters.length - 0.15),
            )

          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: viewport,
              start: 'top top',
              end: () => `+=${scrollDistance()}`,
              pin: true,
              scrub: 0.86,
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
            0.18,
          )

          if (connector) {
            timeline.to(
              connector,
              {
                '--cr-connector-progress': 1,
                duration: chapters.length - 1,
              },
              0.18,
            )
          }

          chapters.forEach((chapter, index) => {
            const direction = directionByComposition[getComposition(chapter)]

            if (index > 0) {
              const entryAt = index - 0.78
              timeline
                .to(
                  titleNodes[index],
                  { y: 0, yPercent: 0, opacity: 1, duration: 0.52 },
                  entryAt,
                )
                .to(
                  descriptionNodes[index],
                  { y: 0, opacity: 1, duration: 0.52 },
                  entryAt + 0.07,
                )
                .to(
                  visualNodes[index],
                  {
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.66,
                  },
                  entryAt + 0.02,
                )
                .to(
                  traceNodes[index],
                  {
                    scaleY: 1,
                    transformOrigin: 'top center',
                    duration: 0.58,
                  },
                  entryAt + 0.16,
                )
            }

            if (index < chapters.length - 1) {
              const exitAt = index + 0.4
              timeline
                .to(
                  titleNodes[index],
                  { yPercent: -44, opacity: 0.26, duration: 0.48 },
                  exitAt,
                )
                .to(
                  descriptionNodes[index],
                  { y: -24, opacity: 0.2, duration: 0.48 },
                  exitAt + 0.02,
                )
                .to(
                  visualNodes[index],
                  {
                    x: direction * -104,
                    y: -16,
                    scale: 0.97,
                    opacity: 0.3,
                    duration: 0.58,
                  },
                  exitAt,
                )
            }
          })

          updateProgress(root, 0, chapters.length)
        })

        mediaQueries.add(VERTICAL_QUERY, () => {
          updateProgress(root, 0, chapters.length)

          chapters.forEach((chapter, index) => {
            const title = chapter.querySelector<HTMLElement>(
              '[data-cr-chapter-title]',
            )
            const description = chapter.querySelector<HTMLElement>(
              '[data-cr-chapter-description]',
            )
            const visual = chapter.querySelector<HTMLElement>(
              '[data-cr-chapter-visual]',
            )
            const trace = chapter.querySelector<HTMLElement>('[data-cr-trace]')
            const direction = directionByComposition[getComposition(chapter)]

            gsap
              .timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                  trigger: chapter,
                  start: 'top 88%',
                  end: 'top 42%',
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
                { yPercent: 34, opacity: 0.2 },
                { yPercent: 0, opacity: 1, duration: 0.72 },
                0,
              )
              .fromTo(
                description,
                { y: 26, opacity: 0.2 },
                { y: 0, opacity: 1, duration: 0.72 },
                0.08,
              )
              .fromTo(
                visual,
                {
                  x: direction * 52,
                  y: 30,
                  scale: 0.965,
                  opacity: 0.28,
                },
                {
                  x: 0,
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  duration: 0.82,
                },
                0.02,
              )
              .fromTo(
                trace,
                { scaleY: 0, transformOrigin: 'top center' },
                { scaleY: 1, duration: 0.7 },
                0.14,
              )
          })
        })

        return () => {
          mediaQueries.revert()
        }
      }, root)

      const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 100)

      return () => {
        window.clearTimeout(refresh)
        context.revert()
        delete root.dataset.motion
        root.style.removeProperty('--cr-story-progress')
      }
    })
  }, [rootRef])
}

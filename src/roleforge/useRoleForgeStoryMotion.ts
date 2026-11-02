import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { watchMotionPreference } from '../product-story/watchMotionPreference'

gsap.registerPlugin(ScrollTrigger)

const DESKTOP_QUERY = '(min-width: 1200px) and (min-height: 700px)'
const VERTICAL_QUERY = '(max-width: 1199px), (max-height: 699px)'

type Composition = 'source' | 'match' | 'draft' | 'review' | 'handoff'

const directionByComposition: Record<Composition, number> = {
  source: 1,
  match: -1,
  draft: 1,
  review: -1,
  handoff: 1,
}

function getComposition(chapter: HTMLElement): Composition {
  const value = chapter.dataset.rfComposition
  if (
    value === 'match' ||
    value === 'draft' ||
    value === 'review' ||
    value === 'handoff'
  ) {
    return value
  }
  return 'source'
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

  root.style.setProperty('--rf-story-progress', String(safeProgress))
  root
    .querySelectorAll<HTMLElement>('[data-rf-progress-item]')
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

export function useRoleForgeStoryMotion(
  rootRef: RefObject<HTMLDivElement | null>,
) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const chapters = Array.from(
      root.querySelectorAll<HTMLElement>('[data-rf-chapter]'),
    )

    return watchMotionPreference(root, '[data-rf-chapter]', reduced => {
      if (reduced) {
        root.dataset.motion = 'reduced'
        updateProgress(root, 0, chapters.length)

        return () => {
          delete root.dataset.motion
          root.style.removeProperty('--rf-story-progress')
        }
      }

      root.dataset.motion = 'enhanced'

      const context = gsap.context(() => {
        gsap
          .timeline({
            defaults: {
              duration: 0.55,
              ease: 'power3.out',
            },
          })
          .from('[data-rf-identity]', { x: -22, opacity: 0 }, 0)
          .from(
            '[data-rf-hero-heading]',
            { yPercent: 108, duration: 0.76 },
            0.08,
          )
          .from(
            '[data-rf-hero-description]',
            { y: 24, opacity: 0 },
            0.28,
          )
          .from(
            '[data-rf-hero-actions]',
            { y: 18, opacity: 0, stagger: 0.08 },
            0.42,
          )
          .from(
            '[data-rf-hero-visual]',
            {
              x: 72,
              scale: 0.96,
              opacity: 0,
              duration: 0.92,
            },
            0.14,
          )
          .from(
            '[data-rf-hero-visual] > div span',
            { scaleX: 0, transformOrigin: 'left center', duration: 0.75 },
            0.46,
          )

        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '[data-rf-hero]',
              start: 'top top',
              end: 'bottom top',
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          })
          .to('[data-rf-hero-copy]', { xPercent: -3, opacity: 0.68 }, 0)
          .to(
            '[data-rf-hero-visual]',
            { xPercent: 4, scale: 1.025, opacity: 0.76 },
            0,
          )

        const mediaQueries = gsap.matchMedia()

        mediaQueries.add(DESKTOP_QUERY, () => {
          const viewport = root.querySelector<HTMLElement>('[data-rf-viewport]')
          const track = root.querySelector<HTMLElement>('[data-rf-track]')
          const connector = root.querySelector<HTMLElement>(
            '[data-rf-connector]',
          )
          if (!viewport || !track || chapters.length === 0) return

          const titleNodes = chapters.map((chapter) =>
            chapter.querySelector<HTMLElement>('[data-rf-chapter-title]'),
          )
          const descriptionNodes = chapters.map((chapter) =>
            chapter.querySelector<HTMLElement>(
              '[data-rf-chapter-description]',
            ),
          )
          const visualNodes = chapters.map((chapter) =>
            chapter.querySelector<HTMLElement>('[data-rf-chapter-visual]'),
          )

          chapters.slice(1).forEach((chapter, offset) => {
            const index = offset + 1
            const direction = directionByComposition[getComposition(chapter)]
            gsap.set(titleNodes[index], { xPercent: direction * 108 })
            gsap.set(descriptionNodes[index], {
              y: 36,
              opacity: 0.24,
            })
            gsap.set(visualNodes[index], {
              x: direction * 118,
              y: 30,
              scale: 0.955,
              opacity: 0.32,
            })
          })

          const horizontalDistance = () =>
            Math.max(0, track.scrollWidth - window.innerWidth)
          const scrollDistance = () =>
            Math.max(
              horizontalDistance() * 0.74,
              window.innerHeight * (chapters.length - 0.2),
            )

          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: viewport,
              start: 'top top',
              end: () => `+=${scrollDistance()}`,
              pin: true,
              scrub: 0.78,
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
                '--rf-connector-progress': 1,
                duration: chapters.length - 1,
              },
              0.18,
            )
          }

          chapters.forEach((chapter, index) => {
            const direction =
              directionByComposition[getComposition(chapter)]

            if (index > 0) {
              const entryAt = index - 0.74
              timeline
                .to(
                  titleNodes[index],
                  {
                    x: 0,
                    xPercent: 0,
                    opacity: 1,
                    duration: 0.48,
                  },
                  entryAt,
                )
                .to(
                  descriptionNodes[index],
                  { y: 0, opacity: 1, duration: 0.5 },
                  entryAt + 0.08,
                )
                .to(
                  visualNodes[index],
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
              const exitAt = index + 0.4
              timeline
                .to(
                  titleNodes[index],
                  {
                    x: direction * -42,
                    opacity: 0.32,
                    duration: 0.46,
                  },
                  exitAt,
                )
                .to(
                  descriptionNodes[index],
                  {
                    y: -22,
                    opacity: 0.24,
                    duration: 0.48,
                  },
                  exitAt + 0.03,
                )
                .to(
                  visualNodes[index],
                  {
                    x: direction * -92,
                    y: -20,
                    scale: 0.97,
                    opacity: 0.38,
                    duration: 0.56,
                  },
                  exitAt + 0.02,
                )
            }
          })

          updateProgress(root, 0, chapters.length)
        })

        mediaQueries.add(VERTICAL_QUERY, () => {
          updateProgress(root, 0, chapters.length)

          chapters.forEach((chapter, index) => {
            const title = chapter.querySelector<HTMLElement>(
              '[data-rf-chapter-title]',
            )
            const description = chapter.querySelector<HTMLElement>(
              '[data-rf-chapter-description]',
            )
            const visual = chapter.querySelector<HTMLElement>(
              '[data-rf-chapter-visual]',
            )
            const direction =
              directionByComposition[getComposition(chapter)]

            gsap
              .timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                  trigger: chapter,
                  start: 'top 88%',
                  end: 'top 44%',
                  scrub: 0.45,
                  invalidateOnRefresh: true,
                  onUpdate: (self) => {
                    if (self.progress > 0.5) {
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
                { xPercent: direction * 18, opacity: 0.18 },
                { xPercent: 0, opacity: 1, duration: 0.72 },
                0,
              )
              .fromTo(
                description,
                { y: 24, opacity: 0.22 },
                { y: 0, opacity: 1, duration: 0.72 },
                0.08,
              )
              .fromTo(
                visual,
                {
                  x: direction * 46,
                  y: 34,
                  scale: 0.97,
                  opacity: 0.3,
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
          })
        })

        return () => {
          mediaQueries.revert()
        }
      }, root)

      const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 80)

      return () => {
        window.clearTimeout(refresh)
        context.revert()
        delete root.dataset.motion
        root.style.removeProperty('--rf-story-progress')
      }
    })
  }, [rootRef])
}

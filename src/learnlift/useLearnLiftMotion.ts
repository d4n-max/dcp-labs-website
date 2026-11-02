import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { LearnLiftConfig } from './learnLiftConfig'

gsap.registerPlugin(ScrollTrigger)

// Each chapter holds still for 1.4 timeline units; transitions occupy 1.2.
// Both nested chapter animation and horizontal travel use this same clock.
const HOLD = 1.4
const HANDOFF = 1.2
const STRIDE = HOLD + HANDOFF

export function useLearnLiftMotion(rootRef: RefObject<HTMLDivElement | null>, config: LearnLiftConfig) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      media.add({
        desktop: '(min-width: 1024px) and (min-height: 700px)',
        vertical: '(max-width: 1023px), (max-height: 699px)',
        reduced: '(prefers-reduced-motion: reduce)',
      }, match => {
        const { desktop, reduced } = match.conditions!
        const chapters = Array.from(root.querySelectorAll<HTMLElement>('[data-ll-chapter]'))
        const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-ll-step]'))
        const viewport = root.querySelector<HTMLElement>('[data-ll-viewport]')!
        root.dataset.llLayout = desktop && !reduced ? 'pinned' : 'vertical'
        root.dataset.llMotion = reduced ? 'reduced' : 'enhanced'

        let active = -1
        const updateProgress = (next: number) => {
          if (active === next) return
          active = next
          steps.forEach((step, index) => {
            step.dataset.active = String(index === next)
            step.dataset.completed = String(index < next)
            if (index === next) step.setAttribute('aria-current', 'step')
            else step.removeAttribute('aria-current')
          })
        }
        updateProgress(0)
        if (reduced) return () => {
          delete root.dataset.llLayout
          delete root.dataset.llMotion
        }

        gsap.timeline({ id: 'learnlift-hero', defaults: { ease: 'power3.out' } })
          .from('[data-ll-identity]', { y: 18, opacity: 0, duration: .45 }, 0)
          .from('[data-ll-hero-title]', { yPercent: 110, duration: .8 }, .1)
          .from('[data-ll-hero-description]', { x: -24, opacity: 0, duration: .6 }, .32)
          .from('[data-ll-hero-actions] > *', { y: 18, opacity: 0, stagger: .08, duration: .5 }, .48)
          .from('[data-ll-hero-visual]', { y: 70, scale: .96, opacity: 0, duration: 1.05 }, .22)
          .from('[data-ll-hero-accent]', { scaleX: .6, opacity: 0, duration: 1.1 }, .1)

        if (desktop) {
          gsap.set(chapters.slice(1), { xPercent: 100 })
          const master = gsap.timeline({
            id: 'learnlift-study-story', defaults: { ease: 'none' },
            scrollTrigger: {
              id: 'learnlift-story', trigger: viewport, start: 'top top',
              end: () => `+=${window.innerHeight * (chapters.length * 1.25)}`,
              pin: true, scrub: .45, invalidateOnRefresh: true, anticipatePin: 1,
            },
            onUpdate() {
              updateProgress(Math.min(chapters.length - 1, Math.max(0, Math.floor((this.time() + HANDOFF / 2) / STRIDE))))
            },
          })

          chapters.forEach((chapter, index) => {
            const title = chapter.querySelector('[data-ll-title]')!
            const description = chapter.querySelector('[data-ll-description]')!
            const detail = chapter.querySelector('[data-ll-detail]')!
            const label = chapter.querySelector('[data-ll-label]')!
            const visual = chapter.querySelector('[data-ll-visual]')!
            const tone = chapter.querySelector('[data-ll-tone]')!
            const variant = config.chapters[index].motion
            const focusedAt = index * STRIDE
            master.addLabel(`${config.chapters[index].id}-focus`, focusedAt)

            if (index > 0) {
              const entry = gsap.timeline({ id: `${config.chapters[index].id}-entrance`, defaults: { ease: 'power2.out' } })
              entry.fromTo(label, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .6 }, .15)
                .fromTo(title, { yPercent: variant === 'review' ? -110 : 110 }, { yPercent: 0, duration: .85 }, .15)
                .fromTo(description, { x: variant === 'progress' ? 40 : -32, y: 22, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: .75 }, .32)
                .fromTo(detail, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .65 }, .5)
                .fromTo(visual, {
                  x: () => -viewport.clientWidth * .25,
                  y: variant === 'review' ? 125 : variant === 'progress' ? -60 : 75,
                  scale: variant === 'continue' ? .9 : .96,
                  clipPath: variant === 'review' ? 'inset(18% 0 0 0 round 27px)' : 'inset(0% 0 0 0 round 27px)',
                }, { x: 0, y: 0, scale: 1, clipPath: 'inset(0% 0 0 0 round 27px)', duration: 1.2 }, 0)
                .fromTo(tone, { opacity: .45 }, { opacity: 1, duration: 1.2 }, 0)
              master.add(entry, focusedAt - HANDOFF)
              master.to(chapter, { xPercent: 0, duration: HANDOFF, ease: 'power1.inOut' }, focusedAt - HANDOFF)
            }

            if (index < chapters.length - 1) {
              const exit = gsap.timeline({ id: `${config.chapters[index].id}-exit`, defaults: { ease: 'power1.inOut' } })
              exit.to(title, { x: -45, opacity: 0, duration: .85 }, .2)
                .to([label, description, detail], { y: -24, opacity: 0, stagger: .05, duration: .75 }, .2)
                .to(visual, { x: () => viewport.clientWidth * .18, y: index % 2 ? 40 : -70, scale: .9, duration: 1.2 }, 0)
              master.add(exit, focusedAt + HOLD)
              master.to(chapter, { xPercent: -100, duration: HANDOFF, ease: 'power1.inOut' }, focusedAt + HOLD)
            }
          })
          // A real final dwell, not a zero-duration end frame.
          master.to({}, { duration: HOLD }, (chapters.length - 1) * STRIDE)
        } else {
          chapters.forEach((chapter, index) => {
            gsap.timeline({
              id: `learnlift-mobile-${index}`, defaults: { ease: 'power2.out' },
              scrollTrigger: { id: `learnlift-vertical-${index}`, trigger: chapter, start: 'top 90%', toggleActions: 'play none none reverse' },
            })
              .from(chapter.querySelector('[data-ll-title]'), { y: 24, opacity: .15, duration: .5 }, 0)
              .from(chapter.querySelector('[data-ll-description]'), { y: 18, opacity: .2, duration: .5 }, .1)
            // Keep the large mobile screenshot visible even if it falls below the text.
          })
        }

        return () => {
          delete root.dataset.llLayout
          delete root.dataset.llMotion
          updateProgress(0)
        }
      })
    }, root)
    let disposed = false
    void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh() })
    return () => {
      disposed = true
      media.revert()
      context.revert()
    }
  }, [rootRef, config])
}

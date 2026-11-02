import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { kinBriefChapters } from './kinBriefConfig'

gsap.registerPlugin(ScrollTrigger)
const HOLD = 1.4
const HANDOFF = 1.2
const STRIDE = HOLD + HANDOFF

// Uses the proven LearnLift context/matchMedia lifecycle and chapter clock.
// Isolated because the generic product hook has no focused dwell and samples
// reduced motion only at mount. No shared consumer behavior changes here.
export function useKinBriefMotion(rootRef: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      media.add({ desktop: '(min-width:1200px) and (min-height:700px)', vertical: '(max-width:1199px), (max-height:699px)', reduced: '(prefers-reduced-motion:reduce)' }, match => {
        const { desktop, reduced } = match.conditions!
        const chapters = Array.from(root.querySelectorAll<HTMLElement>('[data-kb-chapter]'))
        const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-kb-step]'))
        const viewport = root.querySelector<HTMLElement>('[data-kb-viewport]')!
        root.dataset.kbLayout = desktop && !reduced ? 'pinned' : 'vertical'
        root.querySelectorAll<HTMLElement>('[data-kb-pan]').forEach(pan => { pan.tabIndex = desktop && !reduced ? -1 : 0 })
        let current = -1
        const progress = (next: number) => {
          if (current === next) return
          current = next
          steps.forEach((step, index) => {
            step.dataset.active = String(index === next)
            step.dataset.completed = String(index < next)
            if (index === next) step.setAttribute('aria-current', 'step')
            else step.removeAttribute('aria-current')
          })
        }
        const cleanup = () => { delete root.dataset.kbLayout; progress(0) }
        progress(0)
        if (reduced) return cleanup
        gsap.timeline({ id:'kinbrief-hero', defaults:{ ease:'power3.out' } })
          .from('[data-kb-identity]', { y:18, opacity:0, duration:.45 }, 0)
          .from('[data-kb-hero-title]', { yPercent:110, duration:.8 }, .1)
          .from('[data-kb-hero-description]', { y:20, opacity:0, duration:.6 }, .3)
          .from('[data-kb-hero] [data-kb-actions] > *', { y:18, opacity:0, stagger:.08, duration:.5 }, .45)
          .from('[data-kb-hero-visual]', { y:65, opacity:0, scale:.97, duration:1 }, .3)
          .from('[data-kb-accent]', { scaleX:0, duration:.8 }, .5)
        if (desktop) {
          gsap.to('[data-kb-hero-visual]', { y: -35, ease:'none', scrollTrigger:{ id:'kinbrief-hero-scroll', trigger:'[data-kb-hero]', start:'top top', end:'bottom top', scrub:.4 } })
          gsap.set(chapters.slice(1), { xPercent:100 })
          const master = gsap.timeline({ id:'kinbrief-story', defaults:{ ease:'none' }, scrollTrigger:{
            id:'kinbrief-story', trigger:viewport, start:'top top', end:()=>`+=${window.innerHeight * chapters.length * 1.25}`,
            pin:true, scrub:.4, anticipatePin:1, invalidateOnRefresh:true,
          }, onUpdate() { progress(Math.min(chapters.length - 1, Math.max(0,Math.floor((this.time() + HANDOFF / 2) / STRIDE)))) } })
          chapters.forEach((chapter,index) => {
            const title = chapter.querySelector('[data-kb-title]')!
            const description = chapter.querySelector('[data-kb-description]')!
            const visual = chapter.querySelector('[data-kb-visual]')!
            const detail = chapter.querySelector('[data-kb-detail]')
            const focus = index * STRIDE
            master.addLabel(`${kinBriefChapters[index].id}-focus`, index === 0 ? .7 : focus)
            if (index === 0) {
              const entrance = gsap.timeline({ id:'kb-notes-entrance', defaults:{ ease:'power2.out' } })
                .from(title, { yPercent:110, duration:.5 }, 0)
                .from(description, { x:-25, opacity:0, duration:.5 }, .15)
                .from(visual, { y:55, scale:.97, opacity:.4, duration:.7 }, 0)
              master.add(entrance, 0)
            }
            if (index > 0) {
              const entrance = gsap.timeline({ id:`${kinBriefChapters[index].id}-entrance`, defaults:{ ease:'power2.out' } })
                .fromTo(title, { yPercent:index === 1 ? -110 : 110 }, { yPercent:0, duration:.8 }, .1)
                .fromTo(description, { x: index === 1 ? 35 : -30, opacity:0 }, { x:0, opacity:1, duration:.75 }, .3)
                .fromTo(visual, { x:()=>-viewport.clientWidth * .23, y:index === 1 ? -65 : 80, scale:index === 1 ? .97 : .9, opacity:.4 }, { x:0, y:0, scale:1, opacity:1, duration:HANDOFF }, 0)
              if (detail) entrance.fromTo(detail, { y:24, opacity:0 }, { y:0, opacity:1, duration:.65 }, .45)
              master.add(entrance, focus - HANDOFF)
              master.to(chapter, { xPercent:0, duration:HANDOFF, ease:'power1.inOut' }, focus - HANDOFF)
            }
            if (index < chapters.length - 1) {
              const exit = gsap.timeline({ id:`${kinBriefChapters[index].id}-exit`, defaults:{ ease:'power1.inOut' } })
                .to(title, { x:index === 0 ? -40 : 35, opacity:0, duration:.85 }, .2)
                .to(description, { y:-24, opacity:0, duration:.75 }, .25)
                .to(visual, { x:()=>viewport.clientWidth * .18, y:index === 0 ? 55 : -45, scale:.93, duration:HANDOFF }, 0)
              master.add(exit, focus + HOLD)
              master.to(chapter, { xPercent:-100, duration:HANDOFF, ease:'power1.inOut' }, focus + HOLD)
            }
          })
          master.to({}, { duration:HOLD }, (chapters.length - 1) * STRIDE)
        } else {
          chapters.forEach((chapter,index) => {
            gsap.timeline({ id:`kinbrief-vertical-${index}`, scrollTrigger:{ trigger:chapter, start:'top 90%', toggleActions:'play none none reverse' } })
              .from(chapter.querySelector('[data-kb-title]'), { y:20, opacity:.2, duration:.5 }, 0)
              .from(chapter.querySelector('[data-kb-description]'), { y:16, opacity:.2, duration:.5 }, .1)
          })
        }
        gsap.timeline({ id:'kinbrief-conclusion', scrollTrigger:{ trigger:'[data-kb-closing]', start:'top 85%', toggleActions:'play none none reverse' } })
          .from('[data-kb-closing-visual]', { y:35, scale:.97, duration:.8, ease:'power2.out' }, 0)
          .from('[data-kb-closing-copy]', { y:20, opacity:.2, duration:.6 }, .2)
        return cleanup
      })
    }, root)
    let disposed = false
    void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh() })
    return () => { disposed = true; media.revert(); context.revert() }
  }, [rootRef])
}

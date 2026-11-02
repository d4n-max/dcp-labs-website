import { useLayoutEffect } from 'react'
import gsap from 'gsap'

// Call after the story's motion hook. A sibling can commit during selective
// hydration before the lazy story itself, so it cannot certify hero readiness.
export function useHeroReady() {
  useLayoutEffect(() => {
    const root = document.getElementById('root')
    if (!root || root.hasAttribute('data-hydrated')) return
    // Flush GSAP's lazy initial writes before lifting the prerender guard.
    // This uses the current ticker time; it does not seek or shorten a tween.
    gsap.ticker.tick()
    root.setAttribute('data-hydrated', 'true')
  }, [])
}

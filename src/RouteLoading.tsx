import { useEffect, useLayoutEffect, useState } from 'react'

// Fixed status feedback does not reserve artificial content height or expose
// the footer while its route is suspended. Fast loads never show the message.
export function RouteLoadingStatus() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 200)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-route-loading
      className={visible
        ? 'pointer-events-none fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-[#100C19] px-5 py-3 text-sm font-semibold text-[#F5F1EA] shadow-lg'
        : 'sr-only'}
    >
      {visible ? 'Loading page…' : null}
    </div>
  )
}

export function RouteReadyFocus({ pathname, onReady }: {
  pathname: string
  onReady: (pathname: string) => boolean
}) {
  useLayoutEffect(() => {
    // Selective hydration can commit this sibling before a lazy cinematic page.
    // Those pages signal readiness after their own motion hook initializes.
    if (!document.querySelector('[data-product-story-root], [data-hero]')) {
      document.getElementById('root')?.setAttribute('data-hydrated', 'true')
    }
  }, [])
  useEffect(() => {
    const navigated = onReady(pathname)
    if (!navigated) return
    let cleanupFocus: (() => void) | undefined
    // Assess visibility after the existing ScrollToTop effect has run. A
    // reused footer link can otherwise look visible just before that scroll.
    const frame = window.requestAnimationFrame(() => {
      const current = document.activeElement
      const rect = current?.getBoundingClientRect()
      // Respect a header/menu control the reader is using while a route loads.
      if (current && current !== document.body && rect && rect.width > 0 &&
        rect.height > 0 && rect.top >= 0 && rect.bottom <= window.innerHeight) return

      const main = document.querySelector<HTMLElement>('main')
      if (!main) return
      const tabIndex = main.getAttribute('tabindex')
      const outline = main.style.outline
      main.tabIndex = -1
      main.style.outline = 'none'
      // The landmark avoids retaining focus on a hero heading after scrolling.
      main.focus({ preventScroll: true })
      const restore = () => {
        if (tabIndex === null) main.removeAttribute('tabindex')
        else main.setAttribute('tabindex', tabIndex)
        main.style.outline = outline
      }
      main.addEventListener('blur', restore, { once: true })
      cleanupFocus = () => {
        main.removeEventListener('blur', restore)
        restore()
      }
    })
    return () => {
      window.cancelAnimationFrame(frame)
      cleanupFocus?.()
    }
  }, [pathname, onReady])

  return null
}

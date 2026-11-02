import { lazy, Suspense, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { ComponentType, ReactNode } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, useLocation } from 'react-router-dom'
import dcpLogo from './assets/dcp-labs-logo.svg'
import { appLinks } from './data/appLinks'
import { RouteLoadingStatus, RouteReadyFocus } from './RouteLoading'

const PageRoutes = lazy(() => import('./PageRoutes'))
const ProductPages = lazy(() => import('./ProductPages'))
const LabsPreviewPage = lazy(() => import('./labs-preview/LabsPreviewPage'))
const Analytics = lazy(() =>
  import('@vercel/analytics/react').then((module) => ({
    default: module.Analytics,
  })),
)

const navItems = [
  { label: 'Apps', href: '/apps' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const TEXTSENSE_PRIVACY_PATH = '/textsense-privacy-policy'
const TEXTSENSE_TERMS_PATH = '/textsense/terms'
const productPaths = new Set(appLinks.map(app => '/' + app.slug))

export type AppPages = {
  Home: ComponentType<{ isPreview: boolean }>
  Products: ComponentType
  Standard: ComponentType<{ locationOverride?: string }>
}
const lazyPages: AppPages = { Home: LabsPreviewPage, Products: ProductPages, Standard: PageRoutes }

function App({ pages = lazyPages, initialNotFound = false }: { pages?: AppPages; initialNotFound?: boolean }) {
  // The build supplies the resolved entries; browser routes keep their existing
  // lazy boundaries and loading/footer lifecycle.
  const { Home, Products, Standard } = pages
  const location = useLocation()
  const [documentPath] = useState(location.pathname)
  const forceNotFound = initialNotFound && location.pathname === documentPath
  const routeFocus = useRef(location.pathname)
  const onRouteReady = useCallback((pathname: string) => {
    const navigated = routeFocus.current !== pathname
    routeFocus.current = pathname
    return navigated
  }, [])
  const normalizedPath = location.pathname.replace(/\/+$/, '') || '/'
  const isLabsPreview =
    normalizedPath === '/labs-preview' && !forceNotFound
  const isProductionHomepage = normalizedPath === '/' && !forceNotFound

  if (isProductionHomepage || isLabsPreview) {
    return (
      <>
        <main>
          <Suspense fallback={<RouteLoadingStatus />}>
            <Home isPreview={isLabsPreview} />
            <RouteReadyFocus pathname={location.pathname} onReady={onRouteReady} />
          </Suspense>
        </main>
        <ScrollToTop />
        {isLabsPreview ? null : <SiteAnalytics />}
      </>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#08080A] text-[#F5F1EA]">
      <AmbientBackground />
      <Header isErrorPage={forceNotFound} />
      {/* Keep the footer in the route boundary so it cannot paint above an
          empty main and then shift below the asynchronously loaded page. */}
      <Suspense fallback={<RouteLoadingStatus />}>
        <main>
          {forceNotFound ? <Standard locationOverride="/404" /> : productPaths.has(normalizedPath) ? <Products /> : <Standard />}
        </main>
        <Footer />
        <RouteReadyFocus pathname={location.pathname} onReady={onRouteReady} />
      </Suspense>
      <ScrollToTop />
      <SiteAnalytics />
    </div>
  )
}

const subscribeRuntime = () => () => undefined
const analyticsRuntime = () => !['localhost', '127.0.0.1'].includes(window.location.hostname)

function SiteAnalytics() {
  const enabled = useSyncExternalStore(subscribeRuntime, analyticsRuntime, () => false)

  if (!enabled) return null

  return (
    <Suspense fallback={null}>
      <Analytics />
    </Suspense>
  )
}

function Header({ isErrorPage = false }: { isErrorPage?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    const header = headerRef.current
    document.body.style.overflow = 'hidden'

    const focusable = Array.from(
      header?.querySelectorAll<HTMLElement>('[data-site-mobile-menu] a') ?? [],
    )
    window.requestAnimationFrame(() => focusable[0]?.focus())

    const closeAndRestoreFocus = () => {
      setMenuOpen(false)
      window.requestAnimationFrame(() => menuButtonRef.current?.focus())
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeAndRestoreFocus()
        return
      }

      if (event.key !== 'Tab' || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!header?.contains(event.target as Node)) {
        closeAndRestoreFocus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [menuOpen])

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#08080A]/88 backdrop-blur-xl"
      ref={headerRef}
    >
      <nav className="site-container flex h-[72px] items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={dcpLogo} alt="DCP Labs" className="h-11 w-auto" />
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            isErrorPage ? <Link
              key={item.href}
              to={item.href}
              className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm font-semibold transition brand-link-muted"
            >
              {item.label}
            </Link> : <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `inline-flex min-h-11 min-w-11 items-center justify-center text-sm font-semibold transition ${
                  isActive
                    ? 'text-white'
                    : 'brand-link-muted'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="hidden md:block">
          <ButtonLink to="/apps" compact>
            Apps
          </ButtonLink>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-white md:hidden"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="site-mobile-navigation"
          ref={menuButtonRef}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="site-mobile-navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 md:hidden"
            data-site-mobile-menu
          >
            <div className="site-container space-y-2 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-white/10 py-3 font-semibold text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050506]">
      <div className="site-container grid gap-10 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <img src={dcpLogo} alt="DCP Labs" className="h-12 w-auto" />
          <p className="mt-6 max-w-md leading-7 text-brand-subtle">
            Focused digital products for practical everyday and professional
            use.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-white">Apps</h3>
          <div className="mt-4 grid gap-3">
            {appLinks.map((app) => (
              <div key={app.slug} className="grid gap-1">
                <Link
                  to={`/${app.slug}`}
                  className="brand-link-soft inline-flex min-h-11 items-center text-sm"
                >
                  {app.name}
                </Link>
                <a
                  href={app.storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="brand-link-muted inline-flex min-h-11 items-center text-xs"
                >
                  {app.storeLabel}
                </a>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-white">DCP Labs</h3>
          <div className="mt-4 grid gap-2">
            {[
              ['Apps', '/apps'],
              ['Blog', '/blog'],
              ['About', '/about'],
              ['Contact', '/contact'],
              ['Privacy', '/privacy'],
              ['Terms', '/terms'],
              ['TextSense Privacy', TEXTSENSE_PRIVACY_PATH],
              ['TextSense Terms', TEXTSENSE_TERMS_PATH],
            ].map(([label, href]) => (
              <Link
                key={href}
                to={href}
                className="brand-link-muted inline-flex min-h-11 items-center text-sm"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function ButtonLink({
  to,
  children,
  variant = 'primary',
  compact = false,
}: {
  to: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
  compact?: boolean
}) {
  const classes = variant === 'primary' ? 'button-primary' : 'button-secondary'

  return (
    <Link
      to={to}
      className={`button ${classes} ${compact ? 'px-4 py-2 text-sm' : ''}`}
    >
      {children}
      <ArrowRight size={17} />
    </Link>
  )
}

function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[#08080A]" />
      <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:96px_96px]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(44,7,88,0.18),transparent_32%,rgba(237,100,166,0.08)_80%,transparent)]" />
    </div>
  )
}

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return null
}

export default App

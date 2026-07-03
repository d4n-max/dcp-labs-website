import { lazy, Suspense, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, useLocation } from 'react-router-dom'
import dcpLogo from './assets/dcp-labs-logo.svg'
import { appLinks } from './data/appLinks'

const PageRoutes = lazy(() => import('./PageRoutes'))
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

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#08080A] text-[#F5F1EA]">
      <AmbientBackground />
      <Header />
      <main>
        <Suspense fallback={null}>
          <PageRoutes />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTop />
      <Suspense fallback={null}>
        <Analytics />
      </Suspense>
    </div>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#08080A]/88 backdrop-blur-xl">
      <nav className="site-container flex h-[72px] items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={dcpLogo} alt="DCP Labs" className="h-11 w-auto" />
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <NavLink
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
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 md:hidden"
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

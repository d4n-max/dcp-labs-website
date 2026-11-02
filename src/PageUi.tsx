import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import dcpLogo from './assets/dcp-labs-logo.svg'
import { Meta } from './PageMeta'

export function ButtonLink({
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

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="min-h-[70dvh]">{children}</div>
}

export function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode
  delay?: number
}) {
  const shouldReduceMotion = useReducedMotion()
  const revealRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (!shouldReduceMotion || !revealRef.current) return
    // Framer's server render cannot read the reader's motion preference. Its
    // initial hidden styles must not survive a reduced-motion hydration.
    revealRef.current.style.opacity = '1'
    revealRef.current.style.transform = 'none'
  }, [shouldReduceMotion])

  return (
    <motion.div
      ref={revealRef}
      data-nojs-reveal
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

export function NotFoundPage() {
  return (
    <PageShell>
      <Meta
        title="Page Not Found | DCP Labs"
        description="The requested DCP Labs page could not be found."
        path={null}
        robots="noindex, follow"
      />
      <section className="section-pad">
        <div className="site-container max-w-4xl">
          <Reveal>
            <img
              src={dcpLogo}
              alt="DCP Labs"
              className="h-auto w-[min(420px,100%)]"
            />
            <h1 className="mt-12 text-[clamp(3.4rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
              Page not found.
            </h1>
            <p className="copy-lg mt-6 max-w-2xl text-brand-muted">
              The page you are looking for is not available on this site.
            </p>
            <div className="mt-8">
              <ButtonLink to="/apps">Explore apps</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}

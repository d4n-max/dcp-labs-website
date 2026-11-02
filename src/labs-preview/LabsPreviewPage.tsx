import { useHeroReady } from '../product-story/useHeroReady'
import { usePageMetadata } from '../seo/usePageMetadata'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FocusEvent, MouseEvent } from 'react'
import { ArrowDown, ArrowRight, Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import dcpLogo from '../assets/dcp-labs-logo.svg'
import careTailScreenshot from '../assets/products/caretail-feature.webp'
import coinRelicScreenshot from '../assets/products/coinrelic-scan.webp'
import kinBriefScreenshot from '../assets/products/kinbrief-dashboard.png'
import learnLiftScreenshot from '../assets/products/learnlift-home.webp'
import roleForgeScreenshot from '../assets/products/roleforge-analyze-any-job-post.webp'
import serviceSphereScreenshot from '../assets/products/servicesphere-mobile-office.webp'
import { appBySlug } from '../data/apps'
import styles from './LabsPreview.module.css'
import { useLabsPreviewMotion } from './useLabsPreviewMotion'

type PreviewSlug =
  | 'caretail'
  | 'roleforge'
  | 'learnlift-ai'
  | 'servicesphere-field-service-app'
  | 'coinrelic'
  | 'kinbrief'

type PreviewProduct = {
  slug: PreviewSlug
  imageSrc: string
  imageWidth: number
  imageHeight: number
  imageClassName: string
  panelClassName: string
  motionProfile: string
}

const previewProducts: PreviewProduct[] = [
  {
    slug: 'caretail',
    imageSrc: careTailScreenshot,
    imageWidth: 1024,
    imageHeight: 500,
    imageClassName: styles.careTailImage,
    panelClassName: styles.careTailPanel,
    motionProfile: 'soft-rise',
  },
  {
    slug: 'roleforge',
    imageSrc: roleForgeScreenshot,
    imageWidth: 1280,
    imageHeight: 800,
    imageClassName: styles.roleForgeImage,
    panelClassName: styles.roleForgePanel,
    motionProfile: 'precision-lock',
  },
  {
    slug: 'learnlift-ai',
    imageSrc: learnLiftScreenshot,
    imageWidth: 1536,
    imageHeight: 2752,
    imageClassName: styles.learnLiftImage,
    panelClassName: styles.learnLiftPanel,
    motionProfile: 'vertical-stack',
  },
  {
    slug: 'servicesphere-field-service-app',
    imageSrc: serviceSphereScreenshot,
    imageWidth: 1080,
    imageHeight: 1920,
    imageClassName: styles.serviceSphereImage,
    panelClassName: styles.serviceSpherePanel,
    motionProfile: 'workflow-sweep',
  },
  {
    slug: 'coinrelic',
    imageSrc: coinRelicScreenshot,
    imageWidth: 442,
    imageHeight: 592,
    imageClassName: styles.coinRelicImage,
    panelClassName: styles.coinRelicPanel,
    motionProfile: 'collector-focus',
  },
  {
    slug: 'kinbrief',
    imageSrc: kinBriefScreenshot,
    imageWidth: 1768,
    imageHeight: 879,
    imageClassName: styles.kinBriefImage,
    panelClassName: styles.kinBriefPanel,
    motionProfile: 'calm-handoff',
  },
]

const productCount = previewProducts.length
const handoffTileCount = 308

const SITE_URL = 'https://dcplabs.app'
const SOCIAL_IMAGE_URL = `${SITE_URL}/og-dcp-labs.svg`
const HOMEPAGE_TITLE =
  'DCP Labs | Software Lab for Focused Digital Products'
const HOMEPAGE_DESCRIPTION =
  'DCP Labs builds focused digital products for practical everyday and professional use, including KinBrief, ServiceSphere, LearnLift AI, CareTail, CoinRelic, and RoleForge.'

function useHomepageMeta(isPreview: boolean) {
  const canonicalUrl = `${SITE_URL}/`
  const productList = previewProducts.map((product, index) => {
    const app = appBySlug[product.slug]
    return {
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: app.name,
        url: `${SITE_URL}/${app.slug}`,
        applicationCategory: app.category,
        operatingSystem: app.platform,
        description: app.shortDescription,
      },
    }
  })
  const entries = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'DCP Labs',
      url: canonicalUrl,
      description: HOMEPAGE_DESCRIPTION,
      sameAs: previewProducts.map(
        (product) => appBySlug[product.slug].storeUrl,
      ),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'DCP Labs',
      url: canonicalUrl,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'DCP Labs products',
      itemListElement: productList,
    },
  ]

  usePageMetadata({
    title: isPreview ? 'Labs Preview | DCP Labs' : HOMEPAGE_TITLE,
    description: isPreview ? 'A private QA route for the DCP Labs production homepage experience.' : HOMEPAGE_DESCRIPTION,
    path: '/', image: SOCIAL_IMAGE_URL,
    robots: isPreview ? 'noindex, nofollow' : 'index, follow',
    jsonLd: isPreview ? undefined : entries,
  })
}

function jumpToStory(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
  const story = document.querySelector('#product-story')
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  story?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
}

function keepProductFocusVisible(
  event: FocusEvent<HTMLAnchorElement>,
  index: number,
) {
  const panel = event.currentTarget.closest<HTMLElement>(
    '[data-product-panel]',
  )
  const story = document.querySelector<HTMLElement>('[data-story]')
  if (!panel || !story) return

  const linkRect = event.currentTarget.getBoundingClientRect()
  if (linkRect.top >= 0 && linkRect.bottom <= window.innerHeight) return

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  const desktopMotion = window.innerWidth >= 900 && !reduceMotion

  if (desktopMotion) {
    const pinContainer =
      story.parentElement?.classList.contains('pin-spacer')
        ? story.parentElement
        : story
    const start = pinContainer.offsetTop
    const end = start + pinContainer.offsetHeight - window.innerHeight
    const targetProgress = index / (productCount - 1)
    window.requestAnimationFrame(() => {
      window.scrollTo(0, start + (end - start) * targetProgress)
    })
    return
  }

  window.requestAnimationFrame(() => {
    panel.scrollIntoView({ block: 'center' })
  })
}

function PreviewButton({
  to,
  children,
  secondary = false,
}: {
  to: string
  children: React.ReactNode
  secondary?: boolean
}) {
  return (
    <Link
      to={to}
      className={`${styles.button} ${
        secondary ? styles.buttonSecondary : styles.buttonPrimary
      }`}
    >
      <span>{children}</span>
      <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
    </Link>
  )
}

function ProductPanel({
  product,
  index,
}: {
  product: PreviewProduct
  index: number
}) {
  const app = appBySlug[product.slug]
  const style = {
    '--product-accent': app.accent,
    '--product-secondary': app.secondaryAccent,
  } as CSSProperties

  return (
    <article
      className={`${styles.productPanel} ${product.panelClassName}`}
      data-product={product.slug}
      data-product-panel
      data-motion-profile={product.motionProfile}
      style={style}
    >
      <div className={styles.productInner}>
        <div className={styles.productCopy} data-product-copy>
          <div className={styles.productIdentity} data-product-heading>
            {app.iconImage ? (
              <img
                src={app.iconImage}
                alt={`${app.name} icon`}
                className={styles.productIcon}
                data-product-icon
                width="64"
                height="64"
              />
            ) : null}
            <div className={styles.productHeading}>
              <p className={styles.productType}>{app.category}</p>
              <h2>{app.name}</h2>
            </div>
          </div>
          <div className={styles.productNarrative} data-product-body>
            <p className={styles.productDescription}>{app.shortDescription}</p>
            <Link
              className={styles.productLink}
              to={`/${app.slug}`}
              onFocus={(event) => keepProductFocusVisible(event, index)}
            >
              <span>View {app.name}</span>
              <ArrowRight aria-hidden="true" size={20} strokeWidth={1.8} />
            </Link>
          </div>
          <p
            className={styles.panelPosition}
            data-product-number
            aria-hidden="true"
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <span>{String(productCount).padStart(2, '0')}</span>
          </p>
        </div>

        <div className={styles.productMedia} data-product-media>
          <div
            className={styles.productVisualBackdrop}
            data-product-backdrop
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </div>
          <div className={styles.productAccentTrace} data-product-trace aria-hidden="true" />
          <div className={styles.productMediaMask} data-product-mask>
            <img
              src={product.imageSrc}
              alt={`${app.name} product interface`}
              width={product.imageWidth}
              height={product.imageHeight}
              className={product.imageClassName}
              data-product-image
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <span
              className={styles.productMediaSheen}
              data-product-sheen
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </article>
  )
}

export default function LabsPreviewPage({
  isPreview = false,
}: {
  isPreview?: boolean
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useHomepageMeta(isPreview)
  useLabsPreviewMotion(rootRef)
  useHeroReady()

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    const header = headerRef.current
    document.body.style.overflow = 'hidden'

    const focusable = Array.from(
      header?.querySelectorAll<HTMLElement>(
        '[data-mobile-navigation] a, [data-mobile-navigation] button',
      ) ?? [],
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

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className={styles.previewTheme} ref={rootRef}>
      <div
        className={styles.handoffGrid}
        data-handoff-grid
        aria-hidden="true"
      >
        {Array.from({ length: handoffTileCount }, (_, index) => (
          <span
            className={styles.handoffTile}
            data-handoff-tile
            key={`handoff-tile-${index}`}
          />
        ))}
      </div>

      <section className={styles.hero} data-hero>
        <div className={styles.heroGrid} data-hero-grid aria-hidden="true" />
        <div className={styles.heroLight} data-hero-light aria-hidden="true" />

        <header
          className={styles.previewHeader}
          data-hero-header
          ref={headerRef}
        >
          <Link to="/" className={styles.logoLink} aria-label="DCP Labs home">
            <img src={dcpLogo} alt="DCP Labs" width="920" height="220" />
          </Link>
          <nav className={styles.desktopNavigation} aria-label="Primary">
            <a href="#product-story" onClick={jumpToStory}>
              Products
            </a>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <button
            type="button"
            className={styles.mobileMenuButton}
            aria-expanded={menuOpen}
            aria-controls="labs-mobile-navigation"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenuOpen((open) => !open)}
            ref={menuButtonRef}
          >
            {menuOpen ? (
              <X aria-hidden="true" size={20} />
            ) : (
              <Menu aria-hidden="true" size={20} />
            )}
          </button>
          <nav
            id="labs-mobile-navigation"
            className={`${styles.mobileNavigation} ${
              menuOpen ? styles.mobileNavigationOpen : ''
            }`}
            aria-label="Mobile"
            aria-hidden={!menuOpen}
            data-mobile-navigation
          >
            <a href="#product-story" onClick={(event) => {
              closeMenu()
              jumpToStory(event)
            }}>
              Products
            </a>
            <Link to="/about" onClick={closeMenu}>
              About
            </Link>
            <Link to="/contact" onClick={closeMenu}>
              Contact
            </Link>
          </nav>
        </header>

        <div className={styles.heroStatement} data-hero-copy>
          <p className={styles.heroKicker} data-hero-kicker>
            Independent product studio · six public products
          </p>
          <h1 className={styles.heroTitle} aria-label="Small studio. Real products. Built with intent.">
            <span className={styles.heroLineMask}>
              <span className={styles.heroWords} data-hero-line="studio">
                <span className={styles.heroWord}>Small</span>
                <span className={styles.heroWord}>studio.</span>
              </span>
            </span>
            <span className={`${styles.heroLineMask} ${styles.heroLineRight}`}>
              <span className={styles.heroWords} data-hero-line="products">
                <span className={styles.heroWord}>Real</span>
                <span className={styles.heroWord}>products.</span>
              </span>
            </span>
            <span className={`${styles.heroLineMask} ${styles.heroLineAccent}`}>
              <span className={styles.heroWords} data-hero-line="intent">
                <span className={styles.heroWord}>Built</span>
                <span className={styles.heroWord}>with</span>
                <span className={styles.heroWord}>intent.</span>
              </span>
            </span>
          </h1>
        </div>

        <div className={styles.heroFooter}>
          <p className={styles.heroSupport} data-hero-support>
            Focused software for care, work, learning, collecting, and family
            coordination.
          </p>
        </div>

        <div className={styles.heroProductBridge} data-hero-index aria-hidden="true">
          {previewProducts.map((product, index) => (
            <span key={product.slug}>
              {String(index + 1).padStart(2, '0')} {appBySlug[product.slug].name}
            </span>
          ))}
        </div>

        <div className={styles.scrollIndicator} data-scroll-indicator>
          <span>Scroll to enter the product story</span>
          <ArrowDown aria-hidden="true" size={16} strokeWidth={1.8} />
        </div>
      </section>

      <section
        className={styles.story}
        id="product-story"
        data-story
        aria-label="Selected DCP Labs products"
      >
        <div className={styles.storyBase} data-story-base aria-hidden="true" />

        {previewProducts.map((product) => (
          <div
            className={`${styles.storyAmbient} ${styles[`${product.slug.replace(
              /-([a-z])/g,
              (_, letter: string) => letter.toUpperCase(),
            )}Ambient` as keyof typeof styles] ?? ''}`}
            data-story-ambient
            data-ambient-product={product.slug}
            key={`${product.slug}-ambient`}
            aria-hidden="true"
          />
        ))}

        <div className={styles.storyChrome} data-story-chrome>
          <p className={styles.storyLabel}>Selected products</p>
          <div className={styles.activeProduct} aria-live="polite">
            <span className={styles.activeProductCount} data-active-count>
              01
            </span>
            <span className={styles.activeProductNames}>
              {previewProducts.map((product, index) => (
                <span
                  key={product.slug}
                  data-progress-name
                  aria-hidden={index === 0 ? 'false' : 'true'}
                >
                  {appBySlug[product.slug].name}
                </span>
              ))}
            </span>
            <span className={styles.activeProductTotal}>
              / {String(productCount).padStart(2, '0')}
            </span>
          </div>
          <nav aria-label="Product story progress">
            <ol>
              {previewProducts.map((product, index) => (
                <li
                  key={product.slug}
                  data-progress-label
                  aria-current={index === 0 ? 'step' : undefined}
                  aria-label={`${String(index + 1).padStart(2, '0')}: ${
                    appBySlug[product.slug].name
                  }`}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </li>
              ))}
            </ol>
          </nav>
          <div className={styles.progressTrack} aria-hidden="true">
            <span data-progress-fill />
            <i data-progress-marker />
            {previewProducts.map((product) => (
              <b key={`${product.slug}-marker`} />
            ))}
          </div>
        </div>

        <div className={styles.storyTrack} data-story-track>
          {previewProducts.map((product, index) => (
            <ProductPanel
              key={product.slug}
              product={product}
              index={index}
            />
          ))}
        </div>
      </section>

      <section className={styles.finalScene} data-final>
        <div className={styles.finalNames} aria-hidden="true">
          {previewProducts.map((product) => (
            <span data-final-name={product.slug} key={product.slug}>
              {appBySlug[product.slug].name}
            </span>
          ))}
        </div>

        <div className={styles.finalContent} data-final-content>
          <img
            src={dcpLogo}
            alt="DCP Labs"
            width="920"
            height="220"
            className={styles.finalLogo}
          />
          <h2 className={styles.finalTitle}>
            <span className={styles.finalLineMask}>
              <span data-final-line>Different products.</span>
            </span>
            <span className={styles.finalLineMask}>
              <span data-final-line>One focused studio.</span>
            </span>
          </h2>
          <p data-final-detail>
            Explore the full DCP Labs catalog or get in touch about a product.
          </p>
          <div className={styles.finalActions} data-final-detail>
            <PreviewButton to="/apps">View all products</PreviewButton>
            <PreviewButton to="/contact" secondary>
              Contact DCP Labs
            </PreviewButton>
          </div>
          <a
            href="mailto:hello@dcplabs.app"
            className={styles.finalEmail}
            data-final-detail
          >
            hello@dcplabs.app
          </a>
        </div>
      </section>

      <footer className={styles.siteFooter}>
        <div className={styles.siteFooterInner}>
          <div className={styles.siteFooterBrand}>
            <img
              src={dcpLogo}
              alt="DCP Labs"
              width="920"
              height="220"
            />
            <p>
              Focused digital products for practical everyday and professional
              use.
            </p>
            <a href="mailto:hello@dcplabs.app">hello@dcplabs.app</a>
          </div>
          <nav aria-label="DCP Labs products">
            <h2>Products</h2>
            {previewProducts.map((product) => {
              const app = appBySlug[product.slug]
              return (
                <div className={styles.siteFooterProduct} key={product.slug}>
                  <Link to={`/${app.slug}`}>{app.name}</Link>
                  <a href={app.storeUrl} target="_blank" rel="noreferrer">
                    {app.storeLabel}
                  </a>
                </div>
              )
            })}
          </nav>
          <nav aria-label="DCP Labs">
            <h2>Studio</h2>
            <Link to="/apps">Apps</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </nav>
        </div>
        <div className={styles.siteFooterLegal}>
          <span>© {new Date().getFullYear()} DCP Labs</span>
          <span>Independent product studio</span>
        </div>
      </footer>
    </div>
  )
}

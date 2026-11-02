import { Meta } from './PageMeta'
import { absoluteUrl, breadcrumbJsonLd, DEFAULT_SOCIAL_IMAGE } from './PageSeo'
import { ButtonLink, PageShell, Reveal, NotFoundPage } from './PageUi'
import type { ComparisonPageData, RoleForgeGuideExample, CareTailSeoPage } from './productSupportContent'
import { comparisonPages, comparisonBySlug, roleForgeGuides, roleForgeGuideBySlug, careTailSeoPages, careTailSeoPageBySlug } from './productSupportContent'
import {
  ArrowRight,
  Check,
  ChevronRight,
  Filter,
  Mail,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { lazy, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Link,
  Navigate,
  Route,
  Routes,
  useParams,
} from 'react-router-dom'
import dcpLogo from './assets/dcp-labs-logo.svg'
import type { AppCategory, StudioApp } from './data/apps'
import { appBySlug, apps, trustSignals } from './data/apps'
import type { BlogPost } from './data/blogPosts'
import { blogCategories, blogPostBySlug, blogPosts } from './data/blogPosts'

const ServiceSpherePage = lazy(() => import('./ProductPages').then(module => ({ default: module.ServiceSpherePage })))
const TEXTSENSE_PRIVACY_PATH = '/textsense-privacy-policy'
const TEXTSENSE_TERMS_PATH = '/textsense/terms'

function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DCP Labs',
    url: absoluteUrl('/'),
    description:
      'DCP Labs builds focused digital products for practical everyday and professional use.',
    sameAs: apps.map((app) => app.storeUrl),
  }
}

function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DCP Labs',
    url: absoluteUrl('/'),
  }
}

const categoryFilters: AppCategory[] = [
  'All',
  'Android',
  'Chrome Extension',
  'Pets',
  'Family',
  'Education',
  'Productivity',
  'Career',
  'Collectors',
]

type TextSenseLegalSection = {
  heading: string
  body: ReactNode
}

type TextSenseLegalContent = {
  kind: 'privacy' | 'terms'
  title: string
  description: string
  lastUpdated: string
  sections: TextSenseLegalSection[]
}

const textsensePrivacySections: TextSenseLegalSection[] = [
  {
    heading: 'Developer and Contact',
    body: (
      <>
        TextSense is provided by DCP Labs. You can contact us at{' '}
        <a href="mailto:hello@dcplabs.app">hello@dcplabs.app</a>. The Android
        package name for TextSense is <strong>com.textsense.app</strong>.
      </>
    ),
  },
  {
    heading: 'Data We Process',
    body: (
      <>
        TextSense may process chat text you paste, chat screenshots you choose
        to upload, text extracted from screenshots, AI summaries, generated
        reply suggestions, subscription state, purchase history, privacy-safe
        app usage events, and local preferences.
      </>
    ),
  },
  {
    heading: 'How We Use Data',
    body: (
      <>
        We use data to provide the requested TextSense features, including
        analyzing tone, intent, interest level, possible red flags, and natural
        reply options. We also use subscription and purchase data to manage
        Premium access, improve app reliability, understand privacy-safe usage
        patterns, and provide support.
      </>
    ),
  },
  {
    heading: 'Chat Text and Screenshot Handling',
    body: (
      <>
        Chats and screenshots are not saved by default and are processed only
        to provide the requested feature. Screenshots are sent for analysis
        only after explicit user confirmation. Screenshots are not stored
        permanently. Screenshot base64, extracted screenshot text, pasted chat
        text, AI summaries, and generated replies must not be sent to
        analytics.
      </>
    ),
  },
  {
    heading: 'AI Processing',
    body: (
      <>
        TextSense uses AI processing through a backend Supabase Edge Function.
        AI API keys are kept server-side only and are never included in the
        Android app. Content submitted for analysis may be transmitted to our
        backend and AI processing providers so the requested analysis or reply
        suggestions can be generated.
      </>
    ),
  },
  {
    heading: 'Subscriptions and RevenueCat',
    body: (
      <>
        TextSense uses RevenueCat to help manage subscriptions and the
        <strong> premium</strong> entitlement. RevenueCat may process purchase
        identifiers, subscription state, purchase history, product identifiers,
        and related subscription metadata for products including{' '}
        <strong>textsense_premium_monthly</strong> and{' '}
        <strong>textsense_premium_yearly</strong>.
      </>
    ),
  },
  {
    heading: 'Google Play Billing',
    body: (
      <>
        Purchases and subscription billing are handled through Google Play
        Billing. Google may process payment and account information under
        Google Play's own terms and privacy practices. DCP Labs does not
        receive full payment card details from Google Play Billing.
      </>
    ),
  },
  {
    heading: 'Firebase Analytics',
    body: (
      <>
        TextSense uses Firebase Analytics with privacy-safe events only. We do
        not send screenshot base64, extracted screenshot text, pasted chat
        text, AI summaries, or generated replies to analytics.
      </>
    ),
  },
  {
    heading: 'Data Retention',
    body: (
      <>
        Chats and screenshots are not saved by default. Screenshots are not
        stored permanently. Subscription records, purchase history, app usage
        events, and local preferences may be retained as needed to provide the
        app, manage Premium access, maintain records, comply with platform
        requirements, and support users.
      </>
    ),
  },
  {
    heading: 'Data Deletion and Contact',
    body: (
      <>
        To request deletion or ask privacy questions, contact{' '}
        <a href="mailto:hello@dcplabs.app">hello@dcplabs.app</a>. Some
        subscription, billing, and platform records may need to be handled
        through Google Play, RevenueCat, or retained where required for
        legitimate business, security, or legal reasons.
      </>
    ),
  },
  {
    heading: 'Children',
    body: (
      <>
        TextSense is not intended for users under 18. If you believe a person
        under 18 has provided data to TextSense, contact us so we can review
        and take appropriate action.
      </>
    ),
  },
  {
    heading: 'Changes to This Policy',
    body: (
      <>
        We may update this Privacy Policy from time to time. When we make
        changes, we will update the "Last updated" date on this page.
      </>
    ),
  },
]

const textsenseTermsSections: TextSenseLegalSection[] = [
  {
    heading: 'Acceptance of Terms',
    body: (
      <>
        By downloading, accessing, or using TextSense, you agree to these Terms
        of Use. If you do not agree, do not use the app.
      </>
    ),
  },
  {
    heading: 'App Description',
    body: (
      <>
        TextSense is a privacy-first AI dating and relationship clarity coach.
        Users can paste chat text or upload chat screenshots to receive
        analysis of tone, intent, interest level, possible red flags, and
        natural reply suggestions.
      </>
    ),
  },
  {
    heading: 'AI-Generated Suggestions and Limitations',
    body: (
      <>
        TextSense provides AI-generated analysis and suggestions for
        informational and drafting support only. Results may be incomplete,
        inaccurate, or unsuitable for your situation. TextSense is not therapy,
        medical advice, legal advice, or crisis support.
      </>
    ),
  },
  {
    heading: 'User Responsibility',
    body: (
      <>
        You are responsible for deciding whether and how to use any analysis,
        summary, or reply suggestion. You should review generated content,
        consider context the app may not know, and use your own judgment before
        sending messages or making relationship decisions.
      </>
    ),
  },
  {
    heading: 'Acceptable Use',
    body: (
      <>
        You may use TextSense for personal dating and relationship clarity,
        message understanding, and reply drafting in a lawful and respectful
        way.
      </>
    ),
  },
  {
    heading: 'Prohibited Use',
    body: (
      <>
        You may not use TextSense to harass, threaten, stalk, impersonate,
        manipulate, exploit, or harm others; violate another person's privacy;
        upload content you do not have the right to use; reverse engineer the
        app or backend; abuse subscriptions or billing systems; or use the app
        for unlawful purposes.
      </>
    ),
  },
  {
    heading: 'Premium Subscriptions',
    body: (
      <>
        TextSense offers Premium subscriptions through Google Play Billing and
        RevenueCat. Premium access is managed through the{' '}
        <strong>premium</strong> entitlement and may include products such as{' '}
        <strong>textsense_premium_monthly</strong> and{' '}
        <strong>textsense_premium_yearly</strong>. Subscription features,
        pricing, and availability may vary by region and platform.
      </>
    ),
  },
  {
    heading: 'Cancellation and Refunds',
    body: (
      <>
        Subscriptions are managed through Google Play. You can cancel through
        your Google Play account subscription settings. Refund requests are
        handled by Google Play according to Google Play's refund policies.
      </>
    ),
  },
  {
    heading: 'No Guaranteed Outcomes',
    body: (
      <>
        TextSense does not guarantee dating, relationship, communication, or
        personal outcomes. The app can provide analysis and suggestions, but
        outcomes depend on many factors outside the app's control.
      </>
    ),
  },
  {
    heading: 'Privacy',
    body: (
      <>
        Your use of TextSense is also governed by the{' '}
        <Link to={TEXTSENSE_PRIVACY_PATH}>TextSense Privacy Policy</Link>, which
        explains how chat text, screenshots, AI processing, subscriptions, and
        analytics are handled.
      </>
    ),
  },
  {
    heading: 'Changes to These Terms',
    body: (
      <>
        We may update these Terms from time to time. When we make changes, we
        will update the "Last updated" date on this page. Continued use of
        TextSense after changes means you accept the updated Terms.
      </>
    ),
  },
  {
    heading: 'Contact',
    body: (
      <>
        For questions about these Terms, contact DCP Labs at{' '}
        <a href="mailto:hello@dcplabs.app">hello@dcplabs.app</a>.
      </>
    ),
  },
]

const textsenseLegalPages: Record<'privacy' | 'terms', TextSenseLegalContent> = {
  privacy: {
    kind: 'privacy',
    title: 'TextSense Privacy Policy',
    description:
      'Privacy Policy for TextSense, a privacy-first AI dating and relationship clarity coach from DCP Labs.',
    lastUpdated: 'June 29, 2026',
    sections: textsensePrivacySections,
  },
  terms: {
    kind: 'terms',
    title: 'TextSense Terms of Use',
    description:
      'Terms of Use for TextSense, including AI-generated suggestions, subscriptions, user responsibility, and limitations.',
    lastUpdated: 'June 29, 2026',
    sections: textsenseTermsSections,
  },
}

export default function PageRoutes({ locationOverride }: { locationOverride?: string }) {
  return (
    <Routes location={locationOverride}>
      <Route path="/" element={<HomePage />} />
      <Route path="/apps" element={<AppsPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:blogSlug" element={<BlogPostPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route
        path="/servicesphere"
        element={<Navigate to="/servicesphere-field-service-app" replace />}
      />
      <Route
        path="/servicesphere-field-service-app"
        element={<ServiceSpherePage />}
      />
      <Route
        path="/caretail/:careTailPageSlug"
        element={<CareTailSupportPage />}
      />
      <Route
        path="/roleforge/guides"
        element={<RoleForgeGuidesIndexPage />}
      />
      <Route
        path="/roleforge/guides/:guideSlug"
        element={<RoleForgeGuidePage />}
      />
      <Route
        path="/roleforge/best-ai-resume-tools"
        element={<RoleForgeBestToolsPage />}
      />
      <Route
        path="/roleforge/:comparisonSlug"
        element={<RoleForgeComparisonPage />}
      />
      <Route
        path="/textsense/privacy"
        element={<Navigate to={TEXTSENSE_PRIVACY_PATH} replace />}
      />
      <Route
        path={TEXTSENSE_PRIVACY_PATH}
        element={<TextSenseLegalPage content={textsenseLegalPages.privacy} />}
      />
      <Route
        path="/textsense/terms"
        element={<TextSenseLegalPage content={textsenseLegalPages.terms} />}
      />
      <Route
        path="/privacy"
        element={
          <LegalPage
            title="Privacy"
            description="Privacy information for the DCP Labs website and its live products, including KinBrief, ServiceSphere, LearnLift AI, CareTail, CoinRelic, and RoleForge."
          />
        }
      />
      <Route
        path="/terms"
        element={
          <LegalPage
            title="Terms"
            description="Terms information for the DCP Labs website and links to its live product destinations."
          />
        }
      />
      <Route
        path="/coinrelic/is-my-coin-rare"
        element={<CoinRelicRarityToolPage />}
      />
      <Route path="/:slug" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

function HomePage() {
  return (
    <>
      <Meta
        title="DCP Labs | Software Lab for Focused Digital Products"
        description="DCP Labs builds focused digital products for practical everyday and professional use, including KinBrief, ServiceSphere, LearnLift AI, CareTail, CoinRelic, and RoleForge."
        path="/"
        jsonLd={[
          organizationJsonLd(),
          websiteJsonLd(),
          breadcrumbJsonLd([{ name: 'DCP Labs', path: '/' }]),
        ]}
      />
      <HeroSection />
      <TrustStrip />
      <ProductLedger />
      <StudioPrinciples />
      <EcosystemMap />
      <FinalCta
        title="Explore the live DCP Labs products."
        body="Visit KinBrief on the web, install the Android apps from Google Play, or add RoleForge from the Chrome Web Store."
      />
    </>
  )
}

function AppsPage() {
  const [activeFilter, setActiveFilter] = useState<AppCategory>('All')
  const filteredApps = useMemo(
    () =>
      activeFilter === 'All'
        ? apps
        : apps.filter((app) => app.filters.includes(activeFilter)),
    [activeFilter],
  )

  return (
    <PageShell>
      <Meta
        title="Apps | KinBrief, ServiceSphere, LearnLift AI, CareTail, CoinRelic, and RoleForge by DCP Labs"
        description="Explore KinBrief for family care coordination, ServiceSphere for field service work, LearnLift AI for focused study, CareTail for pet owners, CoinRelic for collectors, and RoleForge for job seekers."
        path="/apps"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'DCP Labs Apps',
            description:
              'Live DCP Labs products for pet owners, coin collectors, and job seekers.',
            url: absoluteUrl('/apps'),
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: apps.map((app, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'SoftwareApplication',
                  name: app.name,
                  url: absoluteUrl(`/${app.slug}`),
                  applicationCategory: app.category,
                  description: app.shortDescription,
                },
              })),
            },
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
          ]),
        ]}
      />
      <section className="section-pad border-b border-white/10">
        <div className="site-container">
          <Reveal>
            <div className="max-w-5xl">
              <p className="section-kicker">Apps</p>
              <h1 className="mt-5 max-w-5xl text-[clamp(3rem,8vw,7.7rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
                Six live products, each built for a specific job.
              </h1>
              <p className="copy-lg mt-7 max-w-2xl text-brand-muted">
                KinBrief helps families coordinate care for an aging parent.
                ServiceSphere supports small field service businesses. LearnLift
                AI supports short study sessions. CareTail helps pet owners keep
                care details organized. CoinRelic helps collectors identify and
                catalog coins. RoleForge helps job seekers tailor applications.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="mt-12 flex flex-wrap gap-2">
              {categoryFilters.map((filter) => (
                <FilterChip
                  key={filter}
                  active={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                  icon={filter === 'All' ? <Filter size={15} /> : null}
                >
                  {filter}
                </FilterChip>
              ))}
            </div>
          </Reveal>

          <div className="mt-10">
            <AnimatePresence mode="popLayout">
              {filteredApps.map((app, index) => (
                <CatalogRow key={app.slug} app={app} index={index} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
function CareTailSupportPage() {
  const { careTailPageSlug = '' } = useParams()
  const page = careTailSeoPageBySlug[careTailPageSlug]
  const app = appBySlug.caretail

  if (!page || !app) return <NotFoundPage />

  const path = `/caretail/${page.slug}`
  const relatedPages = page.related
    .map((slug) => careTailSeoPageBySlug[slug])
    .filter((item): item is CareTailSeoPage => Boolean(item))

  return (
    <div className="product-theme product-theme-petcare product-page min-h-screen">
      <Meta
        title={page.title}
        description={page.metaDescription}
        path={path}
        image="/og-caretail.svg"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: page.h1,
            description: page.metaDescription,
            url: absoluteUrl(path),
            isPartOf: {
              '@type': 'WebSite',
              name: 'DCP Labs',
              url: absoluteUrl('/'),
            },
            about: {
              '@type': 'SoftwareApplication',
              name: 'CareTail',
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'Android',
              url: absoluteUrl('/caretail'),
            },
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'CareTail', path: '/caretail' },
            { name: page.h1, path },
          ]),
        ]}
      />

      <section className="relative overflow-hidden border-b border-[#50BFB7]/20 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(80,191,183,0.28),transparent_34%),radial-gradient(circle_at_90%_20%,rgba(255,104,104,0.12),transparent_28%),linear-gradient(135deg,#E4FFFB,#FFF8EB_80%)]" />
        <div className="site-container relative grid gap-12 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div>
              <Link
                to="/caretail"
                className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-bold product-link transition"
              >
                <ChevronRight className="rotate-180" size={16} />
                Back to CareTail
              </Link>
              <div className="flex flex-wrap items-center gap-4">
                {app.iconImage ? (
                  <img
                    src={app.iconImage}
                    alt="CareTail app icon"
                    className="h-14 w-14 rounded-[18px] object-cover shadow-[0_18px_44px_rgba(80,191,183,0.22)]"
                  />
                ) : (
                  <AppSymbol app={app} small />
                )}
                <span className="rounded-full product-chip px-3 py-1 text-sm font-bold shadow-[0_14px_36px_rgba(80,191,183,0.14)]">
                  {page.keyword}
                </span>
              </div>
              <h1 className="mt-8 max-w-4xl text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.94] tracking-[-0.04em] text-[#15212A]">
                {page.h1}
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 product-soft">
                {page.problem}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <CareTailStoreButton href={app.storeUrl}>
                  Get CareTail on Google Play
                </CareTailStoreButton>
                <Link
                  to="/apps"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#2B817C]/20 bg-white px-5 py-3 text-sm font-bold text-[#174F4B] shadow-[0_14px_34px_rgba(21,33,42,0.08)] transition hover:-translate-y-px hover:border-[#2B817C]/36"
                >
                  View DCP apps
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <CareTailPromoPanel
              src={app.screenshots[page.imageIndex]}
              alt={page.imageAlt}
              wide={page.imageIndex === 0}
              portrait={page.imageIndex !== 0}
              priority
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-[#F8FFFC] py-16 md:py-24">
        <div className="site-container grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <Reveal>
            <div>
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#15212A] md:text-6xl">
                How CareTail helps
              </h2>
              <p className="mt-6 text-lg leading-8 product-muted">
                {page.explanation}
              </p>
              <p className="mt-6 rounded-[24px] border border-[#50BFB7]/18 bg-[#ECFBF7] p-5 text-sm leading-6 text-[#2B817C]">
                {page.safetyLine}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="grid gap-4 md:grid-cols-2">
              {page.features.map((feature) => (
                <div
                  key={feature}
                  className="flex gap-3 rounded-[18px] border border-[#50BFB7]/18 bg-white/82 p-5 shadow-[0_10px_26px_rgba(43,129,124,0.08)]"
                >
                  <Check className="mt-1 shrink-0 text-[#FF6868]" size={18} />
                  <span className="leading-7 text-[#236A66]">{feature}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#ECFBF7] py-16 md:py-24">
        <div className="site-container grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <div>
              <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[#15212A] md:text-6xl">
                Keep pet care details organized with CareTail.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 product-muted">
                Explore the main CareTail page for the full product overview,
                screenshots, FAQ, and official Google Play link.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="flex flex-wrap gap-3">
              <CareTailStoreButton href={app.storeUrl}>
                Get CareTail on Google Play
              </CareTailStoreButton>
              <Link
                to="/caretail"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#2B817C]/20 bg-white px-5 py-3 text-sm font-bold text-[#174F4B] shadow-[0_14px_34px_rgba(21,33,42,0.08)] transition hover:-translate-y-px hover:border-[#2B817C]/36"
              >
                View CareTail
                <ArrowRight size={17} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CareTailUseCaseLinks currentSlug={page.slug} relatedPages={relatedPages} />
    </div>
  )
}

function CareTailUseCaseLinks({
  currentSlug,
  relatedPages,
}: {
  currentSlug?: string
  relatedPages?: CareTailSeoPage[]
}) {
  const pages =
    relatedPages ??
    careTailSeoPages.filter((page) => page.slug !== currentSlug)

  return (
    <section className="border-t border-[#50BFB7]/20 bg-[#F8FFFC] py-16 md:py-24">
      <div className="site-container">
        <Reveal>
          <div className="max-w-3xl">
            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-[#15212A] md:text-6xl">
              Explore CareTail use cases
            </h2>
            <p className="mt-5 text-lg leading-8 product-muted">
              Practical guides for organizing routines, reminders, notes,
              records, and multi-pet care with CareTail.
            </p>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((item) => (
            <Reveal key={item.slug}>
              <Link
                to={`/caretail/${item.slug}`}
                className="group flex h-full flex-col justify-between rounded-[18px] border border-[#50BFB7]/18 bg-white/82 p-6 shadow-[0_10px_26px_rgba(43,129,124,0.08)] transition hover:-translate-y-1 hover:border-[#50BFB7]/34"
              >
                <span className="text-sm font-bold text-[#2B817C]">
                  {item.keyword}
                </span>
                <span className="mt-5 block text-2xl font-semibold tracking-[-0.03em] text-[#15212A]">
                  {item.h1}
                </span>
                <span className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#FF6868]">
                  Read guide
                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CareTailPromoPanel({
  src,
  alt,
  wide = false,
  portrait = false,
  priority = false,
}: {
  src: string
  alt: string
  wide?: boolean
  portrait?: boolean
  priority?: boolean
}) {
  const maxWidth = wide ? 'max-w-[920px]' : portrait ? 'max-w-[430px]' : 'max-w-[620px]'

  return (
    <div className={`relative mx-auto w-full ${maxWidth}`}>
      <div className="absolute -inset-5 rounded-[2.25rem] bg-[radial-gradient(circle_at_48%_30%,rgba(80,191,183,0.22),transparent_52%),radial-gradient(circle_at_82%_76%,rgba(255,104,104,0.12),transparent_42%)] blur-2xl" />
      <div className="relative rounded-[20px] border border-[#50BFB7]/18 bg-white/72 p-2 shadow-[0_14px_34px_rgba(43,129,124,0.12),inset_0_1px_0_rgba(255,255,255,0.70)]">
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="h-auto w-full rounded-[24px] object-contain"
        />
      </div>
    </div>
  )
}

function CareTailStoreButton({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#FF6868] bg-[#FF6868] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_42px_rgba(255,104,104,0.24)] transition hover:-translate-y-px hover:bg-[#F85E5E]"
    >
      {children}
      <ArrowRight size={17} />
    </a>
  )
}

type CoinRarityForm = {
  country: string
  year: string
  denomination: string
  mintMark: string
  condition: string
  unusual: string
}

function CoinRelicRarityToolPage() {
  const coinRelic = appBySlug.coinrelic
  const [form, setForm] = useState<CoinRarityForm>({
    country: '',
    year: '',
    denomination: '',
    mintMark: 'Unknown',
    condition: 'Average',
    unusual: 'Not sure',
  })
  const [result, setResult] = useState<{
    score: number
    level: string
    explanation: string
  } | null>(null)

  const updateField = (field: keyof CoinRarityForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const checkCoin = () => {
    const year = Number(form.year)
    let score = 0
    const reasons: string[] = []

    if (Number.isFinite(year) && year > 0) {
      if (year < 1900) {
        score += 3
        reasons.push('the date is before 1900')
      } else if (year <= 1949) {
        score += 2
        reasons.push('the date falls between 1900 and 1949')
      } else if (year <= 1979) {
        score += 1
        reasons.push('the date falls between 1950 and 1979')
      }
    }

    if (form.condition === 'Excellent / Uncirculated') {
      score += 2
      reasons.push('the condition appears especially strong')
    } else if (form.condition === 'Very Good') {
      score += 1
      reasons.push('the condition appears above average')
    }

    if (form.mintMark === 'Unknown' || form.mintMark === 'Other') {
      score += 1
      reasons.push(
        form.mintMark === 'Unknown'
          ? 'the mint mark still needs to be confirmed'
          : 'the mint mark may need closer research',
      )
    }

    if (form.unusual === 'Yes') {
      score += 3
      reasons.push('you noticed a possible error or unusual design detail')
    } else if (form.unusual === 'Not sure') {
      score += 1
      reasons.push('there may be unusual details worth checking')
    }

    const level =
      score >= 6
        ? 'Strong candidate for a closer look'
        : score >= 3
          ? 'Worth checking further'
          : 'Low rarity signals'

    const coinLabel = [
      form.country || 'this coin',
      form.year ? form.year : '',
      form.denomination || '',
    ]
      .filter(Boolean)
      .join(' ')

    const explanation = reasons.length
      ? `${coinLabel} may deserve more research because ${reasons.join(', ')}. This is not an appraisal, but these are reasonable collector signals to inspect.`
      : `${coinLabel} does not show many rarity signals from this checklist. It can still be useful to scan, identify, and save the coin so you have a clean record.`

    setResult({ score, level, explanation })
  }

  return (
    <div className="product-theme product-theme-collector product-page min-h-screen">
      <Meta
        title="Is My Coin Rare? Free Coin Value Checklist | CoinRelic"
        description="Enter your coin's country, year, denomination, mint mark, and condition to see if it may be worth checking further. Use CoinRelic to scan, identify, and track your coin collection."
        path="/coinrelic/is-my-coin-rare"
        image="/og-coinrelic.svg"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Is My Coin Rare? Free Coin Value Checklist',
            description:
              'A free checklist for reviewing coin rarity signals such as date, mint mark, condition, and possible errors.',
            url: absoluteUrl('/coinrelic/is-my-coin-rare'),
            applicationCategory: 'UtilityApplication',
            publisher: {
              '@type': 'Organization',
              name: 'DCP Labs',
              url: absoluteUrl('/'),
            },
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'CoinRelic', path: '/coinrelic' },
            {
              name: 'Is My Coin Rare?',
              path: '/coinrelic/is-my-coin-rare',
            },
          ]),
        ]}
      />

      <section className="relative overflow-hidden border-b border-[#D6A94B]/20 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_24%,rgba(214,169,75,0.18),transparent_30%),radial-gradient(circle_at_16%_76%,rgba(40,90,120,0.22),transparent_34%),linear-gradient(180deg,#03070B,#07111A_58%,#03070B)]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_center,rgba(214,169,75,0.45)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="site-container relative grid gap-12 py-16 md:py-24 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <Reveal>
            <div>
              <Link
                to="/coinrelic"
                className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold product-link transition"
              >
                <ChevronRight className="rotate-180" size={16} />
                Back to CoinRelic
              </Link>
              <p className="section-kicker border-[#D6A94B]/30 bg-[#D6A94B]/10 text-[#D6A94B]">
                Free coin value checklist
              </p>
              <h1 className="mt-6 max-w-4xl text-[clamp(3.6rem,8vw,8rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[#FFF8DF]">
                Is My Coin Rare?
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 product-soft">
                Use this free checklist to see if your coin may be worth
                checking further.
              </p>
              <p className="mt-6 max-w-2xl border-l border-[#D6A94B]/40 pl-5 text-base leading-7 product-muted">
                This tool does not provide an official appraisal. It helps you
                identify signs that a coin may deserve a closer look.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative">
              <div className="absolute inset-8 rounded-full bg-[#D6A94B]/14 blur-3xl" />
              <div className="relative rounded-[22px] border border-[#D6A94B]/18 bg-[#06111A]/92 p-7 shadow-[0_18px_44px_rgba(0,0,0,0.38)] md:p-9">
                <img
                  src={coinRelic.iconImage}
                  alt="CoinRelic app icon"
                  className="h-16 w-16 rounded-[22px] object-cover shadow-[0_0_44px_rgba(214,169,75,0.28)]"
                />
                <h2 className="mt-8 text-3xl font-semibold tracking-[-0.035em] text-[#FFF8DF] md:text-5xl">
                  Look for signals, then save the coin properly.
                </h2>
                <div className="mt-8 grid gap-4">
                  {[
                    'Date and mint mark',
                    'Visible errors',
                    'Condition and wear',
                    'Similar sold examples',
                  ].map((item) => (
                    <div key={item} className="flex gap-3 text-[#E9D8A6]">
                      <Check
                        className="mt-1 shrink-0 text-[#D6A94B]"
                        size={18}
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#050B10] py-16 md:py-24">
        <div className="site-container grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <CoinRarityFormPanel
              form={form}
              updateField={updateField}
              onSubmit={checkCoin}
            />
          </Reveal>
          <Reveal delay={0.05}>
            <CoinRarityResultPanel result={result} app={coinRelic} />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-[#D6A94B]/20 bg-[#020609] py-16 md:py-20">
        <div className="site-container grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <Reveal>
            <div>
              <h2 className="text-4xl font-semibold tracking-[-0.035em] text-[#FFF8DF] md:text-6xl">
                Want to identify and track your coins properly?
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 product-muted">
                CoinRelic helps collectors scan coins, save them to a personal
                collection, keep scan history, and organize discoveries over
                time.
              </p>
            </div>
          </Reveal>
          <StoreButton href={coinRelic.storeUrl}>Download CoinRelic</StoreButton>
        </div>
      </section>

      <CoinRaritySeoContent />
      <CoinRarityFaq app={coinRelic} />
    </div>
  )
}

function CoinRarityFormPanel({
  form,
  updateField,
  onSubmit,
}: {
  form: CoinRarityForm
  updateField: (field: keyof CoinRarityForm, value: string) => void
  onSubmit: () => void
}) {
  return (
    <form
      className="rounded-[20px] border border-[#D6A94B]/16 bg-[#06111A] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.32)] md:p-8"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <h2 className="text-3xl font-semibold tracking-[-0.035em] text-[#FFF8DF] md:text-5xl">
        Check your coin
      </h2>
      <div className="mt-8 grid gap-5">
        <CoinToolField label="Country or region" id="coin-country">
          <input
            id="coin-country"
            value={form.country}
            onChange={(event) => updateField('country', event.target.value)}
            placeholder="United States, Canada, Romania..."
            className="coin-tool-input"
          />
        </CoinToolField>
        <CoinToolField label="Year" id="coin-year">
          <input
            id="coin-year"
            value={form.year}
            onChange={(event) => updateField('year', event.target.value)}
            placeholder="1916"
            min="1"
            max="2100"
            type="number"
            className="coin-tool-input"
          />
        </CoinToolField>
        <CoinToolField label="Denomination" id="coin-denomination">
          <input
            id="coin-denomination"
            value={form.denomination}
            onChange={(event) =>
              updateField('denomination', event.target.value)
            }
            placeholder="Dime, penny, quarter, 1 leu..."
            className="coin-tool-input"
          />
        </CoinToolField>
        <CoinToolField label="Mint mark" id="coin-mint-mark">
          <select
            id="coin-mint-mark"
            value={form.mintMark}
            onChange={(event) => updateField('mintMark', event.target.value)}
            className="coin-tool-input"
          >
            {['Unknown', 'None visible', 'P', 'D', 'S', 'W', 'Other'].map(
              (option) => (
                <option key={option}>{option}</option>
              ),
            )}
          </select>
        </CoinToolField>
        <CoinToolField label="Condition" id="coin-condition">
          <select
            id="coin-condition"
            value={form.condition}
            onChange={(event) => updateField('condition', event.target.value)}
            className="coin-tool-input"
          >
            {[
              'Poor',
              'Average',
              'Good',
              'Very Good',
              'Excellent / Uncirculated',
            ].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </CoinToolField>
        <CoinToolField
          label="Does it look unusual or like it has an error?"
          id="coin-unusual"
        >
          <select
            id="coin-unusual"
            value={form.unusual}
            onChange={(event) => updateField('unusual', event.target.value)}
            className="coin-tool-input"
          >
            {['Not sure', 'No', 'Yes'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </CoinToolField>
        <div className="rounded-[24px] border border-[#D6A94B]/16 bg-[#020609] p-5">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#D6A94B]">
            Photo identification
          </p>
          <p className="mt-3 text-base leading-7 product-muted">
            For photo-based identification, scan your coin in the CoinRelic app.
          </p>
        </div>
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#D6A94B] bg-[#D6A94B] px-5 py-3 text-sm font-bold text-[#07111A] transition hover:-translate-y-px"
        >
          Check my coin
          <ArrowRight size={17} />
        </button>
      </div>
    </form>
  )
}

function CoinToolField({
  label,
  id,
  children,
}: {
  label: string
  id: string
  children: ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-[#E9D8A6]"
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function CoinRarityResultPanel({
  result,
  app,
}: {
  result: { score: number; level: string; explanation: string } | null
  app: StudioApp
}) {
  return (
    <div className="min-h-full rounded-[20px] border border-[#D6A94B]/16 bg-[linear-gradient(135deg,#08131B,#03070B)] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.32)] md:p-8">
      <p className="section-kicker border-[#D6A94B]/30 bg-[#D6A94B]/10 text-[#D6A94B]">
        Checklist result
      </p>
      {result ? (
        <>
          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.035em] text-[#FFF8DF] md:text-6xl">
            {result.level}
          </h2>
          <p className="mt-5 text-lg leading-8 product-muted">
            {result.explanation}
          </p>
          <div className="mt-8 rounded-[24px] border border-[#D6A94B]/16 bg-[#020609] p-5">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#D6A94B]">
              Score
            </p>
            <p className="mt-2 text-3xl font-semibold text-[#FFF8DF]">
              {result.score} points
            </p>
          </div>
        </>
      ) : (
        <>
          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.035em] text-[#FFF8DF] md:text-6xl">
            Your checklist result will appear here.
          </h2>
          <p className="mt-5 text-lg leading-8 product-muted">
            Enter the details you can see on the coin. If you are not sure,
            choose the closest option and use the result as a starting point for
            further research.
          </p>
        </>
      )}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-[#FFF8DF]">
          Things to inspect next
        </h3>
        <div className="mt-5 grid gap-4">
          {[
            'Date and mint mark',
            'Visible errors or unusual design',
            'Condition and wear',
            'Metal composition',
            'Similar sold examples',
          ].map((item) => (
            <div key={item} className="flex gap-3 text-[#E9D8A6]">
              <Check className="mt-1 shrink-0 text-[#D6A94B]" size={18} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-9 flex flex-wrap gap-3">
        <a
          href={app.storeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#D6A94B] bg-[#D6A94B] px-5 py-3 text-sm font-bold text-[#07111A] transition hover:-translate-y-px"
        >
          Scan and save this coin with CoinRelic
          <ArrowRight size={17} />
        </a>
        <StoreButton href={app.storeUrl}>Download CoinRelic on Google Play</StoreButton>
      </div>
    </div>
  )
}

function CoinRaritySeoContent() {
  return (
    <section className="bg-[#050B10] py-16 md:py-24">
      <div className="site-container max-w-4xl">
        <Reveal>
          <div className="prose-coin">
            <h2>How to tell if a coin might be rare</h2>
            <p>
              A coin can be interesting for several reasons: age, low mintage,
              unusual design details, visible errors, metal content, demand from
              collectors, or a combination of those factors. Age alone is not
              enough. Some old coins are common, while some modern coins become
              collectible because of mint errors, limited releases, or unusual
              varieties. A practical first pass is to record the country, date,
              denomination, mint mark, and condition, then compare those details
              with trusted references and similar sold examples.
            </p>
            <p>
              The goal is not to guess an exact value from a quick glance. A
              better goal is to decide whether the coin deserves more research.
              If the date is older, the mint mark is unclear, the design looks
              unusual, or the coin appears to be in strong condition, it is worth
              slowing down and documenting it properly.
            </p>

            <h2>Why mint marks matter</h2>
            <p>
              A mint mark can show where a coin was produced. Two coins with the
              same year and denomination may have different collector interest
              because they came from different mints. Some mint marks are common
              for a given year, while others may be scarcer. In other cases, the
              absence of a visible mint mark can also be meaningful, depending on
              the coin type and country.
            </p>
            <p>
              Mint marks are often small and easy to miss. They may sit near the
              date, below a portrait, beside a building, or on the reverse side
              of the coin. Good lighting and a clear photo can make a major
              difference when checking this detail.
            </p>

            <h2>Why condition changes collector interest</h2>
            <p>
              Condition affects how collectors evaluate a coin. Heavy wear,
              scratches, cleaning marks, corrosion, and edge damage can reduce
              interest, even when the coin is old. On the other hand, a common
              coin in excellent or uncirculated condition may still be worth
              saving and researching because high-grade examples can stand out.
            </p>
            <p>
              When reviewing condition, look at the high points of the design,
              the sharpness of lettering, the rims, and the surface. Avoid
              cleaning a coin before researching it. Cleaning can damage the
              surface and may reduce collector appeal.
            </p>

            <h2>Why coin photos help with identification</h2>
            <p>
              Coin identification depends on visible details. A clear photo can
              capture the date, mint mark, denomination, design variety, wear
              pattern, and possible error features. Photos also help you keep a
              record of a find before it gets mixed into a larger collection.
            </p>
            <p>
              Take photos in natural light when possible. Capture both sides,
              keep the coin flat, and avoid harsh glare. If the coin has a
              suspected error, take an extra close-up of that area.
            </p>

            <h2>What to do after finding an interesting coin</h2>
            <p>
              If a coin looks promising, save the details before you move on.
              Record the country, year, denomination, mint mark, condition,
              photos, and any notes about unusual features. Then compare it
              against reputable references and similar sold examples. For higher
              confidence, especially with rare or expensive coins, consider a
              professional opinion from a reputable dealer or grading service.
            </p>
            <p>
              CoinRelic is designed for this research habit: scan the coin, save
              it to a personal collection, keep scan history, and organize notes
              over time. The better your records are, the easier it becomes to
              revisit interesting finds later.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function CoinRarityFaq({ app }: { app: StudioApp }) {
  const faqs = [
    [
      'Can this tool tell me the exact value of my coin?',
      'No. This checklist does not provide an official appraisal or exact value. It highlights signals that may make a coin worth researching further.',
    ],
    [
      'What makes a coin rare?',
      'Rarity can depend on mintage, age, mint mark, errors, variety, condition, metal composition, collector demand, and how many examples are available in the market.',
    ],
    [
      'What is a mint mark?',
      'A mint mark is a small letter or symbol that can identify where a coin was produced. Mint marks can affect collector interest for certain years and denominations.',
    ],
    [
      'Does condition matter?',
      'Yes. Wear, scratches, cleaning, corrosion, and surface quality can all affect collector interest. Strong condition can make a coin more worth documenting and researching.',
    ],
    [
      'Why should I use CoinRelic after this checklist?',
      'CoinRelic helps you scan coins, save them to a personal collection, keep scan history, and organize notes so interesting finds do not get lost.',
    ],
  ]

  return (
    <section className="border-t border-[#D6A94B]/20 bg-[#020609] py-20 md:py-28">
      <div className="site-container max-w-5xl">
        <Reveal>
          <h2 className="text-4xl font-semibold tracking-[-0.035em] text-[#FFF8DF] md:text-6xl">
            Coin value checklist FAQ
          </h2>
        </Reveal>
        <div className="mt-8 divide-y divide-[#D6A94B]/14 border-y border-[#D6A94B]/14">
          {faqs.map(([question, answer]) => (
            <div key={question} className="py-7">
              <h3 className="text-2xl font-semibold text-[#FFF8DF]">
                {question}
              </h3>
              <p className="mt-4 text-lg leading-8 product-muted">{answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <StoreButton href={app.storeUrl}>Download CoinRelic</StoreButton>
        </div>
      </div>
    </section>
  )
}

function RoleForgeComparisonPage() {
  const { comparisonSlug = '' } = useParams()
  const page = comparisonBySlug[comparisonSlug]

  if (!page) return <NotFoundPage />

  return (
    <RoleForgeArticleShell>
      <Meta
        title={page.title}
        description={page.metaDescription}
        path={`/roleforge/${page.slug}`}
        image="/og-roleforge.svg"
        type="article"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: page.h1,
            description: page.metaDescription,
            mainEntityOfPage: absoluteUrl(`/roleforge/${page.slug}`),
            publisher: {
              '@type': 'Organization',
              name: 'DCP Labs',
              url: absoluteUrl('/'),
            },
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'RoleForge', path: '/roleforge' },
            { name: page.h1, path: `/roleforge/${page.slug}` },
          ]),
        ]}
      />

      <section className="relative overflow-hidden border-b border-white/10 pt-24">
        <RoleForgePageGlow />
        <div className="site-container relative py-16 md:py-24">
          <RoleForgeBreadcrumb label={page.competitor} />
          <Reveal>
            <div className="max-w-5xl">
              <p className="section-kicker border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]">
                RoleForge comparison
              </p>
              <h1 className="mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
                {page.h1}
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 product-muted">
                {page.intro}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <RoleForgeStoreCta />
                <Link
                  to="/roleforge"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-bold text-[#090B12] transition hover:-translate-y-px hover:border-[#8B5CF6]"
                >
                  View RoleForge
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-[#080A12] py-16 md:py-24">
        <div className="site-container grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <Reveal>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
              Quick summary
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-7 text-lg leading-8 product-muted">
              {page.summary}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-[#05060A] py-16 md:py-24">
        <div className="site-container grid gap-8 lg:grid-cols-2">
          <ComparisonList
            title="RoleForge strengths"
            items={page.roleforgeStrengths}
          />
          <ComparisonList
            title={`${page.competitor} strengths`}
            items={page.competitorStrengths}
          />
        </div>
      </section>

      <ComparisonTable page={page} />

      <section className="relative bg-[#05060A] py-16 md:py-24">
        <div className="site-container grid gap-8 lg:grid-cols-2">
          <ComparisonList
            title="Who should choose RoleForge?"
            items={page.chooseRoleForge}
          />
          <ComparisonList
            title={`Who should choose ${page.competitor}?`}
            items={page.chooseCompetitor}
          />
        </div>
      </section>

      <section className="relative border-t border-white/10 bg-[#080A12] py-16 md:py-24">
        <div className="site-container">
          <Reveal>
            <div className="rounded-[20px] border border-white/10 bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(56,189,248,0.08))] p-7 md:p-10">
              <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                Final recommendation
              </h2>
              <p className="mt-5 max-w-4xl text-lg leading-8 text-[#D8D4FF]">
                {page.recommendation}
              </p>
              <div className="mt-8">
                <RoleForgeStoreCta />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <RoleForgeCompareLinks currentSlug={page.slug} />
    </RoleForgeArticleShell>
  )
}

function RoleForgeBestToolsPage() {
  const tools = [
    {
      name: 'RoleForge',
      bestFor: 'Tailoring applications from live job postings',
      body: 'Best for job seekers who already have a role open and want to extract requirements, rewrite resume bullets, draft cover letters, prepare form answers, and create interview notes.',
      link: '/roleforge',
    },
    {
      name: 'Teal',
      bestFor: 'Job tracking and resume organization',
      body: 'Often a fit for applicants who want a broader workspace for managing resumes, job searches, and applications over time.',
      link: '/roleforge/vs-teal',
    },
    {
      name: 'Simplify',
      bestFor: 'Faster application forms',
      body: 'Often useful for candidates who want browser-based support for repetitive application steps and form-heavy processes.',
      link: '/roleforge/vs-simplify',
    },
    {
      name: 'Kickresume',
      bestFor: 'Resume design and templates',
      body: 'Often a fit for applicants who want resume and cover letter building with polished document templates.',
      link: '/roleforge/vs-kickresume',
    },
    {
      name: 'Jobright',
      bestFor: 'Broader job search support',
      body: 'May be useful for job seekers looking for job discovery, matching, or broader career-search assistance.',
      link: '/roleforge/vs-jobright',
    },
  ]

  return (
    <RoleForgeArticleShell>
      <Meta
        title="Best AI Resume Tools for Tailored Job Applications | RoleForge"
        description="Compare AI resume tools for tailored job applications, resume writing, cover letters, job tracking, resume design, and application organization."
        path="/roleforge/best-ai-resume-tools"
        image="/og-roleforge.svg"
        type="article"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Best AI Resume Tools for Tailored Job Applications',
            description:
              'A practical roundup of AI resume tools and job application tools for resume tailoring, cover letters, job tracking, and application organization.',
            mainEntityOfPage: absoluteUrl('/roleforge/best-ai-resume-tools'),
            publisher: {
              '@type': 'Organization',
              name: 'DCP Labs',
              url: absoluteUrl('/'),
            },
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'RoleForge', path: '/roleforge' },
            {
              name: 'Best AI resume tools',
              path: '/roleforge/best-ai-resume-tools',
            },
          ]),
        ]}
      />

      <section className="relative overflow-hidden border-b border-white/10 pt-24">
        <RoleForgePageGlow />
        <div className="site-container relative py-16 md:py-24">
          <RoleForgeBreadcrumb label="Best AI resume tools" />
          <Reveal>
            <div className="max-w-5xl">
              <p className="section-kicker border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]">
                RoleForge guide
              </p>
              <h1 className="mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
                Best AI resume tools for tailored job applications.
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 product-muted">
                The best tool depends on the job seeker's goal. Some tools
                help build resumes, some organize applications, and others focus
                on tailoring materials to the job post in front of you.
              </p>
              <div className="mt-9">
                <RoleForgeStoreCta />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-[#080A12] py-16 md:py-24">
        <div className="site-container">
          <Reveal>
            <div className="max-w-4xl">
              <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                How to choose an AI resume tool
              </h2>
              <p className="mt-5 text-lg leading-8 product-muted">
                Start with the job you need done: tailoring applications to live
                job posts, writing resume content, generating cover letters,
                tracking applications, designing a resume, or organizing the
                whole search.
              </p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5">
            {tools.map((tool, index) => (
              <Reveal key={tool.name} delay={index * 0.04}>
                <article className="grid gap-5 rounded-[18px] border border-white/10 bg-[#0D101A]/92 p-6 md:grid-cols-[0.28fr_0.72fr] md:items-center md:p-8">
                  <div>
                    <span className="font-mono text-sm text-[#60A5FA]">
                      0{index + 1}
                    </span>
                    <h3 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white">
                      {tool.name}
                    </h3>
                    <p className="mt-3 text-sm font-bold text-[#C4B5FD]">
                      {tool.bestFor}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg leading-8 product-muted">
                      {tool.body}
                    </p>
                    <Link
                      to={tool.link}
                      className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#BAE6FD] transition hover:text-white"
                    >
                      {tool.name === 'RoleForge'
                        ? 'View RoleForge'
                        : `Compare RoleForge vs ${tool.name}`}
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/10 bg-[#05060A] py-16 md:py-24">
        <div className="site-container">
          <Reveal>
            <div className="rounded-[20px] border border-white/10 bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(56,189,248,0.08))] p-7 md:p-10">
              <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                A focused option for role-specific applications.
              </h2>
              <p className="mt-5 max-w-4xl text-lg leading-8 text-[#D8D4FF]">
                RoleForge is strongest when the goal is to tailor materials from
                a live job post, then review and edit the output before using
                it.
              </p>
              <div className="mt-8">
                <RoleForgeStoreCta />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <RoleForgeCompareLinks currentSlug="best-ai-resume-tools" />
    </RoleForgeArticleShell>
  )
}

function RoleForgeGuidesIndexPage() {
  return (
    <RoleForgeArticleShell>
      <Meta
        title="RoleForge Guides | Resume Tailoring and Job Application Help"
        description="Practical RoleForge guides for tailoring resumes, rewriting resume bullets, writing cover letters, answering application questions, and preparing job applications."
        path="/roleforge/guides"
        image="/og-roleforge.svg"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'RoleForge Guides',
            description:
              'Practical guides for resume tailoring, cover letters, application answers, and ATS-friendly job application writing.',
            url: absoluteUrl('/roleforge/guides'),
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: roleForgeGuides.map((guide, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Article',
                  headline: guide.h1,
                  url: absoluteUrl(`/roleforge/guides/${guide.slug}`),
                  description: guide.metaDescription,
                },
              })),
            },
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'RoleForge', path: '/roleforge' },
            { name: 'Guides', path: '/roleforge/guides' },
          ]),
        ]}
      />

      <section className="relative overflow-hidden border-b border-white/10 pt-24">
        <RoleForgePageGlow />
        <div className="site-container relative py-16 md:py-24">
          <RoleForgeGuideBreadcrumb />
          <Reveal>
            <div className="max-w-5xl">
              <p className="section-kicker border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]">
                RoleForge guides
              </p>
              <h1 className="mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
                Practical guides for stronger job applications.
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 product-muted">
                Clear, example-led advice for tailoring resumes, cover letters,
                application answers, and interview prep around the role in
                front of you.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/roleforge"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-bold text-[#090B12] transition hover:-translate-y-px hover:border-[#8B5CF6]"
                >
                  View RoleForge
                  <ArrowRight size={17} />
                </Link>
                <RoleForgeStoreCta />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-[#080A12] py-16 md:py-24">
        <div className="site-container">
          <div className="divide-y divide-white/10 border-y border-white/10">
            {roleForgeGuides.map((guide, index) => (
              <Reveal key={guide.slug} delay={index * 0.04}>
                <Link
                  to={`/roleforge/guides/${guide.slug}`}
                  className="group grid gap-6 py-8 transition md:grid-cols-[5rem_1fr_auto] md:items-center"
                >
                  <span className="font-mono text-sm text-[#60A5FA]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="text-3xl font-semibold tracking-[-0.035em] text-white transition group-hover:text-[#D8D4FF] md:text-5xl">
                      {guide.h1}
                    </h2>
                    <p className="mt-4 max-w-3xl text-lg leading-8 text-[#BDB8D8]">
                      {guide.intro}
                    </p>
                  </div>
                  <span className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#BAE6FD]">
                    Read guide
                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <RoleForgeGuideCta />
    </RoleForgeArticleShell>
  )
}

function RoleForgeGuidePage() {
  const { guideSlug = '' } = useParams()
  const guide = roleForgeGuideBySlug[guideSlug]

  if (!guide) return <NotFoundPage />

  const relatedGuides = roleForgeGuides
    .filter((item) => item.slug !== guide.slug)
    .slice(0, 3)

  return (
    <RoleForgeArticleShell>
      <Meta
        title={guide.title}
        description={guide.metaDescription}
        path={`/roleforge/guides/${guide.slug}`}
        image="/og-roleforge.svg"
        type="article"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: guide.h1,
            description: guide.metaDescription,
            mainEntityOfPage: absoluteUrl(`/roleforge/guides/${guide.slug}`),
            publisher: {
              '@type': 'Organization',
              name: 'DCP Labs',
              url: absoluteUrl('/'),
            },
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'RoleForge', path: '/roleforge' },
            { name: 'Guides', path: '/roleforge/guides' },
            { name: guide.h1, path: `/roleforge/guides/${guide.slug}` },
          ]),
        ]}
      />

      <article>
        <section className="relative overflow-hidden border-b border-white/10 pt-24">
          <RoleForgePageGlow />
          <div className="site-container relative py-16 md:py-24">
            <RoleForgeGuideBreadcrumb label={guide.h1} />
            <Reveal>
              <div className="max-w-5xl">
                <p className="section-kicker border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]">
                  Practical guide
                </p>
                <h1 className="mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
                  {guide.h1}
                </h1>
                <p className="mt-7 max-w-3xl text-xl leading-9 product-muted">
                  {guide.intro}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative bg-[#080A12] py-16 md:py-24">
          <div className="site-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <Reveal>
                <div className="border-y border-white/10 py-6">
                  <h2 className="text-2xl font-semibold tracking-[-0.02em] text-white">
                    Quick takeaways
                  </h2>
                  <div className="mt-6 grid gap-4">
                    {guide.takeaways.map((takeaway) => (
                      <div key={takeaway} className="flex gap-3 text-[#D8D4FF]">
                        <Check
                          className="mt-1 shrink-0 text-[#38BDF8]"
                          size={18}
                        />
                        <span className="leading-7">{takeaway}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/roleforge/guides"
                    className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#BAE6FD] transition hover:text-white"
                  >
                    All RoleForge guides
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </Reveal>
            </aside>

            <div className="grid gap-12">
              <Reveal>
                <div className="grid gap-9">
                  {guide.sections.map((section, index) => (
                    <section key={section.heading}>
                      <span className="font-mono text-sm text-[#60A5FA]">
                        0{index + 1}
                      </span>
                      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white md:text-5xl">
                        {section.heading}
                      </h2>
                      <p className="mt-5 text-lg leading-8 product-muted">
                        {section.body}
                      </p>
                    </section>
                  ))}
                </div>
              </Reveal>

              <GuideExampleBlock example={guide.example} />

              <Reveal>
                <section className="border-y border-white/10 py-8">
                  <h2 className="text-3xl font-semibold tracking-[-0.035em] text-white md:text-5xl">
                    Final check
                  </h2>
                  <p className="mt-5 text-lg leading-8 product-muted">
                    {guide.closing}
                  </p>
                </section>
              </Reveal>

              <RoleForgeGuideCta compact />

              <Reveal>
                <section className="border-t border-white/10 pt-8">
                  <h2 className="text-3xl font-semibold tracking-[-0.035em] text-white">
                    Related guides
                  </h2>
                  <div className="mt-6 grid gap-3">
                    {relatedGuides.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/roleforge/guides/${item.slug}`}
                        className="group flex items-center justify-between gap-4 border-b border-white/10 py-4 text-[#D8D4FF] transition hover:text-white"
                      >
                        <span className="font-semibold">{item.h1}</span>
                        <ArrowRight
                          size={17}
                          className="shrink-0 transition group-hover:translate-x-1"
                        />
                      </Link>
                    ))}
                  </div>
                </section>
              </Reveal>
            </div>
          </div>
        </section>
      </article>
    </RoleForgeArticleShell>
  )
}

function GuideExampleBlock({ example }: { example: RoleForgeGuideExample }) {
  const rows = [
    ['Job description requirement', example.requirement],
    ['Generic version', example.generic],
    ['Improved tailored version', example.improved],
    ['Why it works', example.why],
  ]

  return (
    <Reveal>
      <section className="overflow-hidden rounded-[20px] border border-white/10 bg-[#0D101A]/92 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
        <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(139,92,246,0.18),rgba(56,189,248,0.08))] p-6 md:p-8">
          <p className="section-kicker border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#BAE6FD]">
            Live example
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-white md:text-5xl">
            Before and after
          </h2>
        </div>
        <div className="divide-y divide-white/10">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="grid gap-4 p-6 md:grid-cols-[0.32fr_0.68fr] md:p-8"
            >
              <h3 className="text-sm font-bold tracking-[0.08em] text-[#60A5FA]">
                {label}
              </h3>
              <p className="text-lg leading-8 text-[#D8D4FF]">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  )
}

function RoleForgeGuideCta({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={`${compact ? '' : 'border-t border-white/10'} bg-[#05060A] py-12 md:py-16`}
    >
      <div className={compact ? '' : 'site-container'}>
        <Reveal>
          <div className="rounded-[20px] border border-white/10 bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(56,189,248,0.08))] p-7 md:p-10">
            <h2 className="text-3xl font-semibold tracking-[-0.035em] text-white md:text-5xl">
              Tailor your next application with RoleForge.
            </h2>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-[#D8D4FF]">
              RoleForge reads the job post you are viewing and helps you create
              a tailored CV, cover letter, application answers, and interview
              prep without giving up control to an auto-apply bot.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <RoleForgeStoreCta />
              <Link
                to="/roleforge"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-bold text-[#090B12] transition hover:-translate-y-px hover:border-[#8B5CF6]"
              >
                View RoleForge
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function RoleForgeGuideBreadcrumb({ label }: { label?: string }) {
  return (
    <div className="relative mb-10 flex flex-wrap items-center gap-3 text-sm font-bold text-[#B8B7FF]">
      <Link
        to="/apps"
        className="inline-flex min-h-11 items-center transition hover:text-white"
      >
        DCP Labs
      </Link>
      <ChevronRight size={15} />
      <Link
        to="/roleforge"
        className="inline-flex min-h-11 items-center transition hover:text-white"
      >
        RoleForge
      </Link>
      <ChevronRight size={15} />
      <Link
        to="/roleforge/guides"
        className="inline-flex min-h-11 items-center transition hover:text-white"
      >
        Guides
      </Link>
      {label ? (
        <>
          <ChevronRight size={15} />
          <span className="text-[#9D98B8]">{label}</span>
        </>
      ) : null}
    </div>
  )
}

function RoleForgeArticleShell({ children }: { children: ReactNode }) {
  return <div className="product-theme product-theme-career product-page min-h-screen">{children}</div>
}

function RoleForgePageGlow() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,rgba(139,92,246,0.24),transparent_32%),radial-gradient(circle_at_14%_70%,rgba(56,189,248,0.13),transparent_34%),linear-gradient(180deg,#07080D,#090B14_58%,#05060A)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:80px_80px]" />
    </>
  )
}

function RoleForgeBreadcrumb({ label }: { label: string }) {
  return (
    <div className="relative mb-10 flex flex-wrap items-center gap-3 text-sm font-bold text-[#B8B7FF]">
      <Link
        to="/apps"
        className="inline-flex min-h-11 items-center transition hover:text-white"
      >
        DCP Labs
      </Link>
      <ChevronRight size={15} />
      <Link
        to="/roleforge"
        className="inline-flex min-h-11 items-center transition hover:text-white"
      >
        RoleForge
      </Link>
      <ChevronRight size={15} />
      <span className="text-[#9D98B8]">{label}</span>
    </div>
  )
}

function RoleForgeStoreCta() {
  return (
    <a
      href={appBySlug.roleforge.storeUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#7C3AED] px-5 py-3 text-sm font-bold text-white shadow-[0_0_42px_rgba(124,58,237,0.32)] transition hover:-translate-y-px hover:bg-[#6D28D9]"
    >
      Add to Chrome
      <ArrowRight size={17} />
    </a>
  )
}

function ComparisonList({ title, items }: { title: string; items: string[] }) {
  return (
    <Reveal>
      <div className="h-full rounded-[18px] border border-white/10 bg-[#0D101A]/92 p-7 md:p-8">
        <h2 className="text-3xl font-semibold tracking-[-0.035em] text-white md:text-4xl">
          {title}
        </h2>
        <div className="mt-7 grid gap-4">
          {items.map((item) => (
            <div key={item} className="flex gap-3 text-[#D8D4FF]">
              <Check className="mt-1 shrink-0 text-[#38BDF8]" size={18} />
              <span className="leading-7">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  )
}

function ComparisonTable({ page }: { page: ComparisonPageData }) {
  return (
    <section className="relative bg-[#080A12] py-16 md:py-24">
      <div className="site-container">
        <Reveal>
          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
            Feature comparison
          </h2>
        </Reveal>
        <div className="mt-8 overflow-hidden rounded-[18px] border border-white/10">
          <div className="grid bg-white/[0.07] text-sm font-bold text-white md:grid-cols-[0.8fr_1fr_1fr]">
            <div className="border-b border-white/10 p-4 md:border-b-0 md:border-r">
              Category
            </div>
            <div className="border-b border-white/10 p-4 md:border-b-0 md:border-r">
              RoleForge
            </div>
            <div className="p-4">{page.competitor}</div>
          </div>
          {page.features.map((feature) => (
            <div
              key={feature.label}
              className="grid border-t border-white/10 bg-[#0D101A]/80 product-muted md:grid-cols-[0.8fr_1fr_1fr]"
            >
              <div className="border-b border-white/10 p-4 font-semibold text-white md:border-b-0 md:border-r">
                {feature.label}
              </div>
              <div className="border-b border-white/10 p-4 md:border-b-0 md:border-r">
                {feature.roleforge}
              </div>
              <div className="p-4">{feature.competitor}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RoleForgeCompareLinks({ currentSlug = '' }: { currentSlug?: string }) {
  const links = [
    ...comparisonPages.map((page) => ({
      label: `RoleForge vs ${page.competitor}`,
      href: `/roleforge/${page.slug}`,
      slug: page.slug,
    })),
    {
      label: 'Best AI resume tools',
      href: '/roleforge/best-ai-resume-tools',
      slug: 'best-ai-resume-tools',
    },
  ].filter((link) => link.slug !== currentSlug)

  return (
    <section className="border-t border-white/10 bg-[#07080D] py-16">
      <div className="site-container">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="section-kicker border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]">
                Compare RoleForge
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                Compare tools before you apply.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-bold text-[#D8D4FF] transition hover:border-[#8B5CF6]/60 hover:bg-white/[0.07] hover:text-white"
                >
                  {link.label}
                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00Z`))
}

function blogPostJsonLd(post: BlogPost) {
  const wordCount = post.content.match(/\b[\w'-]+\b/g)?.length ?? 0

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription,
    image: absoluteUrl(DEFAULT_SOCIAL_IMAGE),
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'en',
    author: {
      '@type': 'Organization',
      name: 'DCP Labs',
      url: absoluteUrl('/'),
    },
    publisher: {
      '@type': 'Organization',
      name: 'DCP Labs',
      url: absoluteUrl('/'),
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/favicon-192x192.png'),
      },
    },
    isPartOf: {
      '@type': 'Blog',
      name: 'DCP Labs Blog',
      url: absoluteUrl('/blog'),
    },
    wordCount,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/blog/${post.slug}`),
    },
    url: absoluteUrl(`/blog/${post.slug}`),
    articleSection: post.category,
    keywords: post.tags.join(', '),
  }
}

function blogPostCtaText(post: BlogPost) {
  if (post.app === 'RoleForge') return 'Try RoleForge'
  return `Explore ${post.app}`
}

function BlogPage() {
  const [activeCategory, setActiveCategory] =
    useState<(typeof blogCategories)[number]>('All')
  const filteredPosts = useMemo(
    () =>
      activeCategory === 'All'
        ? blogPosts
        : blogPosts.filter((post) => post.category === activeCategory),
    [activeCategory],
  )

  return (
    <PageShell>
      <Meta
        title="DCP Labs Blog | Practical App Guides and Product Resources"
        description="Practical guides, product updates, and app-focused resources from the DCP Labs product studio."
        path="/blog"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'DCP Labs Blog',
            description:
              'Practical guides, product updates, and app-focused resources from the DCP Labs product studio.',
            url: absoluteUrl('/blog'),
            publisher: {
              '@type': 'Organization',
              name: 'DCP Labs',
              url: absoluteUrl('/'),
            },
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Blog', path: '/blog' },
          ]),
        ]}
      />
      <section className="section-pad border-b border-white/10">
        <div className="site-container">
          <Reveal>
            <div className="max-w-5xl">
              <p className="section-kicker">Blog</p>
              <h1 className="mt-5 max-w-5xl text-[clamp(3.2rem,8vw,7.7rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
                DCP Labs Blog
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 text-brand-soft">
                Practical guides, product updates, and app-focused resources
                from the DCP Labs product studio.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="mt-11 flex flex-wrap gap-2">
              {blogCategories.map((category) => (
                <FilterChip
                  key={category}
                  active={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </FilterChip>
              ))}
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, index) => (
                <BlogCard key={post.slug} post={post} index={index} metadataClassName="text-[#8C847A]" />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </PageShell>
  )
}

function BlogCard({ post, index, metadataClassName = 'text-[#81796F]' }: { post: BlogPost; index: number; metadataClassName?: string }) {
  return (
    <Reveal delay={index * 0.04}>
      <motion.article
        layout
        className="brand-card group flex h-full flex-col p-6 transition hover:-translate-y-1 hover:border-[#F2ECE2]/35 hover:bg-[#121217]"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[#D6A94B]/25 bg-[#D6A94B]/10 px-3 py-1 text-xs font-bold text-[#F7D377]">
            {post.category}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-brand-soft">
            {post.app}
          </span>
        </div>
        <h2 className="heading-card mt-6 text-white">
          <Link to={`/blog/${post.slug}`} className="outline-none">
            {post.title}
          </Link>
        </h2>
        <p className="mt-4 flex-1 leading-7 text-brand-muted">
          {post.description}
        </p>
        <div className={`mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-5 text-sm font-semibold ${metadataClassName}`}>
          <span>{formatBlogDate(post.date)}</span>
          <span>{post.readingTime}</span>
        </div>
        <Link
          to={`/blog/${post.slug}`}
          className="focus-ring mt-5 inline-flex min-h-11 w-fit items-center gap-2 text-sm font-bold text-[#F5F1EA] transition group-hover:text-[#F7D377]"
        >
          Read guide
          <ArrowRight size={17} />
        </Link>
      </motion.article>
    </Reveal>
  )
}

function BlogPostPage() {
  const { blogSlug = '' } = useParams()
  const post = blogPostBySlug[blogSlug]

  if (!post) return <NotFoundPage />

  const relatedPosts = blogPosts
    .filter(
      (candidate) =>
        candidate.slug !== post.slug && candidate.category === post.category,
    )
    .concat(blogPosts.filter((candidate) => candidate.slug !== post.slug))
    .filter(
      (candidate, index, list) =>
        list.findIndex((item) => item.slug === candidate.slug) === index,
    )
    .slice(0, 3)

  return (
    <PageShell>
      <Meta
        title={post.seoTitle}
        description={post.seoDescription}
        path={`/blog/${post.slug}`}
        type="article"
        jsonLd={[
          blogPostJsonLd(post),
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <article>
        <section className="section-pad border-b border-white/10">
          <div className="site-container">
            <Reveal>
              <div className="max-w-5xl">
                <Link
                  to="/blog"
                  className="section-kicker transition hover:border-white/30 hover:text-white"
                >
                  Blog
                </Link>
                <div className="mt-7 flex flex-wrap items-center gap-2 text-sm font-semibold text-[#B8B2A8]">
                  <span className="rounded-full border border-[#D6A94B]/25 bg-[#D6A94B]/10 px-3 py-1 text-[#F7D377]">
                    {post.category}
                  </span>
                  <span>{post.app}</span>
                  <span>{formatBlogDate(post.date)}</span>
                  <span>{post.readingTime}</span>
                </div>
                <h1 className="mt-6 max-w-5xl text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.94] tracking-[-0.04em] text-white">
                  {post.title}
                </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 text-brand-soft">
                  {post.description}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="site-container grid gap-12 lg:grid-cols-[minmax(0,44rem)_minmax(18rem,1fr)] lg:items-start">
            <Reveal>
              <MarkdownContent content={post.content} />
            </Reveal>

            <Reveal delay={0.07}>
              <aside className="brand-card sticky top-28 p-6">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#81796F]">
                  Related app
                </p>
                <h2 className="heading-card mt-4 text-white">
                  {post.app}
                </h2>
                <p className="mt-4 leading-7 text-brand-muted">
                  Continue from the guide to the related DCP Labs product page.
                </p>
                <Link to={post.relatedAppUrl} className="button button-primary mt-6">
                  {blogPostCtaText(post)}
                  <ArrowRight size={17} />
                </Link>
              </aside>
            </Reveal>
          </div>
        </section>
      </article>

      <section className="border-t border-white/10 py-16 md:py-24">
        <div className="site-container">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="section-kicker">Related posts</p>
                <h2 className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-white md:text-6xl">
                  Keep reading.
                </h2>
              </div>
              <ButtonLink to="/blog" variant="secondary">
                All posts
              </ButtonLink>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {relatedPosts.map((relatedPost, index) => (
              <BlogCard key={relatedPost.slug} post={relatedPost} index={index} />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}

type MarkdownBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

function MarkdownContent({ content }: { content: string }) {
  const blocks = parseMarkdownBlocks(content)
  const leadIndex = blocks.findIndex((block) => block.type === 'paragraph')

  return (
    <div className="prose-blog">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const Heading = block.level === 2 ? 'h2' : 'h3'
          return <Heading key={index}>{renderInlineMarkdown(block.text)}</Heading>
        }

        if (block.type === 'list') {
          return (
            <ul key={index}>
              {block.items.map((item) => (
                <li key={item}>{renderInlineMarkdown(item)}</li>
              ))}
            </ul>
          )
        }

        return (
          <p key={index} className={index === leadIndex ? 'lead' : undefined}>
            {renderInlineMarkdown(block.text)}
          </p>
        )
      })}
    </div>
  )
}

function parseMarkdownBlocks(content: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = []
  const lines = content.split(/\r?\n/)
  let paragraph: string[] = []
  let listItems: string[] = []

  const flushParagraph = () => {
    if (!paragraph.length) return
    blocks.push({ type: 'paragraph', text: paragraph.join(' ') })
    paragraph = []
  }

  const flushList = () => {
    if (!listItems.length) return
    blocks.push({ type: 'list', items: listItems })
    listItems = []
  }

  lines.forEach((line) => {
    const trimmed = line.trim()

    if (!trimmed) {
      flushParagraph()
      flushList()
      return
    }

    const heading = trimmed.match(/^(#{2,3})\s+(.+)$/)
    if (heading) {
      flushParagraph()
      flushList()
      blocks.push({
        type: 'heading',
        level: heading[1].length as 2 | 3,
        text: heading[2],
      })
      return
    }

    if (trimmed.startsWith('- ')) {
      flushParagraph()
      listItems.push(trimmed.slice(2))
      return
    }

    flushList()
    paragraph.push(trimmed)
  })

  flushParagraph()
  flushList()

  return blocks
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g
  let lastIndex = 0

  text.replace(pattern, (match, _token, offset: number) => {
    if (offset > lastIndex) {
      nodes.push(text.slice(lastIndex, offset))
    }

    if (match.startsWith('**')) {
      nodes.push(<strong key={`${offset}-strong`}>{match.slice(2, -2)}</strong>)
    } else {
      const link = match.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (link) {
        const [, label, href] = link
        nodes.push(
          href.startsWith('/') ? (
            <Link key={`${offset}-link`} to={href}>
              {label}
            </Link>
          ) : (
            <a key={`${offset}-link`} href={href} target="_blank" rel="noreferrer">
              {label}
            </a>
          ),
        )
      }
    }

    lastIndex = offset + match.length
    return match
  })

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

function AboutPage() {
  return (
    <PageShell>
      <Meta
        title="About | DCP Labs"
        description="DCP Labs builds focused digital products for practical everyday and professional use."
        path="/about"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About DCP Labs',
            description:
              'DCP Labs builds focused digital products for practical everyday and professional use.',
            url: absoluteUrl('/about'),
            about: {
              '@type': 'Organization',
              name: 'DCP Labs',
              url: absoluteUrl('/'),
            },
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />
      <section className="section-pad border-b border-white/10">
        <div className="site-container">
          <Reveal>
            <div className="max-w-5xl">
              <img
                src={dcpLogo}
                alt="DCP Labs"
                className="h-auto w-[min(520px,100%)]"
              />
              <h1 className="mt-12 text-[clamp(3.4rem,8vw,8rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-white">
                A software lab for focused digital products.
              </h1>
              <p className="mt-8 max-w-3xl text-xl leading-9 text-brand-soft">
                DCP Labs designs and publishes practical software products for
                everyday and professional use. The current catalog is
                intentionally focused on six live products: KinBrief,
                ServiceSphere, LearnLift AI, CareTail, CoinRelic, and
                RoleForge.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="site-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <h2 className="text-4xl font-semibold tracking-[-0.03em] text-white md:text-6xl">
              Built to stay focused.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {[
                [
                  'Focused scope',
                  'Each product is built around a specific task and a clear audience.',
                ],
                [
                  'Practical categories',
                  'The current catalog focuses on field service work, pet care organization, coin collecting, study practice, and job application preparation.',
                ],
                [
                  'Trustworthy presentation',
                  'Every product page explains what the app does before sending visitors to a store page.',
                ],
              ].map(([title, body]) => (
                <div key={title} className="grid gap-4 py-7 md:grid-cols-3">
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <p className="copy-lg md:col-span-2 text-brand-muted">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCta
        title="Explore the live product catalog."
        body="Choose KinBrief for family care coordination, LearnLift AI for study practice, CareTail for pet care organization, CoinRelic for coin collecting, or RoleForge for job application preparation."
      />
    </PageShell>
  )
}

function ContactPage() {
  return (
    <PageShell>
      <Meta
        title="Contact | DCP Labs"
        description="Contact DCP Labs for product questions, availability, support, and app updates."
        path="/contact"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact DCP Labs',
            description:
              'Contact DCP Labs for product questions, availability, support, and app updates.',
            url: absoluteUrl('/contact'),
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ]}
      />
      <section className="section-pad">
        <div className="site-container grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div>
              <p className="section-kicker">Contact</p>
              <h1 className="mt-5 text-[clamp(3.4rem,8vw,7.4rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
                Product questions and support.
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-brand-soft">
                Reach DCP Labs for product questions, support routes, and
                general inquiries about the live apps.
              </p>
              <div className="mt-9">
                <a
                  href="mailto:hello@dcplabs.app"
                  className="button button-primary"
                >
                  <Mail size={17} />
                  hello@dcplabs.app
                  <ArrowRight size={17} />
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.07}>
            <div className="border-y border-white/10">
              {apps.map((app) => (
                <Link
                  key={app.slug}
                  to={`/${app.slug}`}
                  className="group grid gap-4 border-b border-white/10 py-6 last:border-b-0 md:grid-cols-[auto_1fr_auto] md:items-center"
                >
                  <AppSymbol app={app} small />
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {app.name}
                    </h2>
                    <p className="mt-1 text-brand-muted">{app.shortDescription}</p>
                  </div>
                  <ArrowRight
                    className="text-brand-muted transition group-hover:translate-x-1 group-hover:text-white"
                    size={20}
                  />
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}

function LegalPage({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <PageShell>
      <Meta
        title={`${title} | DCP Labs`}
        description={description}
        path={`/${title.toLowerCase()}`}
        jsonLd={breadcrumbJsonLd([
          { name: 'DCP Labs', path: '/' },
          { name: title, path: `/${title.toLowerCase()}` },
        ])}
      />
      <section className="section-pad">
        <div className="site-container max-w-4xl">
          <Reveal>
            <p className="section-kicker">Legal</p>
            <h1 className="mt-5 text-[clamp(3.4rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-white">
              {title}
            </h1>
            <div className="copy-lg mt-10 border-y border-white/10 py-8 text-brand-soft">
              <p>{description}</p>
              <p className="mt-5">
                For product-specific details, use the contact page or review
                the official store listing for the product you are installing.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink to="/apps">Explore apps</ButtonLink>
                <ButtonLink to="/contact" variant="secondary">
                  Contact
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}

function TextSenseLegalPage({ content }: { content: TextSenseLegalContent }) {
  const currentPath =
    content.kind === 'privacy' ? TEXTSENSE_PRIVACY_PATH : TEXTSENSE_TERMS_PATH
  const alternateLink =
    content.kind === 'privacy'
      ? { label: 'TextSense Terms of Use', to: TEXTSENSE_TERMS_PATH }
      : { label: 'TextSense Privacy Policy', to: TEXTSENSE_PRIVACY_PATH }

  return (
    <PageShell>
      <Meta
        title={`${content.title} | DCP Labs`}
        description={content.description}
        path={currentPath}
        jsonLd={breadcrumbJsonLd([
          { name: 'DCP Labs', path: '/' },
          { name: 'TextSense', path: TEXTSENSE_PRIVACY_PATH },
          { name: content.title, path: currentPath },
        ])}
      />
      <section className="section-pad">
        <div className="site-container max-w-4xl">
          <Reveal>
            <p className="section-kicker">TextSense legal</p>
            <h1 className="mt-5 text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white">
              {content.title}
            </h1>
            <div className="mt-8 grid gap-3 border-y border-white/10 py-6 text-sm font-semibold text-brand-muted md:grid-cols-2">
              <span>Last updated: {content.lastUpdated}</span>
              <span>Developer: DCP Labs</span>
              <span>Contact: hello@dcplabs.app</span>
              <span>Android package: com.textsense.app</span>
            </div>
          </Reveal>

          <div className="mt-10 space-y-10">
            {content.sections.map((section, index) => (
              <Reveal key={section.heading} delay={Math.min(index * 0.025, 0.16)}>
                <section className="border-b border-white/10 pb-10 last:border-b-0">
                  <h2 className="text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl">
                    {section.heading}
                  </h2>
                  <div className="copy-lg mt-4 text-brand-soft [&_a]:font-bold [&_a]:text-[#F7D377] [&_a]:no-underline hover:[&_a]:text-[#FFE08A] [&_strong]:font-bold [&_strong]:text-white">
                    <p>{section.body}</p>
                  </div>
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-12 flex flex-wrap gap-3 border-t border-white/10 pt-8">
              <ButtonLink to={alternateLink.to} variant="secondary">
                {alternateLink.label}
              </ButtonLink>
              <ButtonLink to="/contact" variant="secondary">
                Contact DCP Labs
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}

function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] border-b border-white/10 pt-20">
      <div className="site-container grid min-h-[calc(100dvh-5rem)] gap-12 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <Reveal>
            <div>
              <p className="section-kicker">DCP Labs</p>
              <h1 className="mt-7 max-w-5xl text-[clamp(3.6rem,9vw,8.6rem)] font-semibold leading-[0.88] tracking-[-0.04em] text-white">
                Focused software products for real tasks.
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-9 text-brand-soft">
                DCP Labs builds practical apps with clear jobs to do. The live
                catalog includes KinBrief for family care coordination,
                CareTail for pet owners, CoinRelic for coin collectors, and
                RoleForge for job seekers.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink to="/apps">Explore apps</ButtonLink>
                <ButtonLink to="/kinbrief" variant="secondary">
                  View KinBrief
                </ButtonLink>
              </div>
            </div>
          </Reveal>

        <Reveal delay={0.08}>
          <BrandPanel />
        </Reveal>
      </div>
    </section>
  )
}

function BrandPanel() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="brand-panel relative overflow-hidden p-6 md:p-9">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_42%),linear-gradient(180deg,transparent,rgba(0,0,0,0.5))]" />
      <div className="relative">
        <img src={dcpLogo} alt="DCP Labs" className="h-auto w-full" />
        <div className="mt-12 border-y border-white/10">
          {apps.map((app, index) => (
            <motion.div
              key={app.slug}
              initial={shouldReduceMotion ? false : { opacity: 0, x: 18 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.55 }}
              className="grid grid-cols-[4rem_1fr_auto] items-center border-b border-white/10 py-4 last:border-b-0"
            >
              <span className="font-mono text-xs text-[#81796F]">
                0{index + 1}
              </span>
              <span className="font-semibold text-white">{app.name}</span>
              <span className="text-sm text-brand-muted">{app.category}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TrustStrip() {
  return (
    <section className="border-b border-white/10 bg-[#0C0C0F]">
      <div className="site-container grid gap-0 md:grid-cols-3">
        {trustSignals.map((signal) => (
          <div
            key={signal.label}
            className="flex items-center gap-3 border-b border-white/10 py-5 md:border-b-0 md:border-r md:last:border-r-0"
          >
            <signal.icon size={18} className="text-brand-soft" />
            <span className="text-sm font-semibold text-brand-soft">
              {signal.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function ProductLedger() {
  return (
    <section className="py-20 md:py-28">
      <div className="site-container">
        <Reveal>
          <div className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[0.8fr_1.2fr]">
            <h2 className="heading-section text-white">
              Six products, clear next steps.
            </h2>
            <p className="copy-lg max-w-2xl text-brand-muted">
              Each product explains what it does, who it is for, and where to
              install or open it.
            </p>
          </div>
        </Reveal>
        <div className="mt-2">
          {apps.map((app, index) => (
            <CatalogRow key={app.slug} app={app} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CatalogRow({
  app,
  index,
  compact = false,
}: {
  app: StudioApp
  index: number
  compact?: boolean
}) {
  return (
    <Reveal delay={index * 0.035}>
      <motion.article
        layout
        className={`group border-b border-white/10 ${
          compact ? 'py-6' : 'py-7 md:py-9'
        }`}
      >
        <div className="grid gap-5 md:grid-cols-[5rem_1fr_12rem_auto] md:items-center">
          <span className="font-mono text-sm text-[#81796F]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
              <div className="flex flex-wrap items-center gap-3">
                <AppSymbol app={app} small />
                <h3 className="text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
                  {app.name}
                </h3>
                <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs font-bold text-[#F5F1EA]">
                  {app.status}
                </span>
              </div>
            <p className="copy-lg mt-4 max-w-2xl text-brand-muted">
              {app.shortDescription}
            </p>
          </div>
          <div className="text-sm font-semibold text-brand-soft">
            <span className="block">{app.category}</span>
            <span className="mt-1 block text-[#81796F]">{app.platform}</span>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <Link
              to={`/${app.slug}`}
              className="brand-link-soft inline-flex items-center justify-center gap-2 rounded-full border border-white/12 px-4 py-3 text-sm font-bold hover:border-[#F2ECE2] hover:bg-[#F2ECE2] hover:text-[#111114]"
            >
              View product
              <ArrowRight size={19} />
            </Link>
            <a
              href={app.storeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#F2ECE2] bg-[#F2ECE2] px-4 py-3 text-sm font-bold text-[#111114] transition hover:-translate-y-px"
            >
              {app.storeLabel}
              <ArrowRight size={19} />
            </a>
          </div>
        </div>
      </motion.article>
    </Reveal>
  )
}

function StudioPrinciples() {
  const principles = [
    {
      title: 'Specific use case',
      body: 'Each product is built around a defined audience and a practical task.',
    },
    {
      title: 'Listed when live',
      body: 'The catalog highlights products visitors can actually open, install, and evaluate.',
    },
    {
      title: 'Clear before action',
      body: 'Product pages explain the app, the use case, and the next step before asking for a click.',
    },
  ]

  return (
    <section className="border-y border-white/10 bg-[#0D0D10] py-20 md:py-28">
      <div className="site-container">
        <Reveal>
          <h2 className="heading-section max-w-4xl text-white">
            A product studio built around practical scope.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-0 border-y border-white/10 lg:grid-cols-3">
          {principles.map((principle, index) => (
            <Reveal key={principle.title} delay={index * 0.05}>
              <div className="h-full border-b border-white/10 py-8 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
                <span className="font-mono text-xs text-[#81796F]">
                  0{index + 1}
                </span>
                <h3 className="mt-8 text-3xl font-semibold tracking-[-0.03em] text-white">
                  {principle.title}
                </h3>
                <p className="copy-lg mt-5 text-brand-muted">
                  {principle.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function EcosystemMap() {
  const groups = [
    ['Family care', 'KinBrief'],
    ['Field service', 'ServiceSphere'],
    ['Study practice', 'LearnLift AI'],
    ['Pet care', 'CareTail'],
    ['Collectors', 'CoinRelic'],
    ['Career preparation', 'RoleForge'],
  ]

  return (
    <section className="py-20 md:py-28">
      <div className="site-container">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="section-kicker">Ecosystem</p>
              <h2 className="heading-section mt-5 text-white">
                One studio, six focused product paths.
              </h2>
              <p className="copy-lg mt-5 max-w-md text-brand-muted">
                Choose the family care app, field service app, study coach, pet
                care tracker, collector app, or job application extension, then
                continue to the official destination.
              </p>
            </div>
            <div className="border-y border-white/10">
              {groups.map(([category, product]) => (
                <div
                  key={category}
                  className="grid grid-cols-[1fr_auto] items-center border-b border-white/10 py-5 last:border-b-0"
                >
                  <span className="text-2xl font-semibold text-white">
                    {category}
                  </span>
                  <span className="text-brand-muted">{product}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function FinalCta({ title, body }: { title: string; body: string }) {
  return (
    <section className="border-t border-white/10 py-20 md:py-28">
      <div className="site-container">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="heading-section max-w-4xl text-white">
                {title}
              </h2>
              <p className="copy-lg mt-5 max-w-2xl text-brand-muted">
                {body}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/apps">Explore apps</ButtonLink>
              {apps.map((app) => (
                <a
                  key={app.slug}
                  href={app.storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-secondary"
                >
                  {app.storeLabel}
                  <ArrowRight size={17} />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function FilterChip({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
  icon?: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`focus-ring inline-flex min-h-12 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active
          ? 'border-[#F2ECE2] bg-[#F2ECE2] text-[#111114]'
          : 'border-white/12 bg-white/[0.03] text-brand-muted hover:border-white/25 hover:text-white'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

function StoreButton({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="button button-primary"
    >
      {children}
      <ArrowRight size={17} />
    </a>
  )
}

function AppSymbol({
  app,
  small = false,
}: {
  app: StudioApp
  small?: boolean
}) {
  const Icon = app.icon
  const sizeClass = small ? 'h-11 w-11' : 'h-16 w-16'

  if (app.iconImage) {
    return (
      <span
        className={`${sizeClass} inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]`}
      >
        <img
          src={app.iconImage}
          alt={`${app.name} icon`}
          className="h-full w-full object-cover"
        />
      </span>
    )
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white ${
        small ? 'h-11 w-11' : 'h-16 w-16'
      }`}
      style={{ boxShadow: `inset 0 0 0 1px ${app.accent}22` }}
    >
      <Icon size={small ? 19 : 25} strokeWidth={1.7} />
    </span>
  )
}


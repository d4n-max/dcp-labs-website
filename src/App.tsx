import {
  ArrowRight,
  Check,
  ChevronRight,
  Filter,
  Mail,
  Menu,
  X,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'
import dcpLogo from './assets/dcp-labs-logo.svg'
import type { AppCategory, StudioApp } from './data/apps'
import { appBySlug, apps, trustSignals } from './data/apps'

const navItems = [
  { label: 'Apps', href: '/apps' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const SITE_URL = 'https://dcplabs.app'
const DEFAULT_SOCIAL_IMAGE = '/og-dcp-labs.svg'

type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>

const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString()

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

function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

function softwareApplicationJsonLd({
  app,
  path,
  applicationCategory,
  operatingSystem,
}: {
  app: StudioApp
  path: string
  applicationCategory: string
  operatingSystem: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    applicationCategory,
    operatingSystem,
    url: absoluteUrl(path),
    installUrl: app.storeUrl,
    description: app.description,
    publisher: {
      '@type': 'Organization',
      name: 'DCP Labs',
      url: absoluteUrl('/'),
    },
  }
}

function faqJsonLd(app: StudioApp) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: app.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

const categoryFilters: AppCategory[] = [
  'All',
  'Android',
  'Chrome Extension',
  'Productivity',
  'Career',
  'Collectors',
]

type ComparisonFeature = {
  label: string
  roleforge: string
  competitor: string
}

type ComparisonPageData = {
  slug: string
  competitor: string
  title: string
  metaDescription: string
  h1: string
  intro: string
  summary: string
  roleforgeStrengths: string[]
  competitorStrengths: string[]
  chooseRoleForge: string[]
  chooseCompetitor: string[]
  recommendation: string
  features: ComparisonFeature[]
}

const comparisonPages: ComparisonPageData[] = [
  {
    slug: 'vs-jobright',
    competitor: 'Jobright',
    title: 'RoleForge vs Jobright | Job Application Tailoring Comparison',
    metaDescription:
      'Compare RoleForge and Jobright for job seekers who want job post analysis, resume tailoring, cover letters, and application preparation.',
    h1: 'RoleForge vs Jobright',
    intro:
      'RoleForge and Jobright both help job seekers move faster, but they focus on different parts of the search. This comparison is for applicants deciding whether they need a broader job search assistant or a focused Chrome extension for tailoring applications from the job post in front of them.',
    summary:
      'RoleForge is built around live job posting analysis and role-specific application drafts. Jobright is commonly positioned around job search assistance, matching, and career discovery.',
    roleforgeStrengths: [
      'Works from live job postings in the browser.',
      'Extracts role requirements before drafting application materials.',
      'Helps prepare resume bullets, cover letters, form answers, and interview notes for review.',
    ],
    competitorStrengths: [
      'May be a better fit for broader job discovery and job matching.',
      'May suit job seekers who want a wider job search assistant rather than a focused drafting extension.',
      'May be useful when organization across a broader search matters more than per-role drafting.',
    ],
    chooseRoleForge: [
      'You want to tailor each application from the job post you are viewing.',
      'You already know the role you want to apply for and need sharper materials.',
      'You want drafts you can review, edit, copy, and decide how to use.',
    ],
    chooseCompetitor: [
      'You want broader job search or discovery support.',
      'You are earlier in the search and want help finding roles to consider.',
      'You prefer a more general job-search assistant experience.',
    ],
    recommendation:
      'Choose RoleForge when the main problem is tailoring the next application. Consider Jobright when the main problem is discovering, matching, or managing a broader job search.',
    features: [
      {
        label: 'Primary focus',
        roleforge: 'Tailored application drafts from live job postings.',
        competitor: 'Broader job search assistance and matching.',
      },
      {
        label: 'Resume support',
        roleforge: 'Role-specific resume summaries and bullets for review.',
        competitor: 'Resume or profile support may be part of a wider job-search flow.',
      },
      {
        label: 'Cover letters',
        roleforge: 'Drafts tailored cover letter content for the role.',
        competitor: 'May support application improvement depending on the product setup.',
      },
      {
        label: 'Application control',
        roleforge: 'Users review, edit, copy, and decide what to submit.',
        competitor: 'Varies by product and feature set.',
      },
    ],
  },
  {
    slug: 'vs-teal',
    competitor: 'Teal',
    title: 'RoleForge vs Teal | Resume Tailoring and Job Tracking',
    metaDescription:
      'Compare RoleForge and Teal for resume tailoring, cover letters, job tracking, and application preparation.',
    h1: 'RoleForge vs Teal',
    intro:
      'RoleForge and Teal can both support job seekers preparing applications. The key difference is focus: RoleForge is a Chrome extension centered on tailoring materials from a live job post, while Teal is widely known for resume building and job tracking.',
    summary:
      'RoleForge is strongest when you are on a job posting and want role-specific drafts. Teal may be stronger for broader resume management, job tracking, and career organization.',
    roleforgeStrengths: [
      'Analyzes the live job posting a user is viewing.',
      'Turns role requirements into tailored resume and cover letter drafts.',
      'Keeps drafting close to the application page.',
    ],
    competitorStrengths: [
      'May be a better fit for job tracking and application organization.',
      'May suit users who want broader resume management across many roles.',
      'May be helpful for building and maintaining a central resume workspace.',
    ],
    chooseRoleForge: [
      'You want to tailor application materials while reviewing a live job post.',
      'You need resume bullets, cover letters, form answers, and interview notes for a specific role.',
      'You prefer a focused browser extension.',
    ],
    chooseCompetitor: [
      'You want a broader job tracker and resume workspace.',
      'You need ongoing organization across many applications.',
      'You want to manage resumes and jobs from a central platform.',
    ],
    recommendation:
      'Choose RoleForge for live job-post tailoring. Consider Teal if your priority is a broader job tracking and resume management workspace.',
    features: [
      {
        label: 'Primary focus',
        roleforge: 'Tailoring each application from a live job post.',
        competitor: 'Resume building, job tracking, and application organization.',
      },
      {
        label: 'Job post context',
        roleforge: 'Built around extracting requirements from the current posting.',
        competitor: 'May use job descriptions as part of broader application tracking.',
      },
      {
        label: 'Application drafts',
        roleforge: 'Resume bullets, cover letters, form answers, and interview notes.',
        competitor: 'Resume and job-search support varies by feature and plan.',
      },
      {
        label: 'Best fit',
        roleforge: 'Applicants tailoring the next application.',
        competitor: 'Applicants organizing an ongoing job search.',
      },
    ],
  },
  {
    slug: 'vs-simplify',
    competitor: 'Simplify',
    title: 'RoleForge vs Simplify | Chrome Extension for Job Applications',
    metaDescription:
      'Compare RoleForge and Simplify for job seekers evaluating Chrome extensions, resume tailoring, and job application preparation.',
    h1: 'RoleForge vs Simplify',
    intro:
      'RoleForge and Simplify are both relevant to job seekers working in the browser. RoleForge focuses on tailoring application materials from the live job post, while Simplify is commonly associated with autofill and job search support.',
    summary:
      'RoleForge is a fit when content quality and role-specific drafting matter most. Simplify may be a better fit when the priority is speeding up repetitive application form steps.',
    roleforgeStrengths: [
      'Extracts role requirements from live job pages.',
      'Drafts role-specific resume bullets, cover letters, form answers, and notes.',
      'Keeps users in control of review and editing before use.',
    ],
    competitorStrengths: [
      'May be better for reducing repetitive application form entry.',
      'May suit users who prioritize autofill and faster application forms.',
      'May support a broader browser-based job application process.',
    ],
    chooseRoleForge: [
      'You need to adapt the substance of your application to the role.',
      'You want help turning experience into tailored resume and cover letter drafts.',
      'You want to review and edit generated content before using it.',
    ],
    chooseCompetitor: [
      'You mainly want to reduce manual form filling.',
      'You apply to many roles and want application process automation support.',
      'You need broad application speed more than role-specific writing support.',
    ],
    recommendation:
      'Choose RoleForge when the main bottleneck is tailoring content. Consider Simplify when the main bottleneck is repetitive application forms.',
    features: [
      {
        label: 'Primary focus',
        roleforge: 'Role-specific application content from live postings.',
        competitor: 'Application speed and autofill-oriented support.',
      },
      {
        label: 'Resume tailoring',
        roleforge: 'Drafts role-specific resume content for review.',
        competitor: 'May support resume or profile features depending on setup.',
      },
      {
        label: 'Form answers',
        roleforge: 'Prepares application answer drafts users can review.',
        competitor: 'May focus more on filling repeated application fields.',
      },
      {
        label: 'User control',
        roleforge: 'Review, edit, copy, and decide what to submit.',
        competitor: 'Workflow varies by feature and user configuration.',
      },
    ],
  },
  {
    slug: 'vs-kickresume',
    competitor: 'Kickresume',
    title: 'RoleForge vs Kickresume | Resume Builder vs Application Tailoring',
    metaDescription:
      'Compare RoleForge and Kickresume for resume tailoring, cover letter drafting, resume templates, and job application preparation.',
    h1: 'RoleForge vs Kickresume',
    intro:
      'RoleForge and Kickresume serve different moments in application preparation. RoleForge helps tailor materials from the job post in front of you. Kickresume is commonly known for resume building, cover letter creation, and polished templates.',
    summary:
      'RoleForge is strongest for role-specific tailoring from live postings. Kickresume may be stronger when the priority is resume design, templates, and building polished resume documents.',
    roleforgeStrengths: [
      'Starts from the live job posting and extracts role requirements.',
      'Drafts application materials around the specific role.',
      'Supports resume bullets, cover letters, form answers, and interview notes.',
    ],
    competitorStrengths: [
      'May be better for resume design and template-driven document creation.',
      'May suit users building a polished resume from scratch.',
      'May be useful for cover letter and resume document formatting.',
    ],
    chooseRoleForge: [
      'You already have experience to draw from and need to adapt it to a role.',
      'You want browser-based job post analysis before writing.',
      'You need role-specific content drafts more than resume design templates.',
    ],
    chooseCompetitor: [
      'You want a resume builder with templates and visual document design.',
      'You are creating a resume or cover letter from scratch.',
      'You need polished formatting as much as application tailoring.',
    ],
    recommendation:
      'Choose RoleForge for tailoring applications to specific job posts. Consider Kickresume when resume design, templates, or polished document creation is the main need.',
    features: [
      {
        label: 'Primary focus',
        roleforge: 'Tailored applications from live job postings.',
        competitor: 'Resume and cover letter building with design/template support.',
      },
      {
        label: 'Job post analysis',
        roleforge: 'Central to the product.',
        competitor: 'May not be the main product focus.',
      },
      {
        label: 'Document design',
        roleforge: 'Focused on content drafts, not visual resume design.',
        competitor: 'Often stronger for templates and polished documents.',
      },
      {
        label: 'Best fit',
        roleforge: 'Applicants adapting materials per role.',
        competitor: 'Applicants building or redesigning resume documents.',
      },
    ],
  },
]

const comparisonBySlug = Object.fromEntries(
  comparisonPages.map((page) => [page.slug, page]),
) as Record<string, ComparisonPageData>

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#08080A] text-[#F5F1EA]">
      <AmbientBackground />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/apps" element={<AppsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/roleforge/best-ai-resume-tools"
            element={<RoleForgeBestToolsPage />}
          />
          <Route
            path="/roleforge/:comparisonSlug"
            element={<RoleForgeComparisonPage />}
          />
          <Route
            path="/privacy"
            element={
              <LegalPage
                title="Privacy"
                description="Privacy information for the DCP Labs website and its live products, including CoinRelic and RoleForge."
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
          <Route path="/:slug" element={<AppDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

function HomePage() {
  return (
    <>
      <Meta
        title="DCP Labs | Software Lab for Focused Digital Products"
        description="DCP Labs builds focused digital products for practical everyday and professional use, including CoinRelic and RoleForge."
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
        body="Install CoinRelic from Google Play or add RoleForge from the Chrome Web Store."
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
        title="Apps | CoinRelic and RoleForge by DCP Labs"
        description="Explore CoinRelic for coin collectors and RoleForge for job seekers preparing tailored applications."
        path="/apps"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'DCP Labs Apps',
            description:
              'Live DCP Labs products for coin collectors and job seekers.',
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
                Two live products, each built for a specific job.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#B8B2A8]">
                CoinRelic helps collectors identify and catalog coins.
                RoleForge helps job seekers tailor application materials from
                the job post in front of them.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="mt-12 flex flex-wrap gap-2">
              {categoryFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    activeFilter === filter
                      ? 'border-[#F2ECE2] bg-[#F2ECE2] text-[#111114]'
                      : 'border-white/12 bg-white/[0.03] text-[#B8B2A8] hover:border-white/25 hover:text-white'
                  }`}
                >
                  {filter === 'All' ? <Filter size={15} /> : null}
                  {filter}
                </button>
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

function AppDetailPage() {
  const { slug = '' } = useParams()
  const app = appBySlug[slug]

  if (!app) return <NotFoundPage />

  if (app.slug === 'coinrelic') return <CoinRelicPage app={app} />
  if (app.slug === 'roleforge') return <RoleForgePage app={app} />

  return <NotFoundPage />
}

function CoinRelicPage({ app }: { app: StudioApp }) {
  const workflows = [
    {
      title: 'Scan a coin',
      body: 'Capture a coin from the mobile app and start a new identification record in seconds.',
      image: app.screenshots[0],
    },
    {
      title: 'Review identification details',
      body: 'Review possible identity, value context, rarity cues, and details worth checking before you save the find.',
      image: app.screenshots[1],
    },
    {
      title: 'Save to collection',
      body: 'Add important finds to a digital catalog with photos, notes, and details you can return to later.',
      image: app.screenshots[2],
    },
    {
      title: 'Track history and notes',
      body: 'Keep scan history, watched coins, achievements, and collection notes together as your catalog grows.',
      image: app.screenshots[3],
    },
  ]
  const galleryAltText = [
    'CoinRelic promo showing camera coin identification',
    'CoinRelic promo showing coin value and rarity context',
    'CoinRelic promo showing saved coin collection tracking',
    'CoinRelic promo showing collector achievements and scan history',
  ]

  return (
    <div className="min-h-screen bg-[#03070B] text-[#F7E8B5]">
      <Meta
        title="CoinRelic | Coin Identification and Collection Tracking App"
        description="CoinRelic helps coin collectors identify coins, save scan history, organize collection notes, and build a cleaner digital coin catalog."
        path="/coinrelic"
        image="/og-coinrelic.svg"
        jsonLd={[
          softwareApplicationJsonLd({
            app,
            path: '/coinrelic',
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'Android',
          }),
          faqJsonLd(app),
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'CoinRelic', path: '/coinrelic' },
          ]),
        ]}
      />
      <section className="relative overflow-hidden border-b border-[#D6A94B]/20 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_22%,rgba(214,169,75,0.18),transparent_32%),radial-gradient(circle_at_22%_78%,rgba(40,90,120,0.24),transparent_35%),linear-gradient(180deg,#03070B,#07111A_55%,#03070B)]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_center,rgba(214,169,75,0.45)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="site-container relative grid min-h-[calc(100dvh-6rem)] gap-12 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <Reveal>
            <div>
              <Link
                to="/apps"
                className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#C8B178] transition hover:text-[#F7E8B5]"
              >
                <ChevronRight className="rotate-180" size={16} />
                Back to DCP Labs
              </Link>
              <div className="flex items-center gap-4">
                {app.iconImage ? (
                  <img
                    src={app.iconImage}
                    alt="CoinRelic app icon"
                    className="h-16 w-16 rounded-[22px] object-cover shadow-[0_0_44px_rgba(214,169,75,0.28)]"
                  />
                ) : (
                  <AppSymbol app={app} />
                )}
                <span className="rounded-full border border-[#D6A94B]/30 bg-[#D6A94B]/10 px-3 py-1 text-sm font-bold text-[#F7E8B5]">
                  Live on Google Play
                </span>
              </div>
              <h1 className="mt-8 max-w-4xl text-[clamp(3.8rem,8vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-[#FFF8DF]">
                Identify coins. Organize every find.
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-9 text-[#D8CDAA]">
                {app.heroLine}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <StoreButton href={app.storeUrl}>{app.storeLabel}</StoreButton>
                <Link
                  to="/apps"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#DAD4CA] bg-white px-4 py-3 text-sm font-bold text-[#10211D] transition hover:-translate-y-px hover:border-[#10211D]"
                >
                  Explore apps
                  <ArrowRight size={17} />
                </Link>
              </div>
              <ProductFacts
                facts={app.storeFacts}
                className="mt-6"
                itemClassName="border-[#D6A94B]/20 bg-[#D6A94B]/8 text-[#D8CDAA]"
              />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute inset-y-8 right-8 w-72 rounded-full bg-[#D6A94B]/16 blur-3xl" />
              <div className="absolute bottom-2 left-8 hidden h-48 w-48 rounded-full border border-[#D6A94B]/15 bg-[radial-gradient(circle,rgba(214,169,75,0.18),transparent_64%)] lg:block" />
              <CoinRelicPromoPanel
                src={app.screenshots[0]}
                alt="CoinRelic coin identification app promo screenshot"
                featured
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#050B10] py-20 md:py-28">
        <div className="site-container">
          <Reveal>
            <div className="max-w-4xl">
              <p className="section-kicker border-[#D6A94B]/30 bg-[#D6A94B]/10 text-[#D6A94B]">
                How CoinRelic works
              </p>
              <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#FFF8DF] md:text-6xl">
                From a loose find to a clear record.
              </h2>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-6">
            {workflows.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.04}>
                <div className="grid overflow-hidden rounded-[30px] border border-[#D6A94B]/16 bg-[linear-gradient(135deg,#08131B,#03070B)] lg:grid-cols-[0.92fr_0.88fr] lg:items-center">
                  <div
                    className={`flex flex-col justify-between p-7 md:p-10 ${
                      index % 2 === 1 ? 'lg:order-2' : ''
                    }`}
                  >
                    <span className="font-mono text-sm text-[#D6A94B]">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="mt-10 text-3xl font-semibold tracking-[-0.03em] text-[#FFF8DF] md:text-5xl">
                        {item.title}
                      </h3>
                      <p className="mt-5 text-lg leading-8 text-[#BDAF8D]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                  <div className="relative p-6 md:p-9">
                    <div className="absolute inset-x-10 top-1/2 h-28 -translate-y-1/2 rounded-full bg-[#D6A94B]/10 blur-3xl" />
                    <CoinRelicPromoPanel
                      src={item.image}
                      alt={`CoinRelic ${item.title.toLowerCase()} screenshot`}
                      compact={index === 2}
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#020609] py-20 md:py-28">
        <div className="site-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal>
            <div>
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#FFF8DF] md:text-6xl">
                Keep the story of every coin.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#BDAF8D]">
                CoinRelic keeps the collecting process organized: identify a
                coin, check the details, save the record, and revisit it when
                your catalog changes.
              </p>
              <div className="mt-8 grid gap-4">
                {app.benefits.map((benefit) => (
                  <div key={benefit} className="flex gap-3 text-[#E9D8A6]">
                    <Check className="mt-1 shrink-0 text-[#D6A94B]" size={18} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="grid gap-5 sm:grid-cols-2">
              {app.screenshots.slice(0, 4).map((screenshot, index) => (
                <CoinRelicPromoPanel
                  key={screenshot}
                  src={screenshot}
                  alt={galleryAltText[index]}
                  compact={index === 2}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <ProductFaq
        app={app}
        className="bg-[#050B10] text-[#FFF8DF]"
        mutedClassName="text-[#BDAF8D]"
      />

      <section className="border-t border-[#D6A94B]/20 bg-[#020609] py-20">
        <div className="site-container flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-[#FFF8DF] md:text-6xl">
              Start building a cleaner coin catalog.
            </h2>
            <p className="mt-5 text-lg text-[#BDAF8D]">
              Download CoinRelic from Google Play.
            </p>
          </div>
          <StoreButton href={app.storeUrl}>{app.storeLabel}</StoreButton>
        </div>
      </section>
    </div>
  )
}

function CoinRelicPromoPanel({
  src,
  alt,
  featured = false,
  compact = false,
}: {
  src: string
  alt: string
  featured?: boolean
  compact?: boolean
}) {
  const maxWidth = compact
    ? 'max-w-[370px]'
    : featured
      ? 'max-w-[470px]'
      : 'max-w-[460px]'

  return (
    <div
      className={`relative mx-auto w-full ${maxWidth} ${
        featured ? 'drop-shadow-[0_34px_90px_rgba(214,169,75,0.16)]' : ''
      }`}
    >
      <div className="absolute -inset-5 rounded-[2.25rem] bg-[radial-gradient(circle_at_50%_42%,rgba(214,169,75,0.18),transparent_62%)] blur-2xl" />
      <div className="relative rounded-[30px] border border-[#D6A94B]/22 bg-[#06111A] p-2 shadow-[0_32px_90px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,248,223,0.08)]">
        <img
          src={src}
          alt={alt}
          loading={featured ? 'eager' : 'lazy'}
          decoding="async"
          className="h-auto w-full rounded-[24px] object-contain"
        />
      </div>
    </div>
  )
}

function RoleForgePage({ app }: { app: StudioApp }) {
  const steps = [
    {
      title: 'Analyze any job post',
      body: 'Extract the requirements, skills, and themes from the job page you are viewing.',
      image: app.screenshots[0],
    },
    {
      title: 'Review matched skills',
      body: 'Compare the role against saved experience before drafting application materials.',
      image: app.screenshots[1],
    },
    {
      title: 'Rewrite resume bullets',
      body: 'Turn relevant experience into role-specific resume bullets you can review, edit, and copy.',
      image: app.screenshots[2],
    },
    {
      title: 'Draft cover letters',
      body: 'Draft a role-specific cover letter that can be refined before you use it.',
      image: app.screenshots[3],
    },
    {
      title: 'Download your application bundle',
      body: 'Keep resumes, cover letters, form answers, and interview notes organized in one place.',
      image: app.screenshots[4],
    },
  ]

  return (
    <div className="min-h-screen bg-[#07080D] text-[#F8F7FF]">
      <Meta
        title="RoleForge | Resume Tailoring and Cover Letter Chrome Extension"
        description="RoleForge helps job seekers analyze live job postings and draft tailored resumes, cover letters, job application answers, and interview notes."
        path="/roleforge"
        image="/og-roleforge.svg"
        jsonLd={[
          softwareApplicationJsonLd({
            app,
            path: '/roleforge',
            applicationCategory: 'BrowserApplication',
            operatingSystem: 'Chrome',
          }),
          faqJsonLd(app),
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'RoleForge', path: '/roleforge' },
          ]),
        ]}
      />
      <section className="relative overflow-hidden border-b border-white/10 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_26%,rgba(139,92,246,0.24),transparent_34%),radial-gradient(circle_at_18%_78%,rgba(56,189,248,0.14),transparent_32%),linear-gradient(180deg,#07080D,#0A0D16_58%,#05060A)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:80px_80px]" />
        <div className="site-container relative grid min-h-[calc(100dvh-6rem)] gap-14 py-16 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <Reveal>
            <div>
              <Link
                to="/apps"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#B8B7FF] transition hover:text-white"
              >
                <ChevronRight className="rotate-180" size={16} />
                Back to DCP Labs
              </Link>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                {app.iconImage ? (
                  <img
                    src={app.iconImage}
                    alt="RoleForge icon"
                    className="h-14 w-14 rounded-2xl shadow-[0_0_34px_rgba(56,189,248,0.2)]"
                  />
                ) : (
                  <AppSymbol app={app} />
                )}
                <div>
                  <p className="text-xl font-semibold text-white">RoleForge</p>
                  <span className="mt-2 inline-flex rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-sm font-bold text-[#D8D4FF] shadow-[0_0_50px_rgba(139,92,246,0.16)]">
                    Chrome extension
                  </span>
                </div>
              </div>
              <h1 className="mt-8 max-w-4xl text-[clamp(3.5rem,7.6vw,8rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-white">
                Tailor every application to the role.
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-9 text-[#C8C5DA]">
                RoleForge helps job seekers turn live job postings into
                tailored resumes, cover letters, form answers, and interview
                notes they can review and edit before applying.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={app.storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#7C3AED] px-5 py-3 text-sm font-bold text-white shadow-[0_0_42px_rgba(124,58,237,0.32)] transition hover:-translate-y-px hover:bg-[#6D28D9]"
                >
                  Add to Chrome
                  <ArrowRight size={17} />
                </a>
                <Link
                  to="/apps"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-bold text-[#090B12] transition hover:-translate-y-px hover:border-[#8B5CF6]"
                >
                  Explore apps
                  <ArrowRight size={17} />
                </Link>
              </div>
              <ProductFacts
                facts={app.storeFacts}
                className="mt-6"
                itemClassName="border-white/12 bg-white/[0.05] text-[#C8C5DA]"
              />
              <p className="mt-7 max-w-xl text-sm leading-6 text-[#9D98B8]">
                RoleForge drafts application materials for review. It does not
                submit applications or contact employers automatically.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <RoleForgePromoPanel
              src={app.screenshots[0]}
              alt="RoleForge analyze any job post screenshot"
              featured
            />
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#080A12] py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_18%,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_12%_56%,rgba(139,92,246,0.14),transparent_34%)]" />
        <div className="site-container">
          <Reveal>
            <div className="max-w-4xl">
              <p className="section-kicker border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]">
                How RoleForge works
              </p>
              <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-[-0.035em] text-white md:text-6xl">
                From job post to application draft.
              </h2>
            </div>
          </Reveal>
          <div className="relative mt-14 grid gap-8">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.04}>
                <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0D101A]/92 shadow-[0_30px_120px_rgba(0,0,0,0.38)]">
                  <div className="grid gap-6 p-7 pb-4 md:p-10 md:pb-5 lg:grid-cols-[0.28fr_0.72fr] lg:items-end">
                    <div>
                      <span className="font-mono text-sm text-[#60A5FA]">
                        0{index + 1}
                      </span>
                      <h3 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-white md:text-5xl">
                        {step.title}
                      </h3>
                    </div>
                    <p className="max-w-3xl text-lg leading-8 text-[#BDB8D8] lg:justify-self-end">
                      {step.body}
                    </p>
                  </div>
                  <div className="relative px-0 pb-0 md:px-8 md:pb-8">
                    <RoleForgePromoPanel
                      src={step.image}
                      alt={`RoleForge ${step.title.toLowerCase()} screenshot`}
                      wide
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#05060A] py-20 md:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(139,92,246,0.13),transparent_42%),radial-gradient(circle_at_72%_70%,rgba(56,189,248,0.10),transparent_32%)]" />
        <div className="site-container relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal>
            <div>
              <p className="section-kicker border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#BAE6FD]">
                Review before use
              </p>
              <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-6xl">
                Faster drafting without giving up control.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#C8C5DA]">
                RoleForge helps create application drafts from the role in
                front of you. You stay responsible for reviewing, editing,
                copying, and deciding what to submit.
              </p>
              <div className="mt-8 grid gap-4">
                {app.benefits.map((benefit) => (
                  <div key={benefit} className="flex gap-3 text-[#E7E4FF]">
                    <Check className="mt-1 shrink-0 text-[#38BDF8]" size={18} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <RoleForgePromoPanel
              src={app.screenshots[4]}
              alt="RoleForge download application bundle screenshot"
            />
          </Reveal>
        </div>
      </section>

      <ProductFaq
        app={app}
        className="bg-[#080A12] text-white"
        mutedClassName="text-[#BDB8D8]"
      />

      <RoleForgeCompareLinks />

      <section className="border-t border-white/10 bg-[#05060A] py-20">
        <div className="site-container flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
              Turn the next job post into a sharper draft.
            </h2>
            <p className="mt-5 text-lg text-[#BDB8D8]">
              Add RoleForge to Chrome.
            </p>
          </div>
          <a
            href={app.storeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#7C3AED] px-5 py-3 text-sm font-bold text-white shadow-[0_0_42px_rgba(124,58,237,0.32)] transition hover:-translate-y-px hover:bg-[#6D28D9]"
          >
            Add to Chrome
            <ArrowRight size={17} />
          </a>
        </div>
      </section>
    </div>
  )
}

function RoleForgePromoPanel({
  src,
  alt,
  featured = false,
  wide = false,
}: {
  src: string
  alt: string
  featured?: boolean
  wide?: boolean
}) {
  const maxWidth = wide ? 'max-w-[1160px]' : featured ? 'max-w-[820px]' : 'max-w-[760px]'

  return (
    <div className={`relative mx-auto w-full ${maxWidth}`}>
      <div className="absolute -inset-5 rounded-[2.25rem] bg-[radial-gradient(circle_at_72%_28%,rgba(56,189,248,0.18),transparent_38%),radial-gradient(circle_at_22%_78%,rgba(139,92,246,0.24),transparent_42%)] blur-2xl" />
      <div className="relative rounded-[28px] border border-white/12 bg-[#0B0D15] p-2 shadow-[0_32px_110px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <img
          src={src}
          alt={alt}
          loading={featured ? 'eager' : 'lazy'}
          decoding="async"
          className="h-auto w-full rounded-[22px] object-contain"
        />
      </div>
    </div>
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
              <h1 className="mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-white">
                {page.h1}
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 text-[#C8C5DA]">
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
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7 text-lg leading-8 text-[#C8C5DA]">
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
            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(56,189,248,0.08))] p-7 md:p-10">
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
              <h1 className="mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-white">
                Best AI resume tools for tailored job applications.
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 text-[#C8C5DA]">
                The best tool depends on the job seeker’s goal. Some tools
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
              <p className="mt-5 text-lg leading-8 text-[#C8C5DA]">
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
                <article className="grid gap-5 rounded-[28px] border border-white/10 bg-[#0D101A]/92 p-6 md:grid-cols-[0.28fr_0.72fr] md:items-center md:p-8">
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
                    <p className="text-lg leading-8 text-[#C8C5DA]">
                      {tool.body}
                    </p>
                    <Link
                      to={tool.link}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#BAE6FD] transition hover:text-white"
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
            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(56,189,248,0.08))] p-7 md:p-10">
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

function RoleForgeArticleShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#07080D] text-[#F8F7FF]">{children}</div>
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
      <Link to="/apps" className="transition hover:text-white">
        DCP Labs
      </Link>
      <ChevronRight size={15} />
      <Link to="/roleforge" className="transition hover:text-white">
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
      <div className="h-full rounded-[28px] border border-white/10 bg-[#0D101A]/92 p-7 md:p-8">
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
        <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10">
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
              className="grid border-t border-white/10 bg-[#0D101A]/80 text-[#C8C5DA] md:grid-cols-[0.8fr_1fr_1fr]"
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

function ProductFacts({
  facts,
  className = '',
  itemClassName = '',
}: {
  facts: string[]
  className?: string
  itemClassName?: string
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {facts.map((fact) => (
        <span
          key={fact}
          className={`rounded-full border px-3 py-1 text-xs font-bold ${itemClassName}`}
        >
          {fact}
        </span>
      ))}
    </div>
  )
}

function ProductFaq({
  app,
  className,
  mutedClassName,
}: {
  app: StudioApp
  className: string
  mutedClassName: string
}) {
  return (
    <section className={`py-20 md:py-28 ${className}`}>
      <div className="site-container max-w-5xl">
        <Reveal>
          <h2 className="text-4xl font-semibold tracking-[-0.035em] md:text-6xl">
            Questions before you start
          </h2>
        </Reveal>
        <div className="mt-8 divide-y divide-current/10 border-y border-current/10">
          {app.faq.map((item) => (
            <div key={item.question} className="py-7">
              <h3 className="text-2xl font-semibold">{item.question}</h3>
              <p className={`mt-4 text-lg leading-8 ${mutedClassName}`}>
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
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
              <h1 className="mt-12 text-[clamp(3.4rem,8vw,8rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-white">
                A software lab for focused digital products.
              </h1>
              <p className="mt-8 max-w-3xl text-xl leading-9 text-[#D6D0C7]">
                DCP Labs designs and publishes practical software products for
                everyday and professional use. The current catalog is
                intentionally focused on two live products: CoinRelic and
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
                  'The current catalog focuses on coin collecting and job application preparation.',
                ],
                [
                  'Trustworthy presentation',
                  'Every product page explains what the app does before sending visitors to a store page.',
                ],
              ].map(([title, body]) => (
                <div key={title} className="grid gap-4 py-7 md:grid-cols-3">
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <p className="md:col-span-2 text-lg leading-8 text-[#B8B2A8]">
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
        body="Choose CoinRelic for coin collecting or RoleForge for job application preparation."
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
              <h1 className="mt-5 text-[clamp(3.4rem,8vw,7.4rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-white">
                Product questions and support.
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-[#D6D0C7]">
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
                    <p className="mt-1 text-[#B8B2A8]">{app.shortDescription}</p>
                  </div>
                  <ArrowRight
                    className="text-[#B8B2A8] transition group-hover:translate-x-1 group-hover:text-white"
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
            <h1 className="mt-5 text-[clamp(3.4rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-white">
              {title}
            </h1>
            <div className="mt-10 border-y border-white/10 py-8 text-lg leading-8 text-[#D6D0C7]">
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

function NotFoundPage() {
  return (
    <PageShell>
      <Meta
        title="Page Not Found | DCP Labs"
        description="The requested DCP Labs page could not be found."
        path="/404"
      />
      <section className="section-pad">
        <div className="site-container max-w-4xl">
          <Reveal>
            <img
              src={dcpLogo}
              alt="DCP Labs"
              className="h-auto w-[min(420px,100%)]"
            />
            <h1 className="mt-12 text-[clamp(3.4rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-white">
              Page not found.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#B8B2A8]">
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

function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] border-b border-white/10 pt-20">
      <div className="site-container grid min-h-[calc(100dvh-5rem)] gap-12 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <Reveal>
            <div>
              <p className="section-kicker">DCP Labs</p>
              <h1 className="mt-7 max-w-5xl text-[clamp(3.6rem,9vw,8.6rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-white">
                Focused software products for real tasks.
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-9 text-[#D6D0C7]">
                DCP Labs builds practical apps with clear jobs to do. The live
                catalog currently includes CoinRelic for coin collectors and
                RoleForge for job seekers.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink to="/apps">Explore apps</ButtonLink>
                <ButtonLink to="/coinrelic" variant="secondary">
                  View CoinRelic
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
    <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#101014] p-6 shadow-[0_32px_90px_rgba(0,0,0,0.35)] md:p-9">
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
              <span className="text-sm text-[#B8B2A8]">{app.category}</span>
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
            <signal.icon size={18} className="text-[#D6D0C7]" />
            <span className="text-sm font-semibold text-[#D6D0C7]">
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
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-6xl">
              Two products, clear next steps.
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-[#B8B2A8]">
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
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#B8B2A8]">
              {app.shortDescription}
            </p>
          </div>
          <div className="text-sm font-semibold text-[#D6D0C7]">
            <span className="block">{app.category}</span>
            <span className="mt-1 block text-[#81796F]">{app.platform}</span>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <Link
              to={`/${app.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 px-4 py-3 text-sm font-bold text-[#D6D0C7] transition hover:border-[#F2ECE2] hover:bg-[#F2ECE2] hover:text-[#111114]"
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
          <h2 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-6xl">
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
                <p className="mt-5 text-lg leading-8 text-[#B8B2A8]">
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
              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-6xl">
                One studio, two focused product paths.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-8 text-[#B8B2A8]">
                Choose the collector app or the job application extension, then
                continue to the official store page.
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
                  <span className="text-[#B8B2A8]">{product}</span>
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
              <h2 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-6xl">
                {title}
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#B8B2A8]">
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
                `text-sm font-semibold transition ${
                  isActive
                    ? 'text-white'
                    : 'text-[#B8B2A8] hover:text-white'
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
          <p className="mt-6 max-w-md leading-7 text-[#81796F]">
            Focused digital products for practical everyday and professional
            use.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-white">Apps</h3>
          <div className="mt-4 grid gap-3">
            {apps.map((app) => (
              <div key={app.slug} className="grid gap-1">
                <Link
                  to={`/${app.slug}`}
                  className="text-sm text-[#D6D0C7] transition hover:text-white"
                >
                  {app.name}
                </Link>
                <a
                  href={app.storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#81796F] transition hover:text-white"
                >
                  {app.name === 'CoinRelic'
                    ? 'Google Play'
                    : 'Chrome Web Store'}
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
              ['About', '/about'],
              ['Contact', '/contact'],
              ['Privacy', '/privacy'],
              ['Terms', '/terms'],
            ].map(([label, href]) => (
              <Link
                key={href}
                to={href}
                className="text-sm text-[#81796F] transition hover:text-white"
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

function PageShell({ children }: { children: ReactNode }) {
  return <div className="min-h-[70dvh]">{children}</div>
}

function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode
  delay?: number
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
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

function Meta({
  title,
  description,
  path,
  image = DEFAULT_SOCIAL_IMAGE,
  type = 'website',
  jsonLd,
}: {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  jsonLd?: JsonLd
}) {
  useEffect(() => {
    const normalizedPath =
      path ?? `${window.location.pathname}${window.location.search}`
    const canonicalUrl = new URL(normalizedPath, SITE_URL).toString()
    const imageUrl = new URL(image, SITE_URL).toString()

    const setMeta = (
      selector: string,
      attribute: 'name' | 'property',
      key: string,
      content: string,
    ) => {
      const meta =
        document.querySelector<HTMLMetaElement>(selector) ??
        document.head.appendChild(document.createElement('meta'))
      meta.setAttribute(attribute, key)
      meta.content = content
    }

    document.title = title
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta(
      'meta[property="og:description"]',
      'property',
      'og:description',
      description,
    )
    setMeta('meta[property="og:type"]', 'property', 'og:type', type)
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
    setMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl)
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta(
      'meta[name="twitter:description"]',
      'name',
      'twitter:description',
      description,
    )
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl)

    const canonical =
      document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ??
      document.head.appendChild(document.createElement('link'))
    canonical.rel = 'canonical'
    canonical.href = canonicalUrl

    document
      .querySelectorAll<HTMLScriptElement>('script[data-dcp-json-ld="true"]')
      .forEach((script) => script.remove())

    if (jsonLd) {
      const entries = Array.isArray(jsonLd) ? jsonLd : [jsonLd]
      entries.forEach((entry) => {
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.dataset.dcpJsonLd = 'true'
        script.text = JSON.stringify(entry)
        document.head.appendChild(script)
      })
    }
  }, [description, image, jsonLd, path, title, type])

  return null
}

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return null
}

export default App

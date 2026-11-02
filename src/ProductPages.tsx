import { Route, Routes, useParams } from 'react-router-dom'
import type { StudioApp } from './data/apps'
import { appBySlug } from './data/apps'
import { Meta } from './PageMeta'
import { NotFoundPage } from './PageUi'
import { softwareApplicationJsonLd, faqJsonLd, breadcrumbJsonLd } from './PageSeo'
import { careTailSeoPages, roleForgeGuides, comparisonPages } from './productSupportContent'
import { CareTailStory } from './caretail/CareTailStory'
import { CoinRelicStory } from './coinrelic/CoinRelicStory'
import { LearnLiftStory } from './learnlift/LearnLiftStory'
import { KinBriefStory } from './kinbrief/KinBriefStory'
import { RoleForgeStory } from './roleforge/RoleForgeStory'
import { ServiceSphereStory } from './servicesphere/ServiceSphereStory'

export function AppDetailPage() {
  const { slug = '' } = useParams()
  const app = appBySlug[slug]

  if (!app) return <NotFoundPage />

  if (app.slug === 'caretail') return <CareTailPage app={app} />
  if (app.slug === 'coinrelic') return <CoinRelicPage app={app} />
  if (app.slug === 'roleforge') return <RoleForgePage app={app} />
  if (app.slug === 'learnlift-ai') return <LearnLiftPage app={app} />
  if (app.slug === 'kinbrief') return <KinBriefPage app={app} />
  if (app.slug === 'servicesphere-field-service-app') {
    return <ServiceSpherePage />
  }

  return <NotFoundPage />
}

export function KinBriefPage({ app }: { app: StudioApp }) {
  return (
    <>
      <Meta
        title="KinBrief — Weekly Care Plan for Families | DCP Labs"
        description="KinBrief helps families coordinate notes, tasks, documents, and weekly updates when caring for an aging parent."
        path="/kinbrief"
        jsonLd={[
          softwareApplicationJsonLd({
            app,
            path: '/kinbrief',
            applicationCategory: 'Family care coordination software',
            operatingSystem: 'Web, PWA',
          }),
          faqJsonLd(app),
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'KinBrief', path: '/kinbrief' },
          ]),
        ]}
      />
      <KinBriefStory app={app} />
    </>
  )
}

export function LearnLiftPage({ app }: { app: StudioApp }) {
  return (
    <>
      <Meta
        title="LearnLift AI — Study Coach for English, Interviews and QA"
        description="LearnLift AI helps learners practice English, job interview preparation, and IT/QA topics through short guided study sessions."
        path="/learnlift-ai"
        image="/og-learnlift-ai.png"
        jsonLd={[
          softwareApplicationJsonLd({
            app,
            path: '/learnlift-ai',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Android',
          }),
          faqJsonLd(app),
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'LearnLift AI', path: '/learnlift-ai' },
          ]),
        ]}
      />
      <LearnLiftStory app={app} />
    </>
  )
}

export function CareTailPage({ app }: { app: StudioApp }) {
  return (
    <>
      <Meta
        title="CareTail | Pet Care Tracker App for Reminders, Notes, and Records"
        description="CareTail is a pet care tracker app for organizing pet profiles, reminders, diary notes, documents, reports, and multi-pet care history."
        path="/caretail"
        image="/og-caretail.svg"
        jsonLd={[
          softwareApplicationJsonLd({
            app,
            path: '/caretail',
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'Android',
          }),
          faqJsonLd(app),
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'CareTail', path: '/caretail' },
          ]),
        ]}
      />
      <CareTailStory app={app} useCases={careTailSeoPages} />
    </>
  )
}

export function CoinRelicPage({ app }: { app: StudioApp }) {
  return (
    <>
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
      <CoinRelicStory app={app} />
    </>
  )
}

export function RoleForgePage({ app }: { app: StudioApp }) {
  return (
    <>
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
      <RoleForgeStory
        app={app}
        guides={roleForgeGuides.slice(0, 4).map((guide) => ({
          label: guide.h1,
          href: `/roleforge/guides/${guide.slug}`,
        }))}
        comparisons={[
          ...comparisonPages.map((page) => ({
            label: `RoleForge vs ${page.competitor}`,
            href: `/roleforge/${page.slug}`,
          })),
          {
            label: 'Best AI resume tools',
            href: '/roleforge/best-ai-resume-tools',
          },
        ]}
      />
    </>
  )
}

export function ServiceSpherePage() {
  const app = appBySlug['servicesphere-field-service-app']

  if (!app) return <NotFoundPage />

  return (
    <>
      <Meta
        title="ServiceSphere Field Service App for Solo Contractors | DCP Labs"
        description="ServiceSphere helps solo tradespeople and small service businesses manage clients, quotes, jobs, invoices, photos, notes, and routes from Android."
        path="/servicesphere-field-service-app"
        image={app.screenshots[0]}
        jsonLd={[
          softwareApplicationJsonLd({
            app,
            path: '/servicesphere-field-service-app',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Android',
          }),
          faqJsonLd(app),
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            {
              name: 'ServiceSphere',
              path: '/servicesphere-field-service-app',
            },
          ]),
        ]}
      />
      <ServiceSphereStory app={app} />
    </>
  )
}

// One coarse product entry keeps blog Markdown and support-page implementations
// off the critical path, without adding a separate chunk for every chapter.
export default function ProductPages() {
  return <Routes><Route path="/:slug" element={<AppDetailPage />} /></Routes>
}

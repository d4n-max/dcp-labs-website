import { useHeroReady } from '../product-story/useHeroReady'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { StudioApp } from '../data/apps'
import {
  ProductStoryCta,
  ProductStoryHero,
  ProductStoryRail,
  ProductStoryShell,
} from '../product-story/ProductStory'
import type {
  ProductStoryChapterData,
  ProductStoryTheme,
} from '../product-story/ProductStory'
import { useProductStoryMotion } from '../product-story/useProductStoryMotion'
import styles from './ServiceSphereStory.module.css'

const serviceSphereTheme: ProductStoryTheme = {
  background: '#F7F5FF',
  surface: '#F1EDFF',
  surfaceStrong: '#FFFFFF',
  ink: '#100D1E',
  muted: '#5C536F',
  accent: '#7C3AED',
  accentStrong: '#4338CA',
  deep: '#140F2A',
  onDeep: '#F8F6FF',
}

const audiences = [
  'Handymen',
  'Cleaners',
  'Landscapers',
  'Electricians',
  'Plumbers',
  'HVAC techs',
  'Mobile mechanics',
  'Appliance repair',
  'Small field service teams',
]

const pains = [
  'Photos lost in the camera roll',
  'Quotes buried in messages',
  'Job notes scattered across paper and apps',
  'Invoices sent late',
  'Client records hard to find later',
  'Follow-ups forgotten',
]

const trustStatements = [
  'Focused on simple tools for small businesses.',
  'Product pages link to official store destinations.',
  'Support is available through the DCP Labs contact email.',
]

const relatedPages = [
  {
    title: 'Field service business app',
    body: 'A practical guide for organizing small service work from a phone.',
    href: '/blog/field-service-business-app',
    active: true,
  },
  {
    title: 'Service business without spreadsheets',
    body: 'How scattered notes and spreadsheets slow down service workflows.',
    href: '/blog/organize-service-business-without-spreadsheets',
    active: true,
  },
  {
    title: 'Contractor invoice app',
    body: 'Coming soon',
    href: '',
    active: false,
  },
  {
    title: 'Job photo organizer',
    body: 'Coming soon',
    href: '',
    active: false,
  },
]

function createChapters(app: StudioApp): ProductStoryChapterData[] {
  return [
    {
      id: 'service-client-records',
      title: 'Manage clients and job records',
      imageSrc: app.screenshots[2],
      imageOrientation: 'portrait',
      composition: 'split',
      visualFocus: 'top',
      imageAlt:
        'ServiceSphere screenshot showing organized client records in the Android app',
      details: [
        {
          title: 'Save client details',
          body: 'Keep customer contact info, addresses, notes, and job history close to the work.',
        },
        {
          title: 'Keep records organized',
          body: 'Bring clients, jobs, quotes, invoices, photos, notes, and settings into one mobile workspace.',
        },
      ],
    },
    {
      id: 'service-quotes',
      title: 'Create quotes',
      imageSrc: app.screenshots[3],
      imageOrientation: 'portrait',
      composition: 'quote',
      visualFocus: 'top',
      imageAlt:
        'ServiceSphere screenshot showing quote, job, and invoice workflows',
      details: [
        {
          title: '',
          body: 'Build estimates with line items, discounts, tax, totals, and client context.',
        },
      ],
    },
    {
      id: 'service-track-work',
      title: 'Keep every service job organized',
      imageSrc: app.screenshots[5],
      imageOrientation: 'portrait',
      composition: 'center',
      visualFocus: 'top',
      imageAlt:
        'ServiceSphere screenshot showing job tracking from scheduled to invoiced',
      details: [
        {
          title: 'Turn work into jobs',
          body: 'Track each service request as a job with status, schedule, address, and price context.',
        },
        {
          title: 'Plan routes',
          body: 'Keep location context available when moving between mobile service visits.',
        },
      ],
    },
    {
      id: 'service-proof',
      title: 'Add photos, notes, and signatures',
      imageSrc: app.screenshots[4],
      imageOrientation: 'portrait',
      composition: 'reverse',
      visualFocus: 'center',
      imageAlt:
        'ServiceSphere screenshot showing job details with photo proof, notes, and client signature actions',
      details: [
        {
          title: 'Add photos and notes',
          body: 'Attach job proof and practical details so the work record is easier to revisit.',
        },
        {
          title: 'Capture signatures',
          body: 'Document approval from the same job detail flow used for field notes and proof.',
        },
      ],
    },
    {
      id: 'service-quotes-invoices',
      title: 'Track quotes and invoices',
      imageSrc: app.screenshots[3],
      imageOrientation: 'portrait',
      composition: 'completion',
      visualFocus: 'bottom',
      imageAlt:
        'ServiceSphere screenshot showing quote, job, and invoice workflows',
      details: [
        {
          title: 'Create invoices',
          body: 'Move from completed work to billing without rebuilding the job from scratch.',
        },
      ],
    },
  ]
}

export function ServiceSphereStory({ app }: { app: StudioApp }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const chapters = createChapters(app)

  useProductStoryMotion(rootRef)
  useHeroReady()

  return (
    <ProductStoryShell
      rootRef={rootRef}
      theme={serviceSphereTheme}
      className={`${styles.page} product-theme product-theme-fieldservice product-page`}
    >
      <ProductStoryHero
        backHref="/apps"
        backLabel="Back to DCP Labs apps"
        iconSrc={app.iconImage ?? ''}
        iconAlt="ServiceSphere app icon"
        brandLabel="Your Complete Field Service Ecosystem"
        heading="Run your service business from your phone."
        description="ServiceSphere helps solo tradespeople and small service businesses manage clients, quotes, jobs, routes, signatures, invoices, photos, and notes without enterprise complexity."
        actions={[
          {
            href: app.storeUrl,
            label: 'Get it on Google Play',
            external: true,
            primary: true,
          },
          {
            href: '#how-it-works',
            label: 'See how it works',
          },
        ]}
        visualSrc={app.screenshots[0]}
        visualAlt="ServiceSphere Android app showing clients, jobs, quotes, invoices, and photo proof"
      />

      <section className={styles.audienceSection}>
        <div className={styles.audienceInner}>
          <div className={styles.audienceCopy}>
            <h2>Built for people doing real work in the field.</h2>
            <p>
              ServiceSphere is for hands-on service businesses, not office
              teams managing enterprise software.
            </p>
            <ul className={styles.audienceList}>
              {audiences.map((audience) => (
                <li key={audience}>{audience}</li>
              ))}
            </ul>
          </div>
          <figure className={styles.audienceVisual}>
            <img
              src={app.screenshots[6]}
              alt="ServiceSphere promotional artwork showing the app settings and small service business positioning"
              width="1080"
              height="1920"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </section>

      <section className={styles.painSection}>
        <div className={styles.painInner}>
          <div className={styles.painHeading}>
            <h2>Stop running your business from scattered notes.</h2>
            <p>
              A small service business can lose time in tiny places. The
              problem is usually not effort. It is where the work details end
              up.
            </p>
          </div>
          <div className={styles.painComposition}>
            <figure>
              <img
                src={app.screenshots[1]}
                alt="ServiceSphere dashboard screenshot for managing service jobs"
                width="1080"
                height="1920"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <ul>
              {pains.map((pain) => (
                <li key={pain}>{pain}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ProductStoryRail
        id="how-it-works"
        connector="workflow"
        heading="From quote to finished job, keep the whole workflow together."
        description="Clients, quotes, jobs, routes, signatures, invoices, photos, and notes stay connected so the next action is easier to find."
        visualHeading="Real app screens, large enough to read."
        chapters={chapters}
      />

      <section className={styles.trustSection}>
        <div className={styles.trustInner}>
          <div className={styles.trustHeading}>
            <img
              src={app.iconImage}
              alt=""
              aria-hidden="true"
              width="80"
              height="80"
            />
            <h2>Built and actively maintained by DCP Labs.</h2>
          </div>
          <div className={styles.trustStatements}>
            {trustStatements.map((statement) => (
              <p key={statement}>{statement}</p>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.faqInner}>
          <h2>ServiceSphere FAQ.</h2>
          <div className={styles.faqList}>
            {app.faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.resourcesSection}>
        <div className={styles.resourcesInner}>
          <h2>More field service resources.</h2>
          <div className={styles.resourceList}>
            {relatedPages.map((page) =>
              page.active ? (
                <Link key={page.title} to={page.href} className={styles.resourceLink}>
                  <span>{page.title}</span>
                  <span>{page.body}</span>
                  <ArrowRight aria-hidden="true" size={20} />
                </Link>
              ) : (
                <div key={page.title} className={styles.resourceInactive}>
                  <span>{page.title}</span>
                  <span>{page.body}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <ProductStoryCta
        heading="Ready to organize your service jobs?"
        description="Bring clients, work, proof, billing, and field notes into one Android app built for small service businesses."
        action={{
          href: app.storeUrl,
          label: 'Get ServiceSphere on Google Play',
          external: true,
        }}
      />
    </ProductStoryShell>
  )
}

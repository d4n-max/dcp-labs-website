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
import { useCareTailStoryMotion } from './useCareTailStoryMotion'
import styles from './CareTailStory.module.css'

type CareTailUseCase = {
  slug: string
  keyword: string
  h1: string
}

type CareTailStoryProps = {
  app: StudioApp
  useCases: CareTailUseCase[]
}

const careTailTheme: ProductStoryTheme = {
  background: '#F5FBF8',
  surface: '#E9F8F3',
  surfaceStrong: '#FFFDF8',
  ink: '#132826',
  muted: '#526864',
  accent: '#56C7BE',
  accentStrong: '#1D7770',
  deep: '#143B37',
  onDeep: '#F5FFFC',
}

const careAreas = [
  {
    title: 'Pet profiles',
    body: "Keep each pet's routines, notes, and records separate.",
  },
  {
    title: 'Care reminders',
    body: 'Track grooming, food, medication, vaccines, and visits.',
  },
  {
    title: 'Diary notes',
    body: 'Log appetite, mood, energy, symptoms, and observations.',
  },
  {
    title: 'Vet records',
    body: 'Keep documents and reports easier to find when needed.',
  },
]

const localFirstNotes = [
  'Local-first organization',
  'Optional Google Sign-In',
  'User-created reminders',
]

function createChapters(app: StudioApp): ProductStoryChapterData[] {
  return [
    {
      id: 'caretail-pet-profile',
      title: 'One profile for every pet',
      imageSrc: app.screenshots[2],
      imageOrientation: 'portrait',
      composition: 'split',
      visualFocus: 'full',
      imageAlt:
        'CareTail promo showing a pet profile with reminders, documents, and care history',
      details: [
        {
          title: '',
          body: "Keep each pet's routines, reminders, notes, and records separate so the details stay easy to review.",
        },
      ],
    },
    {
      id: 'caretail-reminders',
      title: 'Care reminders',
      imageSrc: app.screenshots[3],
      imageOrientation: 'portrait',
      composition: 'quote',
      visualFocus: 'full',
      imageAlt:
        'CareTail promo showing pet care reminders for vaccines medication and vet visits',
      details: [
        {
          title: '',
          body: 'Create reminders for medication, grooming, food, vaccines, vet visits, and custom care tasks.',
        },
        {
          title: '',
          body: 'CareTail reminders are user-created organizational tools and are not medical advice.',
        },
      ],
    },
    {
      id: 'caretail-diary',
      title: 'Diary notes over time',
      imageSrc: app.screenshots[4],
      imageOrientation: 'portrait',
      composition: 'center',
      visualFocus: 'full',
      imageAlt:
        'CareTail promo showing diary notes for mood appetite energy symptoms and notes',
      details: [
        {
          title: '',
          body: 'Log appetite, mood, energy, symptoms, observations, and notes without turning everyday care into complicated recordkeeping.',
        },
      ],
    },
    {
      id: 'caretail-documents',
      title: 'Documents and records',
      imageSrc: app.screenshots[5],
      imageOrientation: 'portrait',
      composition: 'reverse',
      visualFocus: 'full',
      imageAlt:
        'CareTail promo showing organized vet records documents prescriptions and insurance files',
      details: [
        {
          title: '',
          body: 'Save vaccine records, prescriptions, insurance files, and documents so appointment prep feels less scattered.',
        },
      ],
    },
    {
      id: 'caretail-multi-pet',
      title: 'Calm organization for more than one pet.',
      imageSrc: app.screenshots[6],
      imageOrientation: 'portrait',
      composition: 'completion',
      visualFocus: 'full',
      imageAlt:
        "CareTail promo showing today's care dashboard with pets reminders and quick actions",
      details: [
        {
          title: '',
          body: 'CareTail supports separate profiles so each pet can have its own routines, notes, reminders, and documents. Premium gives more room for more pets, routines, documents, and care history.',
        },
        ...app.benefits.map((benefit) => ({
          title: '',
          body: benefit,
        })),
      ],
    },
  ]
}

function CareAreaIndex() {
  return (
    <section className={styles.careAreaSection}>
      <div className={styles.careAreaInner}>
        <h2>Built for everyday care, not clinical overwhelm.</h2>
        <div className={styles.careAreaList}>
          {careAreas.map((area) => (
            <article key={area.title}>
              <h3>{area.title}</h3>
              <p>{area.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function StoreFacts({ facts }: { facts: string[] }) {
  return (
    <section className={styles.factSection} aria-label="CareTail availability">
      <div className={styles.factInner}>
        {facts.map((fact) => (
          <span key={fact}>{fact}</span>
        ))}
      </div>
    </section>
  )
}

function LocalFirstSection({ app }: { app: StudioApp }) {
  return (
    <section className={styles.localFirstSection}>
      <div className={styles.localFirstInner}>
        <figure className={styles.localFirstVisual}>
          <img
            src={app.screenshots[1]}
            alt="CareTail promo showing all pet care profiles reminders notes and records in one place"
            width="810"
            height="1440"
            loading="lazy"
            decoding="async"
          />
        </figure>
        <div className={styles.localFirstCopy}>
          <h2>Local-first, with optional sign-in.</h2>
          <p>
            CareTail can be used locally without creating an account. Google
            Sign-In is optional, while the core experience stays focused on
            local-first organization.
          </p>
          <div className={styles.localFirstNotes}>
            {localFirstNotes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CareTailFaq({ app }: { app: StudioApp }) {
  return (
    <section className={styles.faqSection}>
      <div className={styles.faqInner}>
        <h2>CareTail FAQ</h2>
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
  )
}

function CareTailUseCases({ useCases }: { useCases: CareTailUseCase[] }) {
  return (
    <section className={styles.useCaseSection}>
      <div className={styles.useCaseInner}>
        <div className={styles.useCaseHeading}>
          <h2>Explore CareTail use cases</h2>
          <p>
            Practical guides for organizing routines, reminders, notes,
            records, and multi-pet care with CareTail.
          </p>
        </div>
        <div className={styles.useCaseList}>
          {useCases.map((useCase) => (
            <Link
              key={useCase.slug}
              to={`/caretail/${useCase.slug}`}
              className={styles.useCaseLink}
            >
              <span className={styles.useCaseKeyword}>{useCase.keyword}</span>
              <span className={styles.useCaseTitle}>{useCase.h1}</span>
              <span className={styles.useCaseAction}>
                Read guide
                <ArrowRight aria-hidden="true" size={19} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CareTailStory({ app, useCases }: CareTailStoryProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const chapters = createChapters(app)

  useCareTailStoryMotion(rootRef)
  useHeroReady()

  return (
    <ProductStoryShell
      rootRef={rootRef}
      theme={careTailTheme}
      className={`${styles.page} product-theme product-theme-petcare product-page`}
    >
      <ProductStoryHero
        backHref="/apps"
        backLabel="Back to DCP Labs"
        iconSrc={app.iconImage ?? ''}
        iconAlt="CareTail app icon"
        brandLabel="Live on Google Play"
        heading="Care routines, notes, and records in one calm place."
        description="CareTail helps pet owners organize profiles, reminders, diary notes, documents, and care history without keeping everything in their head."
        actions={[
          {
            href: app.storeUrl,
            label: app.storeLabel,
            external: true,
            primary: true,
          },
          {
            href: '/apps',
            label: 'View DCP apps',
          },
        ]}
        visualSrc={app.screenshots[0]}
        visualAlt="CareTail feature graphic showing pet profiles care reminders health diary and vet records"
        visualWidth={1024}
        visualHeight={500}
      />

      <StoreFacts facts={app.storeFacts} />

      <CareAreaIndex />

      <ProductStoryRail
        id="caretail-story"
        connector="rhythm"
        progressLabel="CareTail care story progress"
        heading="Pet care details get scattered fast."
        description="Notes, calendars, documents, photos, and memory all end up carrying part of the routine. CareTail brings reminders, records, and observations into one organized pet care tracker."
        chapters={chapters}
      />

      <LocalFirstSection app={app} />

      <CareTailFaq app={app} />

      <CareTailUseCases useCases={useCases} />

      <ProductStoryCta
        heading="Put pet care details in one calm place."
        description="Download CareTail from Google Play."
        action={{
          href: app.storeUrl,
          label: 'Get it on Google Play',
          external: true,
        }}
      />
    </ProductStoryShell>
  )
}

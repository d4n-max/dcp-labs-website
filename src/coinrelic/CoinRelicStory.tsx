import { useHeroReady } from '../product-story/useHeroReady'
import { useRef, useState } from 'react'
import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { StudioApp } from '../data/apps'
import {
  ProductStoryShell,
  type ProductStoryTheme,
} from '../product-story/ProductStory'
import { useCoinRelicStoryMotion } from './useCoinRelicStoryMotion'
import styles from './CoinRelicStory.module.css'

type CoinRelicChapter = {
  id: string
  title: string
  body: string
  imageSrc: string
  imageAlt: string
  width: number
  composition: 'scan' | 'detail' | 'collection' | 'archive'
}

const coinRelicTheme: ProductStoryTheme = {
  background: '#03070b',
  surface: '#07111a',
  surfaceStrong: '#0b1822',
  ink: '#fff8df',
  muted: '#bdb6a1',
  accent: '#d6a94b',
  accentStrong: '#a9762f',
  deep: '#020609',
  onDeep: '#fff8df',
}

const galleryAltText = [
  'CoinRelic promo showing camera coin identification',
  'CoinRelic promo showing coin value and rarity context',
  'CoinRelic My Collection catalog showing saved coin records',
  'CoinRelic My Collection catalog showing saved coin entries and dates',
]

function createChapters(app: StudioApp): CoinRelicChapter[] {
  return [
    {
      id: 'coinrelic-scan',
      title: 'Scan a coin',
      body: 'Capture a coin from the mobile app and start a new identification record in seconds.',
      imageSrc: app.screenshots[0],
      imageAlt: galleryAltText[0],
      width: 442,
      composition: 'scan',
    },
    {
      id: 'coinrelic-identification',
      title: 'Review identification details',
      body: 'Review possible identity, value context, rarity cues, and details worth checking before you save the find.',
      imageSrc: app.screenshots[1],
      imageAlt: galleryAltText[1],
      width: 443,
      composition: 'detail',
    },
    {
      id: 'coinrelic-collection',
      title: 'Save to collection',
      body: 'Add important finds to a digital catalog with photos, notes, and details you can return to later.',
      imageSrc: app.screenshots[3],
      imageAlt: galleryAltText[2],
      width: 442,
      composition: 'collection',
    },
    {
      id: 'coinrelic-history',
      title: 'Track history and notes',
      body: 'Keep scan history, watched coins, achievements, and collection notes together as your catalog grows.',
      imageSrc: app.screenshots[3],
      imageAlt: galleryAltText[3],
      width: 442,
      composition: 'archive',
    },
  ]
}

function StoreAction({
  href,
  children,
  className,
}: {
  href: string
  children: string
  className?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${styles.primaryAction} ${className ?? ''}`}
    >
      {children}
      <ArrowRight aria-hidden="true" size={17} />
    </a>
  )
}

function CoinRelicHero({ app }: { app: StudioApp }) {
  return (
    <section className={styles.hero} data-cr-hero>
      <div className={styles.heroLight} data-cr-hero-light aria-hidden="true" />
      <div className={styles.heroInner}>
        <div className={styles.heroCopy} data-cr-hero-copy>
          <Link to="/apps" className={styles.backLink}>
            <ChevronRight aria-hidden="true" size={16} />
            Back to DCP Labs
          </Link>

          <div className={styles.identity} data-cr-identity>
            <img
              src={app.iconImage ?? ''}
              alt="CoinRelic app icon"
              width="58"
              height="58"
            />
            <div>
              <span className={styles.productName}>CoinRelic</span>
              <span className={styles.platform}>Live on Google Play</span>
            </div>
          </div>

          <div className={styles.heroHeadingMask}>
            <h1 data-cr-hero-heading>
              Identify coins. Organize every find.
            </h1>
          </div>

          <p className={styles.heroDescription} data-cr-hero-description>
            {app.heroLine}
          </p>

          <div className={styles.heroActions} data-cr-hero-actions>
            <StoreAction href={app.storeUrl}>{app.storeLabel}</StoreAction>
            <Link to="/apps" className={styles.secondaryAction}>
              Explore apps
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link
              to="/coinrelic/is-my-coin-rare"
              className={styles.textAction}
            >
              Check rarity signals
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>

          <div className={styles.facts} aria-label="CoinRelic availability">
            {app.storeFacts.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </div>
        </div>

        <figure className={styles.heroVisual} data-cr-hero-visual>
          <div className={styles.heroIndex} aria-hidden="true">
            <span>CR / 01</span>
            <i />
          </div>
          <div className={styles.heroVisualMask}>
            <img
              src={app.screenshots[0]}
              alt="CoinRelic coin identification app promo screenshot"
              width="442"
              height="592"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </figure>
      </div>
    </section>
  )
}

function ChapterProgress({
  chapters,
}: {
  chapters: CoinRelicChapter[]
}) {
  return (
    <div
      className={styles.progress}
      data-cr-progress
      aria-label="CoinRelic collection story progress"
    >
      <div className={styles.progressLine} aria-hidden="true">
        <span />
      </div>
      {chapters.map((chapter, index) => (
        <span
          key={chapter.id}
          className={styles.progressItem}
          data-cr-progress-item
          data-active={index === 0 ? 'true' : 'false'}
          data-completed="false"
          aria-current={index === 0 ? 'step' : undefined}
        >
          <span aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span>{chapter.title}</span>
        </span>
      ))}
    </div>
  )
}

function CatalogueConnector() {
  return (
    <div className={styles.connector} data-cr-connector aria-hidden="true">
      <span className={styles.connectorBase} />
      <span className={styles.connectorFill} />
      <span className={styles.connectorMarker} />
    </div>
  )
}

function CoinRelicChapterView({
  chapter,
  index,
}: {
  chapter: CoinRelicChapter
  index: number
}) {
  return (
    <section
      className={styles.chapter}
      data-cr-chapter
      data-cr-composition={chapter.composition}
      aria-labelledby={`${chapter.id}-title`}
    >
      <div className={styles.chapterInner}>
        <div className={styles.chapterCopy} data-cr-chapter-copy>
          <div className={styles.chapterNumber} aria-hidden="true">
            Collection entry / {String(index + 1).padStart(2, '0')}
          </div>
          <div className={styles.chapterTitleMask}>
            <h3 id={`${chapter.id}-title`} data-cr-chapter-title>
              {chapter.title}
            </h3>
          </div>
          <p data-cr-chapter-description>{chapter.body}</p>
        </div>

        <figure className={styles.visualStage} data-cr-chapter-visual>
          <div className={styles.visualIndex} aria-hidden="true">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <i />
          </div>
          <div className={styles.visualMask}>
            <img
              src={chapter.imageSrc}
              alt={chapter.imageAlt}
              width={chapter.width}
              height="592"
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
          <span className={styles.trace} data-cr-trace aria-hidden="true" />
        </figure>
      </div>
    </section>
  )
}

function CoinRelicRail({ chapters }: { chapters: CoinRelicChapter[] }) {
  return (
    <section id="coinrelic-story" className={styles.storySection}>
      <div className={styles.storyIntro}>
        <p>How CoinRelic works</p>
        <h2>From a loose find to a clear record.</h2>
      </div>

      <div className={styles.storyViewport} data-cr-viewport>
        <ChapterProgress chapters={chapters} />
        <CatalogueConnector />
        <div className={styles.storyTrack} data-cr-track>
          {chapters.map((chapter, index) => (
            <CoinRelicChapterView
              key={chapter.id}
              chapter={chapter}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function CollectionSection({ app }: { app: StudioApp }) {
  return (
    <section className={styles.collectionSection} data-cr-supporting>
      <div className={styles.collectionInner}>
        <div className={styles.collectionHeading}>
          <h2>Keep the story of every coin.</h2>
          <p>
            CoinRelic keeps the collecting process organized: identify a coin,
            check the details, save the record, and revisit it when your catalog
            changes.
          </p>
        </div>
        <div className={styles.benefitList}>
          {app.benefits.map((benefit, index) => (
            <div key={benefit}>
              <span aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <Check aria-hidden="true" size={18} />
              <p>{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CoinRelicFaq({ app }: { app: StudioApp }) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  return (
    <section className={styles.faqSection}>
      <div className={styles.faqInner}>
        <h2>Questions before you start</h2>
        <div className={styles.faqList}>
          {app.faq.map((item, index) => {
            const answerId = `coinrelic-faq-answer-${index + 1}`
            const isOpen = openQuestion === item.question

            return (
              <div key={item.question} className={styles.faqItem}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() =>
                      setOpenQuestion(isOpen ? null : item.question)
                    }
                  >
                    <span>{item.question}</span>
                    <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                </h3>
                <div id={answerId} hidden={!isOpen}>
                  <p>{item.answer}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ChecklistSection() {
  return (
    <section className={styles.checklistSection}>
      <div className={styles.checklistInner}>
        <div>
          <p>Free collector checklist</p>
          <h2>Is your coin worth a closer look?</h2>
          <p>
            Use the CoinRelic checklist to review date, mint mark, condition,
            and error signals before scanning and saving the coin.
          </p>
        </div>
        <Link
          to="/coinrelic/is-my-coin-rare"
          className={styles.checklistAction}
        >
          Try the checklist
          <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </section>
  )
}

function FinalCta({ app }: { app: StudioApp }) {
  return (
    <section className={styles.finalCta} data-cr-final-cta>
      <div className={styles.finalIndex} aria-hidden="true">
        <span />
      </div>
      <div className={styles.finalCtaInner}>
        <div>
          <h2>Start building a cleaner coin catalog.</h2>
          <p>Download CoinRelic from Google Play.</p>
        </div>
        <StoreAction href={app.storeUrl}>{app.storeLabel}</StoreAction>
      </div>
    </section>
  )
}

export function CoinRelicStory({ app }: { app: StudioApp }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const chapters = createChapters(app)

  useCoinRelicStoryMotion(rootRef)
  useHeroReady()

  return (
    <ProductStoryShell
      rootRef={rootRef}
      theme={coinRelicTheme}
      className={`${styles.page} product-theme product-theme-collector product-page`}
    >
      <CoinRelicHero app={app} />
      <CoinRelicRail chapters={chapters} />
      <CollectionSection app={app} />
      <CoinRelicFaq app={app} />
      <ChecklistSection />
      <FinalCta app={app} />
    </ProductStoryShell>
  )
}

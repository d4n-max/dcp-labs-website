import { useHeroReady } from '../product-story/useHeroReady'
import { useRef, useState } from 'react'
import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { StudioApp } from '../data/apps'
import {
  ProductStoryShell,
  type ProductStoryTheme,
} from '../product-story/ProductStory'
import { useRoleForgeStoryMotion } from './useRoleForgeStoryMotion'
import styles from './RoleForgeStory.module.css'

type StoryLink = {
  href: string
  label: string
}

type RoleForgeStoryProps = {
  app: StudioApp
  comparisons: StoryLink[]
  guides: StoryLink[]
}

type RoleForgeChapter = {
  id: string
  title: string
  body: string
  imageSrc: string
  imageAlt: string
  composition: 'source' | 'match' | 'draft' | 'review' | 'handoff'
}

const roleForgeTheme: ProductStoryTheme = {
  background: '#07080d',
  surface: '#0d101a',
  surfaceStrong: '#121624',
  ink: '#f7f5ff',
  muted: '#bdb8d8',
  accent: '#8b5cf6',
  accentStrong: '#6d28d9',
  deep: '#05060a',
  onDeep: '#f7f5ff',
}

function createChapters(app: StudioApp): RoleForgeChapter[] {
  return [
    {
      id: 'roleforge-analyze',
      title: 'Analyze any job post',
      body: 'Extract the requirements, skills, and themes from the job page you are viewing.',
      imageSrc: app.screenshots[0],
      imageAlt: 'RoleForge analyze any job post screenshot',
      composition: 'source',
    },
    {
      id: 'roleforge-match',
      title: 'Review matched skills',
      body: 'Compare the role against saved experience before drafting application materials.',
      imageSrc: app.screenshots[1],
      imageAlt: 'RoleForge review matched skills screenshot',
      composition: 'match',
    },
    {
      id: 'roleforge-resume',
      title: 'Rewrite resume bullets',
      body: 'Turn relevant experience into role-specific resume bullets you can review, edit, and copy.',
      imageSrc: app.screenshots[2],
      imageAlt: 'RoleForge rewrite resume bullets screenshot',
      composition: 'draft',
    },
    {
      id: 'roleforge-cover-letter',
      title: 'Draft cover letters',
      body: 'Draft a role-specific cover letter that can be refined before you use it.',
      imageSrc: app.screenshots[3],
      imageAlt: 'RoleForge draft cover letters screenshot',
      composition: 'review',
    },
    {
      id: 'roleforge-bundle',
      title: 'Download your application bundle',
      body: 'Keep resumes, cover letters, form answers, and interview notes organized in one place.',
      imageSrc: app.screenshots[4],
      imageAlt: 'RoleForge download your application bundle screenshot',
      composition: 'handoff',
    },
  ]
}

function ExternalAction({
  href,
  label,
}: {
  href: string
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={styles.primaryAction}
    >
      {label}
      <ArrowRight aria-hidden="true" size={17} />
    </a>
  )
}

function RoleForgeHero({ app }: { app: StudioApp }) {
  return (
    <section className={styles.hero} data-rf-hero>
      <div className={styles.heroInner}>
        <div className={styles.heroCopy} data-rf-hero-copy>
          <Link to="/apps" className={styles.backLink}>
            <ChevronRight aria-hidden="true" size={16} />
            Back to DCP Labs
          </Link>

          <div className={styles.identity} data-rf-identity>
            <img
              src={app.iconImage ?? ''}
              alt="RoleForge icon"
              width="56"
              height="56"
            />
            <div>
              <span className={styles.productName}>RoleForge</span>
              <span className={styles.platform}>Chrome extension</span>
            </div>
          </div>

          <div className={styles.heroHeadingMask}>
            <h1 data-rf-hero-heading>
              Tailor every application to the role.
            </h1>
          </div>

          <p className={styles.heroDescription} data-rf-hero-description>
            RoleForge helps job seekers turn live job postings into tailored
            resumes, cover letters, form answers, and interview notes they can
            review and edit before applying.
          </p>

          <div className={styles.heroActions} data-rf-hero-actions>
            <ExternalAction href={app.storeUrl} label="Add to Chrome" />
            <Link to="/apps" className={styles.secondaryAction}>
              Explore apps
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
        </div>

        <figure className={styles.heroVisual} data-rf-hero-visual>
          <div className={styles.interfaceRule} aria-hidden="true">
            <span />
          </div>
          <img
            src={app.screenshots[0]}
            alt="RoleForge analyze any job post screenshot"
            width="1280"
            height="800"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </figure>
      </div>
    </section>
  )
}

function FactStrip({ app }: { app: StudioApp }) {
  return (
    <section className={styles.factSection} aria-label="RoleForge availability">
      <div className={styles.factInner}>
        <div className={styles.facts}>
          {app.storeFacts.map((fact) => (
            <span key={fact}>{fact}</span>
          ))}
        </div>
        <p>
          RoleForge drafts application materials for review. It does not submit
          applications or contact employers automatically.
        </p>
      </div>
    </section>
  )
}

function ChapterProgress({
  chapters,
}: {
  chapters: RoleForgeChapter[]
}) {
  return (
    <div
      className={styles.progress}
      data-rf-progress
      aria-label="RoleForge application story progress"
    >
      {chapters.map((chapter, index) => (
        <span
          key={chapter.id}
          className={styles.progressItem}
          data-rf-progress-item
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

function EvidenceConnector() {
  return (
    <div className={styles.connector} data-rf-connector aria-hidden="true">
      <span className={styles.connectorBase} />
      <span className={styles.connectorFill} />
      <span className={styles.connectorMarker} />
    </div>
  )
}

function RoleForgeChapterView({
  chapter,
  index,
}: {
  chapter: RoleForgeChapter
  index: number
}) {
  return (
    <section
      className={styles.chapter}
      data-rf-chapter
      data-rf-composition={chapter.composition}
      aria-labelledby={`${chapter.id}-title`}
    >
      <div className={styles.chapterInner}>
        <div className={styles.chapterCopy} data-rf-chapter-copy>
          <div className={styles.chapterLabel} aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className={styles.chapterTitleMask}>
            <h3 id={`${chapter.id}-title`} data-rf-chapter-title>
              {chapter.title}
            </h3>
          </div>
          <p data-rf-chapter-description>{chapter.body}</p>
        </div>

        <figure className={styles.visualStage} data-rf-chapter-visual>
          <div className={styles.visualMask}>
            <img
              src={chapter.imageSrc}
              alt={chapter.imageAlt}
              width="1280"
              height="800"
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
        </figure>
      </div>
    </section>
  )
}

function RoleForgeRail({ chapters }: { chapters: RoleForgeChapter[] }) {
  return (
    <section
      id="roleforge-story"
      className={styles.storySection}
      data-rf-story
    >
      <div className={styles.storyIntro}>
        <p>How RoleForge works</p>
        <h2>From job post to application draft.</h2>
      </div>

      <div className={styles.storyViewport} data-rf-viewport>
        <ChapterProgress chapters={chapters} />
        <EvidenceConnector />
        <div className={styles.storyTrack} data-rf-track>
          {chapters.map((chapter, index) => (
            <RoleForgeChapterView
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

function ControlSection({ app }: { app: StudioApp }) {
  return (
    <section className={styles.controlSection} data-rf-supporting>
      <div className={styles.controlInner}>
        <div className={styles.controlHeading}>
          <p>Review before use</p>
          <h2>Faster drafting without giving up control.</h2>
          <p>
            RoleForge helps create application drafts from the role in front of
            you. You stay responsible for reviewing, editing, copying, and
            deciding what to submit.
          </p>
        </div>
        <div className={styles.benefitList}>
          {app.benefits.map((benefit) => (
            <div key={benefit}>
              <Check aria-hidden="true" size={19} />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RoleForgeFaq({ app }: { app: StudioApp }) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  return (
    <section className={styles.faqSection}>
      <div className={styles.faqInner}>
        <h2>Questions before you start</h2>
        <div className={styles.faqList}>
          {app.faq.map((item, index) => {
            const answerId = `roleforge-faq-answer-${index + 1}`
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
                    {item.question}
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

function EditorialLinks({
  eyebrow,
  heading,
  links,
  primaryLink,
}: {
  eyebrow: string
  heading: string
  links: StoryLink[]
  primaryLink?: StoryLink
}) {
  return (
    <section className={styles.linkSection}>
      <div className={styles.linkInner}>
        <div className={styles.linkHeading}>
          <p>{eyebrow}</p>
          <h2>{heading}</h2>
          {primaryLink ? (
            <Link to={primaryLink.href} className={styles.textAction}>
              {primaryLink.label}
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          ) : null}
        </div>
        <nav className={styles.linkList} aria-label={eyebrow}>
          {links.map((link) => (
            <Link key={link.href} to={link.href}>
              <span>{link.label}</span>
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}

function FinalCta({ app }: { app: StudioApp }) {
  return (
    <section className={styles.finalCta} data-rf-final-cta>
      <div className={styles.finalConnector} aria-hidden="true">
        <span />
      </div>
      <div className={styles.finalCtaInner}>
        <div>
          <h2>Turn the next job post into a sharper draft.</h2>
          <p>Add RoleForge to Chrome.</p>
        </div>
        <ExternalAction href={app.storeUrl} label="Add to Chrome" />
      </div>
    </section>
  )
}

export function RoleForgeStory({
  app,
  comparisons,
  guides,
}: RoleForgeStoryProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const chapters = createChapters(app)

  useRoleForgeStoryMotion(rootRef)
  useHeroReady()

  return (
    <ProductStoryShell
      rootRef={rootRef}
      theme={roleForgeTheme}
      className={`${styles.page} product-theme product-theme-career product-page`}
    >
      <RoleForgeHero app={app} />
      <FactStrip app={app} />
      <RoleForgeRail chapters={chapters} />
      <ControlSection app={app} />
      <RoleForgeFaq app={app} />
      <EditorialLinks
        eyebrow="RoleForge guides"
        heading="Practical help before you apply."
        primaryLink={{
          href: '/roleforge/guides',
          label: 'View all guides',
        }}
        links={guides}
      />
      <EditorialLinks
        eyebrow="Compare RoleForge"
        heading="Compare tools before you apply."
        links={comparisons}
      />
      <FinalCta app={app} />
    </ProductStoryShell>
  )
}

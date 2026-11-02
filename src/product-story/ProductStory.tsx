import type {
  CSSProperties,
  ReactNode,
  RefObject,
} from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './ProductStory.module.css'

export type ProductStoryTheme = {
  background: string
  surface: string
  surfaceStrong: string
  ink: string
  muted: string
  accent: string
  accentStrong: string
  deep: string
  onDeep: string
}

export type ProductStoryAction = {
  href: string
  label: string
  external?: boolean
  primary?: boolean
}

export type ProductStoryDetail = {
  title: string
  body: string
}

export type ProductStoryChapterData = {
  id: string
  title: string
  imageSrc: string
  imageAlt: string
  details: ProductStoryDetail[]
  imageWidth?: number
  imageHeight?: number
  imageOrientation?: 'portrait' | 'landscape' | 'square'
  composition?: 'split' | 'quote' | 'center' | 'reverse' | 'completion'
  visualFocus?: 'full' | 'top' | 'center' | 'bottom'
  tone?: 'light' | 'dark'
}

type ProductStoryShellProps = {
  children: ReactNode
  className?: string
  rootRef: RefObject<HTMLDivElement | null>
  theme: ProductStoryTheme
}

type ProductStoryHeroProps = {
  actions: ProductStoryAction[]
  backHref: string
  backLabel: string
  brandLabel: string
  description: string
  heading: string
  iconAlt: string
  iconSrc: string
  visualAlt: string
  visualHeight?: number
  visualSrc: string
  visualWidth?: number
}

type ProductStoryRailProps = {
  chapters: ProductStoryChapterData[]
  connector?: 'none' | 'workflow' | 'rhythm'
  description: string
  heading: string
  id: string
  progressLabel?: string
  visualHeading?: string
}

type ProductStoryCtaProps = {
  action: ProductStoryAction
  description: string
  heading: string
}

function createThemeStyle(theme: ProductStoryTheme) {
  return {
    '--ps-background': theme.background,
    '--ps-surface': theme.surface,
    '--ps-surface-strong': theme.surfaceStrong,
    '--ps-ink': theme.ink,
    '--ps-muted': theme.muted,
    '--ps-accent': theme.accent,
    '--ps-accent-strong': theme.accentStrong,
    '--ps-deep': theme.deep,
    '--ps-on-deep': theme.onDeep,
  } as CSSProperties
}

function StoryAction({ action }: { action: ProductStoryAction }) {
  const className = action.primary
    ? styles.primaryAction
    : styles.secondaryAction

  if (action.external) {
    return (
      <a
        href={action.href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {action.label}
        <ArrowRight aria-hidden="true" size={17} />
      </a>
    )
  }

  if (action.href.startsWith('#')) {
    return (
      <a href={action.href} className={className}>
        {action.label}
        <ChevronRight aria-hidden="true" size={17} />
      </a>
    )
  }

  return (
    <Link to={action.href} className={className}>
      {action.label}
      <ArrowRight aria-hidden="true" size={17} />
    </Link>
  )
}

export function ProductStoryShell({
  children,
  className = '',
  rootRef,
  theme,
}: ProductStoryShellProps) {
  return (
    <div
      ref={rootRef}
      className={`${styles.shell} ${className}`}
      style={createThemeStyle(theme)}
      data-product-story-root
    >
      {children}
    </div>
  )
}

export function ProductStoryHero({
  actions,
  backHref,
  backLabel,
  brandLabel,
  description,
  heading,
  iconAlt,
  iconSrc,
  visualAlt,
  visualHeight = 1920,
  visualSrc,
  visualWidth = 1080,
}: ProductStoryHeroProps) {
  return (
    <section className={styles.hero} data-story-hero>
      <div className={styles.heroInner}>
        <div className={styles.heroCopy} data-story-hero-copy>
          <Link to={backHref} className={styles.backLink}>
            <ChevronRight aria-hidden="true" className={styles.backIcon} size={16} />
            {backLabel}
          </Link>

          <div className={styles.brandLockup} data-story-brand>
            <img
              src={iconSrc}
              alt={iconAlt}
              width="64"
              height="64"
              className={styles.brandIcon}
            />
            <span>{brandLabel}</span>
          </div>

          <div className={styles.headingMask}>
            <h1 className={styles.heroHeading} data-story-hero-heading>
              {heading}
            </h1>
          </div>

          <p className={styles.heroDescription} data-story-hero-description>
            {description}
          </p>

          <div className={styles.heroActions} data-story-hero-actions>
            {actions.map((action) => (
              <StoryAction key={`${action.href}-${action.label}`} action={action} />
            ))}
          </div>
        </div>

        <div className={styles.heroVisual} data-story-hero-visual>
          <img
            src={visualSrc}
            alt={visualAlt}
            width={visualWidth}
            height={visualHeight}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
    </section>
  )
}

function ProductChapterProgress({
  chapters,
  label,
}: {
  chapters: ProductStoryChapterData[]
  label: string
}) {
  return (
    <div
      className={styles.progress}
      aria-label={label}
      data-story-progress
    >
      <div
        className={styles.progressItems}
        style={
          {
            '--story-chapter-count': chapters.length,
          } as CSSProperties
        }
      >
        {chapters.map((chapter, index) => (
          <span
            key={chapter.id}
            className={styles.progressItem}
            data-story-progress-item
            data-active={index === 0 ? 'true' : 'false'}
            data-completed="false"
            aria-current={index === 0 ? 'step' : undefined}
          >
            <span className={styles.progressNumber} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>{chapter.title}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function ProductStoryChapter({
  chapter,
  index,
}: {
  chapter: ProductStoryChapterData
  index: number
}) {
  return (
    <section
      className={styles.chapter}
      data-story-chapter
      data-story-chapter-index={index}
      data-composition={chapter.composition ?? 'split'}
      data-tone={chapter.tone ?? 'light'}
      aria-labelledby={`${chapter.id}-title`}
    >
      <div className={styles.chapterInner}>
        <div className={styles.chapterCopy} data-story-chapter-copy>
          <div className={styles.chapterTitleMask}>
            <h3
              id={`${chapter.id}-title`}
              className={styles.chapterTitle}
              data-story-chapter-title
            >
              {chapter.title}
            </h3>
          </div>
          <div className={styles.chapterDetails} data-story-chapter-details>
            {chapter.details.map((detail) => (
              <div
                key={`${detail.title}-${detail.body}`}
                className={styles.chapterDetail}
              >
                {detail.title ? <h4>{detail.title}</h4> : null}
                <p>{detail.body}</p>
              </div>
            ))}
          </div>
        </div>

        <figure
          className={styles.visualStage}
          data-story-chapter-visual
          data-orientation={chapter.imageOrientation ?? 'portrait'}
          data-focus={chapter.visualFocus ?? 'center'}
        >
          <div className={styles.visualFrame}>
            <img
              src={chapter.imageSrc}
              alt={chapter.imageAlt}
              width={chapter.imageWidth ?? 1080}
              height={chapter.imageHeight ?? 1920}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
        </figure>
      </div>
    </section>
  )
}

export function ProductStoryRail({
  chapters,
  connector = 'none',
  description,
  heading,
  id,
  progressLabel = 'ServiceSphere story progress',
  visualHeading,
}: ProductStoryRailProps) {
  return (
    <section
      id={id}
      className={styles.storySection}
      data-story-section
      data-story-connector-type={connector}
    >
      <div className={styles.storyIntro}>
        <h2>{heading}</h2>
        <p>{description}</p>
        {visualHeading ? (
          <h2 className={styles.visualHeading}>{visualHeading}</h2>
        ) : null}
      </div>

      <div className={styles.storyViewport} data-story-viewport>
        <ProductChapterProgress chapters={chapters} label={progressLabel} />
        {connector !== 'none' ? (
          <div
            className={styles.workflowConnector}
            data-story-connector
            data-connector-type={connector}
            aria-hidden="true"
          >
            <span className={styles.workflowConnectorBase} />
            <span className={styles.workflowConnectorFill} />
            <span className={styles.workflowConnectorMarker} />
          </div>
        ) : null}
        <div className={styles.storyTrack} data-story-track>
          {chapters.map((chapter, index) => (
            <ProductStoryChapter
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

export function ProductStoryCta({
  action,
  description,
  heading,
}: ProductStoryCtaProps) {
  return (
    <section className={styles.cta} data-story-cta>
      <div className={styles.ctaCompletion} aria-hidden="true">
        <span />
      </div>
      <div className={styles.ctaInner}>
        <div>
          <h2>{heading}</h2>
          <p>{description}</p>
        </div>
        <StoryAction action={{ ...action, primary: true }} />
      </div>
    </section>
  )
}

import { useHeroReady } from '../product-story/useHeroReady'
import { useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { StudioApp } from '../data/apps'
import { ProductStoryShell } from '../product-story/ProductStory'
import { createLearnLiftConfig, learnLiftFeatures } from './learnLiftConfig'
import { useLearnLiftMotion } from './useLearnLiftMotion'
import styles from './LearnLiftStory.module.css'

function StoreLink({ href }: { href: string }) {
  return <a href={href} target="_blank" rel="noreferrer" className={styles.storeLink}>
    Get it on Google Play <ArrowRight size={18} aria-hidden="true" />
  </a>
}

function Faq({ items }: { items: StudioApp['faq'] }) {
  const [open, setOpen] = useState<number[]>([])
  return <section className={`${styles.section} ${styles.faq}`} aria-labelledby="learnlift-faq-heading">
    <div className={styles.container}>
      <p className={styles.label}>LearnLift AI FAQ</p>
      <h2 id="learnlift-faq-heading">Questions before you start</h2>
      <div className={styles.faqList}>
        {items.map((item, index) => {
          const expanded = open.includes(index)
          return <article key={item.question}>
            <h3><button id={`ll-question-${index}`} aria-expanded={expanded} aria-controls={`ll-answer-${index}`}
              onClick={() => setOpen(current => expanded ? current.filter(value => value !== index) : [...current, index])}>
              {item.question}<Plus size={22} aria-hidden="true" className={expanded ? styles.openIcon : ''} />
            </button></h3>
            <div id={`ll-answer-${index}`} role="region" aria-labelledby={`ll-question-${index}`} hidden={!expanded}>
              <p>{item.answer}</p>
            </div>
          </article>
        })}
      </div>
    </div>
  </section>
}

export function LearnLiftStory({ app }: { app: StudioApp }) {
  const root = useRef<HTMLDivElement>(null)
  const config = useMemo(() => createLearnLiftConfig(app), [app])
  useLearnLiftMotion(root, config)
  useHeroReady()

  return <ProductStoryShell rootRef={root} theme={config.theme} className={styles.page}>
    <section className={styles.hero} data-ll-hero>
      <div className={styles.heroAccent} data-ll-hero-accent aria-hidden="true" />
      <div className={`${styles.container} ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <Link to="/apps" className={styles.back}><ArrowLeft size={16} aria-hidden="true" />Back to DCP Labs apps</Link>
          <div className={styles.identity} data-ll-identity>
            <img src={config.icon} width="56" height="56" alt="LearnLift AI app icon" />
            <span>Elevate Your Skills, Effortlessly.</span>
          </div>
          <div className={styles.headingMask}><h1 data-ll-hero-title>A study coach for focused daily practice.</h1></div>
          <p className={styles.heroDescription} data-ll-hero-description>LearnLift AI helps learners practice English, job interview preparation, and IT/QA topics through short guided study sessions, flashcards, quizzes, and progress review.</p>
          <div className={styles.actions} data-ll-hero-actions>
            <StoreLink href={config.storeUrl} />
            <Link to="/apps" className={styles.secondary}>Explore DCP Labs apps<ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
          <ul className={styles.facts}>{app.storeFacts.map(fact => <li key={fact}>{fact}</li>)}</ul>
        </div>
        <figure className={styles.heroVisual} data-ll-hero-visual>
          <img src={app.screenshots[0]} width="1280" height="2293" fetchPriority="high" loading="eager"
            alt="LearnLift AI app screenshot showing the home study coach dashboard with flashcards quizzes smart review and study plans" />
        </figure>
      </div>
    </section>
    <div className={styles.topics}><ul className={styles.container}>
      {['English practice', 'Interview preparation', 'IT & QA learning', 'Short daily sessions'].map(text => <li key={text}>{text}</li>)}
    </ul></div>

    <section className={`${styles.section} ${styles.why}`}>
      <div className={`${styles.container} ${styles.explanation}`}>
        <p className={styles.label}>Why it exists</p>
        <h2>Learning for interviews and QA can get scattered.</h2>
        <div className={styles.explanationBody}>
          <p>A learner might have English notes in one place, interview questions somewhere else, and QA practice split across saved links. LearnLift AI gives that practice a simple structure: choose a path, complete a short session, review weak topics, and come back tomorrow.</p>
          <p>The page focuses on visible app features: study paths, flashcards, quizzes, Smart Review, progress review, and Premium Study Packs.</p>
        </div>
      </div>
    </section>

    <section aria-labelledby="learnlift-story-heading" className={styles.story}>
      <div className={`${styles.container} ${styles.storyIntro}`}>
        <p className={styles.label}>Real app screens</p>
        <h2 id="learnlift-story-heading">Study paths, review, and progress in one flow.</h2>
        <p>Screenshots show the current Android experience, including path selection, Smart Review flashcards, progress signals, and premium practice packs.</p>
      </div>
      <div className={styles.viewport} data-ll-viewport>
        <ol className={styles.progress} aria-label="LearnLift AI study stages" data-ll-progress>
          {config.chapters.map((chapter, index) => <li key={chapter.id} data-ll-step data-active={index === 0} data-completed="false" aria-current={index === 0 ? 'step' : undefined}>
            <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}<Check size={15} /></span>
            <span className={styles.stepLabel}>{chapter.title}</span>
          </li>)}
        </ol>
        <div className={styles.track} data-ll-track>
          {config.chapters.map((chapter, index) => <section key={chapter.id} id={chapter.id} aria-labelledby={`${chapter.id}-heading`}
            className={styles.chapter} data-ll-chapter data-ll-motion={chapter.motion} data-orientation={config.orientation}>
            <div className={styles.chapterTone} style={{ background: chapter.tone }} aria-hidden="true" data-ll-tone />
            <div className={styles.chapterInner}>
              <div className={styles.chapterCopy}>
                <span className={styles.chapterNumber} data-ll-label aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div className={styles.headingMask}><h3 id={`${chapter.id}-heading`} data-ll-title>{chapter.title}</h3></div>
                <p className={styles.chapterDescription} data-ll-description>{chapter.body}</p>
                <div className={styles.chapterDetail} data-ll-detail><h4>{chapter.feature.title}</h4><p>{chapter.feature.body}</p></div>
              </div>
              <figure className={styles.visualStage} data-ll-visual>
                <div className={styles.device}><img src={chapter.image} alt={chapter.alt} width="1280" height="2850" loading={index < 2 ? 'eager' : 'lazy'} decoding="async" /></div>
              </figure>
            </div>
          </section>)}
        </div>
      </div>
    </section>

    <section className={`${styles.section} ${styles.support}`}>
      <div className={styles.container}>
        <p className={styles.label}>Study coach app</p>
        <h2>Built for short sessions that are easy to repeat.</h2>
        <dl className={styles.studyDetails}>{[learnLiftFeatures[1], learnLiftFeatures[2]].map(item => <div key={item.title}><dt><h3>{item.title}</h3></dt><dd>{item.body}</dd></div>)}</dl>
        <div className={styles.audience}>
          <div><p className={styles.label}>Who it is for</p><h2>For learners who want a clearer next step.</h2></div>
          <ul>{app.audience.map(item => <li key={item}><Check size={20} aria-hidden="true" /><span>{item}</span></li>)}</ul>
        </div>
      </div>
    </section>
    <Faq items={app.faq} />
    <section className={`${styles.section} ${styles.closing}`}>
      <div className={styles.container}>
        <img src={config.icon} width="64" height="64" alt="" aria-hidden="true" />
        <h2>Start with one focused study session.</h2>
        <p>Download LearnLift AI from Google Play and practice English, interview preparation, or QA topics in small steps.</p>
        <StoreLink href={config.storeUrl} />
      </div>
    </section>
  </ProductStoryShell>
}

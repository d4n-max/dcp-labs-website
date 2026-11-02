import { useHeroReady } from '../product-story/useHeroReady'
import { useRef } from 'react'
import { ArrowLeft, ArrowRight, HandHeart } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { StudioApp } from '../data/apps'
import { ProductStoryShell } from '../product-story/ProductStory'
import { kinBriefActions, kinBriefAudience, kinBriefChapters, kinBriefDifferences, kinBriefTheme } from './kinBriefConfig'
import { useKinBriefMotion } from './useKinBriefMotion'
import styles from './KinBriefStory.module.css'

function Actions() {
  return <div className={styles.actions} data-kb-actions>{kinBriefActions.map((action, index) =>
    <a key={action.href} href={action.href} target="_blank" rel="noreferrer" className={index === 0 ? styles.primary : styles.secondary}>
      {action.label}<ArrowRight size={17} aria-hidden="true" />
    </a>)}</div>
}

export function KinBriefStory({ app }: { app: StudioApp }) {
  const root = useRef<HTMLDivElement>(null)
  useKinBriefMotion(root)
  useHeroReady()
  return <ProductStoryShell rootRef={root} theme={kinBriefTheme} className={styles.page}>
    <section className={styles.hero} data-kb-hero>
      <div className={styles.container}>
        <Link to="/apps" className={styles.back}><ArrowLeft size={16} aria-hidden="true" />Back to DCP Labs apps</Link>
        <div className={styles.heroTop}>
          <div className={styles.identity} data-kb-identity>
            <img src={app.iconImage} alt="KinBrief app icon" width="52" height="52" />
            <div><strong>KinBrief</strong><span>Family care, clearly coordinated</span></div>
          </div>
          <p className={styles.category}>Family care coordination software</p>
        </div>
        <div className={styles.heroGrid}>
          <div className={styles.mask}><h1 data-kb-hero-title>A calmer weekly care plan for families helping an aging parent.</h1></div>
          <div className={styles.heroSupport}>
            <p data-kb-hero-description>KinBrief helps families turn scattered notes, tasks, documents, and updates into one clear weekly plan.</p>
            <Actions />
          </div>
        </div>
        <div className={styles.heroRule} data-kb-accent aria-hidden="true" />
        <figure className={styles.heroVisual} data-kb-hero-visual>
          <img src={app.screenshots[0]} width="1768" height="879" alt={kinBriefChapters[2].alt} loading="eager" fetchPriority="high" />
        </figure>
        <ul className={styles.facts}>{app.storeFacts.map(fact => <li key={fact}>{fact}</li>)}</ul>
      </div>
    </section>
    <section className={`${styles.container} ${styles.intro}`}>
      <p className={styles.label}>Product overview</p>
      <h2>Turn family care chaos into one clear weekly plan.</h2>
      <p>KinBrief gives families a shared place to collect the care details that usually live across texts, calls, folders, and memory, then shape them into an update everyone can understand.</p>
    </section>
    <section className={styles.story} aria-label="KinBrief product overview">
      <div className={styles.viewport} data-kb-viewport>
        <ol className={styles.progress} aria-label="KinBrief story progress">
          {kinBriefChapters.map((chapter, index) => <li key={chapter.id} data-kb-step aria-label={chapter.title} data-active={index === 0} data-completed="false" aria-current={index === 0 ? 'step' : undefined}>
            <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span className={styles.stepTitle}>{chapter.title}</span>
          </li>)}
        </ol>
        <div className={styles.track}>
          {kinBriefChapters.map((chapter, index) => <section key={chapter.id} className={styles.chapter} data-kb-chapter data-view={chapter.view} aria-labelledby={`${chapter.id}-heading`}>
            <div className={styles.chapterInner}>
              <div className={styles.chapterCopy}>
                <div className={styles.mask}><h3 id={`${chapter.id}-heading`} data-kb-title>{chapter.title}</h3></div>
                <p data-kb-description>{chapter.body}</p>
                {index === 2 && <div className={styles.summary} data-kb-detail><h4>Family-ready summaries</h4><p>Share one calmer update instead of rewriting the same thread.</p></div>}
              </div>
              <figure className={styles.visual} data-kb-visual>
                <div className={styles.pan} data-kb-pan tabIndex={0} role="region" aria-label={`${chapter.caption}, horizontally scrollable on small screens`}><div className={styles.crop}><img src={app.screenshots[0]} alt={chapter.alt} width="1768" height="879" loading="eager" decoding="async" /></div></div>
                <figcaption>{chapter.caption}</figcaption>
              </figure>
            </div>
          </section>)}
        </div>
      </div>
    </section>
    <section className={`${styles.container} ${styles.support}`}>
      <div className={styles.document}><h3>Important documents</h3><p>Keep the family pointed to the records that matter.</p></div>
      <div className={styles.audience}>
        <div><p className={styles.label}>Who it is for</p><h2>A shared plan for the people helping.</h2></div>
        <div><p>KinBrief is for adult children, siblings, spouses, relatives, trusted friends, and informal caregivers coordinating care for an aging parent.</p>
          <ul>{kinBriefAudience.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
      <div className={styles.differences}>
        <p className={styles.label}>What makes it different</p><h2>Built around the weekly care questions.</h2>
        <ol>{kinBriefDifferences.map(item => <li key={item}>{item}</li>)}</ol>
      </div>
    </section>
    <section className={styles.safety}>
      <div className={styles.container}><HandHeart size={32} aria-hidden="true" />
        <h2>Coordination only, with a clear safety boundary.</h2>
        <p>KinBrief helps families coordinate care information. It does not diagnose, treat, or replace professional medical advice.</p>
      </div>
    </section>
    <section className={`${styles.container} ${styles.faq}`} aria-labelledby="kb-faq-heading">
      <h2 id="kb-faq-heading">KinBrief FAQ</h2>
      {app.faq.map((item, index) => <details key={item.question}>
        <summary><h3>{item.question}</h3></summary><p id={`kb-answer-${index}`}>{item.answer}</p>
      </details>)}
    </section>
    <section className={styles.closing} data-kb-closing>
      <div className={styles.container}>
        <figure data-kb-closing-visual><img src={app.screenshots[0]} alt={kinBriefChapters[2].alt} width="1768" height="879" loading="lazy" decoding="async" /></figure>
        <div className={styles.closingCopy} data-kb-closing-copy><h2>Start with one weekly care update.</h2><p>Visit KinBrief or try the free weekly care update generator.</p><Actions /></div>
      </div>
    </section>
  </ProductStoryShell>
}

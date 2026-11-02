import type { StudioApp } from '../data/apps'
import type { ProductStoryTheme } from '../product-story/ProductStory'

// Copy is migrated verbatim from the original LearnLift product page.
export const learnLiftTheme: ProductStoryTheme = {
  background: '#eee7fa', surface: '#f3edfb', surfaceStrong: '#e2d6f3',
  ink: '#291b43', muted: '#655575', accent: '#553c9a',
  accentStrong: '#ed64a6', deep: '#39245f', onDeep: '#faf5ff',
}

export const learnLiftFeatures = [
  { title: 'Guided study sessions', body: 'Start from a chosen path and move through focused practice without rebuilding a study plan every day.' },
  { title: 'English practice', body: 'Use vocabulary and speaking prep paths for practical workplace English practice.' },
  { title: 'Job interview preparation', body: 'Review common interview themes, behavioral questions, and answer structure in small steps.' },
  { title: 'IT and QA learning topics', body: 'Practice QA, SQL, automation, and technical interview topics through available study packs.' },
  { title: 'Progress-friendly structure', body: 'Track weak topics and review signals so it is easier to decide what to practice next.' },
  { title: 'Smart Review flashcards', body: 'Return to due cards and mark what is known or needs review during short flashcard sessions.' },
] as const

export function createLearnLiftConfig(app: StudioApp) {
  return {
    theme: learnLiftTheme,
    orientation: 'portrait' as const,
    progress: 'study-stages' as const,
    storeUrl: app.storeUrl,
    icon: app.iconImage,
    chapters: [
      { id: 'learnlift-path', title: 'Choose a focused path',
        body: 'Start with English vocabulary, job interview prep, or a technical study path so practice has a clear next step.',
        alt: 'LearnLift AI screenshot showing selectable study paths for English vocabulary and job interview prep',
        image: app.screenshots[1], feature: learnLiftFeatures[0], motion: 'path', tone: '#eee7fa' },
      { id: 'learnlift-flashcards', title: 'Review with flashcards',
        body: 'Flashcard practice keeps questions, answer reveal, and session review in a focused flow.',
        alt: 'LearnLift AI screenshot showing flashcard preview practice with answer reveal and session review',
        image: app.screenshots[2], feature: learnLiftFeatures[5], motion: 'review', tone: '#f5e5f0' },
      { id: 'learnlift-progress', title: 'Track weak topics',
        body: 'Progress review highlights topics that need more practice without turning learning into a complicated dashboard.',
        alt: 'LearnLift AI screenshot showing daily progress and weak topics to review',
        image: app.screenshots[3], feature: learnLiftFeatures[4], motion: 'progress', tone: '#e5def5' },
      { id: 'learnlift-premium', title: 'Go deeper with Premium',
        body: 'Premium packs add focused practice areas such as SQL, QA, and automation basics.',
        alt: 'LearnLift AI screenshot showing premium study packs for SQL QA and automation practice',
        image: app.screenshots[4], feature: learnLiftFeatures[3], motion: 'continue', tone: '#efe2f4' },
    ],
  }
}

export type LearnLiftConfig = ReturnType<typeof createLearnLiftConfig>

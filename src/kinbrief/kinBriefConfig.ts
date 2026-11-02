import type { ProductStoryTheme } from '../product-story/ProductStory'

// Tokens from the existing KinBrief route, familycare theme and app catalog.
export const kinBriefTheme: ProductStoryTheme = {
  background: '#F3F7FB', surface: '#F7FAFD', surfaceStrong: '#FFFFFF',
  ink: '#111827', muted: '#526179', accent: '#2563EB',
  accentStrong: '#1747B6', deep: '#172033', onDeep: '#FFFFFF',
}
export const kinBriefActions = [
  { label: 'Visit KinBrief', href: 'https://kinbrief.app' },
  { label: 'Try the weekly care update generator', href: 'https://kinbrief.app/tools/weekly-care-update-generator' },
]
export const kinBriefChapters = [
  { id: 'kb-notes', title: 'Notes from calls and appointments', body: 'Collect rough notes before they disappear into chats.', view: 'notes', caption: 'Dashboard detail: care plan and Paste notes', alt: 'Existing KinBrief dashboard detail showing the active care plan and Paste notes action' },
  { id: 'kb-tasks', title: 'Shared tasks and follow-ups', body: 'Keep owners, dates, and open loops visible.', view: 'tasks', caption: 'Dashboard detail: Today, Overdue, and Coming up next', alt: 'Existing KinBrief dashboard detail showing Today, Overdue, and Coming up next' },
  { id: 'kb-week', title: 'Weekly care updates', body: 'Turn the week into a clear family-ready summary.', view: 'overview', caption: 'KinBrief dashboard', alt: 'KinBrief dashboard showing weekly care priorities, overdue items, upcoming follow-ups, and family responsibilities' },
] as const
export const kinBriefAudience = ['Adult children', 'Siblings', 'Spouses', 'Relatives', 'Trusted friends', 'Informal caregivers']
export const kinBriefDifferences = [
  'Built around a weekly care plan, not a generic task list.',
  'Shows what changed, what is overdue, who is doing what, and what needs attention next.',
  'Uses review-first AI support, where suggestions are reviewed before being saved.',
  'Focused on family coordination only, not medical advice.',
]

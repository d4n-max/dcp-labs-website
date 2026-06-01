import {
  BadgeCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  Coins,
  ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import coinrelicAchievements from '../assets/products/coinrelic-achievements.png'
import coinrelicCollection from '../assets/products/coinrelic-collection.png'
import coinrelicIcon from '../assets/products/coinrelic-icon.png'
import coinrelicScan from '../assets/products/coinrelic-scan.png'
import coinrelicValue from '../assets/products/coinrelic-value.png'
import roleforgeAnalyze from '../assets/products/roleforge-analyze-any-job-post.png'
import roleforgeBundle from '../assets/products/roleforge-download-application-bundle.png'
import roleforgeCoverLetters from '../assets/products/roleforge-draft-cover-letters.png'
import roleforgeIcon from '../assets/products/roleforge-icon.svg'
import roleforgeMatchedSkills from '../assets/products/roleforge-review-matched-skills.png'
import roleforgeResumeBullets from '../assets/products/roleforge-rewrite-resume-bullets.png'

export type AppCategory =
  | 'All'
  | 'Android'
  | 'Chrome Extension'
  | 'Collectors'
  | 'Career'
  | 'Productivity'

export type StudioApp = {
  slug: string
  name: string
  category: string
  filters: Exclude<AppCategory, 'All'>[]
  status: 'Live'
  platform: string
  storeLabel: string
  storeUrl: string
  shortDescription: string
  description: string
  heroLine: string
  problem: string
  benefits: string[]
  features: string[]
  audience: string[]
  faq: { question: string; answer: string }[]
  cta: string
  icon: LucideIcon
  accent: string
  secondaryAccent: string
  code: string
  visualStyle: 'collector' | 'career'
  iconImage?: string
  screenshots: string[]
  storeFacts: string[]
}

export const apps: StudioApp[] = [
  {
    slug: 'coinrelic',
    name: 'CoinRelic',
    category: 'Coin identification and collection tracking',
    filters: ['Android', 'Collectors', 'Productivity'],
    status: 'Live',
    platform: 'Android app',
    storeLabel: 'Get it on Google Play',
    storeUrl:
      'https://play.google.com/store/apps/details?id=com.coinlens.coinlens',
    shortDescription:
      'Identify coins, save scan history, organize notes, and build a cleaner digital catalog.',
    description:
      'CoinRelic helps collectors scan coins, review identification details, save notes, and organize discoveries in a digital collection.',
    heroLine:
      'A mobile workspace for identifying coins, saving scan history, and keeping collection notes organized.',
    problem:
      'Coin finds often start with a photo, a guess, and scattered notes. CoinRelic gives collectors one place to scan, save, compare, and revisit each discovery.',
    benefits: [
      'Identify old, rare, world, commemorative, and everyday coins from a camera scan.',
      'Save coins with scan history, photos, value context, and collector notes.',
      'Track watchlists, top finds, and collection details as the catalog grows.',
    ],
    features: [
      'Camera-based coin identification',
      'Estimated value and rarity context',
      'Digital collection catalog',
      'Scan history and saved photos',
      'Collector notes, condition details, and watchlists',
      'Expert review and premium collector tools',
    ],
    audience: [
      'Coin collectors and hobbyists',
      'People sorting inherited or estate-sale collections',
      'Metal detectorists and antique enthusiasts',
      'Collectors who want organized notes and scan history',
    ],
    faq: [
      {
        question: 'What can CoinRelic help identify?',
        answer:
          'CoinRelic is designed for old coins, world coins, rare finds, commemoratives, bullion, and everyday coins collectors want to research and organize.',
      },
      {
        question: 'Can I save coins after scanning them?',
        answer:
          'Yes. You can save scanned coins with details, photos, scan history, and collector notes.',
      },
      {
        question: 'Are value estimates guaranteed?',
        answer:
          'No. Value estimates are informational. Condition, demand, authenticity, grading, errors, and sale venue can all affect real market value.',
      },
    ],
    cta: 'Get it on Google Play',
    icon: Coins,
    accent: '#D6A94B',
    secondaryAccent: '#285A78',
    code: 'CR',
    visualStyle: 'collector',
    iconImage: coinrelicIcon,
    screenshots: [
      coinrelicScan,
      coinrelicValue,
      coinrelicCollection,
      coinrelicAchievements,
    ],
    storeFacts: ['Live on Google Play', 'Android app', 'Collector tools'],
  },
  {
    slug: 'roleforge',
    name: 'RoleForge',
    category: 'Job application preparation',
    filters: ['Chrome Extension', 'Career', 'Productivity'],
    status: 'Live',
    platform: 'Chrome extension',
    storeLabel: 'Add to Chrome',
    storeUrl:
      'https://chromewebstore.google.com/detail/hdalojniclbnhkholcnhdkjkecggmifd?utm_source=item-share-cb',
    shortDescription:
      'Turn live job postings into tailored resumes, cover letters, form answers, and interview notes.',
    description:
      'RoleForge extracts role requirements from live job postings, compares them with saved experience, and drafts application materials users can review and edit.',
    heroLine:
      'Turn the job post in front of you into resume bullets, cover letters, form answers, and interview notes you can review before applying.',
    problem:
      'Every role asks for something different. RoleForge helps job seekers understand the posting, match their experience, and prepare role-specific drafts.',
    benefits: [
      'Extract requirements, skills, and themes from live job posting pages.',
      'Compare role requirements against saved experience, skills, and target roles.',
      'Draft resumes, cover letters, form answers, and interview notes for review and editing.',
    ],
    features: [
      'Live job posting analysis',
      'Matched skills and requirements review',
      'Role-specific resume summaries and bullets',
      'Cover letter draft generation',
      'Application form answer support',
      'Downloadable application bundle',
    ],
    audience: [
      'Job seekers applying to multiple roles',
      'Career switchers reframing their experience',
      'Professionals who want faster application preparation',
      'Candidates tailoring materials for a specific job post',
    ],
    faq: [
      {
        question: 'Does RoleForge apply to jobs automatically?',
        answer:
          'No. RoleForge helps draft application materials. You review, edit, copy, and decide what to submit.',
      },
      {
        question: 'Does RoleForge replace my resume?',
        answer:
          'No. It uses your saved experience as source material and helps adapt it to each role.',
      },
      {
        question: 'What can RoleForge generate?',
        answer:
          'RoleForge can draft resume summaries, resume bullets, cover letters, application form answers, and interview preparation notes.',
      },
      {
        question: 'Does it work on every job site?',
        answer:
          'RoleForge works with many job posting pages and recruiting sites. Results can vary depending on how each page is structured.',
      },
    ],
    cta: 'Add to Chrome',
    icon: BriefcaseBusiness,
    accent: '#8B5CF6',
    secondaryAccent: '#38BDF8',
    code: 'RF',
    visualStyle: 'career',
    iconImage: roleforgeIcon,
    screenshots: [
      roleforgeAnalyze,
      roleforgeMatchedSkills,
      roleforgeResumeBullets,
      roleforgeCoverLetters,
      roleforgeBundle,
    ],
    storeFacts: ['Live on Chrome Web Store', 'Chrome extension', 'Job-search tool'],
  },
]

export const appBySlug: Record<string, StudioApp> = Object.fromEntries(
  apps.map((app) => [app.slug, app]),
)

export const trustSignals: Array<{ label: string; icon: LucideIcon }> = [
  { label: 'Two live products', icon: BadgeCheck },
  { label: 'Built for practical use cases', icon: ClipboardCheck },
  { label: 'Direct links to official stores', icon: ShieldCheck },
]

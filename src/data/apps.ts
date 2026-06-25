import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarCheck,
  ClipboardCheck,
  Coins,
  GraduationCap,
  HeartPulse,
  ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import coinrelicAchievements from '../assets/products/coinrelic-achievements.png'
import coinrelicCollection from '../assets/products/coinrelic-collection.png'
import coinrelicIcon from '../assets/products/coinrelic-icon.png'
import coinrelicScan from '../assets/products/coinrelic-scan.png'
import coinrelicValue from '../assets/products/coinrelic-value.png'
import caretailAllCare from '../assets/products/caretail-all-care.png'
import caretailDashboard from '../assets/products/caretail-dashboard.png'
import caretailDiary from '../assets/products/caretail-diary.png'
import caretailDocuments from '../assets/products/caretail-documents.png'
import caretailFeature from '../assets/products/caretail-feature.png'
import caretailIcon from '../assets/products/caretail-icon.png'
import caretailProfile from '../assets/products/caretail-profile.png'
import caretailReminders from '../assets/products/caretail-reminders.png'
import learnliftHome from '../assets/products/learnlift-home.png'
import learnliftIcon from '../assets/products/learnlift-icon.png'
import learnliftRawFlashcards from '../assets/products/learnlift-raw-flashcards.png'
import learnliftRawPremium from '../assets/products/learnlift-raw-premium.png'
import learnliftRawProgress from '../assets/products/learnlift-raw-progress.png'
import learnliftRawStudyPaths from '../assets/products/learnlift-raw-study-paths.png'
import roleforgeAnalyze from '../assets/products/roleforge-analyze-any-job-post.png'
import roleforgeBundle from '../assets/products/roleforge-download-application-bundle.png'
import roleforgeCoverLetters from '../assets/products/roleforge-draft-cover-letters.png'
import roleforgeIcon from '../assets/products/roleforge-icon.svg'
import roleforgeMatchedSkills from '../assets/products/roleforge-review-matched-skills.png'
import roleforgeResumeBullets from '../assets/products/roleforge-rewrite-resume-bullets.png'
import servicesphereClientRecords from '../assets/products/servicesphere-client-records.jpg'
import servicesphereIcon from '../assets/products/servicesphere-icon.png'
import servicesphereManageJobs from '../assets/products/servicesphere-manage-jobs.jpg'
import servicesphereMobileOffice from '../assets/products/servicesphere-mobile-office.jpg'
import servicespherePhotosSignatures from '../assets/products/servicesphere-photos-signatures.jpg'
import servicesphereQuotesInvoices from '../assets/products/servicesphere-quotes-invoices.jpg'
import servicesphereSmallBusinesses from '../assets/products/servicesphere-small-businesses.jpg'
import servicesphereTrackWork from '../assets/products/servicesphere-track-work.jpg'

export type AppCategory =
  | 'All'
  | 'Android'
  | 'Chrome Extension'
  | 'Collectors'
  | 'Pets'
  | 'Career'
  | 'Education'
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
  visualStyle: 'collector' | 'career' | 'petcare' | 'learning' | 'fieldservice'
  iconImage?: string
  screenshots: string[]
  storeFacts: string[]
}

export const apps: StudioApp[] = [
  {
    slug: 'servicesphere-field-service-app',
    name: 'ServiceSphere',
    category: 'Field service app',
    filters: ['Android', 'Productivity'],
    status: 'Live',
    platform: 'Android app',
    storeLabel: 'Get it on Google Play',
    storeUrl:
      'https://play.google.com/store/apps/details?id=com.servicesphere.app',
    shortDescription:
      'Run clients, quotes, jobs, invoices, photos, notes, routes, and signatures from one Android app.',
    description:
      'ServiceSphere helps solo tradespeople and small service businesses manage clients, quotes, jobs, invoices, photos, notes, routes, and signatures without enterprise complexity.',
    heroLine:
      'Your Complete Field Service Ecosystem for running service work from your phone.',
    problem:
      'Service jobs often get split across paper notes, message threads, spreadsheets, photos, and memory. ServiceSphere keeps the core workflow together on Android.',
    benefits: [
      'Keep client records, job context, quotes, invoices, photos, notes, and signatures in one mobile workspace.',
      'Track each job from request to quote, service visit, invoice, and follow-up.',
      'Use a practical field service app built for solo tradespeople and small service businesses.',
    ],
    features: [
      'Client records',
      'Job tracking',
      'Quotes and invoices',
      'Photos and notes',
      'Client signatures',
      'Routes and scheduling context',
      'Business profile settings',
      'Small service business workflow',
    ],
    audience: [
      'Handymen and repair technicians',
      'Cleaners and small cleaning crews',
      'Landscapers and mobile service providers',
      'Plumbers, electricians, HVAC techs, and appliance repair businesses',
    ],
    faq: [
      {
        question: 'What is ServiceSphere?',
        answer:
          'ServiceSphere is an Android field service app for managing clients, quotes, jobs, invoices, photos, notes, routes, and signatures from a phone.',
      },
      {
        question: 'Who is ServiceSphere for?',
        answer:
          'ServiceSphere is built for solo tradespeople and small service businesses such as handymen, cleaners, landscapers, plumbers, electricians, HVAC techs, mobile mechanics, and appliance repair providers.',
      },
      {
        question: 'Is ServiceSphere only for large field service companies?',
        answer:
          'No. ServiceSphere is intentionally positioned for solo contractors and small service teams that want practical job organization without enterprise CRM complexity.',
      },
      {
        question: 'Can I use ServiceSphere as a solo tradesperson?',
        answer:
          'Yes. The app is designed around phone-first workflows for people managing service work directly in the field.',
      },
      {
        question: 'What can I track in ServiceSphere?',
        answer:
          'You can organize client details, service jobs, quotes, invoices, job notes, photos, signatures, reminders, and route context visible in the app experience.',
      },
      {
        question: 'Does ServiceSphere help with quotes and invoices?',
        answer:
          'Yes. ServiceSphere includes quote and invoice workflows for creating estimates, managing work, and billing clients from Android.',
      },
      {
        question: 'Can I keep job photos and notes organized?',
        answer:
          'Yes. ServiceSphere includes job details, photo proof, job notes, and client signature workflows so work context stays attached to the job.',
      },
      {
        question: 'Is ServiceSphere available on Android?',
        answer:
          'Yes. ServiceSphere is available through its official Google Play listing.',
      },
    ],
    cta: 'Get it on Google Play',
    icon: CalendarCheck,
    accent: '#7C3AED',
    secondaryAccent: '#4338CA',
    code: 'SS',
    visualStyle: 'fieldservice',
    iconImage: servicesphereIcon,
    screenshots: [
      servicesphereMobileOffice,
      servicesphereManageJobs,
      servicesphereClientRecords,
      servicesphereQuotesInvoices,
      servicespherePhotosSignatures,
      servicesphereTrackWork,
      servicesphereSmallBusinesses,
    ],
    storeFacts: ['Live on Google Play', 'Android app', 'Field service app'],
  },
  {
    slug: 'learnlift-ai',
    name: 'LearnLift AI',
    category: 'Study coach app',
    filters: ['Android', 'Education', 'Career', 'Productivity'],
    status: 'Live',
    platform: 'Android app',
    storeLabel: 'Get it on Google Play',
    storeUrl:
      'https://play.google.com/store/apps/details?id=com.learnliftai.app',
    shortDescription:
      'Practice English, job interview prep, and IT/QA topics through short guided study sessions.',
    description:
      'LearnLift AI helps learners build consistent practice around English, interview preparation, and IT/QA learning topics with flashcards, quizzes, progress review, and bite-sized study paths.',
    heroLine:
      'A focused Android study coach for English practice, interview preparation, and IT/QA learning in small daily steps.',
    problem:
      'Interview prep, English practice, and technical QA learning can feel scattered across notes, videos, and saved questions. LearnLift AI gives learners one calm place to choose a path, practice, review, and track progress.',
    benefits: [
      'Choose focused study paths for English, job interview preparation, and technical learning.',
      'Practice with flashcards, quizzes, and short sessions designed for consistency.',
      'Review weak topics and progress signals so the next study step is easier to choose.',
    ],
    features: [
      'Guided study sessions',
      'English vocabulary and speaking prep',
      'Job interview preparation',
      'IT and QA learning topics',
      'Smart Review flashcards',
      'Progress and weak-topic review',
      'Bite-sized daily practice',
      'Premium study packs',
    ],
    audience: [
      'QA testers preparing for web or software QA interviews',
      'People improving English for work',
      'Beginners who want structured learning paths',
      'Job seekers building consistent interview practice',
    ],
    faq: [
      {
        question: 'What is LearnLift AI for?',
        answer:
          'LearnLift AI is a study coach app for short guided practice around English, interview preparation, and IT/QA learning topics.',
      },
      {
        question: 'Does LearnLift AI guarantee interview results?',
        answer:
          'No. LearnLift AI supports practice and preparation, but interview outcomes depend on the role, the candidate, and the full hiring process.',
      },
      {
        question: 'What study modes are visible in the app?',
        answer:
          'The current app experience shows study paths, flashcards, quizzes, Smart Review, weak-topic progress review, and premium study packs.',
      },
      {
        question: 'Is LearnLift AI available on Android?',
        answer:
          'Yes. LearnLift AI is linked from DCP Labs to its official Google Play listing.',
      },
    ],
    cta: 'Get it on Google Play',
    icon: GraduationCap,
    accent: '#553C9A',
    secondaryAccent: '#ED64A6',
    code: 'LL',
    visualStyle: 'learning',
    iconImage: learnliftIcon,
    screenshots: [
      learnliftHome,
      learnliftRawStudyPaths,
      learnliftRawFlashcards,
      learnliftRawProgress,
      learnliftRawPremium,
    ],
    storeFacts: ['Live on Google Play', 'Android app', 'Study coach app'],
  },
  {
    slug: 'caretail',
    name: 'CareTail',
    category: 'Pet care tracker',
    filters: ['Android', 'Pets', 'Productivity'],
    status: 'Live',
    platform: 'Android app',
    storeLabel: 'Get it on Google Play',
    storeUrl:
      'https://play.google.com/store/apps/details?id=com.caretail.app',
    shortDescription:
      'Organize pet profiles, care reminders, diary notes, documents, and records in one calm place.',
    description:
      'CareTail helps pet owners organize pet profiles, reminders, diary notes, documents, care history, and reports without keeping every detail in their head.',
    heroLine:
      'A calm pet care tracker for profiles, reminders, diary notes, documents, and care history.',
    problem:
      'Pet care details often end up scattered across notes, calendars, photos, and memory. CareTail brings routines, records, reminders, and observations into one organized place.',
    benefits: [
      "Keep each pet's profile, routines, reminders, notes, and records separate.",
      'Create reminders for care tasks like medication, grooming, food, vaccines, and vet visits.',
      'Use CareTail locally without creating an account. Google Sign-In is optional.',
    ],
    features: [
      'Pet profiles',
      'Care reminders',
      'Diary notes',
      'Documents and vet records',
      'Care reports and export',
      'Multi-pet organization',
      'Local-first use',
      'Optional Google Sign-In',
    ],
    audience: [
      'Pet owners managing daily care routines',
      'Multi-pet households keeping records separate',
      'Owners preparing notes and documents for appointments',
      'People who want care history without a complicated system',
    ],
    faq: [
      {
        question: 'Is CareTail a medical app?',
        answer:
          'No. CareTail is for organizing reminders, notes, and records. Veterinary decisions should stay with the pet owner and their vet.',
      },
      {
        question: 'Can I use CareTail without an account?',
        answer:
          'Yes. CareTail can be used locally without creating an account. Google Sign-In is optional.',
      },
      {
        question: 'Can I track more than one pet?',
        answer:
          'Yes. CareTail supports separate profiles so each pet can have its own routines, notes, reminders, and records.',
      },
      {
        question: 'What is Premium for?',
        answer:
          'Premium gives more room for more pets, routines, documents, and care history.',
      },
    ],
    cta: 'Get it on Google Play',
    icon: HeartPulse,
    accent: '#56C7BE',
    secondaryAccent: '#FF6868',
    code: 'CT',
    visualStyle: 'petcare',
    iconImage: caretailIcon,
    screenshots: [
      caretailFeature,
      caretailAllCare,
      caretailProfile,
      caretailReminders,
      caretailDiary,
      caretailDocuments,
      caretailDashboard,
    ],
    storeFacts: ['Live on Google Play', 'Android app', 'Pet care tracker'],
  },
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
  { label: 'Five live products', icon: BadgeCheck },
  { label: 'Built for practical use cases', icon: ClipboardCheck },
  { label: 'Direct links to official stores', icon: ShieldCheck },
]

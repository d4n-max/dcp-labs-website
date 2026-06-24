export type BlogCategory =
  | 'Pet Care'
  | 'Productivity'
  | 'Career Tools'
  | 'Education'
  | 'Field Service'
  | 'Collecting'

export type BlogPostSection = {
  heading: string
  body: string[]
  bullets?: string[]
}

export type BlogPost = {
  slug: string
  title: string
  description: string
  date: string
  category: BlogCategory
  app: string
  tags: string[]
  readingTime: string
  seoTitle: string
  seoDescription: string
  intro: string
  sections: BlogPostSection[]
  relatedAppUrl: string
  ctaText: string
}

export const blogCategories: Array<'All' | BlogCategory> = [
  'All',
  'Pet Care',
  'Productivity',
  'Career Tools',
  'Education',
  'Field Service',
  'Collecting',
]

export const blogPosts: BlogPost[] = [
  {
    slug: 'pet-care-tracker-app',
    title: 'Why a Pet Care Tracker Helps Keep Daily Pet Care Organized',
    description:
      'A practical look at how pet care trackers help owners organize reminders, notes, records, and routines without turning care into admin work.',
    date: '2026-06-24',
    category: 'Pet Care',
    app: 'CareTail',
    tags: ['pet care tracker app', 'pet reminder app', 'pet diary app'],
    readingTime: '4 min read',
    seoTitle:
      'Pet Care Tracker App: Organize Reminders, Notes, and Records | DCP Labs',
    seoDescription:
      'Learn how a pet care tracker app can help organize daily routines, reminders, pet diary notes, documents, and care history.',
    intro:
      'Daily pet care is full of small details: food changes, medication schedules, grooming dates, vaccine reminders, symptoms, vet notes, and documents. A pet care tracker helps turn those scattered details into a calmer routine.',
    sections: [
      {
        heading: 'Pet care gets messy when details live everywhere',
        body: [
          'Many owners start with a mix of phone notes, calendar events, screenshots, paper records, and memory. That can work for a while, but it becomes fragile when there are multiple pets, recurring care tasks, or a vet visit coming up.',
          'A tracker gives each pet a dedicated place for the details that are easy to forget and hard to reconstruct later.',
        ],
      },
      {
        heading: 'What a useful pet tracker should help with',
        body: [
          'The best setup is not the most complicated one. It is the one that helps you record what happened, see what is due, and find the right context when you need it.',
        ],
        bullets: [
          'Care reminders for medicine, grooming, vaccines, food, and appointments.',
          'A pet diary for behavior changes, symptoms, routines, and small observations.',
          'Separate profiles so each pet has its own care history.',
          'Documents and records that are easier to find before a vet visit.',
        ],
      },
      {
        heading: 'How CareTail fits this workflow',
        body: [
          'CareTail is designed as a calm organizer for pet profiles, reminders, diary notes, documents, and care history. It is useful when the goal is not to make pet care feel clinical, but to keep important details close enough that they are easy to act on.',
          'It is especially helpful for multi-pet homes, owners preparing for appointments, and anyone who wants care history without building a complicated spreadsheet.',
        ],
      },
    ],
    relatedAppUrl: '/caretail',
    ctaText: 'Explore CareTail',
  },
  {
    slug: 'tailor-resume-to-job-description',
    title:
      'How to Tailor Your Resume to a Job Description Without Starting From Scratch',
    description:
      'A practical resume tailoring workflow for matching a job description while keeping your experience accurate and easy to review.',
    date: '2026-06-24',
    category: 'Career Tools',
    app: 'RoleForge',
    tags: ['tailor resume to job description', 'resume tailoring tool', 'AI resume tool'],
    readingTime: '5 min read',
    seoTitle:
      'How to Tailor Your Resume to a Job Description | DCP Labs',
    seoDescription:
      'Learn how to tailor your resume to a job description without rewriting everything from scratch, with a practical workflow for role-specific applications.',
    intro:
      'Tailoring a resume does not mean rebuilding your work history every time. It means choosing the most relevant proof, moving it closer to the top, and rewriting only the parts that help a recruiter understand the fit.',
    sections: [
      {
        heading: 'Start with the role, not the resume',
        body: [
          'Before editing, read the job description for repeated responsibilities, required tools, seniority signals, and outcomes. Repeated themes usually matter more than one isolated keyword.',
          'Then compare those requirements against your actual experience. The goal is relevance, not exaggeration.',
        ],
      },
      {
        heading: 'Change the highest-impact areas first',
        body: [
          'Most applicants do not need a brand-new resume for each role. A few targeted edits can make a strong base resume feel much more specific.',
        ],
        bullets: [
          'Rewrite the summary for the type of role you are applying to.',
          'Reorder skills so the most relevant tools and strengths appear first.',
          'Replace generic bullets with examples that match the job description.',
          'Keep titles, dates, metrics, and responsibilities accurate.',
        ],
      },
      {
        heading: 'Where RoleForge helps',
        body: [
          'RoleForge is built for the moment when you are looking at a live job post and need to prepare application materials around it. It helps extract requirements, compare them with saved experience, and draft resume bullets, cover letters, form answers, and interview notes for review.',
          'The useful habit is still human: read, review, edit, and submit only what feels true to your background.',
        ],
      },
    ],
    relatedAppUrl: '/roleforge',
    ctaText: 'Try RoleForge',
  },
  {
    slug: 'coin-collection-tracker',
    title: 'How a Coin Collection Tracker Helps You Organize Your Coins',
    description:
      'Why coin collectors benefit from a simple digital catalog for photos, notes, scan history, value context, and collection organization.',
    date: '2026-06-24',
    category: 'Collecting',
    app: 'CoinRelic',
    tags: ['coin collection tracker', 'coin collecting app', 'coin catalog app'],
    readingTime: '4 min read',
    seoTitle:
      'Coin Collection Tracker: Organize Coins, Notes, and Photos | DCP Labs',
    seoDescription:
      'See how a coin collection tracker helps collectors organize coin photos, notes, scan history, watchlists, and catalog details.',
    intro:
      'Coin collecting is part research, part memory, and part organization. A coin collection tracker gives every find a place to live so details do not disappear after the first scan or note.',
    sections: [
      {
        heading: 'A collection grows faster than your memory',
        body: [
          'A few coins can be managed with a small notebook. Once the collection grows, it becomes harder to remember which coins were scanned, where they came from, what condition notes were recorded, and which pieces deserve follow-up research.',
          'A digital tracker keeps the catalog searchable and easier to revisit.',
        ],
      },
      {
        heading: 'Useful details to keep with each coin',
        body: [
          'The value of a tracker is not only the list. It is the context around each coin.',
        ],
        bullets: [
          'Photos and scan history for later comparison.',
          'Condition notes, year, country, denomination, and identifying marks.',
          'Estimated value context with room for your own collector judgment.',
          'Watchlists or top finds for coins you want to research again.',
        ],
      },
      {
        heading: 'How CoinRelic supports collectors',
        body: [
          'CoinRelic helps collectors scan coins, save details, build a digital catalog, and keep notes attached to each discovery. It is built for hobbyists who want a cleaner record without turning collection management into a heavy database project.',
        ],
      },
    ],
    relatedAppUrl: '/coinrelic',
    ctaText: 'Explore CoinRelic',
  },
  {
    slug: 'study-coach-app-for-interview-prep',
    title: 'How a Study Coach App Can Help With Interview Preparation',
    description:
      'A calm approach to using short study sessions, flashcards, quizzes, and progress review while preparing for interviews.',
    date: '2026-06-24',
    category: 'Education',
    app: 'LearnLift AI',
    tags: ['study coach app', 'interview preparation app', 'QA interview practice'],
    readingTime: '4 min read',
    seoTitle:
      'Study Coach App for Interview Preparation | DCP Labs',
    seoDescription:
      'Learn how a study coach app can support interview preparation with guided practice, flashcards, quizzes, and topic review.',
    intro:
      'Interview preparation often fails because the material is scattered. A study coach app helps by turning preparation into repeatable sessions instead of one long, stressful cram.',
    sections: [
      {
        heading: 'Interview prep works better in small loops',
        body: [
          'Most people do not need more open tabs. They need a repeatable way to practice questions, review weak areas, and return tomorrow without deciding from scratch what to study next.',
          'Short sessions make it easier to stay consistent, especially when preparing around work, school, or an active job search.',
        ],
      },
      {
        heading: 'What to practice before an interview',
        body: [
          'A practical interview plan usually mixes subject knowledge, communication, and recall.',
        ],
        bullets: [
          'Common role questions and answer structure.',
          'Technical or QA topics that need repeated review.',
          'English vocabulary or phrasing for workplace conversations.',
          'Weak areas identified during quizzes or flashcard review.',
        ],
      },
      {
        heading: 'Where LearnLift AI fits',
        body: [
          'LearnLift AI supports short guided study sessions for English, interview preparation, and IT/QA learning topics. Its study paths, flashcards, quizzes, and progress review are designed to help learners decide what to practice next.',
          'It does not replace real interview experience, but it can make preparation more structured and easier to repeat.',
        ],
      },
    ],
    relatedAppUrl: '/learnlift-ai',
    ctaText: 'Explore LearnLift AI',
  },
  {
    slug: 'field-service-business-app',
    title: 'What Small Service Businesses Need From a Field Service App',
    description:
      'A practical overview of job tracking, customer context, scheduling, and follow-up needs for small field service businesses.',
    date: '2026-06-24',
    category: 'Field Service',
    app: 'ServiceSphere',
    tags: ['field service app', 'service business app', 'job tracking app'],
    readingTime: '5 min read',
    seoTitle:
      'Field Service App Needs for Small Service Businesses | DCP Labs',
    seoDescription:
      'Learn what small service businesses need from a field service app, including job tracking, scheduling, customer details, and follow-up workflows.',
    intro:
      'Small service teams often run on calls, messages, notes, photos, invoices, and memory. A good field service app should reduce that friction without forcing the business into a system built for a much larger operation.',
    sections: [
      {
        heading: 'The core problem is coordination',
        body: [
          'A service business needs to know who requested the work, what was promised, when the job is scheduled, what happened on-site, and what still needs follow-up. When those details are split across messages and notebooks, small mistakes become expensive.',
        ],
      },
      {
        heading: 'What matters in a small-business workflow',
        body: [
          'The right tool should make everyday work easier for the person actually running the jobs.',
        ],
        bullets: [
          'Clear job status from request to completion.',
          'Customer history, notes, addresses, and contact details in one place.',
          'Scheduling that is easy to review on mobile.',
          'Photos, notes, and follow-up tasks attached to the job.',
          'Simple reporting without requiring a dedicated operations team.',
        ],
      },
      {
        heading: 'How ServiceSphere is positioned',
        body: [
          'ServiceSphere is the DCP Labs direction for service business organization: job tracking, customer context, scheduling, and follow-up support for practical field work. The most useful version of that workflow is focused, mobile-friendly, and easy to keep updated between jobs.',
        ],
      },
    ],
    relatedAppUrl: '/servicesphere',
    ctaText: 'Explore ServiceSphere',
  },
]

export const blogPostBySlug = Object.fromEntries(
  blogPosts.map((post) => [post.slug, post]),
) as Record<string, BlogPost>

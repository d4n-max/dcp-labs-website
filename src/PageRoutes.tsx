import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Brain,
  Camera,
  CalendarDays,
  Check,
  ChevronRight,
  Filter,
  FileSignature,
  FileText,
  Languages,
  ListChecks,
  Mail,
  MapPinned,
  NotebookTabs,
  ReceiptText,
  Target,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Link,
  Navigate,
  Route,
  Routes,
  useParams,
} from 'react-router-dom'
import dcpLogo from './assets/dcp-labs-logo.svg'
import type { AppCategory, StudioApp } from './data/apps'
import { appBySlug, apps, trustSignals } from './data/apps'
import type { BlogPost } from './data/blogPosts'
import { blogCategories, blogPostBySlug, blogPosts } from './data/blogPosts'

const SITE_URL = 'https://dcplabs.app'
const DEFAULT_SOCIAL_IMAGE = '/og-dcp-labs.svg'
const TEXTSENSE_PRIVACY_PATH = '/textsense-privacy-policy'
const TEXTSENSE_TERMS_PATH = '/textsense/terms'

type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>

const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString()

function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DCP Labs',
    url: absoluteUrl('/'),
    description:
      'DCP Labs builds focused digital products for practical everyday and professional use.',
    sameAs: apps.map((app) => app.storeUrl),
  }
}

function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DCP Labs',
    url: absoluteUrl('/'),
  }
}

function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

function softwareApplicationJsonLd({
  app,
  path,
  applicationCategory,
  operatingSystem,
}: {
  app: StudioApp
  path: string
  applicationCategory: string
  operatingSystem: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    applicationCategory,
    operatingSystem,
    url: absoluteUrl(path),
    installUrl: app.storeUrl,
    description: app.description,
    publisher: {
      '@type': 'Organization',
      name: 'DCP Labs',
      url: absoluteUrl('/'),
    },
  }
}

function faqJsonLd(app: StudioApp) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: app.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

const categoryFilters: AppCategory[] = [
  'All',
  'Android',
  'Chrome Extension',
  'Pets',
  'Education',
  'Productivity',
  'Career',
  'Collectors',
]

type ComparisonFeature = {
  label: string
  roleforge: string
  competitor: string
}

type ComparisonPageData = {
  slug: string
  competitor: string
  title: string
  metaDescription: string
  h1: string
  intro: string
  summary: string
  roleforgeStrengths: string[]
  competitorStrengths: string[]
  chooseRoleForge: string[]
  chooseCompetitor: string[]
  recommendation: string
  features: ComparisonFeature[]
}

type RoleForgeGuideExample = {
  requirement: string
  generic: string
  improved: string
  why: string
}

type RoleForgeGuide = {
  slug: string
  title: string
  metaDescription: string
  h1: string
  intro: string
  takeaways: string[]
  sections: Array<{ heading: string; body: string }>
  example: RoleForgeGuideExample
  closing: string
}

type CareTailSeoPage = {
  slug: string
  title: string
  metaDescription: string
  h1: string
  keyword: string
  problem: string
  explanation: string
  features: string[]
  safetyLine: string
  imageIndex: number
  imageAlt: string
  related: string[]
}

const comparisonPages: ComparisonPageData[] = [
  {
    slug: 'vs-jobright',
    competitor: 'Jobright',
    title: 'RoleForge vs Jobright | Job Application Tailoring Comparison',
    metaDescription:
      'Compare RoleForge and Jobright for job seekers who want job post analysis, resume tailoring, cover letters, and application preparation.',
    h1: 'RoleForge vs Jobright',
    intro:
      'RoleForge and Jobright both help job seekers move faster, but they focus on different parts of the search. This comparison is for applicants deciding whether they need a broader job search assistant or a focused Chrome extension for tailoring applications from the job post in front of them.',
    summary:
      'RoleForge is built around live job posting analysis and role-specific application drafts. Jobright is commonly positioned around job search assistance, matching, and career discovery.',
    roleforgeStrengths: [
      'Works from live job postings in the browser.',
      'Extracts role requirements before drafting application materials.',
      'Helps prepare resume bullets, cover letters, form answers, and interview notes for review.',
    ],
    competitorStrengths: [
      'May be a better fit for broader job discovery and job matching.',
      'May suit job seekers who want a wider job search assistant rather than a focused drafting extension.',
      'May be useful when organization across a broader search matters more than per-role drafting.',
    ],
    chooseRoleForge: [
      'You want to tailor each application from the job post you are viewing.',
      'You already know the role you want to apply for and need sharper materials.',
      'You want drafts you can review, edit, copy, and decide how to use.',
    ],
    chooseCompetitor: [
      'You want broader job search or discovery support.',
      'You are earlier in the search and want help finding roles to consider.',
      'You prefer a more general job-search assistant experience.',
    ],
    recommendation:
      'Choose RoleForge when the main problem is tailoring the next application. Consider Jobright when the main problem is discovering, matching, or managing a broader job search.',
    features: [
      {
        label: 'Primary focus',
        roleforge: 'Tailored application drafts from live job postings.',
        competitor: 'Broader job search assistance and matching.',
      },
      {
        label: 'Resume support',
        roleforge: 'Role-specific resume summaries and bullets for review.',
        competitor: 'Resume or profile support may be part of a wider job-search flow.',
      },
      {
        label: 'Cover letters',
        roleforge: 'Drafts tailored cover letter content for the role.',
        competitor: 'May support application improvement depending on the product setup.',
      },
      {
        label: 'Application control',
        roleforge: 'Users review, edit, copy, and decide what to submit.',
        competitor: 'Varies by product and feature set.',
      },
    ],
  },
  {
    slug: 'vs-teal',
    competitor: 'Teal',
    title: 'RoleForge vs Teal | Resume Tailoring and Job Tracking',
    metaDescription:
      'Compare RoleForge and Teal for resume tailoring, cover letters, job tracking, and application preparation.',
    h1: 'RoleForge vs Teal',
    intro:
      'RoleForge and Teal can both support job seekers preparing applications. The key difference is focus: RoleForge is a Chrome extension centered on tailoring materials from a live job post, while Teal is widely known for resume building and job tracking.',
    summary:
      'RoleForge is strongest when you are on a job posting and want role-specific drafts. Teal may be stronger for broader resume management, job tracking, and career organization.',
    roleforgeStrengths: [
      'Analyzes the live job posting a user is viewing.',
      'Turns role requirements into tailored resume and cover letter drafts.',
      'Keeps drafting close to the application page.',
    ],
    competitorStrengths: [
      'May be a better fit for job tracking and application organization.',
      'May suit users who want broader resume management across many roles.',
      'May be helpful for building and maintaining a central resume workspace.',
    ],
    chooseRoleForge: [
      'You want to tailor application materials while reviewing a live job post.',
      'You need resume bullets, cover letters, form answers, and interview notes for a specific role.',
      'You prefer a focused browser extension.',
    ],
    chooseCompetitor: [
      'You want a broader job tracker and resume workspace.',
      'You need ongoing organization across many applications.',
      'You want to manage resumes and jobs from a central platform.',
    ],
    recommendation:
      'Choose RoleForge for live job-post tailoring. Consider Teal if your priority is a broader job tracking and resume management workspace.',
    features: [
      {
        label: 'Primary focus',
        roleforge: 'Tailoring each application from a live job post.',
        competitor: 'Resume building, job tracking, and application organization.',
      },
      {
        label: 'Job post context',
        roleforge: 'Built around extracting requirements from the current posting.',
        competitor: 'May use job descriptions as part of broader application tracking.',
      },
      {
        label: 'Application drafts',
        roleforge: 'Resume bullets, cover letters, form answers, and interview notes.',
        competitor: 'Resume and job-search support varies by feature and plan.',
      },
      {
        label: 'Best fit',
        roleforge: 'Applicants tailoring the next application.',
        competitor: 'Applicants organizing an ongoing job search.',
      },
    ],
  },
  {
    slug: 'vs-simplify',
    competitor: 'Simplify',
    title: 'RoleForge vs Simplify | Chrome Extension for Job Applications',
    metaDescription:
      'Compare RoleForge and Simplify for job seekers evaluating Chrome extensions, resume tailoring, and job application preparation.',
    h1: 'RoleForge vs Simplify',
    intro:
      'RoleForge and Simplify are both relevant to job seekers working in the browser. RoleForge focuses on tailoring application materials from the live job post, while Simplify is commonly associated with autofill and job search support.',
    summary:
      'RoleForge is a fit when content quality and role-specific drafting matter most. Simplify may be a better fit when the priority is speeding up repetitive application form steps.',
    roleforgeStrengths: [
      'Extracts role requirements from live job pages.',
      'Drafts role-specific resume bullets, cover letters, form answers, and notes.',
      'Keeps users in control of review and editing before use.',
    ],
    competitorStrengths: [
      'May be better for reducing repetitive application form entry.',
      'May suit users who prioritize autofill and faster application forms.',
      'May support a broader browser-based job application process.',
    ],
    chooseRoleForge: [
      'You need to adapt the substance of your application to the role.',
      'You want help turning experience into tailored resume and cover letter drafts.',
      'You want to review and edit generated content before using it.',
    ],
    chooseCompetitor: [
      'You mainly want to reduce manual form filling.',
      'You apply to many roles and want application process automation support.',
      'You need broad application speed more than role-specific writing support.',
    ],
    recommendation:
      'Choose RoleForge when the main bottleneck is tailoring content. Consider Simplify when the main bottleneck is repetitive application forms.',
    features: [
      {
        label: 'Primary focus',
        roleforge: 'Role-specific application content from live postings.',
        competitor: 'Application speed and autofill-oriented support.',
      },
      {
        label: 'Resume tailoring',
        roleforge: 'Drafts role-specific resume content for review.',
        competitor: 'May support resume or profile features depending on setup.',
      },
      {
        label: 'Form answers',
        roleforge: 'Prepares application answer drafts users can review.',
        competitor: 'May focus more on filling repeated application fields.',
      },
      {
        label: 'User control',
        roleforge: 'Review, edit, copy, and decide what to submit.',
        competitor: 'Workflow varies by feature and user configuration.',
      },
    ],
  },
  {
    slug: 'vs-kickresume',
    competitor: 'Kickresume',
    title: 'RoleForge vs Kickresume | Resume Builder vs Application Tailoring',
    metaDescription:
      'Compare RoleForge and Kickresume for resume tailoring, cover letter drafting, resume templates, and job application preparation.',
    h1: 'RoleForge vs Kickresume',
    intro:
      'RoleForge and Kickresume serve different moments in application preparation. RoleForge helps tailor materials from the job post in front of you. Kickresume is commonly known for resume building, cover letter creation, and polished templates.',
    summary:
      'RoleForge is strongest for role-specific tailoring from live postings. Kickresume may be stronger when the priority is resume design, templates, and building polished resume documents.',
    roleforgeStrengths: [
      'Starts from the live job posting and extracts role requirements.',
      'Drafts application materials around the specific role.',
      'Supports resume bullets, cover letters, form answers, and interview notes.',
    ],
    competitorStrengths: [
      'May be better for resume design and template-driven document creation.',
      'May suit users building a polished resume from scratch.',
      'May be useful for cover letter and resume document formatting.',
    ],
    chooseRoleForge: [
      'You already have experience to draw from and need to adapt it to a role.',
      'You want browser-based job post analysis before writing.',
      'You need role-specific content drafts more than resume design templates.',
    ],
    chooseCompetitor: [
      'You want a resume builder with templates and visual document design.',
      'You are creating a resume or cover letter from scratch.',
      'You need polished formatting as much as application tailoring.',
    ],
    recommendation:
      'Choose RoleForge for tailoring applications to specific job posts. Consider Kickresume when resume design, templates, or polished document creation is the main need.',
    features: [
      {
        label: 'Primary focus',
        roleforge: 'Tailored applications from live job postings.',
        competitor: 'Resume and cover letter building with design/template support.',
      },
      {
        label: 'Job post analysis',
        roleforge: 'Central to the product.',
        competitor: 'May not be the main product focus.',
      },
      {
        label: 'Document design',
        roleforge: 'Focused on content drafts, not visual resume design.',
        competitor: 'Often stronger for templates and polished documents.',
      },
      {
        label: 'Best fit',
        roleforge: 'Applicants adapting materials per role.',
        competitor: 'Applicants building or redesigning resume documents.',
      },
    ],
  },
]

const comparisonBySlug = Object.fromEntries(
  comparisonPages.map((page) => [page.slug, page]),
) as Record<string, ComparisonPageData>

const roleForgeGuides: RoleForgeGuide[] = [
  {
    slug: 'how-to-tailor-your-resume-to-a-job-description',
    title: 'How to Tailor Your Resume to a Job Description | RoleForge Guide',
    metaDescription:
      'Learn how to tailor your resume to a job description with practical steps, examples, and a clear before-and-after rewrite.',
    h1: 'How to tailor your resume to a job description',
    intro:
      'A tailored resume does not mean rewriting your entire work history. It means reading the job post carefully, choosing the most relevant experience, and making the connection easy for the recruiter to see.',
    takeaways: [
      'Start with the job requirements, not your full resume.',
      'Move the most relevant experience higher on the page.',
      'Rewrite bullets so they show the same kind of work the role asks for.',
    ],
    sections: [
      {
        heading: 'Pull out the real requirements',
        body: 'Read the job post once for the role summary, then again for the repeated skills, tools, responsibilities, and outcomes. Repeated ideas usually matter more than one-off phrases.',
      },
      {
        heading: 'Choose matching proof from your experience',
        body: 'For each key requirement, find a project, task, metric, tool, or result from your background that proves you have done similar work.',
      },
      {
        heading: 'Rewrite for relevance, not exaggeration',
        body: 'Keep the facts true. Change the emphasis, order, and wording so the reader can quickly see why your experience fits this specific role.',
      },
    ],
    example: {
      requirement:
        'The job description asks for experience testing mobile applications, documenting bugs, and working with developers to resolve defects.',
      generic:
        'Tested software and reported issues to the team.',
      improved:
        'Tested Android and iOS release builds, documented reproducible defects with screenshots and logs, and worked with developers to verify fixes before production release.',
      why:
        'The improved version names the platform, shows the testing process, includes collaboration, and mirrors the job requirement without copying it word for word.',
    },
    closing:
      'Before you submit, compare the top third of your resume against the top requirements in the posting. If the strongest match is buried, move it up or rewrite it.',
  },
  {
    slug: 'what-to-change-on-your-resume-for-each-application',
    title: 'What to Change on Your Resume for Each Application | RoleForge Guide',
    metaDescription:
      'A practical checklist for what to change on your resume for each job application without rewriting everything from scratch.',
    h1: 'What to change on your resume for each application',
    intro:
      'You do not need a brand-new resume for every application. You need a stable base resume and a few targeted adjustments that make the right experience easier to find.',
    takeaways: [
      'Adjust the summary, top skills, and most relevant bullets first.',
      'Keep job titles and dates accurate.',
      'Remove weak details when stronger role-specific proof is available.',
    ],
    sections: [
      {
        heading: 'Update the summary',
        body: 'The summary should reflect the role you are applying for. If the job is about customer support operations, do not lead with unrelated project management language.',
      },
      {
        heading: 'Reorder skills for the job',
        body: 'Put the most relevant tools, methods, and domain experience first. This helps both recruiters and screening systems find the fit quickly.',
      },
      {
        heading: 'Swap weak bullets for stronger matches',
        body: 'Keep your work history honest, but choose the bullets that best support the role. A resume for a QA role should not lead with generic team participation when you have testing, bug triage, or release experience.',
      },
    ],
    example: {
      requirement:
        'The posting emphasizes customer onboarding, CRM hygiene, and reducing manual follow-up work.',
      generic:
        'Helped customers and kept records updated.',
      improved:
        'Managed customer onboarding tasks in HubSpot, cleaned duplicate CRM records, and created follow-up checklists that reduced missed handoffs between sales and support.',
      why:
        'The improved version changes the emphasis from general support to the exact operational work the role is asking for.',
    },
    closing:
      'If you only have ten minutes, tailor the summary, skills order, and three strongest bullets. Those changes usually do more than rewriting the whole document.',
  },
  {
    slug: 'how-to-rewrite-resume-bullets-for-ats',
    title: 'How to Rewrite Resume Bullets for ATS | RoleForge Guide',
    metaDescription:
      'Learn how to rewrite resume bullets for ATS-friendly applications while keeping the writing clear, specific, and honest.',
    h1: 'How to rewrite resume bullets for ATS',
    intro:
      'ATS-friendly resume writing is not about stuffing keywords into every line. Strong bullets use clear job language, specific actions, and evidence that a recruiter can understand after the resume gets through screening.',
    takeaways: [
      'Use the role language naturally when it matches your real experience.',
      'Lead with action, context, and outcome.',
      'Avoid vague bullets that could describe almost any job.',
    ],
    sections: [
      {
        heading: 'Use recognizable wording',
        body: 'If the job post says regression testing and you have done regression testing, use that phrase. Do not hide it behind vague wording like quality checks.',
      },
      {
        heading: 'Add context and outcome',
        body: 'A good bullet explains what you did, where you did it, and why it mattered. Numbers help when they are real, but process detail can also make a bullet stronger.',
      },
      {
        heading: 'Keep one main idea per bullet',
        body: 'ATS systems and recruiters both reward clarity. Do not cram five responsibilities into one line if two focused bullets would be easier to scan.',
      },
    ],
    example: {
      requirement:
        'The job description asks for regression testing, API testing, bug tracking, and release validation.',
      generic:
        'Performed testing and helped improve application quality.',
      improved:
        'Ran regression and API test cases for weekly releases, logged defects in Jira, and verified fixes before release sign-off.',
      why:
        'The improved version includes the exact relevant testing terms, shows the tools and process, and stays clear enough for both ATS screening and human review.',
    },
    closing:
      'The best ATS-friendly bullets read naturally. If a sentence sounds awkward out loud, it probably needs a cleaner rewrite.',
  },
  {
    slug: 'resume-keywords-without-keyword-stuffing',
    title: 'Resume Keywords Without Keyword Stuffing | RoleForge Guide',
    metaDescription:
      'Use resume keywords naturally by matching job requirements to real experience instead of stuffing terms into your resume.',
    h1: 'Resume keywords without keyword stuffing',
    intro:
      'Resume keywords matter, but keyword stuffing makes a resume weaker. The goal is to use the right terms where they accurately describe your work.',
    takeaways: [
      'Group keywords by requirement, tool, responsibility, and outcome.',
      'Use keywords only where they match real experience.',
      'Prefer plain, specific sentences over dense keyword lists.',
    ],
    sections: [
      {
        heading: 'Separate must-have skills from nice-to-have words',
        body: 'A keyword repeated in the job title, responsibilities, and requirements is more important than a tool mentioned once near the bottom of the post.',
      },
      {
        heading: 'Place keywords where they belong',
        body: 'Tools can go in skills. Responsibilities belong in bullets. Outcomes belong in accomplishments. This keeps the resume readable.',
      },
      {
        heading: 'Do not claim what you cannot support',
        body: 'If you only watched a tool in a demo, do not list it as hands-on experience. Use your strongest honest match instead.',
      },
    ],
    example: {
      requirement:
        'The job post mentions SQL, dashboard reporting, stakeholder communication, and weekly operations reviews.',
      generic:
        'SQL, dashboards, reports, stakeholders, communication, operations, analytics, meetings.',
      improved:
        'Built weekly SQL-based operations reports, reviewed dashboard trends with support leads, and translated recurring issues into action items for the team.',
      why:
        'The improved version uses the keywords in a real work context instead of dropping them into a list with no evidence.',
    },
    closing:
      'A recruiter should be able to understand the sentence even if they ignore the keywords. That is usually the sign that the wording is strong.',
  },
  {
    slug: 'how-to-answer-why-are-you-interested-in-this-role',
    title: 'How to Answer Why Are You Interested in This Role | RoleForge Guide',
    metaDescription:
      'Write a stronger answer to why you are interested in this role with a practical structure and tailored example.',
    h1: 'How to answer why you are interested in this role',
    intro:
      'This question is not asking for flattery. A strong answer connects the role, the company, and your experience in a way that feels specific and believable.',
    takeaways: [
      'Mention something specific from the role.',
      'Connect it to work you have done or want to do more of.',
      'Keep the answer concise and grounded.',
    ],
    sections: [
      {
        heading: 'Start with the work, not the company slogan',
        body: 'Use the responsibilities in the job post as your anchor. This keeps the answer relevant even when you do not know much about the company yet.',
      },
      {
        heading: 'Add a personal fit point',
        body: 'Explain why the role fits your strengths, interests, or direction. Avoid sounding like you would take any job with the same title.',
      },
      {
        heading: 'Close with contribution',
        body: 'End by naming the kind of value you hope to bring: better testing coverage, clearer customer onboarding, cleaner reporting, faster support, or stronger execution.',
      },
    ],
    example: {
      requirement:
        'The application asks why you are interested in a QA role focused on mobile testing, release quality, and collaboration with product teams.',
      generic:
        'I am interested because I think this is a great opportunity and I want to grow my career.',
      improved:
        'I am interested in this role because it combines mobile testing, release quality, and close collaboration with product teams. My recent experience has focused on finding reproducible defects, documenting clear bug reports, and verifying fixes before release, so this role matches the kind of quality work I want to keep building on.',
      why:
        'The improved answer is specific to the job post, connects to real experience, and explains motivation without sounding generic.',
    },
    closing:
      'If your answer could be pasted into any application, it is too generic. Add one role-specific detail and one honest connection to your experience.',
  },
]

const roleForgeGuideBySlug = Object.fromEntries(
  roleForgeGuides.map((guide) => [guide.slug, guide]),
) as Record<string, RoleForgeGuide>

const careTailSeoPages: CareTailSeoPage[] = [
  {
    slug: 'pet-care-tracker',
    title: 'Pet Care Tracker App for Routines, Notes, and Records | CareTail',
    metaDescription:
      'CareTail is a pet care tracker app for organizing pet profiles, reminders, diary notes, documents, and care reports in one place.',
    h1: 'Pet care tracker app for routines, notes, and records',
    keyword: 'pet care tracker app',
    problem:
      'Pet care details can spread across notes, calendars, photos, and memory. That makes everyday routines harder to review when you need the details later.',
    explanation:
      'CareTail gives pet owners a calmer workspace for profiles, reminders, diary notes, documents, and care reports, with each detail organized around the right pet.',
    features: [
      'Create a separate profile for each pet.',
      'Track reminders, notes, documents, and care history together.',
      'Keep diary observations easier to review over time.',
      'Prepare records and notes before appointments.',
      'Use one organized place instead of scattered tools.',
    ],
    safetyLine:
      'CareTail is an organization tool for pet owners. Veterinary decisions should stay with the pet owner and their vet.',
    imageIndex: 1,
    imageAlt:
      'CareTail promo showing pet profiles reminders notes and records in one place',
    related: [
      'pet-reminder-app',
      'pet-health-diary',
      'vet-records-organizer',
      'multi-pet-care',
    ],
  },
  {
    slug: 'pet-reminder-app',
    title: 'Pet Reminder App for Everyday Care Routines | CareTail',
    metaDescription:
      'Use CareTail as a pet reminder app for grooming, medication, food, vaccines, vet visits, appointments, and custom care routines.',
    h1: 'Pet reminder app for everyday care routines',
    keyword: 'pet reminder app',
    problem:
      'Pet care routines often include small recurring tasks that are easy to scatter across calendars, notes, and memory.',
    explanation:
      'CareTail helps you create user-controlled reminders for grooming, medication, food, vaccines, appointments, vet visits, and custom care routines.',
    features: [
      'Create reminders for common care tasks.',
      'Assign reminders to the right pet profile.',
      'Keep upcoming care tasks visible in one place.',
      'Add notes for context when a reminder needs detail.',
      'Organize routine care without turning it into a complicated system.',
    ],
    safetyLine:
      'CareTail reminders are user-created organizational tools and are not medical advice.',
    imageIndex: 3,
    imageAlt:
      'CareTail promo showing pet reminders for vaccines medication grooming and vet visits',
    related: [
      'pet-care-tracker',
      'pet-health-diary',
      'multi-pet-care',
      'local-first-pet-care-app',
    ],
  },
  {
    slug: 'pet-health-diary',
    title: 'Pet Health Diary for Notes and Care Observations | CareTail',
    metaDescription:
      'CareTail helps pet owners keep a pet health diary for appetite, mood, energy, symptoms, behavior, routines, and care observations.',
    h1: 'Pet health diary for notes and care observations',
    keyword: 'pet health diary app',
    problem:
      'Small care observations can be hard to remember clearly once days or weeks have passed.',
    explanation:
      'CareTail helps you keep appetite, mood, energy, symptoms, behavior, routines, and care observations organized so they are easier to review later.',
    features: [
      'Log diary notes for each pet.',
      'Record appetite, mood, energy, symptoms, and observations.',
      'Keep notes connected to the right profile.',
      'Review care history without searching through scattered notes.',
      'Use plain organization for notes you want to review later.',
    ],
    safetyLine:
      'CareTail keeps observations organized for later review and is not medical advice.',
    imageIndex: 4,
    imageAlt:
      'CareTail promo showing diary notes for mood appetite energy symptoms and observations',
    related: [
      'pet-care-tracker',
      'pet-reminder-app',
      'vet-records-organizer',
      'multi-pet-care',
    ],
  },
  {
    slug: 'vet-records-organizer',
    title: 'Organize Pet Vet Records and Care Documents | CareTail',
    metaDescription:
      'CareTail helps pet owners organize pet vet records, vaccination documents, medication notes, appointment prep, documents, and care history.',
    h1: 'Organize pet vet records and care documents',
    keyword: 'organize pet vet records',
    problem:
      'Vet records, vaccination documents, medication notes, and appointment details are often stored in different places.',
    explanation:
      'CareTail gives pet owners a practical place to keep documents, notes, records, and care history easier to find when appointment prep or review time comes around.',
    features: [
      'Save vaccination documents and care records.',
      'Keep medication notes and appointment details together.',
      'Connect documents to the correct pet profile.',
      'Use reports and exports when you need a cleaner care history.',
      'Keep records easier to find without replacing professional advice.',
    ],
    safetyLine:
      'CareTail helps organize records and notes for the pet owner and their vet to review when needed.',
    imageIndex: 5,
    imageAlt:
      'CareTail promo showing organized vet records documents prescriptions and insurance files',
    related: [
      'pet-care-tracker',
      'pet-health-diary',
      'multi-pet-care',
      'local-first-pet-care-app',
    ],
  },
  {
    slug: 'multi-pet-care',
    title: 'Multi-Pet Care App for Separate Routines and Records | CareTail',
    metaDescription:
      'CareTail is a multi-pet care app for separate pet profiles, reminders, notes, documents, routines, and care history.',
    h1: 'Multi-pet care app for separate routines and records',
    keyword: 'multi-pet care app',
    problem:
      'Households with more than one pet need a clear way to keep routines, notes, documents, and care history separated.',
    explanation:
      'CareTail supports separate profiles so each pet can have its own reminders, diary notes, documents, routines, and history.',
    features: [
      'Create separate profiles for different pets.',
      'Keep routines and reminders attached to the right pet.',
      'Store notes and documents without mixing histories.',
      'Review today\'s care across the household.',
      'Use Premium for more room for pets, routines, documents, and history.',
    ],
    safetyLine:
      'Premium is framed as additional capacity and organization, not better care or medical support.',
    imageIndex: 6,
    imageAlt:
      'CareTail promo showing a daily care dashboard for multiple pet care tasks',
    related: [
      'pet-care-tracker',
      'pet-reminder-app',
      'pet-health-diary',
      'vet-records-organizer',
    ],
  },
  {
    slug: 'local-first-pet-care-app',
    title: 'Local-First Pet Care App with Optional Sign-In | CareTail',
    metaDescription:
      'CareTail is a local-first pet care app that can be used without creating an account, with optional Google Sign-In for supported account features.',
    h1: 'Local-first pet care app with optional sign-in',
    keyword: 'local-first pet care app',
    problem:
      'Some pet owners want a simple way to organize care details without being forced into an account before they can start.',
    explanation:
      'CareTail can be used locally without creating an account. Google Sign-In is optional for supported account features, while the core experience stays focused on simple organization.',
    features: [
      'Start organizing pet care details locally.',
      'Use Google Sign-In only if you choose to.',
      'Keep profiles, reminders, notes, and documents in a simple workspace.',
      'Stay in control of what you add and review.',
      'Use CareTail as a practical organizer for details you add yourself.',
    ],
    safetyLine:
      'CareTail is presented as local-first organization with optional sign-in.',
    imageIndex: 0,
    imageAlt:
      'CareTail feature graphic showing the pet care tracker identity and app workspace',
    related: [
      'pet-care-tracker',
      'pet-reminder-app',
      'vet-records-organizer',
      'multi-pet-care',
    ],
  },
]

const careTailSeoPageBySlug = Object.fromEntries(
  careTailSeoPages.map((page) => [page.slug, page]),
) as Record<string, CareTailSeoPage>

type TextSenseLegalSection = {
  heading: string
  body: ReactNode
}

type TextSenseLegalContent = {
  kind: 'privacy' | 'terms'
  title: string
  description: string
  lastUpdated: string
  sections: TextSenseLegalSection[]
}

const textsensePrivacySections: TextSenseLegalSection[] = [
  {
    heading: 'Developer and Contact',
    body: (
      <>
        TextSense is provided by DCP Labs. You can contact us at{' '}
        <a href="mailto:hello@dcplabs.app">hello@dcplabs.app</a>. The Android
        package name for TextSense is <strong>com.textsense.app</strong>.
      </>
    ),
  },
  {
    heading: 'Data We Process',
    body: (
      <>
        TextSense may process chat text you paste, chat screenshots you choose
        to upload, text extracted from screenshots, AI summaries, generated
        reply suggestions, subscription state, purchase history, privacy-safe
        app usage events, and local preferences.
      </>
    ),
  },
  {
    heading: 'How We Use Data',
    body: (
      <>
        We use data to provide the requested TextSense features, including
        analyzing tone, intent, interest level, possible red flags, and natural
        reply options. We also use subscription and purchase data to manage
        Premium access, improve app reliability, understand privacy-safe usage
        patterns, and provide support.
      </>
    ),
  },
  {
    heading: 'Chat Text and Screenshot Handling',
    body: (
      <>
        Chats and screenshots are not saved by default and are processed only
        to provide the requested feature. Screenshots are sent for analysis
        only after explicit user confirmation. Screenshots are not stored
        permanently. Screenshot base64, extracted screenshot text, pasted chat
        text, AI summaries, and generated replies must not be sent to
        analytics.
      </>
    ),
  },
  {
    heading: 'AI Processing',
    body: (
      <>
        TextSense uses AI processing through a backend Supabase Edge Function.
        AI API keys are kept server-side only and are never included in the
        Android app. Content submitted for analysis may be transmitted to our
        backend and AI processing providers so the requested analysis or reply
        suggestions can be generated.
      </>
    ),
  },
  {
    heading: 'Subscriptions and RevenueCat',
    body: (
      <>
        TextSense uses RevenueCat to help manage subscriptions and the
        <strong> premium</strong> entitlement. RevenueCat may process purchase
        identifiers, subscription state, purchase history, product identifiers,
        and related subscription metadata for products including{' '}
        <strong>textsense_premium_monthly</strong> and{' '}
        <strong>textsense_premium_yearly</strong>.
      </>
    ),
  },
  {
    heading: 'Google Play Billing',
    body: (
      <>
        Purchases and subscription billing are handled through Google Play
        Billing. Google may process payment and account information under
        Google Play's own terms and privacy practices. DCP Labs does not
        receive full payment card details from Google Play Billing.
      </>
    ),
  },
  {
    heading: 'Firebase Analytics',
    body: (
      <>
        TextSense uses Firebase Analytics with privacy-safe events only. We do
        not send screenshot base64, extracted screenshot text, pasted chat
        text, AI summaries, or generated replies to analytics.
      </>
    ),
  },
  {
    heading: 'Data Retention',
    body: (
      <>
        Chats and screenshots are not saved by default. Screenshots are not
        stored permanently. Subscription records, purchase history, app usage
        events, and local preferences may be retained as needed to provide the
        app, manage Premium access, maintain records, comply with platform
        requirements, and support users.
      </>
    ),
  },
  {
    heading: 'Data Deletion and Contact',
    body: (
      <>
        To request deletion or ask privacy questions, contact{' '}
        <a href="mailto:hello@dcplabs.app">hello@dcplabs.app</a>. Some
        subscription, billing, and platform records may need to be handled
        through Google Play, RevenueCat, or retained where required for
        legitimate business, security, or legal reasons.
      </>
    ),
  },
  {
    heading: 'Children',
    body: (
      <>
        TextSense is not intended for users under 18. If you believe a person
        under 18 has provided data to TextSense, contact us so we can review
        and take appropriate action.
      </>
    ),
  },
  {
    heading: 'Changes to This Policy',
    body: (
      <>
        We may update this Privacy Policy from time to time. When we make
        changes, we will update the "Last updated" date on this page.
      </>
    ),
  },
]

const textsenseTermsSections: TextSenseLegalSection[] = [
  {
    heading: 'Acceptance of Terms',
    body: (
      <>
        By downloading, accessing, or using TextSense, you agree to these Terms
        of Use. If you do not agree, do not use the app.
      </>
    ),
  },
  {
    heading: 'App Description',
    body: (
      <>
        TextSense is a privacy-first AI dating and relationship clarity coach.
        Users can paste chat text or upload chat screenshots to receive
        analysis of tone, intent, interest level, possible red flags, and
        natural reply suggestions.
      </>
    ),
  },
  {
    heading: 'AI-Generated Suggestions and Limitations',
    body: (
      <>
        TextSense provides AI-generated analysis and suggestions for
        informational and drafting support only. Results may be incomplete,
        inaccurate, or unsuitable for your situation. TextSense is not therapy,
        medical advice, legal advice, or crisis support.
      </>
    ),
  },
  {
    heading: 'User Responsibility',
    body: (
      <>
        You are responsible for deciding whether and how to use any analysis,
        summary, or reply suggestion. You should review generated content,
        consider context the app may not know, and use your own judgment before
        sending messages or making relationship decisions.
      </>
    ),
  },
  {
    heading: 'Acceptable Use',
    body: (
      <>
        You may use TextSense for personal dating and relationship clarity,
        message understanding, and reply drafting in a lawful and respectful
        way.
      </>
    ),
  },
  {
    heading: 'Prohibited Use',
    body: (
      <>
        You may not use TextSense to harass, threaten, stalk, impersonate,
        manipulate, exploit, or harm others; violate another person's privacy;
        upload content you do not have the right to use; reverse engineer the
        app or backend; abuse subscriptions or billing systems; or use the app
        for unlawful purposes.
      </>
    ),
  },
  {
    heading: 'Premium Subscriptions',
    body: (
      <>
        TextSense offers Premium subscriptions through Google Play Billing and
        RevenueCat. Premium access is managed through the{' '}
        <strong>premium</strong> entitlement and may include products such as{' '}
        <strong>textsense_premium_monthly</strong> and{' '}
        <strong>textsense_premium_yearly</strong>. Subscription features,
        pricing, and availability may vary by region and platform.
      </>
    ),
  },
  {
    heading: 'Cancellation and Refunds',
    body: (
      <>
        Subscriptions are managed through Google Play. You can cancel through
        your Google Play account subscription settings. Refund requests are
        handled by Google Play according to Google Play's refund policies.
      </>
    ),
  },
  {
    heading: 'No Guaranteed Outcomes',
    body: (
      <>
        TextSense does not guarantee dating, relationship, communication, or
        personal outcomes. The app can provide analysis and suggestions, but
        outcomes depend on many factors outside the app's control.
      </>
    ),
  },
  {
    heading: 'Privacy',
    body: (
      <>
        Your use of TextSense is also governed by the{' '}
        <Link to={TEXTSENSE_PRIVACY_PATH}>TextSense Privacy Policy</Link>, which
        explains how chat text, screenshots, AI processing, subscriptions, and
        analytics are handled.
      </>
    ),
  },
  {
    heading: 'Changes to These Terms',
    body: (
      <>
        We may update these Terms from time to time. When we make changes, we
        will update the "Last updated" date on this page. Continued use of
        TextSense after changes means you accept the updated Terms.
      </>
    ),
  },
  {
    heading: 'Contact',
    body: (
      <>
        For questions about these Terms, contact DCP Labs at{' '}
        <a href="mailto:hello@dcplabs.app">hello@dcplabs.app</a>.
      </>
    ),
  },
]

const textsenseLegalPages: Record<'privacy' | 'terms', TextSenseLegalContent> = {
  privacy: {
    kind: 'privacy',
    title: 'TextSense Privacy Policy',
    description:
      'Privacy Policy for TextSense, a privacy-first AI dating and relationship clarity coach from DCP Labs.',
    lastUpdated: 'June 29, 2026',
    sections: textsensePrivacySections,
  },
  terms: {
    kind: 'terms',
    title: 'TextSense Terms of Use',
    description:
      'Terms of Use for TextSense, including AI-generated suggestions, subscriptions, user responsibility, and limitations.',
    lastUpdated: 'June 29, 2026',
    sections: textsenseTermsSections,
  },
}

export default function PageRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/apps" element={<AppsPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:blogSlug" element={<BlogPostPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route
        path="/servicesphere"
        element={<Navigate to="/servicesphere-field-service-app" replace />}
      />
      <Route
        path="/servicesphere-field-service-app"
        element={<ServiceSpherePage />}
      />
      <Route
        path="/caretail/:careTailPageSlug"
        element={<CareTailSupportPage />}
      />
      <Route
        path="/roleforge/guides"
        element={<RoleForgeGuidesIndexPage />}
      />
      <Route
        path="/roleforge/guides/:guideSlug"
        element={<RoleForgeGuidePage />}
      />
      <Route
        path="/roleforge/best-ai-resume-tools"
        element={<RoleForgeBestToolsPage />}
      />
      <Route
        path="/roleforge/:comparisonSlug"
        element={<RoleForgeComparisonPage />}
      />
      <Route
        path="/textsense/privacy"
        element={<Navigate to={TEXTSENSE_PRIVACY_PATH} replace />}
      />
      <Route
        path={TEXTSENSE_PRIVACY_PATH}
        element={<TextSenseLegalPage content={textsenseLegalPages.privacy} />}
      />
      <Route
        path="/textsense/terms"
        element={<TextSenseLegalPage content={textsenseLegalPages.terms} />}
      />
      <Route
        path="/privacy"
        element={
          <LegalPage
            title="Privacy"
            description="Privacy information for the DCP Labs website and its live products, including ServiceSphere, LearnLift AI, CareTail, CoinRelic, and RoleForge."
          />
        }
      />
      <Route
        path="/terms"
        element={
          <LegalPage
            title="Terms"
            description="Terms information for the DCP Labs website and links to its live product destinations."
          />
        }
      />
      <Route
        path="/coinrelic/is-my-coin-rare"
        element={<CoinRelicRarityToolPage />}
      />
      <Route path="/:slug" element={<AppDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

function HomePage() {
  return (
    <>
      <Meta
        title="DCP Labs | Software Lab for Focused Digital Products"
        description="DCP Labs builds focused digital products for practical everyday and professional use, including ServiceSphere, LearnLift AI, CareTail, CoinRelic, and RoleForge."
        path="/"
        jsonLd={[
          organizationJsonLd(),
          websiteJsonLd(),
          breadcrumbJsonLd([{ name: 'DCP Labs', path: '/' }]),
        ]}
      />
      <HeroSection />
      <TrustStrip />
      <ProductLedger />
      <StudioPrinciples />
      <EcosystemMap />
      <FinalCta
        title="Explore the live DCP Labs products."
        body="Install LearnLift AI, CareTail, or CoinRelic from Google Play, or add RoleForge from the Chrome Web Store."
      />
    </>
  )
}

function AppsPage() {
  const [activeFilter, setActiveFilter] = useState<AppCategory>('All')
  const filteredApps = useMemo(
    () =>
      activeFilter === 'All'
        ? apps
        : apps.filter((app) => app.filters.includes(activeFilter)),
    [activeFilter],
  )

  return (
    <PageShell>
      <Meta
        title="Apps | ServiceSphere, LearnLift AI, CareTail, CoinRelic, and RoleForge by DCP Labs"
        description="Explore LearnLift AI for focused study, CareTail for pet owners, CoinRelic for coin collectors, and RoleForge for job seekers preparing tailored applications."
        path="/apps"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'DCP Labs Apps',
            description:
              'Live DCP Labs products for pet owners, coin collectors, and job seekers.',
            url: absoluteUrl('/apps'),
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: apps.map((app, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'SoftwareApplication',
                  name: app.name,
                  url: absoluteUrl(`/${app.slug}`),
                  applicationCategory: app.category,
                  description: app.shortDescription,
                },
              })),
            },
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
          ]),
        ]}
      />
      <section className="section-pad border-b border-white/10">
        <div className="site-container">
          <Reveal>
            <div className="max-w-5xl">
              <p className="section-kicker">Apps</p>
              <h1 className="mt-5 max-w-5xl text-[clamp(3rem,8vw,7.7rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
                Five live products, each built for a specific job.
              </h1>
              <p className="copy-lg mt-7 max-w-2xl text-brand-muted">
                LearnLift AI supports short study sessions for English,
                interviews, and QA learning. CareTail helps pet owners keep
                care details organized. CoinRelic helps collectors identify and
                catalog coins. RoleForge helps job seekers tailor application
                materials from the job post in front of them.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="mt-12 flex flex-wrap gap-2">
              {categoryFilters.map((filter) => (
                <FilterChip
                  key={filter}
                  active={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                  icon={filter === 'All' ? <Filter size={15} /> : null}
                >
                  {filter}
                </FilterChip>
              ))}
            </div>
          </Reveal>

          <div className="mt-10">
            <AnimatePresence mode="popLayout">
              {filteredApps.map((app, index) => (
                <CatalogRow key={app.slug} app={app} index={index} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </PageShell>
  )
}

function AppDetailPage() {
  const { slug = '' } = useParams()
  const app = appBySlug[slug]

  if (!app) return <NotFoundPage />

  if (app.slug === 'caretail') return <CareTailPage app={app} />
  if (app.slug === 'coinrelic') return <CoinRelicPage app={app} />
  if (app.slug === 'roleforge') return <RoleForgePage app={app} />
  if (app.slug === 'learnlift-ai') return <LearnLiftPage app={app} />
  if (app.slug === 'servicesphere-field-service-app') {
    return <ServiceSpherePage />
  }

  return <NotFoundPage />
}

function LearnLiftPage({ app }: { app: StudioApp }) {
  const trustPoints = [
    'English practice',
    'Interview preparation',
    'IT & QA learning',
    'Short daily sessions',
  ]
  const features = [
    {
      title: 'Guided study sessions',
      body: 'Start from a chosen path and move through focused practice without rebuilding a study plan every day.',
      icon: ListChecks,
    },
    {
      title: 'English practice',
      body: 'Use vocabulary and speaking prep paths for practical workplace English practice.',
      icon: Languages,
    },
    {
      title: 'Job interview preparation',
      body: 'Review common interview themes, behavioral questions, and answer structure in small steps.',
      icon: Target,
    },
    {
      title: 'IT and QA learning topics',
      body: 'Practice QA, SQL, automation, and technical interview topics through available study packs.',
      icon: BookOpenCheck,
    },
    {
      title: 'Progress-friendly structure',
      body: 'Track weak topics and review signals so it is easier to decide what to practice next.',
      icon: BarChart3,
    },
    {
      title: 'Smart Review flashcards',
      body: 'Return to due cards and mark what is known or needs review during short flashcard sessions.',
      icon: Brain,
    },
  ]
  const gallery = [
    {
      src: app.screenshots[1],
      title: 'Choose a focused path',
      body: 'Start with English vocabulary, job interview prep, or a technical study path so practice has a clear next step.',
      alt: 'LearnLift AI screenshot showing selectable study paths for English vocabulary and job interview prep',
    },
    {
      src: app.screenshots[2],
      title: 'Review with flashcards',
      body: 'Flashcard practice keeps questions, answer reveal, and session review in a focused flow.',
      alt: 'LearnLift AI screenshot showing flashcard preview practice with answer reveal and session review',
    },
    {
      src: app.screenshots[3],
      title: 'Track weak topics',
      body: 'Progress review highlights topics that need more practice without turning learning into a complicated dashboard.',
      alt: 'LearnLift AI screenshot showing daily progress and weak topics to review',
    },
    {
      src: app.screenshots[4],
      title: 'Go deeper with Premium',
      body: 'Premium packs add focused practice areas such as SQL, QA, and automation basics.',
      alt: 'LearnLift AI screenshot showing premium study packs for SQL QA and automation practice',
    },
  ]

  return (
    <div className="product-theme product-theme-learning product-page min-h-screen">
      <Meta
        title="LearnLift AI — Study Coach for English, Interviews and QA"
        description="LearnLift AI helps learners practice English, job interview preparation, and IT/QA topics through short guided study sessions."
        path="/learnlift-ai"
        image="/og-learnlift-ai.png"
        jsonLd={[
          softwareApplicationJsonLd({
            app,
            path: '/learnlift-ai',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Android',
          }),
          faqJsonLd(app),
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'LearnLift AI', path: '/learnlift-ai' },
          ]),
        ]}
      />

      <section className="relative overflow-hidden border-b border-[#ED64A6]/20 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(85,60,154,0.72),transparent_34%),radial-gradient(circle_at_82%_30%,rgba(237,100,166,0.34),transparent_30%),linear-gradient(145deg,#090614,#1B1230_54%,#10091E)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.85)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.85)_1px,transparent_1px)] [background-size:88px_88px]" />
        <div className="site-container relative grid gap-12 py-8 md:py-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <Reveal>
            <div>
              <Link
                to="/apps"
                className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-bold product-link transition"
              >
                <ChevronRight className="rotate-180" size={16} />
                Back to DCP Labs apps
              </Link>
              <div className="flex flex-wrap items-center gap-4">
                {app.iconImage ? (
                  <img
                    src={app.iconImage}
                    alt="LearnLift AI app icon"
                    className="h-16 w-16 rounded-[20px] object-cover shadow-[0_22px_56px_rgba(237,100,166,0.28)]"
                  />
                ) : (
                  <AppSymbol app={app} />
                )}
                <span className="rounded-full product-chip px-3 py-1 text-sm font-bold">
                  Elevate Your Skills, Effortlessly.
                </span>
              </div>
              <h1 className="mt-7 max-w-4xl text-[clamp(2.75rem,5.2vw,5.1rem)] font-semibold leading-[0.93] tracking-[-0.04em] text-white">
                A study coach for focused daily practice.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 product-muted">
                LearnLift AI helps learners practice English, job interview
                preparation, and IT/QA topics through short guided study
                sessions, flashcards, quizzes, and progress review.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <LearnLiftStoreButton href={app.storeUrl}>
                  Get it on Google Play
                </LearnLiftStoreButton>
                <Link
                  to="/apps"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/16 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-px hover:border-white/32 hover:bg-white/[0.08]"
                >
                  Explore DCP Labs apps
                  <ArrowRight size={17} />
                </Link>
              </div>
              <ProductFacts
                facts={app.storeFacts}
                className="mt-6"
                itemClassName="product-chip"
              />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute inset-y-10 right-10 w-72 rounded-full bg-[#ED64A6]/24 blur-3xl" />
              <div className="absolute bottom-10 left-2 hidden h-52 w-52 rounded-full border border-[#ED64A6]/18 bg-[#553C9A]/22 lg:block" />
              <LearnLiftImagePanel
                src={app.screenshots[0]}
                alt="LearnLift AI app screenshot showing the home study coach dashboard with flashcards quizzes smart review and study plans"
                featured
                priority
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-[#ED64A6]/16 bg-[#0C0818]">
        <div className="site-container grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((point) => (
            <div
              key={point}
              className="border-b border-[#ED64A6]/14 py-5 sm:border-r sm:last:border-r-0 lg:border-b-0"
            >
              <span className="text-sm font-bold text-[#F0C5DD]">{point}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[#ED64A6]/14 bg-[#0B0715] py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(85,60,154,0.34),transparent_34%),linear-gradient(180deg,#0B0715,#130B24)]" />
        <div className="site-container grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <Reveal>
            <div className="relative">
              <p className="section-kicker border-[#ED64A6]/28 bg-[#ED64A6]/10 text-[#FFD4E8]">
                Why it exists
              </p>
              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-6xl">
                Learning for interviews and QA can get scattered.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="relative max-w-3xl rounded-[20px] border border-white/10 bg-white/[0.055] p-6 text-lg leading-8 text-[#E9DDF6] shadow-[0_12px_30px_rgba(0,0,0,0.20)] md:p-8">
              <p>
                A learner might have English notes in one place, interview
                questions somewhere else, and QA practice split across saved
                links. LearnLift AI gives that practice a simple structure:
                choose a path, complete a short session, review weak topics,
                and come back tomorrow.
              </p>
              <p className="mt-5">
                The page focuses on visible app features: study paths,
                flashcards, quizzes, Smart Review, progress review, and Premium
                Study Packs.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#120B22] py-16 md:py-24">
        <div className="site-container">
          <Reveal>
            <div className="max-w-4xl">
              <p className="section-kicker border-[#ED64A6]/28 bg-[#ED64A6]/10 text-[#FFD4E8]">
                Study coach app
              </p>
              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-6xl">
                Built for short sessions that are easy to repeat.
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon

              return (
                <Reveal key={feature.title} delay={index * 0.035}>
                  <div className="h-full rounded-[18px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ED64A6]/24 bg-[#ED64A6]/12 text-[#FFD4E8]">
                      <Icon size={20} strokeWidth={1.8} />
                    </span>
                    <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-4 leading-7 text-[#C9BCD8]">
                      {feature.body}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-[#ED64A6]/14 bg-[#0A0613] py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(237,100,166,0.16),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(85,60,154,0.28),transparent_32%),linear-gradient(180deg,#0A0613,#150C26_55%,#0B0715)]" />
        <div className="site-container">
          <Reveal>
            <div className="relative grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
              <div>
                <p className="section-kicker border-[#ED64A6]/28 bg-[#ED64A6]/10 text-[#FFD4E8]">
                  Real app screens
                </p>
                <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-6xl">
                  Study paths, review, and progress in one flow.
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 product-muted">
                Screenshots show the current Android experience, including
                path selection, Smart Review flashcards, progress signals, and
                premium practice packs.
              </p>
            </div>
          </Reveal>
          <div className="relative mt-12 grid gap-8">
            {gallery.map((item, index) => (
              <Reveal key={item.src} delay={index * 0.045}>
                <article className="grid gap-8 rounded-[22px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_16px_44px_rgba(0,0,0,0.22)] md:p-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <span className="text-sm font-bold text-[#ED64A6]">
                      0{index + 1}
                    </span>
                    <h3 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white md:text-5xl">
                      {item.title}
                    </h3>
                    <p className="mt-5 text-lg leading-8 product-muted">
                      {item.body}
                    </p>
                  </div>
                  <LearnLiftImagePanel
                    src={item.src}
                    alt={item.alt}
                    featured
                  />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0C0818] py-16 md:py-24">
        <div className="site-container grid gap-10 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
          <Reveal>
            <div>
              <p className="section-kicker border-[#ED64A6]/28 bg-[#ED64A6]/10 text-[#FFD4E8]">
                Who it is for
              </p>
              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-6xl">
                For learners who want a clearer next step.
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {app.audience.map((item, index) => (
              <Reveal key={item} delay={index * 0.04}>
                <div className="flex h-full gap-3 rounded-[18px] border border-white/10 bg-white/[0.045] p-5">
                  <Check className="mt-1 shrink-0 text-[#ED64A6]" size={18} />
                  <span className="leading-7 product-muted">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <LearnLiftFaq app={app} />

      <section className="border-t border-[#ED64A6]/20 bg-[linear-gradient(135deg,#130B24,#2A1747_56%,#10091E)] py-16 md:py-24">
        <div className="site-container flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
              Start with one focused study session.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 product-muted">
              Download LearnLift AI from Google Play and practice English,
              interview preparation, or QA topics in small steps.
            </p>
          </div>
          <LearnLiftStoreButton href={app.storeUrl}>
            Get it on Google Play
          </LearnLiftStoreButton>
        </div>
      </section>
    </div>
  )
}

function LearnLiftFaq({ app }: { app: StudioApp }) {
  return (
    <section className="relative overflow-hidden border-t border-[#ED64A6]/14 bg-[#0B0715] py-16 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(85,60,154,0.26),transparent_32%),linear-gradient(180deg,#0B0715,#120A21)]" />
      <div className="site-container relative max-w-5xl">
        <Reveal>
          <div>
            <p className="section-kicker border-[#ED64A6]/28 bg-[#ED64A6]/10 text-[#FFD4E8]">
              LearnLift AI FAQ
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
              Questions before you start
            </h2>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4">
          {app.faq.map((item, index) => (
            <Reveal key={item.question} delay={index * 0.04}>
              <article className="rounded-[18px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.16)] md:p-6">
                <h3 className="text-xl font-semibold tracking-[-0.025em] text-white md:text-2xl">
                  {item.question}
                </h3>
                <p className="mt-3 text-base leading-7 product-muted md:text-lg md:leading-8">
                  {item.answer}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function LearnLiftImagePanel({
  src,
  alt,
  featured = false,
  priority = false,
}: {
  src: string
  alt: string
  featured?: boolean
  priority?: boolean
}) {
  const maxWidth = featured ? 'max-w-[640px]' : 'max-w-[420px]'

  return (
    <div className={`relative mx-auto w-full ${maxWidth}`}>
      <div className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_35%_15%,rgba(237,100,166,0.20),transparent_45%),radial-gradient(circle_at_75%_75%,rgba(85,60,154,0.18),transparent_42%)] blur-2xl" />
      <div
        className={`relative border border-white/14 bg-white/[0.07] shadow-[0_16px_44px_rgba(24,9,42,0.24)] ${
          featured ? 'rounded-[20px] p-2.5' : 'rounded-[18px] p-1.5'
        }`}
      >
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className={`h-auto w-full object-contain ${
            featured ? 'rounded-[17px]' : 'rounded-[20px]'
          }`}
        />
      </div>
    </div>
  )
}

function LearnLiftStoreButton({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#ED64A6] bg-[#ED64A6] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_46px_rgba(237,100,166,0.28)] transition hover:-translate-y-px hover:bg-[#F174B3]"
    >
      {children}
      <ArrowRight size={17} />
    </a>
  )
}

function CareTailPage({ app }: { app: StudioApp }) {
  const panels = [
    {
      title: 'One profile for every pet',
      body: "Keep each pet's routines, reminders, notes, and records separate so the details stay easy to review.",
      image: app.screenshots[2],
      alt: 'CareTail promo showing a pet profile with reminders, documents, and care history',
    },
    {
      title: 'Care reminders',
      body: 'Create reminders for medication, grooming, food, vaccines, vet visits, and custom care tasks.',
      image: app.screenshots[3],
      alt: 'CareTail promo showing pet care reminders for vaccines medication and vet visits',
    },
    {
      title: 'Diary notes over time',
      body: 'Log appetite, mood, energy, symptoms, observations, and notes without turning everyday care into complicated recordkeeping.',
      image: app.screenshots[4],
      alt: 'CareTail promo showing diary notes for mood appetite energy symptoms and notes',
    },
    {
      title: 'Documents and records',
      body: 'Save vaccine records, prescriptions, insurance files, and documents so appointment prep feels less scattered.',
      image: app.screenshots[5],
      alt: 'CareTail promo showing organized vet records documents prescriptions and insurance files',
    },
  ]

  return (
    <div className="product-theme product-theme-petcare product-page min-h-screen">
      <Meta
        title="CareTail | Pet Care Tracker App for Reminders, Notes, and Records"
        description="CareTail is a pet care tracker app for organizing pet profiles, reminders, diary notes, documents, reports, and multi-pet care history."
        path="/caretail"
        image="/og-caretail.svg"
        jsonLd={[
          softwareApplicationJsonLd({
            app,
            path: '/caretail',
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'Android',
          }),
          faqJsonLd(app),
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'CareTail', path: '/caretail' },
          ]),
        ]}
      />

      <section className="relative overflow-hidden border-b border-[#50BFB7]/20 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(80,191,183,0.30),transparent_34%),radial-gradient(circle_at_86%_20%,rgba(255,104,104,0.14),transparent_28%),linear-gradient(135deg,#E4FFFB,#FFF8EB_76%)]" />
        <div className="site-container relative grid min-h-[calc(100dvh-6rem)] gap-12 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div>
              <Link
                to="/apps"
                className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-bold product-link transition"
              >
                <ChevronRight className="rotate-180" size={16} />
                Back to DCP Labs
              </Link>
              <div className="flex items-center gap-4">
                {app.iconImage ? (
                  <img
                    src={app.iconImage}
                    alt="CareTail app icon"
                    className="h-16 w-16 rounded-[20px] object-cover shadow-[0_22px_50px_rgba(80,191,183,0.24)]"
                  />
                ) : (
                  <AppSymbol app={app} />
                )}
                <span className="rounded-full product-chip px-3 py-1 text-sm font-bold shadow-[0_14px_36px_rgba(80,191,183,0.14)]">
                  Live on Google Play
                </span>
              </div>
              <h1 className="mt-8 max-w-4xl text-[clamp(3.2rem,7.4vw,7.4rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-[#15212A]">
                Care routines, notes, and records in one calm place.
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 product-soft">
                CareTail helps pet owners organize profiles, reminders, diary
                notes, documents, and care history without keeping everything in
                their head.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <CareTailStoreButton href={app.storeUrl}>
                  {app.storeLabel}
                </CareTailStoreButton>
                <Link
                  to="/apps"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#2B817C]/20 bg-white px-5 py-3 text-sm font-bold text-[#174F4B] shadow-[0_14px_34px_rgba(21,33,42,0.08)] transition hover:-translate-y-px hover:border-[#2B817C]/36"
                >
                  View DCP apps
                  <ArrowRight size={17} />
                </Link>
              </div>
              <ProductFacts
                facts={app.storeFacts}
                className="mt-6"
                itemClassName="product-chip"
              />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative">
              <div className="absolute inset-8 rounded-full bg-[#50BFB7]/20 blur-3xl" />
              <CareTailPromoPanel
                src={app.screenshots[0]}
                alt="CareTail feature graphic showing pet profiles care reminders health diary and vet records"
                wide
                priority
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#F8FFFC] py-16 md:py-24">
        <div className="site-container max-w-5xl">
          <Reveal>
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#15212A] md:text-6xl">
              Pet care details get scattered fast.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 product-muted">
              Notes, calendars, documents, photos, and memory all end up
              carrying part of the routine. CareTail brings reminders, records,
              and observations into one organized pet care tracker.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#ECFBF7] py-16 md:py-24">
        <div className="site-container">
          <Reveal>
            <div className="max-w-4xl">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#15212A] md:text-6xl">
                Built for everyday care, not clinical overwhelm.
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              ['Pet profiles', "Keep each pet's routines, notes, and records separate."],
              ['Care reminders', 'Track grooming, food, medication, vaccines, and visits.'],
              ['Diary notes', 'Log appetite, mood, energy, symptoms, and observations.'],
              ['Vet records', 'Keep documents and reports easier to find when needed.'],
            ].map(([title, body]) => (
              <Reveal key={title}>
                <div className="h-full rounded-[18px] border border-[#50BFB7]/18 bg-white/76 p-6 shadow-[0_12px_28px_rgba(43,129,124,0.08)]">
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#15212A]">
                    {title}
                  </h3>
                  <p className="mt-4 leading-7 product-muted">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F8FFFC] py-16 md:py-24">
        <div className="site-container grid gap-8">
          {panels.map((panel, index) => (
            <Reveal key={panel.title} delay={index * 0.04}>
              <div className="grid gap-8 rounded-[22px] border border-[#50BFB7]/16 bg-white/80 p-5 shadow-[0_14px_34px_rgba(43,129,124,0.08)] lg:grid-cols-[0.42fr_0.58fr] lg:items-center lg:p-8">
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#15212A] md:text-6xl">
                    {panel.title}
                  </h2>
                  <p className="mt-5 text-lg leading-8 product-muted">
                    {panel.body}
                  </p>
                  {panel.title === 'Care reminders' ? (
                    <p className="mt-5 rounded-[22px] border border-[#50BFB7]/18 bg-[#ECFBF7] p-4 text-sm leading-6 text-[#2B817C]">
                      CareTail reminders are user-created organizational tools
                      and are not medical advice.
                    </p>
                  ) : null}
                </div>
                <CareTailPromoPanel
                  src={panel.image}
                  alt={panel.alt}
                  portrait
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-[#E6FAF7] py-16 md:py-24">
        <div className="site-container grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <Reveal>
            <div>
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#15212A] md:text-6xl">
                Calm organization for more than one pet.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 product-muted">
                CareTail supports separate profiles so each pet can have its
                own routines, notes, reminders, and documents. Premium gives
                more room for more pets, routines, documents, and care history.
              </p>
              <div className="mt-8 grid gap-4">
                {app.benefits.map((benefit) => (
                  <div key={benefit} className="flex gap-3 text-[#236A66]">
                    <Check className="mt-1 shrink-0 text-[#FF6868]" size={18} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <CareTailPromoPanel
              src={app.screenshots[6]}
              alt="CareTail promo showing today's care dashboard with pets reminders and quick actions"
              portrait
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-[#F8FFFC] py-16 md:py-24">
        <div className="site-container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <CareTailPromoPanel
              src={app.screenshots[1]}
              alt="CareTail promo showing all pet care profiles reminders notes and records in one place"
              portrait
            />
          </Reveal>
          <Reveal delay={0.05}>
            <div>
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#15212A] md:text-6xl">
                Local-first, with optional sign-in.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 product-muted">
                CareTail can be used locally without creating an account.
                Google Sign-In is optional, while the core experience stays
                focused on local-first organization.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-[#50BFB7]/20 bg-[#ECFBF7] px-4 py-2 text-sm font-bold text-[#236A66]">
                  Local-first organization
                </span>
                <span className="rounded-full border border-[#50BFB7]/20 bg-[#ECFBF7] px-4 py-2 text-sm font-bold text-[#236A66]">
                  Optional Google Sign-In
                </span>
                <span className="rounded-full border border-[#50BFB7]/20 bg-[#ECFBF7] px-4 py-2 text-sm font-bold text-[#236A66]">
                  User-created reminders
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CareTailFaq app={app} />

      <CareTailUseCaseLinks />

      <section className="border-t border-[#50BFB7]/20 bg-[linear-gradient(135deg,#E4FFFB,#FFF8EB)] py-16 md:py-24">
        <div className="site-container flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[#15212A] md:text-6xl">
              Put pet care details in one calm place.
            </h2>
            <p className="mt-5 text-lg product-muted">
              Download CareTail from Google Play.
            </p>
          </div>
          <CareTailStoreButton href={app.storeUrl}>
            Get it on Google Play
          </CareTailStoreButton>
        </div>
      </section>
    </div>
  )
}

function CareTailSupportPage() {
  const { careTailPageSlug = '' } = useParams()
  const page = careTailSeoPageBySlug[careTailPageSlug]
  const app = appBySlug.caretail

  if (!page || !app) return <NotFoundPage />

  const path = `/caretail/${page.slug}`
  const relatedPages = page.related
    .map((slug) => careTailSeoPageBySlug[slug])
    .filter((item): item is CareTailSeoPage => Boolean(item))

  return (
    <div className="product-theme product-theme-petcare product-page min-h-screen">
      <Meta
        title={page.title}
        description={page.metaDescription}
        path={path}
        image="/og-caretail.svg"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: page.h1,
            description: page.metaDescription,
            url: absoluteUrl(path),
            isPartOf: {
              '@type': 'WebSite',
              name: 'DCP Labs',
              url: absoluteUrl('/'),
            },
            about: {
              '@type': 'SoftwareApplication',
              name: 'CareTail',
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'Android',
              url: absoluteUrl('/caretail'),
            },
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'CareTail', path: '/caretail' },
            { name: page.h1, path },
          ]),
        ]}
      />

      <section className="relative overflow-hidden border-b border-[#50BFB7]/20 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(80,191,183,0.28),transparent_34%),radial-gradient(circle_at_90%_20%,rgba(255,104,104,0.12),transparent_28%),linear-gradient(135deg,#E4FFFB,#FFF8EB_80%)]" />
        <div className="site-container relative grid gap-12 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div>
              <Link
                to="/caretail"
                className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-bold product-link transition"
              >
                <ChevronRight className="rotate-180" size={16} />
                Back to CareTail
              </Link>
              <div className="flex flex-wrap items-center gap-4">
                {app.iconImage ? (
                  <img
                    src={app.iconImage}
                    alt="CareTail app icon"
                    className="h-14 w-14 rounded-[18px] object-cover shadow-[0_18px_44px_rgba(80,191,183,0.22)]"
                  />
                ) : (
                  <AppSymbol app={app} small />
                )}
                <span className="rounded-full product-chip px-3 py-1 text-sm font-bold shadow-[0_14px_36px_rgba(80,191,183,0.14)]">
                  {page.keyword}
                </span>
              </div>
              <h1 className="mt-8 max-w-4xl text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.94] tracking-[-0.04em] text-[#15212A]">
                {page.h1}
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 product-soft">
                {page.problem}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <CareTailStoreButton href={app.storeUrl}>
                  Get CareTail on Google Play
                </CareTailStoreButton>
                <Link
                  to="/apps"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#2B817C]/20 bg-white px-5 py-3 text-sm font-bold text-[#174F4B] shadow-[0_14px_34px_rgba(21,33,42,0.08)] transition hover:-translate-y-px hover:border-[#2B817C]/36"
                >
                  View DCP apps
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <CareTailPromoPanel
              src={app.screenshots[page.imageIndex]}
              alt={page.imageAlt}
              wide={page.imageIndex === 0}
              portrait={page.imageIndex !== 0}
              priority
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-[#F8FFFC] py-16 md:py-24">
        <div className="site-container grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <Reveal>
            <div>
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#15212A] md:text-6xl">
                How CareTail helps
              </h2>
              <p className="mt-6 text-lg leading-8 product-muted">
                {page.explanation}
              </p>
              <p className="mt-6 rounded-[24px] border border-[#50BFB7]/18 bg-[#ECFBF7] p-5 text-sm leading-6 text-[#2B817C]">
                {page.safetyLine}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="grid gap-4 md:grid-cols-2">
              {page.features.map((feature) => (
                <div
                  key={feature}
                  className="flex gap-3 rounded-[18px] border border-[#50BFB7]/18 bg-white/82 p-5 shadow-[0_10px_26px_rgba(43,129,124,0.08)]"
                >
                  <Check className="mt-1 shrink-0 text-[#FF6868]" size={18} />
                  <span className="leading-7 text-[#236A66]">{feature}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#ECFBF7] py-16 md:py-24">
        <div className="site-container grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <div>
              <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[#15212A] md:text-6xl">
                Keep pet care details organized with CareTail.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 product-muted">
                Explore the main CareTail page for the full product overview,
                screenshots, FAQ, and official Google Play link.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="flex flex-wrap gap-3">
              <CareTailStoreButton href={app.storeUrl}>
                Get CareTail on Google Play
              </CareTailStoreButton>
              <Link
                to="/caretail"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#2B817C]/20 bg-white px-5 py-3 text-sm font-bold text-[#174F4B] shadow-[0_14px_34px_rgba(21,33,42,0.08)] transition hover:-translate-y-px hover:border-[#2B817C]/36"
              >
                View CareTail
                <ArrowRight size={17} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CareTailUseCaseLinks currentSlug={page.slug} relatedPages={relatedPages} />
    </div>
  )
}

function CareTailUseCaseLinks({
  currentSlug,
  relatedPages,
}: {
  currentSlug?: string
  relatedPages?: CareTailSeoPage[]
}) {
  const pages =
    relatedPages ??
    careTailSeoPages.filter((page) => page.slug !== currentSlug)

  return (
    <section className="border-t border-[#50BFB7]/20 bg-[#F8FFFC] py-16 md:py-24">
      <div className="site-container">
        <Reveal>
          <div className="max-w-3xl">
            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-[#15212A] md:text-6xl">
              Explore CareTail use cases
            </h2>
            <p className="mt-5 text-lg leading-8 product-muted">
              Practical guides for organizing routines, reminders, notes,
              records, and multi-pet care with CareTail.
            </p>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((item) => (
            <Reveal key={item.slug}>
              <Link
                to={`/caretail/${item.slug}`}
                className="group flex h-full flex-col justify-between rounded-[18px] border border-[#50BFB7]/18 bg-white/82 p-6 shadow-[0_10px_26px_rgba(43,129,124,0.08)] transition hover:-translate-y-1 hover:border-[#50BFB7]/34"
              >
                <span className="text-sm font-bold text-[#2B817C]">
                  {item.keyword}
                </span>
                <span className="mt-5 block text-2xl font-semibold tracking-[-0.03em] text-[#15212A]">
                  {item.h1}
                </span>
                <span className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#FF6868]">
                  Read guide
                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CareTailPromoPanel({
  src,
  alt,
  wide = false,
  portrait = false,
  priority = false,
}: {
  src: string
  alt: string
  wide?: boolean
  portrait?: boolean
  priority?: boolean
}) {
  const maxWidth = wide ? 'max-w-[920px]' : portrait ? 'max-w-[430px]' : 'max-w-[620px]'

  return (
    <div className={`relative mx-auto w-full ${maxWidth}`}>
      <div className="absolute -inset-5 rounded-[2.25rem] bg-[radial-gradient(circle_at_48%_30%,rgba(80,191,183,0.22),transparent_52%),radial-gradient(circle_at_82%_76%,rgba(255,104,104,0.12),transparent_42%)] blur-2xl" />
      <div className="relative rounded-[20px] border border-[#50BFB7]/18 bg-white/72 p-2 shadow-[0_14px_34px_rgba(43,129,124,0.12),inset_0_1px_0_rgba(255,255,255,0.70)]">
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="h-auto w-full rounded-[24px] object-contain"
        />
      </div>
    </div>
  )
}

function CareTailStoreButton({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#FF6868] bg-[#FF6868] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_42px_rgba(255,104,104,0.24)] transition hover:-translate-y-px hover:bg-[#F85E5E]"
    >
      {children}
      <ArrowRight size={17} />
    </a>
  )
}

function CareTailFaq({ app }: { app: StudioApp }) {
  return (
    <section className="bg-[#ECFBF7] py-16 md:py-24">
      <div className="site-container max-w-5xl">
        <Reveal>
          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-[#15212A] md:text-6xl">
            CareTail FAQ
          </h2>
        </Reveal>
        <div className="mt-8 divide-y divide-[#50BFB7]/18 border-y border-[#50BFB7]/18">
          {app.faq.map((item) => (
            <div key={item.question} className="py-7">
              <h3 className="text-2xl font-semibold text-[#15212A]">
                {item.question}
              </h3>
              <p className="mt-4 text-lg leading-8 product-muted">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CoinRelicPage({ app }: { app: StudioApp }) {
  const workflows = [
    {
      title: 'Scan a coin',
      body: 'Capture a coin from the mobile app and start a new identification record in seconds.',
      image: app.screenshots[0],
    },
    {
      title: 'Review identification details',
      body: 'Review possible identity, value context, rarity cues, and details worth checking before you save the find.',
      image: app.screenshots[1],
    },
    {
      title: 'Save to collection',
      body: 'Add important finds to a digital catalog with photos, notes, and details you can return to later.',
      image: app.screenshots[2],
    },
    {
      title: 'Track history and notes',
      body: 'Keep scan history, watched coins, achievements, and collection notes together as your catalog grows.',
      image: app.screenshots[3],
    },
  ]
  const galleryAltText = [
    'CoinRelic promo showing camera coin identification',
    'CoinRelic promo showing coin value and rarity context',
    'CoinRelic promo showing saved coin collection tracking',
    'CoinRelic promo showing collector achievements and scan history',
  ]

  return (
    <div className="product-theme product-theme-collector product-page min-h-screen">
      <Meta
        title="CoinRelic | Coin Identification and Collection Tracking App"
        description="CoinRelic helps coin collectors identify coins, save scan history, organize collection notes, and build a cleaner digital coin catalog."
        path="/coinrelic"
        image="/og-coinrelic.svg"
        jsonLd={[
          softwareApplicationJsonLd({
            app,
            path: '/coinrelic',
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'Android',
          }),
          faqJsonLd(app),
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'CoinRelic', path: '/coinrelic' },
          ]),
        ]}
      />
      <section className="relative overflow-hidden border-b border-[#D6A94B]/20 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_22%,rgba(214,169,75,0.18),transparent_32%),radial-gradient(circle_at_22%_78%,rgba(40,90,120,0.24),transparent_35%),linear-gradient(180deg,#03070B,#07111A_55%,#03070B)]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_center,rgba(214,169,75,0.45)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="site-container relative grid min-h-[calc(100dvh-6rem)] gap-12 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <Reveal>
            <div>
              <Link
                to="/apps"
                className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold product-link transition"
              >
                <ChevronRight className="rotate-180" size={16} />
                Back to DCP Labs
              </Link>
              <div className="flex items-center gap-4">
                {app.iconImage ? (
                  <img
                    src={app.iconImage}
                    alt="CoinRelic app icon"
                    className="h-16 w-16 rounded-[22px] object-cover shadow-[0_0_44px_rgba(214,169,75,0.28)]"
                  />
                ) : (
                  <AppSymbol app={app} />
                )}
                <span className="rounded-full product-chip px-3 py-1 text-sm font-bold">
                  Live on Google Play
                </span>
              </div>
              <h1 className="mt-8 max-w-4xl text-[clamp(3.8rem,8vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.04em] text-[#FFF8DF]">
                Identify coins. Organize every find.
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-9 product-soft">
                {app.heroLine}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <StoreButton href={app.storeUrl}>{app.storeLabel}</StoreButton>
                <Link
                  to="/apps"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#DAD4CA] bg-white px-4 py-3 text-sm font-bold text-[#10211D] transition hover:-translate-y-px hover:border-[#10211D]"
                >
                  Explore apps
                  <ArrowRight size={17} />
                </Link>
                <Link
                  to="/coinrelic/is-my-coin-rare"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#D6A94B]/40 bg-[#D6A94B]/10 px-4 py-3 text-sm font-bold text-[#F7E8B5] transition hover:-translate-y-px hover:border-[#D6A94B]/70 hover:bg-[#D6A94B]/16"
                >
                  Check rarity signals
                  <ArrowRight size={17} />
                </Link>
              </div>
              <ProductFacts
                facts={app.storeFacts}
                className="mt-6"
                itemClassName="product-chip"
              />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute inset-y-8 right-8 w-72 rounded-full bg-[#D6A94B]/16 blur-3xl" />
              <div className="absolute bottom-2 left-8 hidden h-48 w-48 rounded-full border border-[#D6A94B]/15 bg-[radial-gradient(circle,rgba(214,169,75,0.18),transparent_64%)] lg:block" />
              <CoinRelicPromoPanel
                src={app.screenshots[0]}
                alt="CoinRelic coin identification app promo screenshot"
                featured
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#050B10] py-20 md:py-28">
        <div className="site-container">
          <Reveal>
            <div className="max-w-4xl">
              <p className="section-kicker border-[#D6A94B]/30 bg-[#D6A94B]/10 text-[#D6A94B]">
                How CoinRelic works
              </p>
              <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#FFF8DF] md:text-6xl">
                From a loose find to a clear record.
              </h2>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-6">
            {workflows.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.04}>
                <div className="grid overflow-hidden rounded-[20px] border border-[#D6A94B]/16 bg-[linear-gradient(135deg,#08131B,#03070B)] lg:grid-cols-[0.92fr_0.88fr] lg:items-center">
                  <div
                    className={`flex flex-col justify-between p-7 md:p-10 ${
                      index % 2 === 1 ? 'lg:order-2' : ''
                    }`}
                  >
                    <span className="font-mono text-sm text-[#D6A94B]">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="mt-10 text-3xl font-semibold tracking-[-0.03em] text-[#FFF8DF] md:text-5xl">
                        {item.title}
                      </h3>
                      <p className="mt-5 text-lg leading-8 product-muted">
                        {item.body}
                      </p>
                    </div>
                  </div>
                  <div className="relative p-6 md:p-9">
                    <div className="absolute inset-x-10 top-1/2 h-28 -translate-y-1/2 rounded-full bg-[#D6A94B]/10 blur-3xl" />
                    <CoinRelicPromoPanel
                      src={item.image}
                      alt={`CoinRelic ${item.title.toLowerCase()} screenshot`}
                      compact={index === 2}
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#020609] py-20 md:py-28">
        <div className="site-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal>
            <div>
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#FFF8DF] md:text-6xl">
                Keep the story of every coin.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 product-muted">
                CoinRelic keeps the collecting process organized: identify a
                coin, check the details, save the record, and revisit it when
                your catalog changes.
              </p>
              <div className="mt-8 grid gap-4">
                {app.benefits.map((benefit) => (
                  <div key={benefit} className="flex gap-3 text-[#E9D8A6]">
                    <Check className="mt-1 shrink-0 text-[#D6A94B]" size={18} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="grid gap-5 sm:grid-cols-2">
              {app.screenshots.slice(0, 4).map((screenshot, index) => (
                <CoinRelicPromoPanel
                  key={screenshot}
                  src={screenshot}
                  alt={galleryAltText[index]}
                  compact={index === 2}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <ProductFaq
        app={app}
        className="bg-[#050B10] text-[#FFF8DF]"
        mutedClassName="product-muted"
      />

      <section className="border-t border-[#D6A94B]/20 bg-[#03070B] py-16">
        <div className="site-container">
          <Reveal>
            <div className="grid gap-6 rounded-[20px] border border-[#D6A94B]/16 bg-[linear-gradient(135deg,#08131B,#03070B)] p-7 md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="section-kicker border-[#D6A94B]/30 bg-[#D6A94B]/10 text-[#D6A94B]">
                  Free collector checklist
                </p>
                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-[#FFF8DF] md:text-5xl">
                  Is your coin worth a closer look?
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 product-muted">
                  Use the CoinRelic checklist to review date, mint mark,
                  condition, and error signals before scanning and saving the
                  coin.
                </p>
              </div>
              <Link
                to="/coinrelic/is-my-coin-rare"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#D6A94B] bg-[#D6A94B] px-5 py-3 text-sm font-bold text-[#07111A] transition hover:-translate-y-px"
              >
                Try the checklist
                <ArrowRight size={17} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[#D6A94B]/20 bg-[#020609] py-20">
        <div className="site-container flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-[#FFF8DF] md:text-6xl">
              Start building a cleaner coin catalog.
            </h2>
            <p className="mt-5 text-lg product-muted">
              Download CoinRelic from Google Play.
            </p>
          </div>
          <StoreButton href={app.storeUrl}>{app.storeLabel}</StoreButton>
        </div>
      </section>
    </div>
  )
}

function CoinRelicPromoPanel({
  src,
  alt,
  featured = false,
  compact = false,
}: {
  src: string
  alt: string
  featured?: boolean
  compact?: boolean
}) {
  const maxWidth = compact
    ? 'max-w-[370px]'
    : featured
      ? 'max-w-[470px]'
      : 'max-w-[460px]'

  return (
    <div
      className={`relative mx-auto w-full ${maxWidth} ${
        featured ? 'drop-shadow-[0_16px_36px_rgba(214,169,75,0.14)]' : ''
      }`}
    >
      <div className="absolute -inset-5 rounded-[2.25rem] bg-[radial-gradient(circle_at_50%_42%,rgba(214,169,75,0.18),transparent_62%)] blur-2xl" />
      <div className="relative rounded-[20px] border border-[#D6A94B]/22 bg-[#06111A] p-2 shadow-[0_18px_44px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,248,223,0.08)]">
        <img
          src={src}
          alt={alt}
          loading={featured ? 'eager' : 'lazy'}
          fetchPriority={featured ? 'high' : 'auto'}
          decoding="async"
          className="h-auto w-full rounded-[24px] object-contain"
        />
      </div>
    </div>
  )
}

type CoinRarityForm = {
  country: string
  year: string
  denomination: string
  mintMark: string
  condition: string
  unusual: string
}

function CoinRelicRarityToolPage() {
  const coinRelic = appBySlug.coinrelic
  const [form, setForm] = useState<CoinRarityForm>({
    country: '',
    year: '',
    denomination: '',
    mintMark: 'Unknown',
    condition: 'Average',
    unusual: 'Not sure',
  })
  const [result, setResult] = useState<{
    score: number
    level: string
    explanation: string
  } | null>(null)

  const updateField = (field: keyof CoinRarityForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const checkCoin = () => {
    const year = Number(form.year)
    let score = 0
    const reasons: string[] = []

    if (Number.isFinite(year) && year > 0) {
      if (year < 1900) {
        score += 3
        reasons.push('the date is before 1900')
      } else if (year <= 1949) {
        score += 2
        reasons.push('the date falls between 1900 and 1949')
      } else if (year <= 1979) {
        score += 1
        reasons.push('the date falls between 1950 and 1979')
      }
    }

    if (form.condition === 'Excellent / Uncirculated') {
      score += 2
      reasons.push('the condition appears especially strong')
    } else if (form.condition === 'Very Good') {
      score += 1
      reasons.push('the condition appears above average')
    }

    if (form.mintMark === 'Unknown' || form.mintMark === 'Other') {
      score += 1
      reasons.push(
        form.mintMark === 'Unknown'
          ? 'the mint mark still needs to be confirmed'
          : 'the mint mark may need closer research',
      )
    }

    if (form.unusual === 'Yes') {
      score += 3
      reasons.push('you noticed a possible error or unusual design detail')
    } else if (form.unusual === 'Not sure') {
      score += 1
      reasons.push('there may be unusual details worth checking')
    }

    const level =
      score >= 6
        ? 'Strong candidate for a closer look'
        : score >= 3
          ? 'Worth checking further'
          : 'Low rarity signals'

    const coinLabel = [
      form.country || 'this coin',
      form.year ? form.year : '',
      form.denomination || '',
    ]
      .filter(Boolean)
      .join(' ')

    const explanation = reasons.length
      ? `${coinLabel} may deserve more research because ${reasons.join(', ')}. This is not an appraisal, but these are reasonable collector signals to inspect.`
      : `${coinLabel} does not show many rarity signals from this checklist. It can still be useful to scan, identify, and save the coin so you have a clean record.`

    setResult({ score, level, explanation })
  }

  return (
    <div className="product-theme product-theme-collector product-page min-h-screen">
      <Meta
        title="Is My Coin Rare? Free Coin Value Checklist | CoinRelic"
        description="Enter your coin's country, year, denomination, mint mark, and condition to see if it may be worth checking further. Use CoinRelic to scan, identify, and track your coin collection."
        path="/coinrelic/is-my-coin-rare"
        image="/og-coinrelic.svg"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Is My Coin Rare? Free Coin Value Checklist',
            description:
              'A free checklist for reviewing coin rarity signals such as date, mint mark, condition, and possible errors.',
            url: absoluteUrl('/coinrelic/is-my-coin-rare'),
            applicationCategory: 'UtilityApplication',
            publisher: {
              '@type': 'Organization',
              name: 'DCP Labs',
              url: absoluteUrl('/'),
            },
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'CoinRelic', path: '/coinrelic' },
            {
              name: 'Is My Coin Rare?',
              path: '/coinrelic/is-my-coin-rare',
            },
          ]),
        ]}
      />

      <section className="relative overflow-hidden border-b border-[#D6A94B]/20 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_24%,rgba(214,169,75,0.18),transparent_30%),radial-gradient(circle_at_16%_76%,rgba(40,90,120,0.22),transparent_34%),linear-gradient(180deg,#03070B,#07111A_58%,#03070B)]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_center,rgba(214,169,75,0.45)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="site-container relative grid gap-12 py-16 md:py-24 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <Reveal>
            <div>
              <Link
                to="/coinrelic"
                className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold product-link transition"
              >
                <ChevronRight className="rotate-180" size={16} />
                Back to CoinRelic
              </Link>
              <p className="section-kicker border-[#D6A94B]/30 bg-[#D6A94B]/10 text-[#D6A94B]">
                Free coin value checklist
              </p>
              <h1 className="mt-6 max-w-4xl text-[clamp(3.6rem,8vw,8rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[#FFF8DF]">
                Is My Coin Rare?
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 product-soft">
                Use this free checklist to see if your coin may be worth
                checking further.
              </p>
              <p className="mt-6 max-w-2xl border-l border-[#D6A94B]/40 pl-5 text-base leading-7 product-muted">
                This tool does not provide an official appraisal. It helps you
                identify signs that a coin may deserve a closer look.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative">
              <div className="absolute inset-8 rounded-full bg-[#D6A94B]/14 blur-3xl" />
              <div className="relative rounded-[22px] border border-[#D6A94B]/18 bg-[#06111A]/92 p-7 shadow-[0_18px_44px_rgba(0,0,0,0.38)] md:p-9">
                <img
                  src={coinRelic.iconImage}
                  alt="CoinRelic app icon"
                  className="h-16 w-16 rounded-[22px] object-cover shadow-[0_0_44px_rgba(214,169,75,0.28)]"
                />
                <h2 className="mt-8 text-3xl font-semibold tracking-[-0.035em] text-[#FFF8DF] md:text-5xl">
                  Look for signals, then save the coin properly.
                </h2>
                <div className="mt-8 grid gap-4">
                  {[
                    'Date and mint mark',
                    'Visible errors',
                    'Condition and wear',
                    'Similar sold examples',
                  ].map((item) => (
                    <div key={item} className="flex gap-3 text-[#E9D8A6]">
                      <Check
                        className="mt-1 shrink-0 text-[#D6A94B]"
                        size={18}
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#050B10] py-16 md:py-24">
        <div className="site-container grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <CoinRarityFormPanel
              form={form}
              updateField={updateField}
              onSubmit={checkCoin}
            />
          </Reveal>
          <Reveal delay={0.05}>
            <CoinRarityResultPanel result={result} app={coinRelic} />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-[#D6A94B]/20 bg-[#020609] py-16 md:py-20">
        <div className="site-container grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <Reveal>
            <div>
              <h2 className="text-4xl font-semibold tracking-[-0.035em] text-[#FFF8DF] md:text-6xl">
                Want to identify and track your coins properly?
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 product-muted">
                CoinRelic helps collectors scan coins, save them to a personal
                collection, keep scan history, and organize discoveries over
                time.
              </p>
            </div>
          </Reveal>
          <StoreButton href={coinRelic.storeUrl}>Download CoinRelic</StoreButton>
        </div>
      </section>

      <CoinRaritySeoContent />
      <CoinRarityFaq app={coinRelic} />
    </div>
  )
}

function CoinRarityFormPanel({
  form,
  updateField,
  onSubmit,
}: {
  form: CoinRarityForm
  updateField: (field: keyof CoinRarityForm, value: string) => void
  onSubmit: () => void
}) {
  return (
    <form
      className="rounded-[20px] border border-[#D6A94B]/16 bg-[#06111A] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.32)] md:p-8"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <h2 className="text-3xl font-semibold tracking-[-0.035em] text-[#FFF8DF] md:text-5xl">
        Check your coin
      </h2>
      <div className="mt-8 grid gap-5">
        <CoinToolField label="Country or region" id="coin-country">
          <input
            id="coin-country"
            value={form.country}
            onChange={(event) => updateField('country', event.target.value)}
            placeholder="United States, Canada, Romania..."
            className="coin-tool-input"
          />
        </CoinToolField>
        <CoinToolField label="Year" id="coin-year">
          <input
            id="coin-year"
            value={form.year}
            onChange={(event) => updateField('year', event.target.value)}
            placeholder="1916"
            min="1"
            max="2100"
            type="number"
            className="coin-tool-input"
          />
        </CoinToolField>
        <CoinToolField label="Denomination" id="coin-denomination">
          <input
            id="coin-denomination"
            value={form.denomination}
            onChange={(event) =>
              updateField('denomination', event.target.value)
            }
            placeholder="Dime, penny, quarter, 1 leu..."
            className="coin-tool-input"
          />
        </CoinToolField>
        <CoinToolField label="Mint mark" id="coin-mint-mark">
          <select
            id="coin-mint-mark"
            value={form.mintMark}
            onChange={(event) => updateField('mintMark', event.target.value)}
            className="coin-tool-input"
          >
            {['Unknown', 'None visible', 'P', 'D', 'S', 'W', 'Other'].map(
              (option) => (
                <option key={option}>{option}</option>
              ),
            )}
          </select>
        </CoinToolField>
        <CoinToolField label="Condition" id="coin-condition">
          <select
            id="coin-condition"
            value={form.condition}
            onChange={(event) => updateField('condition', event.target.value)}
            className="coin-tool-input"
          >
            {[
              'Poor',
              'Average',
              'Good',
              'Very Good',
              'Excellent / Uncirculated',
            ].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </CoinToolField>
        <CoinToolField
          label="Does it look unusual or like it has an error?"
          id="coin-unusual"
        >
          <select
            id="coin-unusual"
            value={form.unusual}
            onChange={(event) => updateField('unusual', event.target.value)}
            className="coin-tool-input"
          >
            {['Not sure', 'No', 'Yes'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </CoinToolField>
        <div className="rounded-[24px] border border-[#D6A94B]/16 bg-[#020609] p-5">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#D6A94B]">
            Photo identification
          </p>
          <p className="mt-3 text-base leading-7 product-muted">
            For photo-based identification, scan your coin in the CoinRelic app.
          </p>
        </div>
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#D6A94B] bg-[#D6A94B] px-5 py-3 text-sm font-bold text-[#07111A] transition hover:-translate-y-px"
        >
          Check my coin
          <ArrowRight size={17} />
        </button>
      </div>
    </form>
  )
}

function CoinToolField({
  label,
  id,
  children,
}: {
  label: string
  id: string
  children: ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-[#E9D8A6]"
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function CoinRarityResultPanel({
  result,
  app,
}: {
  result: { score: number; level: string; explanation: string } | null
  app: StudioApp
}) {
  return (
    <div className="min-h-full rounded-[20px] border border-[#D6A94B]/16 bg-[linear-gradient(135deg,#08131B,#03070B)] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.32)] md:p-8">
      <p className="section-kicker border-[#D6A94B]/30 bg-[#D6A94B]/10 text-[#D6A94B]">
        Checklist result
      </p>
      {result ? (
        <>
          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.035em] text-[#FFF8DF] md:text-6xl">
            {result.level}
          </h2>
          <p className="mt-5 text-lg leading-8 product-muted">
            {result.explanation}
          </p>
          <div className="mt-8 rounded-[24px] border border-[#D6A94B]/16 bg-[#020609] p-5">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#D6A94B]">
              Score
            </p>
            <p className="mt-2 text-3xl font-semibold text-[#FFF8DF]">
              {result.score} points
            </p>
          </div>
        </>
      ) : (
        <>
          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.035em] text-[#FFF8DF] md:text-6xl">
            Your checklist result will appear here.
          </h2>
          <p className="mt-5 text-lg leading-8 product-muted">
            Enter the details you can see on the coin. If you are not sure,
            choose the closest option and use the result as a starting point for
            further research.
          </p>
        </>
      )}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-[#FFF8DF]">
          Things to inspect next
        </h3>
        <div className="mt-5 grid gap-4">
          {[
            'Date and mint mark',
            'Visible errors or unusual design',
            'Condition and wear',
            'Metal composition',
            'Similar sold examples',
          ].map((item) => (
            <div key={item} className="flex gap-3 text-[#E9D8A6]">
              <Check className="mt-1 shrink-0 text-[#D6A94B]" size={18} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-9 flex flex-wrap gap-3">
        <a
          href={app.storeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#D6A94B] bg-[#D6A94B] px-5 py-3 text-sm font-bold text-[#07111A] transition hover:-translate-y-px"
        >
          Scan and save this coin with CoinRelic
          <ArrowRight size={17} />
        </a>
        <StoreButton href={app.storeUrl}>Download CoinRelic on Google Play</StoreButton>
      </div>
    </div>
  )
}

function CoinRaritySeoContent() {
  return (
    <section className="bg-[#050B10] py-16 md:py-24">
      <div className="site-container max-w-4xl">
        <Reveal>
          <div className="prose-coin">
            <h2>How to tell if a coin might be rare</h2>
            <p>
              A coin can be interesting for several reasons: age, low mintage,
              unusual design details, visible errors, metal content, demand from
              collectors, or a combination of those factors. Age alone is not
              enough. Some old coins are common, while some modern coins become
              collectible because of mint errors, limited releases, or unusual
              varieties. A practical first pass is to record the country, date,
              denomination, mint mark, and condition, then compare those details
              with trusted references and similar sold examples.
            </p>
            <p>
              The goal is not to guess an exact value from a quick glance. A
              better goal is to decide whether the coin deserves more research.
              If the date is older, the mint mark is unclear, the design looks
              unusual, or the coin appears to be in strong condition, it is worth
              slowing down and documenting it properly.
            </p>

            <h2>Why mint marks matter</h2>
            <p>
              A mint mark can show where a coin was produced. Two coins with the
              same year and denomination may have different collector interest
              because they came from different mints. Some mint marks are common
              for a given year, while others may be scarcer. In other cases, the
              absence of a visible mint mark can also be meaningful, depending on
              the coin type and country.
            </p>
            <p>
              Mint marks are often small and easy to miss. They may sit near the
              date, below a portrait, beside a building, or on the reverse side
              of the coin. Good lighting and a clear photo can make a major
              difference when checking this detail.
            </p>

            <h2>Why condition changes collector interest</h2>
            <p>
              Condition affects how collectors evaluate a coin. Heavy wear,
              scratches, cleaning marks, corrosion, and edge damage can reduce
              interest, even when the coin is old. On the other hand, a common
              coin in excellent or uncirculated condition may still be worth
              saving and researching because high-grade examples can stand out.
            </p>
            <p>
              When reviewing condition, look at the high points of the design,
              the sharpness of lettering, the rims, and the surface. Avoid
              cleaning a coin before researching it. Cleaning can damage the
              surface and may reduce collector appeal.
            </p>

            <h2>Why coin photos help with identification</h2>
            <p>
              Coin identification depends on visible details. A clear photo can
              capture the date, mint mark, denomination, design variety, wear
              pattern, and possible error features. Photos also help you keep a
              record of a find before it gets mixed into a larger collection.
            </p>
            <p>
              Take photos in natural light when possible. Capture both sides,
              keep the coin flat, and avoid harsh glare. If the coin has a
              suspected error, take an extra close-up of that area.
            </p>

            <h2>What to do after finding an interesting coin</h2>
            <p>
              If a coin looks promising, save the details before you move on.
              Record the country, year, denomination, mint mark, condition,
              photos, and any notes about unusual features. Then compare it
              against reputable references and similar sold examples. For higher
              confidence, especially with rare or expensive coins, consider a
              professional opinion from a reputable dealer or grading service.
            </p>
            <p>
              CoinRelic is designed for this research habit: scan the coin, save
              it to a personal collection, keep scan history, and organize notes
              over time. The better your records are, the easier it becomes to
              revisit interesting finds later.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function CoinRarityFaq({ app }: { app: StudioApp }) {
  const faqs = [
    [
      'Can this tool tell me the exact value of my coin?',
      'No. This checklist does not provide an official appraisal or exact value. It highlights signals that may make a coin worth researching further.',
    ],
    [
      'What makes a coin rare?',
      'Rarity can depend on mintage, age, mint mark, errors, variety, condition, metal composition, collector demand, and how many examples are available in the market.',
    ],
    [
      'What is a mint mark?',
      'A mint mark is a small letter or symbol that can identify where a coin was produced. Mint marks can affect collector interest for certain years and denominations.',
    ],
    [
      'Does condition matter?',
      'Yes. Wear, scratches, cleaning, corrosion, and surface quality can all affect collector interest. Strong condition can make a coin more worth documenting and researching.',
    ],
    [
      'Why should I use CoinRelic after this checklist?',
      'CoinRelic helps you scan coins, save them to a personal collection, keep scan history, and organize notes so interesting finds do not get lost.',
    ],
  ]

  return (
    <section className="border-t border-[#D6A94B]/20 bg-[#020609] py-20 md:py-28">
      <div className="site-container max-w-5xl">
        <Reveal>
          <h2 className="text-4xl font-semibold tracking-[-0.035em] text-[#FFF8DF] md:text-6xl">
            Coin value checklist FAQ
          </h2>
        </Reveal>
        <div className="mt-8 divide-y divide-[#D6A94B]/14 border-y border-[#D6A94B]/14">
          {faqs.map(([question, answer]) => (
            <div key={question} className="py-7">
              <h3 className="text-2xl font-semibold text-[#FFF8DF]">
                {question}
              </h3>
              <p className="mt-4 text-lg leading-8 product-muted">{answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <StoreButton href={app.storeUrl}>Download CoinRelic</StoreButton>
        </div>
      </div>
    </section>
  )
}

function RoleForgePage({ app }: { app: StudioApp }) {
  const steps = [
    {
      title: 'Analyze any job post',
      body: 'Extract the requirements, skills, and themes from the job page you are viewing.',
      image: app.screenshots[0],
    },
    {
      title: 'Review matched skills',
      body: 'Compare the role against saved experience before drafting application materials.',
      image: app.screenshots[1],
    },
    {
      title: 'Rewrite resume bullets',
      body: 'Turn relevant experience into role-specific resume bullets you can review, edit, and copy.',
      image: app.screenshots[2],
    },
    {
      title: 'Draft cover letters',
      body: 'Draft a role-specific cover letter that can be refined before you use it.',
      image: app.screenshots[3],
    },
    {
      title: 'Download your application bundle',
      body: 'Keep resumes, cover letters, form answers, and interview notes organized in one place.',
      image: app.screenshots[4],
    },
  ]

  return (
    <div className="product-theme product-theme-career product-page min-h-screen">
      <Meta
        title="RoleForge | Resume Tailoring and Cover Letter Chrome Extension"
        description="RoleForge helps job seekers analyze live job postings and draft tailored resumes, cover letters, job application answers, and interview notes."
        path="/roleforge"
        image="/og-roleforge.svg"
        jsonLd={[
          softwareApplicationJsonLd({
            app,
            path: '/roleforge',
            applicationCategory: 'BrowserApplication',
            operatingSystem: 'Chrome',
          }),
          faqJsonLd(app),
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'RoleForge', path: '/roleforge' },
          ]),
        ]}
      />
      <section className="relative overflow-hidden border-b border-white/10 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_26%,rgba(139,92,246,0.24),transparent_34%),radial-gradient(circle_at_18%_78%,rgba(56,189,248,0.14),transparent_32%),linear-gradient(180deg,#07080D,#0A0D16_58%,#05060A)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:80px_80px]" />
        <div className="site-container relative grid min-h-[calc(100dvh-6rem)] gap-14 py-16 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <Reveal>
            <div>
              <Link
                to="/apps"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-bold product-link transition"
              >
                <ChevronRight className="rotate-180" size={16} />
                Back to DCP Labs
              </Link>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                {app.iconImage ? (
                  <img
                    src={app.iconImage}
                    alt="RoleForge icon"
                    className="h-14 w-14 rounded-2xl shadow-[0_0_34px_rgba(56,189,248,0.2)]"
                  />
                ) : (
                  <AppSymbol app={app} />
                )}
                <div>
                  <p className="text-xl font-semibold text-white">RoleForge</p>
                  <span className="mt-2 inline-flex rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-sm font-bold text-[#D8D4FF] shadow-[0_0_50px_rgba(139,92,246,0.16)]">
                    Chrome extension
                  </span>
                </div>
              </div>
              <h1 className="mt-8 max-w-4xl text-[clamp(3.5rem,7.6vw,8rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-white">
                Tailor every application to the role.
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-9 product-muted">
                RoleForge helps job seekers turn live job postings into
                tailored resumes, cover letters, form answers, and interview
                notes they can review and edit before applying.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={app.storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#7C3AED] px-5 py-3 text-sm font-bold text-white shadow-[0_0_42px_rgba(124,58,237,0.32)] transition hover:-translate-y-px hover:bg-[#6D28D9]"
                >
                  Add to Chrome
                  <ArrowRight size={17} />
                </a>
                <Link
                  to="/apps"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-bold text-[#090B12] transition hover:-translate-y-px hover:border-[#8B5CF6]"
                >
                  Explore apps
                  <ArrowRight size={17} />
                </Link>
              </div>
              <ProductFacts
                facts={app.storeFacts}
                className="mt-6"
                itemClassName="product-chip"
              />
              <p className="mt-7 max-w-xl text-sm leading-6 text-[#9D98B8]">
                RoleForge drafts application materials for review. It does not
                submit applications or contact employers automatically.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <RoleForgePromoPanel
              src={app.screenshots[0]}
              alt="RoleForge analyze any job post screenshot"
              featured
            />
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#080A12] py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_18%,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_12%_56%,rgba(139,92,246,0.14),transparent_34%)]" />
        <div className="site-container">
          <Reveal>
            <div className="max-w-4xl">
              <p className="section-kicker border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]">
                How RoleForge works
              </p>
              <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-[-0.035em] text-white md:text-6xl">
                From job post to application draft.
              </h2>
            </div>
          </Reveal>
          <div className="relative mt-14 grid gap-8">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.04}>
                <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#0D101A]/92 shadow-[0_18px_48px_rgba(0,0,0,0.30)]">
                  <div className="grid gap-6 p-7 pb-4 md:p-10 md:pb-5 lg:grid-cols-[0.28fr_0.72fr] lg:items-end">
                    <div>
                      <span className="font-mono text-sm text-[#60A5FA]">
                        0{index + 1}
                      </span>
                      <h3 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-white md:text-5xl">
                        {step.title}
                      </h3>
                    </div>
                    <p className="max-w-3xl text-lg leading-8 text-[#BDB8D8] lg:justify-self-end">
                      {step.body}
                    </p>
                  </div>
                  <div className="relative px-0 pb-0 md:px-8 md:pb-8">
                    <RoleForgePromoPanel
                      src={step.image}
                      alt={`RoleForge ${step.title.toLowerCase()} screenshot`}
                      wide
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#05060A] py-20 md:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(139,92,246,0.13),transparent_42%),radial-gradient(circle_at_72%_70%,rgba(56,189,248,0.10),transparent_32%)]" />
        <div className="site-container relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal>
            <div>
              <p className="section-kicker border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#BAE6FD]">
                Review before use
              </p>
              <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-6xl">
                Faster drafting without giving up control.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 product-muted">
                RoleForge helps create application drafts from the role in
                front of you. You stay responsible for reviewing, editing,
                copying, and deciding what to submit.
              </p>
              <div className="mt-8 grid gap-4">
                {app.benefits.map((benefit) => (
                  <div key={benefit} className="flex gap-3 text-[#E7E4FF]">
                    <Check className="mt-1 shrink-0 text-[#38BDF8]" size={18} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <RoleForgePromoPanel
              src={app.screenshots[4]}
              alt="RoleForge download application bundle screenshot"
            />
          </Reveal>
        </div>
      </section>

      <ProductFaq
        app={app}
        className="bg-[#080A12] text-white"
        mutedClassName="text-[#BDB8D8]"
      />

      <RoleForgeGuideLinks />
      <RoleForgeCompareLinks />

      <section className="border-t border-white/10 bg-[#05060A] py-20">
        <div className="site-container flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
              Turn the next job post into a sharper draft.
            </h2>
            <p className="mt-5 text-lg text-[#BDB8D8]">
              Add RoleForge to Chrome.
            </p>
          </div>
          <a
            href={app.storeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#7C3AED] px-5 py-3 text-sm font-bold text-white shadow-[0_0_42px_rgba(124,58,237,0.32)] transition hover:-translate-y-px hover:bg-[#6D28D9]"
          >
            Add to Chrome
            <ArrowRight size={17} />
          </a>
        </div>
      </section>
    </div>
  )
}

function RoleForgePromoPanel({
  src,
  alt,
  featured = false,
  wide = false,
}: {
  src: string
  alt: string
  featured?: boolean
  wide?: boolean
}) {
  const maxWidth = wide ? 'max-w-[1160px]' : featured ? 'max-w-[820px]' : 'max-w-[760px]'

  return (
    <div className={`relative mx-auto w-full ${maxWidth}`}>
      <div className="absolute -inset-5 rounded-[2.25rem] bg-[radial-gradient(circle_at_72%_28%,rgba(56,189,248,0.18),transparent_38%),radial-gradient(circle_at_22%_78%,rgba(139,92,246,0.24),transparent_42%)] blur-2xl" />
      <div className="relative rounded-[18px] border border-white/12 bg-[#0B0D15] p-2 shadow-[0_18px_48px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <img
          src={src}
          alt={alt}
          loading={featured ? 'eager' : 'lazy'}
          fetchPriority={featured ? 'high' : 'auto'}
          decoding="async"
          className="h-auto w-full rounded-[22px] object-contain"
        />
      </div>
    </div>
  )
}

function RoleForgeComparisonPage() {
  const { comparisonSlug = '' } = useParams()
  const page = comparisonBySlug[comparisonSlug]

  if (!page) return <NotFoundPage />

  return (
    <RoleForgeArticleShell>
      <Meta
        title={page.title}
        description={page.metaDescription}
        path={`/roleforge/${page.slug}`}
        image="/og-roleforge.svg"
        type="article"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: page.h1,
            description: page.metaDescription,
            mainEntityOfPage: absoluteUrl(`/roleforge/${page.slug}`),
            publisher: {
              '@type': 'Organization',
              name: 'DCP Labs',
              url: absoluteUrl('/'),
            },
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'RoleForge', path: '/roleforge' },
            { name: page.h1, path: `/roleforge/${page.slug}` },
          ]),
        ]}
      />

      <section className="relative overflow-hidden border-b border-white/10 pt-24">
        <RoleForgePageGlow />
        <div className="site-container relative py-16 md:py-24">
          <RoleForgeBreadcrumb label={page.competitor} />
          <Reveal>
            <div className="max-w-5xl">
              <p className="section-kicker border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]">
                RoleForge comparison
              </p>
              <h1 className="mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
                {page.h1}
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 product-muted">
                {page.intro}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <RoleForgeStoreCta />
                <Link
                  to="/roleforge"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-bold text-[#090B12] transition hover:-translate-y-px hover:border-[#8B5CF6]"
                >
                  View RoleForge
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-[#080A12] py-16 md:py-24">
        <div className="site-container grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <Reveal>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
              Quick summary
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-7 text-lg leading-8 product-muted">
              {page.summary}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-[#05060A] py-16 md:py-24">
        <div className="site-container grid gap-8 lg:grid-cols-2">
          <ComparisonList
            title="RoleForge strengths"
            items={page.roleforgeStrengths}
          />
          <ComparisonList
            title={`${page.competitor} strengths`}
            items={page.competitorStrengths}
          />
        </div>
      </section>

      <ComparisonTable page={page} />

      <section className="relative bg-[#05060A] py-16 md:py-24">
        <div className="site-container grid gap-8 lg:grid-cols-2">
          <ComparisonList
            title="Who should choose RoleForge?"
            items={page.chooseRoleForge}
          />
          <ComparisonList
            title={`Who should choose ${page.competitor}?`}
            items={page.chooseCompetitor}
          />
        </div>
      </section>

      <section className="relative border-t border-white/10 bg-[#080A12] py-16 md:py-24">
        <div className="site-container">
          <Reveal>
            <div className="rounded-[20px] border border-white/10 bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(56,189,248,0.08))] p-7 md:p-10">
              <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                Final recommendation
              </h2>
              <p className="mt-5 max-w-4xl text-lg leading-8 text-[#D8D4FF]">
                {page.recommendation}
              </p>
              <div className="mt-8">
                <RoleForgeStoreCta />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <RoleForgeCompareLinks currentSlug={page.slug} />
    </RoleForgeArticleShell>
  )
}

function RoleForgeBestToolsPage() {
  const tools = [
    {
      name: 'RoleForge',
      bestFor: 'Tailoring applications from live job postings',
      body: 'Best for job seekers who already have a role open and want to extract requirements, rewrite resume bullets, draft cover letters, prepare form answers, and create interview notes.',
      link: '/roleforge',
    },
    {
      name: 'Teal',
      bestFor: 'Job tracking and resume organization',
      body: 'Often a fit for applicants who want a broader workspace for managing resumes, job searches, and applications over time.',
      link: '/roleforge/vs-teal',
    },
    {
      name: 'Simplify',
      bestFor: 'Faster application forms',
      body: 'Often useful for candidates who want browser-based support for repetitive application steps and form-heavy processes.',
      link: '/roleforge/vs-simplify',
    },
    {
      name: 'Kickresume',
      bestFor: 'Resume design and templates',
      body: 'Often a fit for applicants who want resume and cover letter building with polished document templates.',
      link: '/roleforge/vs-kickresume',
    },
    {
      name: 'Jobright',
      bestFor: 'Broader job search support',
      body: 'May be useful for job seekers looking for job discovery, matching, or broader career-search assistance.',
      link: '/roleforge/vs-jobright',
    },
  ]

  return (
    <RoleForgeArticleShell>
      <Meta
        title="Best AI Resume Tools for Tailored Job Applications | RoleForge"
        description="Compare AI resume tools for tailored job applications, resume writing, cover letters, job tracking, resume design, and application organization."
        path="/roleforge/best-ai-resume-tools"
        image="/og-roleforge.svg"
        type="article"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Best AI Resume Tools for Tailored Job Applications',
            description:
              'A practical roundup of AI resume tools and job application tools for resume tailoring, cover letters, job tracking, and application organization.',
            mainEntityOfPage: absoluteUrl('/roleforge/best-ai-resume-tools'),
            publisher: {
              '@type': 'Organization',
              name: 'DCP Labs',
              url: absoluteUrl('/'),
            },
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'RoleForge', path: '/roleforge' },
            {
              name: 'Best AI resume tools',
              path: '/roleforge/best-ai-resume-tools',
            },
          ]),
        ]}
      />

      <section className="relative overflow-hidden border-b border-white/10 pt-24">
        <RoleForgePageGlow />
        <div className="site-container relative py-16 md:py-24">
          <RoleForgeBreadcrumb label="Best AI resume tools" />
          <Reveal>
            <div className="max-w-5xl">
              <p className="section-kicker border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]">
                RoleForge guide
              </p>
              <h1 className="mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
                Best AI resume tools for tailored job applications.
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 product-muted">
                The best tool depends on the job seeker's goal. Some tools
                help build resumes, some organize applications, and others focus
                on tailoring materials to the job post in front of you.
              </p>
              <div className="mt-9">
                <RoleForgeStoreCta />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-[#080A12] py-16 md:py-24">
        <div className="site-container">
          <Reveal>
            <div className="max-w-4xl">
              <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                How to choose an AI resume tool
              </h2>
              <p className="mt-5 text-lg leading-8 product-muted">
                Start with the job you need done: tailoring applications to live
                job posts, writing resume content, generating cover letters,
                tracking applications, designing a resume, or organizing the
                whole search.
              </p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5">
            {tools.map((tool, index) => (
              <Reveal key={tool.name} delay={index * 0.04}>
                <article className="grid gap-5 rounded-[18px] border border-white/10 bg-[#0D101A]/92 p-6 md:grid-cols-[0.28fr_0.72fr] md:items-center md:p-8">
                  <div>
                    <span className="font-mono text-sm text-[#60A5FA]">
                      0{index + 1}
                    </span>
                    <h3 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white">
                      {tool.name}
                    </h3>
                    <p className="mt-3 text-sm font-bold text-[#C4B5FD]">
                      {tool.bestFor}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg leading-8 product-muted">
                      {tool.body}
                    </p>
                    <Link
                      to={tool.link}
                      className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#BAE6FD] transition hover:text-white"
                    >
                      {tool.name === 'RoleForge'
                        ? 'View RoleForge'
                        : `Compare RoleForge vs ${tool.name}`}
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/10 bg-[#05060A] py-16 md:py-24">
        <div className="site-container">
          <Reveal>
            <div className="rounded-[20px] border border-white/10 bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(56,189,248,0.08))] p-7 md:p-10">
              <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                A focused option for role-specific applications.
              </h2>
              <p className="mt-5 max-w-4xl text-lg leading-8 text-[#D8D4FF]">
                RoleForge is strongest when the goal is to tailor materials from
                a live job post, then review and edit the output before using
                it.
              </p>
              <div className="mt-8">
                <RoleForgeStoreCta />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <RoleForgeCompareLinks currentSlug="best-ai-resume-tools" />
    </RoleForgeArticleShell>
  )
}

function RoleForgeGuidesIndexPage() {
  return (
    <RoleForgeArticleShell>
      <Meta
        title="RoleForge Guides | Resume Tailoring and Job Application Help"
        description="Practical RoleForge guides for tailoring resumes, rewriting resume bullets, writing cover letters, answering application questions, and preparing job applications."
        path="/roleforge/guides"
        image="/og-roleforge.svg"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'RoleForge Guides',
            description:
              'Practical guides for resume tailoring, cover letters, application answers, and ATS-friendly job application writing.',
            url: absoluteUrl('/roleforge/guides'),
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: roleForgeGuides.map((guide, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Article',
                  headline: guide.h1,
                  url: absoluteUrl(`/roleforge/guides/${guide.slug}`),
                  description: guide.metaDescription,
                },
              })),
            },
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'RoleForge', path: '/roleforge' },
            { name: 'Guides', path: '/roleforge/guides' },
          ]),
        ]}
      />

      <section className="relative overflow-hidden border-b border-white/10 pt-24">
        <RoleForgePageGlow />
        <div className="site-container relative py-16 md:py-24">
          <RoleForgeGuideBreadcrumb />
          <Reveal>
            <div className="max-w-5xl">
              <p className="section-kicker border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]">
                RoleForge guides
              </p>
              <h1 className="mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
                Practical guides for stronger job applications.
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 product-muted">
                Clear, example-led advice for tailoring resumes, cover letters,
                application answers, and interview prep around the role in
                front of you.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/roleforge"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-bold text-[#090B12] transition hover:-translate-y-px hover:border-[#8B5CF6]"
                >
                  View RoleForge
                  <ArrowRight size={17} />
                </Link>
                <RoleForgeStoreCta />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-[#080A12] py-16 md:py-24">
        <div className="site-container">
          <div className="divide-y divide-white/10 border-y border-white/10">
            {roleForgeGuides.map((guide, index) => (
              <Reveal key={guide.slug} delay={index * 0.04}>
                <Link
                  to={`/roleforge/guides/${guide.slug}`}
                  className="group grid gap-6 py-8 transition md:grid-cols-[5rem_1fr_auto] md:items-center"
                >
                  <span className="font-mono text-sm text-[#60A5FA]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="text-3xl font-semibold tracking-[-0.035em] text-white transition group-hover:text-[#D8D4FF] md:text-5xl">
                      {guide.h1}
                    </h2>
                    <p className="mt-4 max-w-3xl text-lg leading-8 text-[#BDB8D8]">
                      {guide.intro}
                    </p>
                  </div>
                  <span className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#BAE6FD]">
                    Read guide
                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <RoleForgeGuideCta />
    </RoleForgeArticleShell>
  )
}

function RoleForgeGuidePage() {
  const { guideSlug = '' } = useParams()
  const guide = roleForgeGuideBySlug[guideSlug]

  if (!guide) return <NotFoundPage />

  const relatedGuides = roleForgeGuides
    .filter((item) => item.slug !== guide.slug)
    .slice(0, 3)

  return (
    <RoleForgeArticleShell>
      <Meta
        title={guide.title}
        description={guide.metaDescription}
        path={`/roleforge/guides/${guide.slug}`}
        image="/og-roleforge.svg"
        type="article"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: guide.h1,
            description: guide.metaDescription,
            mainEntityOfPage: absoluteUrl(`/roleforge/guides/${guide.slug}`),
            publisher: {
              '@type': 'Organization',
              name: 'DCP Labs',
              url: absoluteUrl('/'),
            },
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            { name: 'RoleForge', path: '/roleforge' },
            { name: 'Guides', path: '/roleforge/guides' },
            { name: guide.h1, path: `/roleforge/guides/${guide.slug}` },
          ]),
        ]}
      />

      <article>
        <section className="relative overflow-hidden border-b border-white/10 pt-24">
          <RoleForgePageGlow />
          <div className="site-container relative py-16 md:py-24">
            <RoleForgeGuideBreadcrumb label={guide.h1} />
            <Reveal>
              <div className="max-w-5xl">
                <p className="section-kicker border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]">
                  Practical guide
                </p>
                <h1 className="mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
                  {guide.h1}
                </h1>
                <p className="mt-7 max-w-3xl text-xl leading-9 product-muted">
                  {guide.intro}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative bg-[#080A12] py-16 md:py-24">
          <div className="site-container grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <Reveal>
                <div className="border-y border-white/10 py-6">
                  <h2 className="text-2xl font-semibold tracking-[-0.02em] text-white">
                    Quick takeaways
                  </h2>
                  <div className="mt-6 grid gap-4">
                    {guide.takeaways.map((takeaway) => (
                      <div key={takeaway} className="flex gap-3 text-[#D8D4FF]">
                        <Check
                          className="mt-1 shrink-0 text-[#38BDF8]"
                          size={18}
                        />
                        <span className="leading-7">{takeaway}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/roleforge/guides"
                    className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#BAE6FD] transition hover:text-white"
                  >
                    All RoleForge guides
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </Reveal>
            </aside>

            <div className="grid gap-12">
              <Reveal>
                <div className="grid gap-9">
                  {guide.sections.map((section, index) => (
                    <section key={section.heading}>
                      <span className="font-mono text-sm text-[#60A5FA]">
                        0{index + 1}
                      </span>
                      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white md:text-5xl">
                        {section.heading}
                      </h2>
                      <p className="mt-5 text-lg leading-8 product-muted">
                        {section.body}
                      </p>
                    </section>
                  ))}
                </div>
              </Reveal>

              <GuideExampleBlock example={guide.example} />

              <Reveal>
                <section className="border-y border-white/10 py-8">
                  <h2 className="text-3xl font-semibold tracking-[-0.035em] text-white md:text-5xl">
                    Final check
                  </h2>
                  <p className="mt-5 text-lg leading-8 product-muted">
                    {guide.closing}
                  </p>
                </section>
              </Reveal>

              <RoleForgeGuideCta compact />

              <Reveal>
                <section className="border-t border-white/10 pt-8">
                  <h2 className="text-3xl font-semibold tracking-[-0.035em] text-white">
                    Related guides
                  </h2>
                  <div className="mt-6 grid gap-3">
                    {relatedGuides.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/roleforge/guides/${item.slug}`}
                        className="group flex items-center justify-between gap-4 border-b border-white/10 py-4 text-[#D8D4FF] transition hover:text-white"
                      >
                        <span className="font-semibold">{item.h1}</span>
                        <ArrowRight
                          size={17}
                          className="shrink-0 transition group-hover:translate-x-1"
                        />
                      </Link>
                    ))}
                  </div>
                </section>
              </Reveal>
            </div>
          </div>
        </section>
      </article>
    </RoleForgeArticleShell>
  )
}

function GuideExampleBlock({ example }: { example: RoleForgeGuideExample }) {
  const rows = [
    ['Job description requirement', example.requirement],
    ['Generic version', example.generic],
    ['Improved tailored version', example.improved],
    ['Why it works', example.why],
  ]

  return (
    <Reveal>
      <section className="overflow-hidden rounded-[20px] border border-white/10 bg-[#0D101A]/92 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
        <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(139,92,246,0.18),rgba(56,189,248,0.08))] p-6 md:p-8">
          <p className="section-kicker border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#BAE6FD]">
            Live example
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-white md:text-5xl">
            Before and after
          </h2>
        </div>
        <div className="divide-y divide-white/10">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="grid gap-4 p-6 md:grid-cols-[0.32fr_0.68fr] md:p-8"
            >
              <h3 className="text-sm font-bold tracking-[0.08em] text-[#60A5FA]">
                {label}
              </h3>
              <p className="text-lg leading-8 text-[#D8D4FF]">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  )
}

function RoleForgeGuideCta({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={`${compact ? '' : 'border-t border-white/10'} bg-[#05060A] py-12 md:py-16`}
    >
      <div className={compact ? '' : 'site-container'}>
        <Reveal>
          <div className="rounded-[20px] border border-white/10 bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(56,189,248,0.08))] p-7 md:p-10">
            <h2 className="text-3xl font-semibold tracking-[-0.035em] text-white md:text-5xl">
              Tailor your next application with RoleForge.
            </h2>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-[#D8D4FF]">
              RoleForge reads the job post you are viewing and helps you create
              a tailored CV, cover letter, application answers, and interview
              prep without giving up control to an auto-apply bot.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <RoleForgeStoreCta />
              <Link
                to="/roleforge"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-bold text-[#090B12] transition hover:-translate-y-px hover:border-[#8B5CF6]"
              >
                View RoleForge
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function RoleForgeGuideLinks() {
  return (
    <section className="border-t border-white/10 bg-[#07080D] py-16">
      <div className="site-container">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="section-kicker border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]">
                RoleForge guides
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                Practical help before you apply.
              </h2>
              <Link
                to="/roleforge/guides"
                className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#BAE6FD] transition hover:text-white"
              >
                View all guides
                <ArrowRight size={17} />
              </Link>
            </div>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {roleForgeGuides.slice(0, 4).map((guide) => (
                <Link
                  key={guide.slug}
                  to={`/roleforge/guides/${guide.slug}`}
                  className="group flex items-center justify-between gap-4 py-4 text-[#D8D4FF] transition hover:text-white"
                >
                  <span className="font-semibold">{guide.h1}</span>
                  <ArrowRight
                    size={17}
                    className="shrink-0 transition group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function RoleForgeGuideBreadcrumb({ label }: { label?: string }) {
  return (
    <div className="relative mb-10 flex flex-wrap items-center gap-3 text-sm font-bold text-[#B8B7FF]">
      <Link
        to="/apps"
        className="inline-flex min-h-11 items-center transition hover:text-white"
      >
        DCP Labs
      </Link>
      <ChevronRight size={15} />
      <Link
        to="/roleforge"
        className="inline-flex min-h-11 items-center transition hover:text-white"
      >
        RoleForge
      </Link>
      <ChevronRight size={15} />
      <Link
        to="/roleforge/guides"
        className="inline-flex min-h-11 items-center transition hover:text-white"
      >
        Guides
      </Link>
      {label ? (
        <>
          <ChevronRight size={15} />
          <span className="text-[#9D98B8]">{label}</span>
        </>
      ) : null}
    </div>
  )
}

function RoleForgeArticleShell({ children }: { children: ReactNode }) {
  return <div className="product-theme product-theme-career product-page min-h-screen">{children}</div>
}

function RoleForgePageGlow() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,rgba(139,92,246,0.24),transparent_32%),radial-gradient(circle_at_14%_70%,rgba(56,189,248,0.13),transparent_34%),linear-gradient(180deg,#07080D,#090B14_58%,#05060A)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:80px_80px]" />
    </>
  )
}

function RoleForgeBreadcrumb({ label }: { label: string }) {
  return (
    <div className="relative mb-10 flex flex-wrap items-center gap-3 text-sm font-bold text-[#B8B7FF]">
      <Link
        to="/apps"
        className="inline-flex min-h-11 items-center transition hover:text-white"
      >
        DCP Labs
      </Link>
      <ChevronRight size={15} />
      <Link
        to="/roleforge"
        className="inline-flex min-h-11 items-center transition hover:text-white"
      >
        RoleForge
      </Link>
      <ChevronRight size={15} />
      <span className="text-[#9D98B8]">{label}</span>
    </div>
  )
}

function RoleForgeStoreCta() {
  return (
    <a
      href={appBySlug.roleforge.storeUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#7C3AED] px-5 py-3 text-sm font-bold text-white shadow-[0_0_42px_rgba(124,58,237,0.32)] transition hover:-translate-y-px hover:bg-[#6D28D9]"
    >
      Add to Chrome
      <ArrowRight size={17} />
    </a>
  )
}

function ComparisonList({ title, items }: { title: string; items: string[] }) {
  return (
    <Reveal>
      <div className="h-full rounded-[18px] border border-white/10 bg-[#0D101A]/92 p-7 md:p-8">
        <h2 className="text-3xl font-semibold tracking-[-0.035em] text-white md:text-4xl">
          {title}
        </h2>
        <div className="mt-7 grid gap-4">
          {items.map((item) => (
            <div key={item} className="flex gap-3 text-[#D8D4FF]">
              <Check className="mt-1 shrink-0 text-[#38BDF8]" size={18} />
              <span className="leading-7">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  )
}

function ComparisonTable({ page }: { page: ComparisonPageData }) {
  return (
    <section className="relative bg-[#080A12] py-16 md:py-24">
      <div className="site-container">
        <Reveal>
          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
            Feature comparison
          </h2>
        </Reveal>
        <div className="mt-8 overflow-hidden rounded-[18px] border border-white/10">
          <div className="grid bg-white/[0.07] text-sm font-bold text-white md:grid-cols-[0.8fr_1fr_1fr]">
            <div className="border-b border-white/10 p-4 md:border-b-0 md:border-r">
              Category
            </div>
            <div className="border-b border-white/10 p-4 md:border-b-0 md:border-r">
              RoleForge
            </div>
            <div className="p-4">{page.competitor}</div>
          </div>
          {page.features.map((feature) => (
            <div
              key={feature.label}
              className="grid border-t border-white/10 bg-[#0D101A]/80 product-muted md:grid-cols-[0.8fr_1fr_1fr]"
            >
              <div className="border-b border-white/10 p-4 font-semibold text-white md:border-b-0 md:border-r">
                {feature.label}
              </div>
              <div className="border-b border-white/10 p-4 md:border-b-0 md:border-r">
                {feature.roleforge}
              </div>
              <div className="p-4">{feature.competitor}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RoleForgeCompareLinks({ currentSlug = '' }: { currentSlug?: string }) {
  const links = [
    ...comparisonPages.map((page) => ({
      label: `RoleForge vs ${page.competitor}`,
      href: `/roleforge/${page.slug}`,
      slug: page.slug,
    })),
    {
      label: 'Best AI resume tools',
      href: '/roleforge/best-ai-resume-tools',
      slug: 'best-ai-resume-tools',
    },
  ].filter((link) => link.slug !== currentSlug)

  return (
    <section className="border-t border-white/10 bg-[#07080D] py-16">
      <div className="site-container">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="section-kicker border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]">
                Compare RoleForge
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                Compare tools before you apply.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-bold text-[#D8D4FF] transition hover:border-[#8B5CF6]/60 hover:bg-white/[0.07] hover:text-white"
                >
                  {link.label}
                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ProductFacts({
  facts,
  className = '',
  itemClassName = '',
}: {
  facts: string[]
  className?: string
  itemClassName?: string
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {facts.map((fact) => (
        <span
          key={fact}
          className={`rounded-full border px-3 py-1 text-xs font-bold ${itemClassName}`}
        >
          {fact}
        </span>
      ))}
    </div>
  )
}

function ProductFaq({
  app,
  className,
  mutedClassName,
}: {
  app: StudioApp
  className: string
  mutedClassName: string
}) {
  return (
    <section className={`py-20 md:py-28 ${className}`}>
      <div className="site-container max-w-5xl">
        <Reveal>
          <h2 className="text-4xl font-semibold tracking-[-0.035em] md:text-6xl">
            Questions before you start
          </h2>
        </Reveal>
        <div className="mt-8 divide-y divide-current/10 border-y border-current/10">
          {app.faq.map((item) => (
            <div key={item.question} className="py-7">
              <h3 className="text-2xl font-semibold">{item.question}</h3>
              <p className={`mt-4 text-lg leading-8 ${mutedClassName}`}>
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00Z`))
}

function blogPostJsonLd(post: BlogPost) {
  const wordCount = post.content.match(/\b[\w'-]+\b/g)?.length ?? 0

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription,
    image: absoluteUrl(DEFAULT_SOCIAL_IMAGE),
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'en',
    author: {
      '@type': 'Organization',
      name: 'DCP Labs',
      url: absoluteUrl('/'),
    },
    publisher: {
      '@type': 'Organization',
      name: 'DCP Labs',
      url: absoluteUrl('/'),
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/favicon-192x192.png'),
      },
    },
    isPartOf: {
      '@type': 'Blog',
      name: 'DCP Labs Blog',
      url: absoluteUrl('/blog'),
    },
    wordCount,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/blog/${post.slug}`),
    },
    url: absoluteUrl(`/blog/${post.slug}`),
    articleSection: post.category,
    keywords: post.tags.join(', '),
  }
}

function blogPostCtaText(post: BlogPost) {
  if (post.app === 'RoleForge') return 'Try RoleForge'
  return `Explore ${post.app}`
}

function BlogPage() {
  const [activeCategory, setActiveCategory] =
    useState<(typeof blogCategories)[number]>('All')
  const filteredPosts = useMemo(
    () =>
      activeCategory === 'All'
        ? blogPosts
        : blogPosts.filter((post) => post.category === activeCategory),
    [activeCategory],
  )

  return (
    <PageShell>
      <Meta
        title="DCP Labs Blog | Practical App Guides and Product Resources"
        description="Practical guides, product updates, and app-focused resources from the DCP Labs product studio."
        path="/blog"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'DCP Labs Blog',
            description:
              'Practical guides, product updates, and app-focused resources from the DCP Labs product studio.',
            url: absoluteUrl('/blog'),
            publisher: {
              '@type': 'Organization',
              name: 'DCP Labs',
              url: absoluteUrl('/'),
            },
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Blog', path: '/blog' },
          ]),
        ]}
      />
      <section className="section-pad border-b border-white/10">
        <div className="site-container">
          <Reveal>
            <div className="max-w-5xl">
              <p className="section-kicker">Blog</p>
              <h1 className="mt-5 max-w-5xl text-[clamp(3.2rem,8vw,7.7rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
                DCP Labs Blog
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 text-brand-soft">
                Practical guides, product updates, and app-focused resources
                from the DCP Labs product studio.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="mt-11 flex flex-wrap gap-2">
              {blogCategories.map((category) => (
                <FilterChip
                  key={category}
                  active={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </FilterChip>
              ))}
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, index) => (
                <BlogCard key={post.slug} post={post} index={index} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </PageShell>
  )
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <Reveal delay={index * 0.04}>
      <motion.article
        layout
        className="brand-card group flex h-full flex-col p-6 transition hover:-translate-y-1 hover:border-[#F2ECE2]/35 hover:bg-[#121217]"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[#D6A94B]/25 bg-[#D6A94B]/10 px-3 py-1 text-xs font-bold text-[#F7D377]">
            {post.category}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-brand-soft">
            {post.app}
          </span>
        </div>
        <h2 className="heading-card mt-6 text-white">
          <Link to={`/blog/${post.slug}`} className="outline-none">
            {post.title}
          </Link>
        </h2>
        <p className="mt-4 flex-1 leading-7 text-brand-muted">
          {post.description}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-5 text-sm font-semibold text-[#81796F]">
          <span>{formatBlogDate(post.date)}</span>
          <span>{post.readingTime}</span>
        </div>
        <Link
          to={`/blog/${post.slug}`}
          className="focus-ring mt-5 inline-flex min-h-11 w-fit items-center gap-2 text-sm font-bold text-[#F5F1EA] transition group-hover:text-[#F7D377]"
        >
          Read guide
          <ArrowRight size={17} />
        </Link>
      </motion.article>
    </Reveal>
  )
}

function BlogPostPage() {
  const { blogSlug = '' } = useParams()
  const post = blogPostBySlug[blogSlug]

  if (!post) return <NotFoundPage />

  const relatedPosts = blogPosts
    .filter(
      (candidate) =>
        candidate.slug !== post.slug && candidate.category === post.category,
    )
    .concat(blogPosts.filter((candidate) => candidate.slug !== post.slug))
    .filter(
      (candidate, index, list) =>
        list.findIndex((item) => item.slug === candidate.slug) === index,
    )
    .slice(0, 3)

  return (
    <PageShell>
      <Meta
        title={post.seoTitle}
        description={post.seoDescription}
        path={`/blog/${post.slug}`}
        type="article"
        jsonLd={[
          blogPostJsonLd(post),
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <article>
        <section className="section-pad border-b border-white/10">
          <div className="site-container">
            <Reveal>
              <div className="max-w-5xl">
                <Link
                  to="/blog"
                  className="section-kicker transition hover:border-white/30 hover:text-white"
                >
                  Blog
                </Link>
                <div className="mt-7 flex flex-wrap items-center gap-2 text-sm font-semibold text-[#B8B2A8]">
                  <span className="rounded-full border border-[#D6A94B]/25 bg-[#D6A94B]/10 px-3 py-1 text-[#F7D377]">
                    {post.category}
                  </span>
                  <span>{post.app}</span>
                  <span>{formatBlogDate(post.date)}</span>
                  <span>{post.readingTime}</span>
                </div>
                <h1 className="mt-6 max-w-5xl text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.94] tracking-[-0.04em] text-white">
                  {post.title}
                </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 text-brand-soft">
                  {post.description}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="site-container grid gap-12 lg:grid-cols-[minmax(0,44rem)_minmax(18rem,1fr)] lg:items-start">
            <Reveal>
              <MarkdownContent content={post.content} />
            </Reveal>

            <Reveal delay={0.07}>
              <aside className="brand-card sticky top-28 p-6">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#81796F]">
                  Related app
                </p>
                <h2 className="heading-card mt-4 text-white">
                  {post.app}
                </h2>
                <p className="mt-4 leading-7 text-brand-muted">
                  Continue from the guide to the related DCP Labs product page.
                </p>
                <Link to={post.relatedAppUrl} className="button button-primary mt-6">
                  {blogPostCtaText(post)}
                  <ArrowRight size={17} />
                </Link>
              </aside>
            </Reveal>
          </div>
        </section>
      </article>

      <section className="border-t border-white/10 py-16 md:py-24">
        <div className="site-container">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="section-kicker">Related posts</p>
                <h2 className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-white md:text-6xl">
                  Keep reading.
                </h2>
              </div>
              <ButtonLink to="/blog" variant="secondary">
                All posts
              </ButtonLink>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {relatedPosts.map((relatedPost, index) => (
              <BlogCard key={relatedPost.slug} post={relatedPost} index={index} />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}

type MarkdownBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

function MarkdownContent({ content }: { content: string }) {
  const blocks = parseMarkdownBlocks(content)
  const leadIndex = blocks.findIndex((block) => block.type === 'paragraph')

  return (
    <div className="prose-blog">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const Heading = block.level === 2 ? 'h2' : 'h3'
          return <Heading key={index}>{renderInlineMarkdown(block.text)}</Heading>
        }

        if (block.type === 'list') {
          return (
            <ul key={index}>
              {block.items.map((item) => (
                <li key={item}>{renderInlineMarkdown(item)}</li>
              ))}
            </ul>
          )
        }

        return (
          <p key={index} className={index === leadIndex ? 'lead' : undefined}>
            {renderInlineMarkdown(block.text)}
          </p>
        )
      })}
    </div>
  )
}

function parseMarkdownBlocks(content: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = []
  const lines = content.split(/\r?\n/)
  let paragraph: string[] = []
  let listItems: string[] = []

  const flushParagraph = () => {
    if (!paragraph.length) return
    blocks.push({ type: 'paragraph', text: paragraph.join(' ') })
    paragraph = []
  }

  const flushList = () => {
    if (!listItems.length) return
    blocks.push({ type: 'list', items: listItems })
    listItems = []
  }

  lines.forEach((line) => {
    const trimmed = line.trim()

    if (!trimmed) {
      flushParagraph()
      flushList()
      return
    }

    const heading = trimmed.match(/^(#{2,3})\s+(.+)$/)
    if (heading) {
      flushParagraph()
      flushList()
      blocks.push({
        type: 'heading',
        level: heading[1].length as 2 | 3,
        text: heading[2],
      })
      return
    }

    if (trimmed.startsWith('- ')) {
      flushParagraph()
      listItems.push(trimmed.slice(2))
      return
    }

    flushList()
    paragraph.push(trimmed)
  })

  flushParagraph()
  flushList()

  return blocks
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g
  let lastIndex = 0

  text.replace(pattern, (match, _token, offset: number) => {
    if (offset > lastIndex) {
      nodes.push(text.slice(lastIndex, offset))
    }

    if (match.startsWith('**')) {
      nodes.push(<strong key={`${offset}-strong`}>{match.slice(2, -2)}</strong>)
    } else {
      const link = match.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (link) {
        const [, label, href] = link
        nodes.push(
          href.startsWith('/') ? (
            <Link key={`${offset}-link`} to={href}>
              {label}
            </Link>
          ) : (
            <a key={`${offset}-link`} href={href} target="_blank" rel="noreferrer">
              {label}
            </a>
          ),
        )
      }
    }

    lastIndex = offset + match.length
    return match
  })

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

function ServiceSpherePage() {
  const app = appBySlug['servicesphere-field-service-app']

  if (!app) return <NotFoundPage />

  const audiences = [
    'Handymen',
    'Cleaners',
    'Landscapers',
    'Electricians',
    'Plumbers',
    'HVAC techs',
    'Mobile mechanics',
    'Appliance repair',
    'Small field service teams',
  ]

  const workflow = [
    {
      title: 'Save client details',
      body: 'Keep customer contact info, addresses, notes, and job history close to the work.',
      icon: NotebookTabs,
    },
    {
      title: 'Create quotes',
      body: 'Build estimates with line items, discounts, tax, totals, and client context.',
      icon: FileText,
    },
    {
      title: 'Turn work into jobs',
      body: 'Track each service request as a job with status, schedule, address, and price context.',
      icon: CalendarDays,
    },
    {
      title: 'Add photos and notes',
      body: 'Attach job proof and practical details so the work record is easier to revisit.',
      icon: Camera,
    },
    {
      title: 'Plan routes',
      body: 'Keep location context available when moving between mobile service visits.',
      icon: MapPinned,
    },
    {
      title: 'Capture signatures',
      body: 'Document approval from the same job detail flow used for field notes and proof.',
      icon: FileSignature,
    },
    {
      title: 'Create invoices',
      body: 'Move from completed work to billing without rebuilding the job from scratch.',
      icon: ReceiptText,
    },
    {
      title: 'Keep records organized',
      body: 'Bring clients, jobs, quotes, invoices, photos, notes, and settings into one mobile workspace.',
      icon: ListChecks,
    },
  ]

  const pains = [
    'Photos lost in the camera roll',
    'Quotes buried in messages',
    'Job notes scattered across paper and apps',
    'Invoices sent late',
    'Client records hard to find later',
    'Follow-ups forgotten',
  ]

  const screenshots = [
    {
      src: app.screenshots[2],
      title: 'Manage clients and job records',
      alt: 'ServiceSphere screenshot showing organized client records in the Android app',
    },
    {
      src: app.screenshots[3],
      title: 'Track quotes and invoices',
      alt: 'ServiceSphere screenshot showing quote, job, and invoice workflows',
    },
    {
      src: app.screenshots[4],
      title: 'Add photos, notes, and signatures',
      alt: 'ServiceSphere screenshot showing job details with photo proof, notes, and client signature actions',
    },
    {
      src: app.screenshots[5],
      title: 'Keep every service job organized',
      alt: 'ServiceSphere screenshot showing job tracking from scheduled to invoiced',
    },
  ]

  const relatedPages = [
    {
      title: 'Field service business app',
      body: 'A practical guide for organizing small service work from a phone.',
      href: '/blog/field-service-business-app',
      active: true,
    },
    {
      title: 'Service business without spreadsheets',
      body: 'How scattered notes and spreadsheets slow down service workflows.',
      href: '/blog/organize-service-business-without-spreadsheets',
      active: true,
    },
    {
      title: 'Contractor invoice app',
      body: 'Coming soon',
      href: '',
      active: false,
    },
    {
      title: 'Job photo organizer',
      body: 'Coming soon',
      href: '',
      active: false,
    },
  ]

  return (
    <div className="product-theme product-theme-fieldservice product-page min-h-screen">
      <Meta
        title="ServiceSphere Field Service App for Solo Contractors | DCP Labs"
        description="ServiceSphere helps solo tradespeople and small service businesses manage clients, quotes, jobs, invoices, photos, notes, and routes from Android."
        path="/servicesphere-field-service-app"
        image={app.screenshots[0]}
        jsonLd={[
          softwareApplicationJsonLd({
            app,
            path: '/servicesphere-field-service-app',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Android',
          }),
          faqJsonLd(app),
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Apps', path: '/apps' },
            {
              name: 'ServiceSphere',
              path: '/servicesphere-field-service-app',
            },
          ]),
        ]}
      />

      <section className="relative overflow-hidden border-b border-[#7C3AED]/14 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(124,58,237,0.18),transparent_32%),linear-gradient(135deg,#F7F5FF,#FFFFFF_48%,#EEE9FF)]" />
        <div className="site-container relative grid gap-12 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-16">
          <Reveal>
            <Link
              to="/apps"
              className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-bold product-link transition"
            >
              <ChevronRight className="rotate-180" size={16} />
              Back to DCP Labs apps
            </Link>
            <div className="flex flex-wrap items-center gap-4">
              <img
                src={app.iconImage}
                alt="ServiceSphere app icon"
                className="h-16 w-16 rounded-[18px] object-cover shadow-[0_22px_60px_rgba(67,56,202,0.25)]"
              />
              <span className="rounded-full product-chip px-4 py-2 text-sm font-extrabold shadow-[0_16px_44px_rgba(67,56,202,0.08)]">
                Your Complete Field Service Ecosystem
              </span>
            </div>
            <h1 className="mt-8 max-w-4xl text-[clamp(3rem,6.5vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-[#100D1E]">
              Run your service business from your phone.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-9 product-soft">
              ServiceSphere helps solo tradespeople and small service
              businesses manage clients, quotes, jobs, routes, signatures,
              invoices, photos, and notes without enterprise complexity.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={app.storeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#4C1D95] bg-[#4C1D95] px-5 py-3 text-sm font-extrabold text-white shadow-[0_22px_52px_rgba(76,29,149,0.28)] transition hover:-translate-y-px hover:bg-[#3B1776]"
              >
                Get it on Google Play
                <ArrowRight size={17} />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#7C3AED]/24 bg-white/70 px-5 py-3 text-sm font-extrabold text-[#312E81] transition hover:-translate-y-px hover:border-[#7C3AED]/42 hover:bg-white"
              >
                See how it works
                <ChevronRight size={17} />
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mx-auto w-full max-w-[500px] rounded-[24px] border border-white bg-white/76 p-3 shadow-[0_18px_44px_rgba(67,56,202,0.16)] lg:max-w-[560px]">
              <img
                src={app.screenshots[0]}
                alt="ServiceSphere Android app showing clients, jobs, quotes, invoices, and photo proof"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="aspect-[9/16] w-full rounded-[18px] object-cover object-top"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="site-container">
          <Reveal>
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#100D1E] md:text-6xl">
                Built for people doing real work in the field.
              </h2>
              <p className="mt-5 text-lg leading-8 product-muted">
                ServiceSphere is for hands-on service businesses, not office
                teams managing enterprise software.
              </p>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-9">
            {audiences.map((audience, index) => (
              <Reveal key={audience} delay={index * 0.025}>
                <div className="flex min-h-24 items-end rounded-[22px] border border-[#7C3AED]/14 bg-white/74 p-4 text-base font-extrabold text-[#211A34] shadow-[0_18px_48px_rgba(67,56,202,0.07)] lg:min-h-36">
                  {audience}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white/58 py-16 md:py-24">
        <div className="site-container grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#100D1E] md:text-6xl">
                From quote to finished job, keep the whole workflow together.
              </h2>
              <p className="mt-5 text-lg leading-8 product-muted">
                Clients, quotes, jobs, routes, signatures, invoices, photos,
                and notes stay connected so the next action is easier to find.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-3 md:grid-cols-2">
            {workflow.map((item, index) => {
              const Icon = item.icon
              return (
                <Reveal key={item.title} delay={index * 0.025}>
                  <article className="h-full rounded-[24px] border border-[#7C3AED]/14 bg-[#F9F7FF] p-6 shadow-[0_18px_48px_rgba(67,56,202,0.07)]">
                    <Icon size={24} className="text-[#7C3AED]" />
                    <h3 className="mt-6 text-2xl font-semibold tracking-[-0.025em] text-[#100D1E]">
                      {item.title}
                    </h3>
                    <p className="mt-3 leading-7 product-muted">
                      {item.body}
                    </p>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="site-container">
          <Reveal>
            <div className="max-w-4xl">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#100D1E] md:text-6xl">
                Stop running your business from scattered notes.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 product-muted">
                A small service business can lose time in tiny places. The
                problem is usually not effort. It is where the work details
                end up.
              </p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <div className="overflow-hidden rounded-[18px] border border-[#7C3AED]/14 bg-white p-3 shadow-[0_12px_30px_rgba(67,56,202,0.10)]">
                <img
                  src={app.screenshots[1]}
                  alt="ServiceSphere dashboard screenshot for managing service jobs"
                  loading="lazy"
                  decoding="async"
                  className="aspect-[9/14] w-full rounded-[22px] object-cover object-top md:aspect-[4/3]"
                />
              </div>
            </Reveal>
            <div className="grid gap-3">
              {pains.map((pain, index) => (
                <Reveal key={pain} delay={index * 0.035}>
                  <div className="rounded-[20px] border border-[#7C3AED]/14 bg-white/76 px-5 py-4 text-lg font-bold text-[#211A34] shadow-[0_16px_42px_rgba(67,56,202,0.06)]">
                    {pain}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#EEE9FF] py-16 md:py-24">
        <div className="site-container">
          <Reveal>
            <h2 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#100D1E] md:text-6xl">
              Real app screens, large enough to read.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {screenshots.map((screenshot, index) => (
              <Reveal key={screenshot.title} delay={index * 0.04}>
                <figure className="overflow-hidden rounded-[18px] border border-white bg-white p-3 shadow-[0_12px_30px_rgba(67,56,202,0.11)]">
                  <img
                    src={screenshot.src}
                    alt={screenshot.alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[9/12] w-full rounded-[22px] object-cover object-top md:aspect-[9/13]"
                  />
                  <figcaption className="px-2 py-5 text-xl font-extrabold tracking-[-0.02em] text-[#211A34]">
                    {screenshot.title}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="site-container grid gap-8 rounded-[20px] border border-[#7C3AED]/14 bg-[#140F2A] p-6 text-white shadow-[0_14px_36px_rgba(20,15,42,0.18)] md:p-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div>
              <img
                src={app.iconImage}
                alt=""
                aria-hidden="true"
                className="h-20 w-20 rounded-[22px]"
              />
              <h2 className="mt-8 text-4xl font-semibold leading-tight tracking-[-0.035em] md:text-6xl">
                Built and actively maintained by DCP Labs.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="grid gap-4 md:grid-cols-3 lg:pt-28">
              {[
                'Focused on simple tools for small businesses.',
                'Product pages link to official store destinations.',
                'Support is available through the DCP Labs contact email.',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-white/12 bg-white/[0.06] p-5 text-lg font-bold leading-7 text-[#EEE9FF]"
                >
                  {item}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white/58 py-16 md:py-24">
        <div className="site-container grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <Reveal>
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#100D1E] md:text-6xl">
              ServiceSphere FAQ.
            </h2>
          </Reveal>
          <div className="grid gap-3">
            {app.faq.map((item, index) => (
              <Reveal key={item.question} delay={index * 0.025}>
                <details className="group rounded-[22px] border border-[#7C3AED]/14 bg-white p-5 shadow-[0_16px_42px_rgba(67,56,202,0.06)]">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center text-xl font-extrabold tracking-[-0.02em] text-[#211A34]">
                    {item.question}
                  </summary>
                  <p className="mt-4 leading-7 product-muted">{item.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="site-container">
          <Reveal>
            <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.035em] text-[#100D1E] md:text-6xl">
              More field service resources.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {relatedPages.map((page, index) =>
              page.active ? (
                <Reveal key={page.title} delay={index * 0.03}>
                  <Link
                    to={page.href}
                    className="group flex min-h-52 flex-col justify-between rounded-[24px] border border-[#7C3AED]/14 bg-white p-5 shadow-[0_18px_48px_rgba(67,56,202,0.07)] transition hover:-translate-y-1 hover:border-[#7C3AED]/35"
                  >
                    <span className="text-xl font-extrabold tracking-[-0.02em] text-[#211A34]">
                      {page.title}
                    </span>
                    <span className="mt-6 leading-7 product-muted">
                      {page.body}
                    </span>
                    <ArrowRight
                      size={19}
                      className="mt-6 text-[#7C3AED] transition group-hover:translate-x-1"
                    />
                  </Link>
                </Reveal>
              ) : (
                <Reveal key={page.title} delay={index * 0.03}>
                  <div className="flex min-h-52 flex-col justify-between rounded-[24px] border border-[#7C3AED]/10 bg-white/48 p-5 product-muted">
                    <span className="text-xl font-extrabold tracking-[-0.02em] text-[#7A728C]">
                      {page.title}
                    </span>
                    <span>{page.body}</span>
                  </div>
                </Reveal>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-[#7C3AED]/14 bg-[#140F2A] py-16 text-white md:py-24">
        <div className="site-container grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <div>
              <h2 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.035em] md:text-6xl">
                Ready to organize your service jobs?
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#CFC7F8]">
                Bring clients, work, proof, billing, and field notes into one
                Android app built for small service businesses.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <a
              href={app.storeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white bg-white px-5 py-3 text-sm font-extrabold text-[#140F2A] transition hover:-translate-y-px"
            >
              Get ServiceSphere on Google Play
              <ArrowRight size={17} />
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

function AboutPage() {
  return (
    <PageShell>
      <Meta
        title="About | DCP Labs"
        description="DCP Labs builds focused digital products for practical everyday and professional use."
        path="/about"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About DCP Labs',
            description:
              'DCP Labs builds focused digital products for practical everyday and professional use.',
            url: absoluteUrl('/about'),
            about: {
              '@type': 'Organization',
              name: 'DCP Labs',
              url: absoluteUrl('/'),
            },
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />
      <section className="section-pad border-b border-white/10">
        <div className="site-container">
          <Reveal>
            <div className="max-w-5xl">
              <img
                src={dcpLogo}
                alt="DCP Labs"
                className="h-auto w-[min(520px,100%)]"
              />
              <h1 className="mt-12 text-[clamp(3.4rem,8vw,8rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-white">
                A software lab for focused digital products.
              </h1>
              <p className="mt-8 max-w-3xl text-xl leading-9 text-brand-soft">
                DCP Labs designs and publishes practical software products for
                everyday and professional use. The current catalog is
                intentionally focused on five live products: ServiceSphere,
                LearnLift AI, CareTail, CoinRelic, and RoleForge.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="site-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <h2 className="text-4xl font-semibold tracking-[-0.03em] text-white md:text-6xl">
              Built to stay focused.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {[
                [
                  'Focused scope',
                  'Each product is built around a specific task and a clear audience.',
                ],
                [
                  'Practical categories',
                  'The current catalog focuses on field service work, pet care organization, coin collecting, study practice, and job application preparation.',
                ],
                [
                  'Trustworthy presentation',
                  'Every product page explains what the app does before sending visitors to a store page.',
                ],
              ].map(([title, body]) => (
                <div key={title} className="grid gap-4 py-7 md:grid-cols-3">
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <p className="copy-lg md:col-span-2 text-brand-muted">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCta
        title="Explore the live product catalog."
        body="Choose LearnLift AI for study practice, CareTail for pet care organization, CoinRelic for coin collecting, or RoleForge for job application preparation."
      />
    </PageShell>
  )
}

function ContactPage() {
  return (
    <PageShell>
      <Meta
        title="Contact | DCP Labs"
        description="Contact DCP Labs for product questions, availability, support, and app updates."
        path="/contact"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact DCP Labs',
            description:
              'Contact DCP Labs for product questions, availability, support, and app updates.',
            url: absoluteUrl('/contact'),
          },
          breadcrumbJsonLd([
            { name: 'DCP Labs', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ]}
      />
      <section className="section-pad">
        <div className="site-container grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div>
              <p className="section-kicker">Contact</p>
              <h1 className="mt-5 text-[clamp(3.4rem,8vw,7.4rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
                Product questions and support.
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-brand-soft">
                Reach DCP Labs for product questions, support routes, and
                general inquiries about the live apps.
              </p>
              <div className="mt-9">
                <a
                  href="mailto:hello@dcplabs.app"
                  className="button button-primary"
                >
                  <Mail size={17} />
                  hello@dcplabs.app
                  <ArrowRight size={17} />
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.07}>
            <div className="border-y border-white/10">
              {apps.map((app) => (
                <Link
                  key={app.slug}
                  to={`/${app.slug}`}
                  className="group grid gap-4 border-b border-white/10 py-6 last:border-b-0 md:grid-cols-[auto_1fr_auto] md:items-center"
                >
                  <AppSymbol app={app} small />
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {app.name}
                    </h2>
                    <p className="mt-1 text-brand-muted">{app.shortDescription}</p>
                  </div>
                  <ArrowRight
                    className="text-brand-muted transition group-hover:translate-x-1 group-hover:text-white"
                    size={20}
                  />
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}

function LegalPage({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <PageShell>
      <Meta
        title={`${title} | DCP Labs`}
        description={description}
        path={`/${title.toLowerCase()}`}
        jsonLd={breadcrumbJsonLd([
          { name: 'DCP Labs', path: '/' },
          { name: title, path: `/${title.toLowerCase()}` },
        ])}
      />
      <section className="section-pad">
        <div className="site-container max-w-4xl">
          <Reveal>
            <p className="section-kicker">Legal</p>
            <h1 className="mt-5 text-[clamp(3.4rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-white">
              {title}
            </h1>
            <div className="copy-lg mt-10 border-y border-white/10 py-8 text-brand-soft">
              <p>{description}</p>
              <p className="mt-5">
                For product-specific details, use the contact page or review
                the official store listing for the product you are installing.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink to="/apps">Explore apps</ButtonLink>
                <ButtonLink to="/contact" variant="secondary">
                  Contact
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}

function TextSenseLegalPage({ content }: { content: TextSenseLegalContent }) {
  const currentPath =
    content.kind === 'privacy' ? TEXTSENSE_PRIVACY_PATH : TEXTSENSE_TERMS_PATH
  const alternateLink =
    content.kind === 'privacy'
      ? { label: 'TextSense Terms of Use', to: TEXTSENSE_TERMS_PATH }
      : { label: 'TextSense Privacy Policy', to: TEXTSENSE_PRIVACY_PATH }

  return (
    <PageShell>
      <Meta
        title={`${content.title} | DCP Labs`}
        description={content.description}
        path={currentPath}
        jsonLd={breadcrumbJsonLd([
          { name: 'DCP Labs', path: '/' },
          { name: 'TextSense', path: TEXTSENSE_PRIVACY_PATH },
          { name: content.title, path: currentPath },
        ])}
      />
      <section className="section-pad">
        <div className="site-container max-w-4xl">
          <Reveal>
            <p className="section-kicker">TextSense legal</p>
            <h1 className="mt-5 text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white">
              {content.title}
            </h1>
            <div className="mt-8 grid gap-3 border-y border-white/10 py-6 text-sm font-semibold text-brand-muted md:grid-cols-2">
              <span>Last updated: {content.lastUpdated}</span>
              <span>Developer: DCP Labs</span>
              <span>Contact: hello@dcplabs.app</span>
              <span>Android package: com.textsense.app</span>
            </div>
          </Reveal>

          <div className="mt-10 space-y-10">
            {content.sections.map((section, index) => (
              <Reveal key={section.heading} delay={Math.min(index * 0.025, 0.16)}>
                <section className="border-b border-white/10 pb-10 last:border-b-0">
                  <h2 className="text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl">
                    {section.heading}
                  </h2>
                  <div className="copy-lg mt-4 text-brand-soft [&_a]:font-bold [&_a]:text-[#F7D377] [&_a]:no-underline hover:[&_a]:text-[#FFE08A] [&_strong]:font-bold [&_strong]:text-white">
                    <p>{section.body}</p>
                  </div>
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-12 flex flex-wrap gap-3 border-t border-white/10 pt-8">
              <ButtonLink to={alternateLink.to} variant="secondary">
                {alternateLink.label}
              </ButtonLink>
              <ButtonLink to="/contact" variant="secondary">
                Contact DCP Labs
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}

function NotFoundPage() {
  return (
    <PageShell>
      <Meta
        title="Page Not Found | DCP Labs"
        description="The requested DCP Labs page could not be found."
        path="/404"
      />
      <section className="section-pad">
        <div className="site-container max-w-4xl">
          <Reveal>
            <img
              src={dcpLogo}
              alt="DCP Labs"
              className="h-auto w-[min(420px,100%)]"
            />
            <h1 className="mt-12 text-[clamp(3.4rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
              Page not found.
            </h1>
            <p className="copy-lg mt-6 max-w-2xl text-brand-muted">
              The page you are looking for is not available on this site.
            </p>
            <div className="mt-8">
              <ButtonLink to="/apps">Explore apps</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}

function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] border-b border-white/10 pt-20">
      <div className="site-container grid min-h-[calc(100dvh-5rem)] gap-12 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <Reveal>
            <div>
              <p className="section-kicker">DCP Labs</p>
              <h1 className="mt-7 max-w-5xl text-[clamp(3.6rem,9vw,8.6rem)] font-semibold leading-[0.88] tracking-[-0.04em] text-white">
                Focused software products for real tasks.
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-9 text-brand-soft">
                DCP Labs builds practical apps with clear jobs to do. The live
                catalog currently includes CareTail for pet owners, CoinRelic
                for coin collectors, and RoleForge for job seekers.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink to="/apps">Explore apps</ButtonLink>
                <ButtonLink to="/caretail" variant="secondary">
                  View CareTail
                </ButtonLink>
              </div>
            </div>
          </Reveal>

        <Reveal delay={0.08}>
          <BrandPanel />
        </Reveal>
      </div>
    </section>
  )
}

function BrandPanel() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="brand-panel relative overflow-hidden p-6 md:p-9">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_42%),linear-gradient(180deg,transparent,rgba(0,0,0,0.5))]" />
      <div className="relative">
        <img src={dcpLogo} alt="DCP Labs" className="h-auto w-full" />
        <div className="mt-12 border-y border-white/10">
          {apps.map((app, index) => (
            <motion.div
              key={app.slug}
              initial={shouldReduceMotion ? false : { opacity: 0, x: 18 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.55 }}
              className="grid grid-cols-[4rem_1fr_auto] items-center border-b border-white/10 py-4 last:border-b-0"
            >
              <span className="font-mono text-xs text-[#81796F]">
                0{index + 1}
              </span>
              <span className="font-semibold text-white">{app.name}</span>
              <span className="text-sm text-brand-muted">{app.category}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TrustStrip() {
  return (
    <section className="border-b border-white/10 bg-[#0C0C0F]">
      <div className="site-container grid gap-0 md:grid-cols-3">
        {trustSignals.map((signal) => (
          <div
            key={signal.label}
            className="flex items-center gap-3 border-b border-white/10 py-5 md:border-b-0 md:border-r md:last:border-r-0"
          >
            <signal.icon size={18} className="text-brand-soft" />
            <span className="text-sm font-semibold text-brand-soft">
              {signal.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function ProductLedger() {
  return (
    <section className="py-20 md:py-28">
      <div className="site-container">
        <Reveal>
          <div className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[0.8fr_1.2fr]">
            <h2 className="heading-section text-white">
              Five products, clear next steps.
            </h2>
            <p className="copy-lg max-w-2xl text-brand-muted">
              Each product explains what it does, who it is for, and where to
              install or open it.
            </p>
          </div>
        </Reveal>
        <div className="mt-2">
          {apps.map((app, index) => (
            <CatalogRow key={app.slug} app={app} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CatalogRow({
  app,
  index,
  compact = false,
}: {
  app: StudioApp
  index: number
  compact?: boolean
}) {
  return (
    <Reveal delay={index * 0.035}>
      <motion.article
        layout
        className={`group border-b border-white/10 ${
          compact ? 'py-6' : 'py-7 md:py-9'
        }`}
      >
        <div className="grid gap-5 md:grid-cols-[5rem_1fr_12rem_auto] md:items-center">
          <span className="font-mono text-sm text-[#81796F]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
              <div className="flex flex-wrap items-center gap-3">
                <AppSymbol app={app} small />
                <h3 className="text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
                  {app.name}
                </h3>
                <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs font-bold text-[#F5F1EA]">
                  {app.status}
                </span>
              </div>
            <p className="copy-lg mt-4 max-w-2xl text-brand-muted">
              {app.shortDescription}
            </p>
          </div>
          <div className="text-sm font-semibold text-brand-soft">
            <span className="block">{app.category}</span>
            <span className="mt-1 block text-[#81796F]">{app.platform}</span>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <Link
              to={`/${app.slug}`}
              className="brand-link-soft inline-flex items-center justify-center gap-2 rounded-full border border-white/12 px-4 py-3 text-sm font-bold hover:border-[#F2ECE2] hover:bg-[#F2ECE2] hover:text-[#111114]"
            >
              View product
              <ArrowRight size={19} />
            </Link>
            <a
              href={app.storeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#F2ECE2] bg-[#F2ECE2] px-4 py-3 text-sm font-bold text-[#111114] transition hover:-translate-y-px"
            >
              {app.storeLabel}
              <ArrowRight size={19} />
            </a>
          </div>
        </div>
      </motion.article>
    </Reveal>
  )
}

function StudioPrinciples() {
  const principles = [
    {
      title: 'Specific use case',
      body: 'Each product is built around a defined audience and a practical task.',
    },
    {
      title: 'Listed when live',
      body: 'The catalog highlights products visitors can actually open, install, and evaluate.',
    },
    {
      title: 'Clear before action',
      body: 'Product pages explain the app, the use case, and the next step before asking for a click.',
    },
  ]

  return (
    <section className="border-y border-white/10 bg-[#0D0D10] py-20 md:py-28">
      <div className="site-container">
        <Reveal>
          <h2 className="heading-section max-w-4xl text-white">
            A product studio built around practical scope.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-0 border-y border-white/10 lg:grid-cols-3">
          {principles.map((principle, index) => (
            <Reveal key={principle.title} delay={index * 0.05}>
              <div className="h-full border-b border-white/10 py-8 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
                <span className="font-mono text-xs text-[#81796F]">
                  0{index + 1}
                </span>
                <h3 className="mt-8 text-3xl font-semibold tracking-[-0.03em] text-white">
                  {principle.title}
                </h3>
                <p className="copy-lg mt-5 text-brand-muted">
                  {principle.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function EcosystemMap() {
  const groups = [
    ['Field service', 'ServiceSphere'],
    ['Study practice', 'LearnLift AI'],
    ['Pet care', 'CareTail'],
    ['Collectors', 'CoinRelic'],
    ['Career preparation', 'RoleForge'],
  ]

  return (
    <section className="py-20 md:py-28">
      <div className="site-container">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="section-kicker">Ecosystem</p>
              <h2 className="heading-section mt-5 text-white">
                One studio, five focused product paths.
              </h2>
              <p className="copy-lg mt-5 max-w-md text-brand-muted">
                Choose the field service app, study coach, pet care tracker,
                collector app, or job application extension, then continue to
                the official store page.
              </p>
            </div>
            <div className="border-y border-white/10">
              {groups.map(([category, product]) => (
                <div
                  key={category}
                  className="grid grid-cols-[1fr_auto] items-center border-b border-white/10 py-5 last:border-b-0"
                >
                  <span className="text-2xl font-semibold text-white">
                    {category}
                  </span>
                  <span className="text-brand-muted">{product}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function FinalCta({ title, body }: { title: string; body: string }) {
  return (
    <section className="border-t border-white/10 py-20 md:py-28">
      <div className="site-container">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="heading-section max-w-4xl text-white">
                {title}
              </h2>
              <p className="copy-lg mt-5 max-w-2xl text-brand-muted">
                {body}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/apps">Explore apps</ButtonLink>
              {apps.map((app) => (
                <a
                  key={app.slug}
                  href={app.storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-secondary"
                >
                  {app.storeLabel}
                  <ArrowRight size={17} />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ButtonLink({
  to,
  children,
  variant = 'primary',
  compact = false,
}: {
  to: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
  compact?: boolean
}) {
  const classes = variant === 'primary' ? 'button-primary' : 'button-secondary'

  return (
    <Link
      to={to}
      className={`button ${classes} ${compact ? 'px-4 py-2 text-sm' : ''}`}
    >
      {children}
      <ArrowRight size={17} />
    </Link>
  )
}

function FilterChip({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
  icon?: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`focus-ring inline-flex min-h-12 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active
          ? 'border-[#F2ECE2] bg-[#F2ECE2] text-[#111114]'
          : 'border-white/12 bg-white/[0.03] text-brand-muted hover:border-white/25 hover:text-white'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

function StoreButton({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="button button-primary"
    >
      {children}
      <ArrowRight size={17} />
    </a>
  )
}

function AppSymbol({
  app,
  small = false,
}: {
  app: StudioApp
  small?: boolean
}) {
  const Icon = app.icon
  const sizeClass = small ? 'h-11 w-11' : 'h-16 w-16'

  if (app.iconImage) {
    return (
      <span
        className={`${sizeClass} inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]`}
      >
        <img
          src={app.iconImage}
          alt={`${app.name} icon`}
          className="h-full w-full object-cover"
        />
      </span>
    )
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white ${
        small ? 'h-11 w-11' : 'h-16 w-16'
      }`}
      style={{ boxShadow: `inset 0 0 0 1px ${app.accent}22` }}
    >
      <Icon size={small ? 19 : 25} strokeWidth={1.7} />
    </span>
  )
}

function PageShell({ children }: { children: ReactNode }) {
  return <div className="min-h-[70dvh]">{children}</div>
}

function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode
  delay?: number
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

function Meta({
  title,
  description,
  path,
  image = DEFAULT_SOCIAL_IMAGE,
  type = 'website',
  jsonLd,
}: {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  jsonLd?: JsonLd
}) {
  useEffect(() => {
    const normalizedPath =
      path ?? `${window.location.pathname}${window.location.search}`
    const canonicalUrl = new URL(normalizedPath, SITE_URL).toString()
    const imageUrl = new URL(image, SITE_URL).toString()

    const setMeta = (
      selector: string,
      attribute: 'name' | 'property',
      key: string,
      content: string,
    ) => {
      const meta =
        document.querySelector<HTMLMetaElement>(selector) ??
        document.head.appendChild(document.createElement('meta'))
      meta.setAttribute(attribute, key)
      meta.content = content
    }

    document.title = title
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta(
      'meta[property="og:description"]',
      'property',
      'og:description',
      description,
    )
    setMeta('meta[property="og:type"]', 'property', 'og:type', type)
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
    setMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl)
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta(
      'meta[name="twitter:description"]',
      'name',
      'twitter:description',
      description,
    )
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl)

    const canonical =
      document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ??
      document.head.appendChild(document.createElement('link'))
    canonical.rel = 'canonical'
    canonical.href = canonicalUrl

    document
      .querySelectorAll<HTMLScriptElement>('script[data-dcp-json-ld="true"]')
      .forEach((script) => script.remove())

    if (jsonLd) {
      const entries = Array.isArray(jsonLd) ? jsonLd : [jsonLd]
      entries.forEach((entry) => {
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.dataset.dcpJsonLd = 'true'
        script.text = JSON.stringify(entry)
        document.head.appendChild(script)
      })
    }
  }, [description, image, jsonLd, path, title, type])

  return null
}


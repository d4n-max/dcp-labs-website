import {
  ArrowRight,
  Check,
  ChevronRight,
  Filter,
  Mail,
  Menu,
  X,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import dcpLogo from './assets/dcp-labs-logo.svg'
import type { AppCategory, StudioApp } from './data/apps'
import { appBySlug, apps, trustSignals } from './data/apps'

const navItems = [
  { label: 'Apps', href: '/apps' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const SITE_URL = 'https://dcplabs.app'
const DEFAULT_SOCIAL_IMAGE = '/og-dcp-labs.svg'

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

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#08080A] text-[#F5F1EA]">
      <AmbientBackground />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/apps" element={<AppsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
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
            path="/privacy"
            element={
              <LegalPage
                title="Privacy"
                description="Privacy information for the DCP Labs website and its live products, including CareTail, CoinRelic, and RoleForge."
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
      </main>
      <Footer />
      <ScrollToTop />
      <Analytics />
    </div>
  )
}

function HomePage() {
  return (
    <>
      <Meta
        title="DCP Labs | Software Lab for Focused Digital Products"
        description="DCP Labs builds focused digital products for practical everyday and professional use, including CareTail, CoinRelic, and RoleForge."
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
        body="Install CareTail or CoinRelic from Google Play, or add RoleForge from the Chrome Web Store."
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
        title="Apps | CareTail, CoinRelic, and RoleForge by DCP Labs"
        description="Explore CareTail for pet owners, CoinRelic for coin collectors, and RoleForge for job seekers preparing tailored applications."
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
                Three live products, each built for a specific job.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#B8B2A8]">
                CareTail helps pet owners keep care details organized.
                CoinRelic helps collectors identify and catalog coins.
                RoleForge helps job seekers tailor application materials from
                the job post in front of them.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="mt-12 flex flex-wrap gap-2">
              {categoryFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    activeFilter === filter
                      ? 'border-[#F2ECE2] bg-[#F2ECE2] text-[#111114]'
                      : 'border-white/12 bg-white/[0.03] text-[#B8B2A8] hover:border-white/25 hover:text-white'
                  }`}
                >
                  {filter === 'All' ? <Filter size={15} /> : null}
                  {filter}
                </button>
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

  return <NotFoundPage />
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
    <div className="min-h-screen bg-[#F5FFFB] text-[#15212A]">
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
                className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#2B817C] transition hover:text-[#125A56]"
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
                <span className="rounded-full border border-[#50BFB7]/25 bg-white/62 px-3 py-1 text-sm font-bold text-[#236A66] shadow-[0_14px_36px_rgba(80,191,183,0.14)]">
                  Live on Google Play
                </span>
              </div>
              <h1 className="mt-8 max-w-4xl text-[clamp(3.2rem,7.4vw,7.4rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-[#15212A]">
                Care routines, notes, and records in one calm place.
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-[#41545B]">
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
                itemClassName="border-[#50BFB7]/24 bg-white/62 text-[#2B817C]"
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
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#53666B]">
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
                <div className="h-full rounded-[28px] border border-[#50BFB7]/18 bg-white/76 p-6 shadow-[0_24px_70px_rgba(43,129,124,0.10)]">
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#15212A]">
                    {title}
                  </h3>
                  <p className="mt-4 leading-7 text-[#53666B]">{body}</p>
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
              <div className="grid gap-8 rounded-[34px] border border-[#50BFB7]/16 bg-white/80 p-5 shadow-[0_28px_80px_rgba(43,129,124,0.10)] lg:grid-cols-[0.42fr_0.58fr] lg:items-center lg:p-8">
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#15212A] md:text-6xl">
                    {panel.title}
                  </h2>
                  <p className="mt-5 text-lg leading-8 text-[#53666B]">
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
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#53666B]">
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
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#53666B]">
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
            <p className="mt-5 text-lg text-[#53666B]">
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
    <div className="min-h-screen bg-[#F5FFFB] text-[#15212A]">
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
                className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#2B817C] transition hover:text-[#125A56]"
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
                <span className="rounded-full border border-[#50BFB7]/25 bg-white/62 px-3 py-1 text-sm font-bold text-[#236A66] shadow-[0_14px_36px_rgba(80,191,183,0.14)]">
                  {page.keyword}
                </span>
              </div>
              <h1 className="mt-8 max-w-4xl text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-[#15212A]">
                {page.h1}
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-[#41545B]">
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
              <p className="mt-6 text-lg leading-8 text-[#53666B]">
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
                  className="flex gap-3 rounded-[26px] border border-[#50BFB7]/18 bg-white/82 p-5 shadow-[0_20px_60px_rgba(43,129,124,0.09)]"
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
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#53666B]">
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
            <p className="mt-5 text-lg leading-8 text-[#53666B]">
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
                className="group flex h-full flex-col justify-between rounded-[28px] border border-[#50BFB7]/18 bg-white/82 p-6 shadow-[0_20px_60px_rgba(43,129,124,0.09)] transition hover:-translate-y-1 hover:border-[#50BFB7]/34"
              >
                <span className="text-sm font-bold text-[#2B817C]">
                  {item.keyword}
                </span>
                <span className="mt-5 block text-2xl font-semibold tracking-[-0.03em] text-[#15212A]">
                  {item.h1}
                </span>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#FF6868]">
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
      <div className="relative rounded-[30px] border border-[#50BFB7]/18 bg-white/72 p-2 shadow-[0_28px_80px_rgba(43,129,124,0.16),inset_0_1px_0_rgba(255,255,255,0.70)]">
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
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
              <p className="mt-4 text-lg leading-8 text-[#53666B]">
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
    <div className="min-h-screen bg-[#03070B] text-[#F7E8B5]">
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
                className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#C8B178] transition hover:text-[#F7E8B5]"
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
                <span className="rounded-full border border-[#D6A94B]/30 bg-[#D6A94B]/10 px-3 py-1 text-sm font-bold text-[#F7E8B5]">
                  Live on Google Play
                </span>
              </div>
              <h1 className="mt-8 max-w-4xl text-[clamp(3.8rem,8vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-[#FFF8DF]">
                Identify coins. Organize every find.
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-9 text-[#D8CDAA]">
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
                itemClassName="border-[#D6A94B]/20 bg-[#D6A94B]/8 text-[#D8CDAA]"
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
                <div className="grid overflow-hidden rounded-[30px] border border-[#D6A94B]/16 bg-[linear-gradient(135deg,#08131B,#03070B)] lg:grid-cols-[0.92fr_0.88fr] lg:items-center">
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
                      <p className="mt-5 text-lg leading-8 text-[#BDAF8D]">
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
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#BDAF8D]">
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
        mutedClassName="text-[#BDAF8D]"
      />

      <section className="border-t border-[#D6A94B]/20 bg-[#03070B] py-16">
        <div className="site-container">
          <Reveal>
            <div className="grid gap-6 rounded-[30px] border border-[#D6A94B]/16 bg-[linear-gradient(135deg,#08131B,#03070B)] p-7 md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="section-kicker border-[#D6A94B]/30 bg-[#D6A94B]/10 text-[#D6A94B]">
                  Free collector checklist
                </p>
                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-[#FFF8DF] md:text-5xl">
                  Is your coin worth a closer look?
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-[#BDAF8D]">
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
            <p className="mt-5 text-lg text-[#BDAF8D]">
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
        featured ? 'drop-shadow-[0_34px_90px_rgba(214,169,75,0.16)]' : ''
      }`}
    >
      <div className="absolute -inset-5 rounded-[2.25rem] bg-[radial-gradient(circle_at_50%_42%,rgba(214,169,75,0.18),transparent_62%)] blur-2xl" />
      <div className="relative rounded-[30px] border border-[#D6A94B]/22 bg-[#06111A] p-2 shadow-[0_32px_90px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,248,223,0.08)]">
        <img
          src={src}
          alt={alt}
          loading={featured ? 'eager' : 'lazy'}
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
    <div className="min-h-screen bg-[#03070B] text-[#F7E8B5]">
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
                className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#C8B178] transition hover:text-[#F7E8B5]"
              >
                <ChevronRight className="rotate-180" size={16} />
                Back to CoinRelic
              </Link>
              <p className="section-kicker border-[#D6A94B]/30 bg-[#D6A94B]/10 text-[#D6A94B]">
                Free coin value checklist
              </p>
              <h1 className="mt-6 max-w-4xl text-[clamp(3.6rem,8vw,8rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-[#FFF8DF]">
                Is My Coin Rare?
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-[#D8CDAA]">
                Use this free checklist to see if your coin may be worth
                checking further.
              </p>
              <p className="mt-6 max-w-2xl border-l border-[#D6A94B]/40 pl-5 text-base leading-7 text-[#BDAF8D]">
                This tool does not provide an official appraisal. It helps you
                identify signs that a coin may deserve a closer look.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative">
              <div className="absolute inset-8 rounded-full bg-[#D6A94B]/14 blur-3xl" />
              <div className="relative rounded-[34px] border border-[#D6A94B]/18 bg-[#06111A]/92 p-7 shadow-[0_32px_100px_rgba(0,0,0,0.5)] md:p-9">
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
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#BDAF8D]">
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
      className="rounded-[32px] border border-[#D6A94B]/16 bg-[#06111A] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.42)] md:p-8"
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
          <p className="mt-3 text-base leading-7 text-[#BDAF8D]">
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
    <div className="min-h-full rounded-[32px] border border-[#D6A94B]/16 bg-[linear-gradient(135deg,#08131B,#03070B)] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.42)] md:p-8">
      <p className="section-kicker border-[#D6A94B]/30 bg-[#D6A94B]/10 text-[#D6A94B]">
        Checklist result
      </p>
      {result ? (
        <>
          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.035em] text-[#FFF8DF] md:text-6xl">
            {result.level}
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#BDAF8D]">
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
          <p className="mt-5 text-lg leading-8 text-[#BDAF8D]">
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
              <p className="mt-4 text-lg leading-8 text-[#BDAF8D]">{answer}</p>
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
    <div className="min-h-screen bg-[#07080D] text-[#F8F7FF]">
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
                className="inline-flex items-center gap-2 text-sm font-bold text-[#B8B7FF] transition hover:text-white"
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
              <h1 className="mt-8 max-w-4xl text-[clamp(3.5rem,7.6vw,8rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-white">
                Tailor every application to the role.
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-9 text-[#C8C5DA]">
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
                itemClassName="border-white/12 bg-white/[0.05] text-[#C8C5DA]"
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
                <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0D101A]/92 shadow-[0_30px_120px_rgba(0,0,0,0.38)]">
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
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#C8C5DA]">
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
      <div className="relative rounded-[28px] border border-white/12 bg-[#0B0D15] p-2 shadow-[0_32px_110px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <img
          src={src}
          alt={alt}
          loading={featured ? 'eager' : 'lazy'}
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
              <h1 className="mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-white">
                {page.h1}
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 text-[#C8C5DA]">
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
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7 text-lg leading-8 text-[#C8C5DA]">
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
            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(56,189,248,0.08))] p-7 md:p-10">
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
              <h1 className="mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-white">
                Best AI resume tools for tailored job applications.
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 text-[#C8C5DA]">
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
              <p className="mt-5 text-lg leading-8 text-[#C8C5DA]">
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
                <article className="grid gap-5 rounded-[28px] border border-white/10 bg-[#0D101A]/92 p-6 md:grid-cols-[0.28fr_0.72fr] md:items-center md:p-8">
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
                    <p className="text-lg leading-8 text-[#C8C5DA]">
                      {tool.body}
                    </p>
                    <Link
                      to={tool.link}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#BAE6FD] transition hover:text-white"
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
            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(56,189,248,0.08))] p-7 md:p-10">
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
              <h1 className="mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-white">
                Practical guides for stronger job applications.
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 text-[#C8C5DA]">
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
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-[#BAE6FD]">
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
                <h1 className="mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-white">
                  {guide.h1}
                </h1>
                <p className="mt-7 max-w-3xl text-xl leading-9 text-[#C8C5DA]">
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
                    className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#BAE6FD] transition hover:text-white"
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
                      <p className="mt-5 text-lg leading-8 text-[#C8C5DA]">
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
                  <p className="mt-5 text-lg leading-8 text-[#C8C5DA]">
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
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0D101A]/92 shadow-[0_30px_120px_rgba(0,0,0,0.35)]">
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
          <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(56,189,248,0.08))] p-7 md:p-10">
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
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#BAE6FD] transition hover:text-white"
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
      <Link to="/apps" className="transition hover:text-white">
        DCP Labs
      </Link>
      <ChevronRight size={15} />
      <Link to="/roleforge" className="transition hover:text-white">
        RoleForge
      </Link>
      <ChevronRight size={15} />
      <Link to="/roleforge/guides" className="transition hover:text-white">
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
  return <div className="min-h-screen bg-[#07080D] text-[#F8F7FF]">{children}</div>
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
      <Link to="/apps" className="transition hover:text-white">
        DCP Labs
      </Link>
      <ChevronRight size={15} />
      <Link to="/roleforge" className="transition hover:text-white">
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
      <div className="h-full rounded-[28px] border border-white/10 bg-[#0D101A]/92 p-7 md:p-8">
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
        <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10">
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
              className="grid border-t border-white/10 bg-[#0D101A]/80 text-[#C8C5DA] md:grid-cols-[0.8fr_1fr_1fr]"
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
              <h1 className="mt-12 text-[clamp(3.4rem,8vw,8rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-white">
                A software lab for focused digital products.
              </h1>
              <p className="mt-8 max-w-3xl text-xl leading-9 text-[#D6D0C7]">
                DCP Labs designs and publishes practical software products for
                everyday and professional use. The current catalog is
                intentionally focused on three live products: CareTail,
                CoinRelic, and RoleForge.
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
                  'The current catalog focuses on pet care organization, coin collecting, and job application preparation.',
                ],
                [
                  'Trustworthy presentation',
                  'Every product page explains what the app does before sending visitors to a store page.',
                ],
              ].map(([title, body]) => (
                <div key={title} className="grid gap-4 py-7 md:grid-cols-3">
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <p className="md:col-span-2 text-lg leading-8 text-[#B8B2A8]">
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
        body="Choose CareTail for pet care organization, CoinRelic for coin collecting, or RoleForge for job application preparation."
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
              <h1 className="mt-5 text-[clamp(3.4rem,8vw,7.4rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-white">
                Product questions and support.
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-[#D6D0C7]">
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
                    <p className="mt-1 text-[#B8B2A8]">{app.shortDescription}</p>
                  </div>
                  <ArrowRight
                    className="text-[#B8B2A8] transition group-hover:translate-x-1 group-hover:text-white"
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
            <h1 className="mt-5 text-[clamp(3.4rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-white">
              {title}
            </h1>
            <div className="mt-10 border-y border-white/10 py-8 text-lg leading-8 text-[#D6D0C7]">
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
            <h1 className="mt-12 text-[clamp(3.4rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-white">
              Page not found.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#B8B2A8]">
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
              <h1 className="mt-7 max-w-5xl text-[clamp(3.6rem,9vw,8.6rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-white">
                Focused software products for real tasks.
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-9 text-[#D6D0C7]">
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
    <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#101014] p-6 shadow-[0_32px_90px_rgba(0,0,0,0.35)] md:p-9">
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
              <span className="text-sm text-[#B8B2A8]">{app.category}</span>
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
            <signal.icon size={18} className="text-[#D6D0C7]" />
            <span className="text-sm font-semibold text-[#D6D0C7]">
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
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-6xl">
              Three products, clear next steps.
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-[#B8B2A8]">
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
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#B8B2A8]">
              {app.shortDescription}
            </p>
          </div>
          <div className="text-sm font-semibold text-[#D6D0C7]">
            <span className="block">{app.category}</span>
            <span className="mt-1 block text-[#81796F]">{app.platform}</span>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <Link
              to={`/${app.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 px-4 py-3 text-sm font-bold text-[#D6D0C7] transition hover:border-[#F2ECE2] hover:bg-[#F2ECE2] hover:text-[#111114]"
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
          <h2 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-6xl">
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
                <p className="mt-5 text-lg leading-8 text-[#B8B2A8]">
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
              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-6xl">
                One studio, three focused product paths.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-8 text-[#B8B2A8]">
                Choose the pet care tracker, collector app, or job application
                extension, then continue to the official store page.
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
                  <span className="text-[#B8B2A8]">{product}</span>
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
              <h2 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-6xl">
                {title}
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#B8B2A8]">
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

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#08080A]/88 backdrop-blur-xl">
      <nav className="site-container flex h-[72px] items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={dcpLogo} alt="DCP Labs" className="h-11 w-auto" />
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${
                  isActive
                    ? 'text-white'
                    : 'text-[#B8B2A8] hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="hidden md:block">
          <ButtonLink to="/apps" compact>
            Apps
          </ButtonLink>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-white md:hidden"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 md:hidden"
          >
            <div className="site-container space-y-2 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-white/10 py-3 font-semibold text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050506]">
      <div className="site-container grid gap-10 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <img src={dcpLogo} alt="DCP Labs" className="h-12 w-auto" />
          <p className="mt-6 max-w-md leading-7 text-[#81796F]">
            Focused digital products for practical everyday and professional
            use.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-white">Apps</h3>
          <div className="mt-4 grid gap-3">
            {apps.map((app) => (
              <div key={app.slug} className="grid gap-1">
                <Link
                  to={`/${app.slug}`}
                  className="text-sm text-[#D6D0C7] transition hover:text-white"
                >
                  {app.name}
                </Link>
                <a
                  href={app.storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#81796F] transition hover:text-white"
                >
                  {app.platform === 'Android app'
                    ? 'Google Play'
                    : 'Chrome Web Store'}
                </a>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-white">DCP Labs</h3>
          <div className="mt-4 grid gap-2">
            {[
              ['Apps', '/apps'],
              ['About', '/about'],
              ['Contact', '/contact'],
              ['Privacy', '/privacy'],
              ['Terms', '/terms'],
            ].map(([label, href]) => (
              <Link
                key={href}
                to={href}
                className="text-sm text-[#81796F] transition hover:text-white"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
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

function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[#08080A]" />
      <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:96px_96px]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(44,7,88,0.18),transparent_32%,rgba(237,100,166,0.08)_80%,transparent)]" />
    </div>
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

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return null
}

export default App

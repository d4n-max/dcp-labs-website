import type { StudioApp } from './data/apps'

export const SITE_URL = 'https://dcplabs.app'

export const DEFAULT_SOCIAL_IMAGE = '/og-dcp-labs.svg'

export type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString()

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
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

export function softwareApplicationJsonLd({
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

export function faqJsonLd(app: StudioApp) {
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

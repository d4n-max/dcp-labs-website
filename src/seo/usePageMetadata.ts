import { useContext, useEffect } from 'react'
import { DEFAULT_SOCIAL_IMAGE, SITE_URL } from '../PageSeo'
import { MetadataCapture } from './metadata'
import type { PageMetadata } from './metadata'

export function usePageMetadata({ title, description, path, image = DEFAULT_SOCIAL_IMAGE,
  type = 'website', jsonLd, robots = 'index, follow' }: PageMetadata) {
  const capture = useContext(MetadataCapture)
  capture?.({ title, description, path, image, type, jsonLd, robots })

  useEffect(() => {
    const canonicalUrl = path === null ? null : new URL(path ?? window.location.pathname, SITE_URL).toString()
    const setMeta = (attribute: 'name' | 'property', key: string, content: string | null) => {
      const selector = 'meta[' + attribute + '="' + key + '"]'
      const matches = [...document.head.querySelectorAll<HTMLMetaElement>(selector)]
      matches.slice(1).forEach(meta => meta.remove())
      if (content === null) { matches[0]?.remove(); return }
      const meta = matches[0] ?? document.head.appendChild(document.createElement('meta'))
      meta.setAttribute(attribute, key)
      meta.content = content
    }
    document.title = title
    setMeta('name', 'description', description)
    setMeta('name', 'robots', robots)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('property', 'og:image', new URL(image, SITE_URL).toString())
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', new URL(image, SITE_URL).toString())

    const canonicals = [...document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')]
    canonicals.slice(1).forEach(link => link.remove())
    if (canonicalUrl) {
      const canonical = canonicals[0] ?? document.head.appendChild(document.createElement('link'))
      canonical.rel = 'canonical'
      canonical.href = canonicalUrl
    } else canonicals[0]?.remove()
    document.head.querySelectorAll('script[data-dcp-json-ld],script[data-dcp-home-json-ld]').forEach(script => script.remove())
    if (jsonLd) for (const entry of Array.isArray(jsonLd) ? jsonLd : [jsonLd]) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.dcpJsonLd = 'true'
      script.text = JSON.stringify(entry)
      document.head.appendChild(script)
    }
  }, [title, description, path, image, type, jsonLd, robots])
}

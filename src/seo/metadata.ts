import { createContext } from 'react'
import type { JsonLd } from '../PageSeo'

export type PageMetadata = {
  title: string
  description: string
  path?: string | null
  image?: string
  type?: 'website' | 'article'
  jsonLd?: JsonLd
  robots?: string
}

// Build-only collector. The browser uses the same metadata through its effect.
export const MetadataCapture = createContext<((data: PageMetadata) => void) | null>(null)

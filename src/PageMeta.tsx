import type { PageMetadata } from './seo/metadata'
import { usePageMetadata } from './seo/usePageMetadata'

export function Meta(props: PageMetadata) {
  usePageMetadata(props)
  return null
}

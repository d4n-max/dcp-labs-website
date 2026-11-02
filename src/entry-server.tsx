import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import Home from './labs-preview/LabsPreviewPage'
import Products from './ProductPages'
import Standard from './PageRoutes'
import { MetadataCapture } from './seo/metadata'
import type { PageMetadata } from './seo/metadata'
export { publicRoutes, routeRedirects } from './seo/routes'
export { blogPosts } from './data/blogPosts'
const pages = { Home, Products, Standard }

export async function render(path: string) {
  let metadata: PageMetadata | undefined
  const html = renderToString(
    <StrictMode>
      <MetadataCapture.Provider value={value => { metadata = value }}>
        <StaticRouter location={path}><App pages={pages} initialNotFound={path === '/404'} /></StaticRouter>
      </MetadataCapture.Provider>
    </StrictMode>,
  )
  if (!metadata) throw new Error('No metadata rendered for ' + path)
  return { html, metadata }
}

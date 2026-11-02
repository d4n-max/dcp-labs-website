import { appLinks } from '../data/appLinks'
import { blogPosts } from '../data/blogPosts'
import { careTailSeoPages, comparisonPages, roleForgeGuides } from '../productSupportContent'

export const publicRoutes = [
  '/', '/apps', '/blog', '/about', '/contact', '/privacy', '/terms',
  '/textsense-privacy-policy', '/textsense/terms', '/coinrelic/is-my-coin-rare',
  '/roleforge/guides', '/roleforge/best-ai-resume-tools',
  ...appLinks.map(app => '/' + app.slug),
  ...careTailSeoPages.map(page => '/caretail/' + page.slug),
  ...comparisonPages.map(page => '/roleforge/' + page.slug),
  ...roleForgeGuides.map(guide => '/roleforge/guides/' + guide.slug),
  ...blogPosts.map(post => '/blog/' + post.slug),
]

export const routeRedirects = [
  { source: '/servicesphere', destination: '/servicesphere-field-service-app', permanent: true },
  { source: '/textsense/privacy', destination: '/textsense-privacy-policy', permanent: true },
]

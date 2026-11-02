import legacyPublished from '../content/blog-publication.json'

// Legacy approval is backed by the observed public blog, not Git tracking.
// New content is private until its frontmatter explicitly says published.
export function blogPublication(source: string, filename: string) {
  if (filename.startsWith('_')) return { published: false, reason: 'template' }
  const head = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
  const field = (name: string) => head.match(new RegExp('^' + name + ':\\s*(.*?)\\s*$', 'm'))?.[1].replace(/^['"]|['"]$/g, '')
  const slug = field('slug')
  const status = field('status')?.toLowerCase()
  const draft = field('draft')?.toLowerCase()
  const published = field('published')?.toLowerCase()
  if (draft === 'true' || published === 'false' || (status && status !== 'published')) {
    return { published: false, slug, reason: 'explicit draft/private state' }
  }
  const approved = published === 'true' || status === 'published' ||
    legacyPublished.posts.some(post => post.file === filename && post.slug === slug)
  return { published: approved, slug, reason: approved ? 'published' : 'approval required' }
}

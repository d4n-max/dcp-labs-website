export type BlogCategory =
  | 'Pet Care'
  | 'Productivity'
  | 'Career Tools'
  | 'Education'
  | 'Field Service'
  | 'Collecting'

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
  relatedAppUrl: string
  content: string
  sourcePath: string
}

type BlogFrontmatter = Omit<BlogPost, 'content' | 'sourcePath'>

export const blogCategories: Array<'All' | BlogCategory> = [
  'All',
  'Pet Care',
  'Productivity',
  'Career Tools',
  'Education',
  'Field Service',
  'Collecting',
]

const markdownFiles = import.meta.glob('../content/blog/*.{md,mdx}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const requiredFields = [
  'title',
  'slug',
  'description',
  'date',
  'category',
  'app',
  'relatedAppUrl',
  'readingTime',
  'seoTitle',
  'seoDescription',
  'tags',
] as const

function parseFrontmatter(source: string, sourcePath: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)

  if (!match) {
    throw new Error(`Blog post is missing frontmatter: ${sourcePath}`)
  }

  return {
    frontmatter: parseYamlLikeFrontmatter(match[1], sourcePath),
    content: match[2].trim(),
  }
}

function parseYamlLikeFrontmatter(source: string, sourcePath: string) {
  const values: Record<string, string | string[]> = {}
  const lines = source.split(/\r?\n/)
  let activeListKey: string | null = null

  lines.forEach((line) => {
    if (!line.trim()) return

    const listItem = line.match(/^\s*-\s+(.+)$/)
    if (activeListKey && listItem) {
      const currentValue = values[activeListKey]
      values[activeListKey] = [
        ...(Array.isArray(currentValue) ? currentValue : []),
        cleanScalar(listItem[1]),
      ]
      return
    }

    const entry = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/)
    if (!entry) {
      throw new Error(`Invalid frontmatter line in ${sourcePath}: ${line}`)
    }

    const [, key, rawValue] = entry
    activeListKey = rawValue ? null : key
    values[key] = parseFrontmatterValue(rawValue)
  })

  return values
}

function parseFrontmatterValue(value: string) {
  const trimmed = value.trim()

  if (!trimmed) return []

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((item) => cleanScalar(item))
      .filter(Boolean)
  }

  return cleanScalar(trimmed)
}

function cleanScalar(value: string) {
  return value.trim().replace(/^['"]|['"]$/g, '')
}

function asFrontmatter(
  values: Record<string, string | string[]>,
  sourcePath: string,
): BlogFrontmatter {
  requiredFields.forEach((field) => {
    const value = values[field]
    if (!value || (Array.isArray(value) && value.length === 0)) {
      throw new Error(`Missing blog frontmatter field "${field}" in ${sourcePath}`)
    }
  })

  const category = String(values.category)
  if (!blogCategories.includes(category as BlogCategory)) {
    throw new Error(`Invalid blog category "${category}" in ${sourcePath}`)
  }

  return {
    slug: String(values.slug),
    title: String(values.title),
    description: String(values.description),
    date: String(values.date),
    category: category as BlogCategory,
    app: String(values.app),
    relatedAppUrl: String(values.relatedAppUrl),
    readingTime: String(values.readingTime),
    seoTitle: String(values.seoTitle),
    seoDescription: String(values.seoDescription),
    tags: Array.isArray(values.tags)
      ? values.tags
      : String(values.tags)
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
  }
}

export const blogPosts: BlogPost[] = Object.entries(markdownFiles)
  .filter(([sourcePath]) => !sourcePath.split('/').pop()?.startsWith('_'))
  .map(([sourcePath, source]) => {
    const { frontmatter, content } = parseFrontmatter(source, sourcePath)

    return {
      ...asFrontmatter(frontmatter, sourcePath),
      content,
      sourcePath,
    }
  })
  .sort((first, second) => second.date.localeCompare(first.date))

export const blogPostBySlug = Object.fromEntries(
  blogPosts.map((post) => [post.slug, post]),
) as Record<string, BlogPost>

import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import { normalizePath } from 'vite'
import { blogPublication } from '../src/data/blogPublication'

export function publishedBlog(): Plugin {
  const virtual = '\0virtual:published-blog'
  const directory = path.resolve('src/content/blog')
  return {
    name: 'published-blog',
    resolveId(id) { if (id === 'virtual:published-blog') return virtual },
    load(id) {
      if (id !== virtual) return
      this.addWatchFile(directory)
      const posts = fs.readdirSync(directory).filter(file => /\.mdx?$/.test(file)).filter(file => {
        const filename = path.join(directory, file)
        this.addWatchFile(filename)
        return blogPublication(fs.readFileSync(filename, 'utf8'), file).published
      }).sort()
      const slugs = posts.map(file => blogPublication(fs.readFileSync(path.join(directory, file), 'utf8'), file).slug)
      if (slugs.some(slug => !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) || new Set(slugs).size !== slugs.length) {
        throw new Error('Published blog slugs must be valid and unique')
      }
      return posts.map((file, i) => 'import post' + i + ' from ' + JSON.stringify('/src/content/blog/' + file + '?raw') + ';').join('\n') +
        '\nexport default {' + posts.map((file, i) => JSON.stringify('../content/blog/' + file) + ':post' + i).join(',') + '};'
    },
    handleHotUpdate({ file, server }) {
      if (!normalizePath(file).startsWith(normalizePath(directory) + '/') && !file.endsWith('blog-publication.json')) return
      const module = server.moduleGraph.getModuleById(virtual)
      if (module) server.moduleGraph.invalidateModule(module)
      server.ws.send({ type: 'full-reload' })
      return []
    },
  }
}

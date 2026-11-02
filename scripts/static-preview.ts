import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

// Vite's default SPA preview would mask missing URLs with index.html. Match
// the generated static site's routes/404 locally; Vercel serves the files itself.
export function staticPreview(): Plugin {
  return {
    name: 'static-seo-preview',
    configurePreviewServer(server) {
      const output = path.resolve(server.config.root, server.config.build.outDir)
      return () => server.middlewares.use((request, response, next) => {
        let pathname: string
        try { pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname) }
        catch { pathname = '/invalid-url' }
        const hosting = JSON.parse(fs.readFileSync(path.join(server.config.root, 'vercel.json'), 'utf8'))
        const redirect = hosting.redirects?.find((item: { source: string }) => item.source === pathname)
        if (redirect) {
          response.statusCode = 308
          response.setHeader('Location', redirect.destination)
          response.end()
          return
        }
        const candidate = path.resolve(output, '.' + pathname)
        if (candidate.startsWith(output + path.sep) && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          if (pathname === '/labs-preview.html') response.setHeader('X-Robots-Tag', 'noindex, nofollow')
          next()
          return
        }
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html; charset=utf-8')
        response.setHeader('X-Robots-Tag', 'noindex, follow')
        response.end(request.method === 'HEAD' ? undefined : fs.readFileSync(path.join(output, '404.html')))
      })
    },
  }
}

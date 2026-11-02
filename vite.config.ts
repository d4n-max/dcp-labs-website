import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { publishedBlog } from './scripts/published-blog'
import { staticPreview } from './scripts/static-preview'

// https://vite.dev/config/
export default defineConfig(({ isPreview }) => ({
  appType: isPreview ? 'mpa' : 'spa',
  plugins: [react(), tailwindcss(), publishedBlog(), staticPreview()],
  build: { manifest: true },
}))

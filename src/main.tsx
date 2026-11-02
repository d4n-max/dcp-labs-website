import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/manrope/index.css'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const isErrorDocument = root.getAttribute('data-http-status') === '404'
const application = (
  <StrictMode>
    <BrowserRouter>
      <App initialNotFound={isErrorDocument} />
    </BrowserRouter>
  </StrictMode>
)

// Preserve the server's generic error state even if client route matching
// would otherwise reinterpret the original unknown URL as a valid page.
if (root.hasAttribute('data-prerendered')) hydrateRoot(root, application)
else createRoot(root).render(application)

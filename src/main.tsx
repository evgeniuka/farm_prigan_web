import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { initPostHog } from './analytics/posthog.ts'
import { VisitProvider } from './app/VisitProvider.tsx'

initPostHog()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <VisitProvider>
        <App />
      </VisitProvider>
    </BrowserRouter>
  </StrictMode>,
)

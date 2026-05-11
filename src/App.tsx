import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { CatalogPage } from './pages/CatalogPage'
import { ComparePage } from './pages/ComparePage'
import { FarmMapPage } from './pages/FarmMapPage'
import { FinishPage } from './pages/FinishPage'
import { HelpPage } from './pages/HelpPage'
import { HomePage } from './pages/HomePage'
import { HowAIWorksPage } from './pages/HowAIWorksPage'
import { LiveRoutePage } from './pages/LiveRoutePage'
import { MyVisitPage } from './pages/MyVisitPage'
import { PepperDetailPage } from './pages/PepperDetailPage'
import { RecommendedRoutePage } from './pages/RecommendedRoutePage'
import { StopDetailPage } from './pages/StopDetailPage'
import { VisitPlannerPage } from './pages/VisitPlannerPage'

function SpaRedirectHandler() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const redirectedPath = params.get('spa')
    if (!redirectedPath) return

    const target = redirectedPath.startsWith('/') ? redirectedPath : `/${redirectedPath}`
    navigate(target, { replace: true })
  }, [location.search, navigate])

  return null
}

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    const scrollToTop = () => window.scrollTo({ left: 0, top: 0 })
    scrollToTop()
    const frame = window.requestAnimationFrame(scrollToTop)
    const timer = window.setTimeout(scrollToTop, 100)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [location.pathname])

  return null
}

function App() {
  return (
    <>
      <SpaRedirectHandler />
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/planner" element={<VisitPlannerPage />} />
          <Route path="/recommended" element={<RecommendedRoutePage />} />
          <Route path="/route" element={<LiveRoutePage />} />
          <Route path="/stops/:stopId" element={<StopDetailPage />} />
          <Route path="/map" element={<FarmMapPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/peppers/:pepperId" element={<PepperDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/my-visit" element={<MyVisitPage />} />
          <Route path="/finish" element={<FinishPage />} />
          <Route path="/ai" element={<HowAIWorksPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

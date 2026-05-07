import { Navigate, Route, Routes } from 'react-router-dom'
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

function App() {
  return (
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
  )
}

export default App

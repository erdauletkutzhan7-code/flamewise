import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import StarField from './components/StarField'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import RankingPage from './pages/RankingPage'
import InsightsPage from './pages/InsightsPage'
import EngineeringBriefPage from './pages/EngineeringBriefPage'
import VisualizationsPage from './pages/VisualizationsPage'
import FlameLabPage from './pages/FlameLabPage'
import CopilotPage from './pages/CopilotPage'
import AboutPage from './pages/AboutPage'
import Footer from './components/Footer'

export default function App() {
  const location = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      {/* Persistent star background */}
      <StarField />
      
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"               element={<HomePage />} />
            <Route path="/dashboard"      element={<DashboardPage />} />
            <Route path="/ranking"        element={<RankingPage />} />
            <Route path="/insights"       element={<InsightsPage />} />
            <Route path="/engineering"    element={<EngineeringBriefPage />} />
            <Route path="/visualizations" element={<VisualizationsPage />} />
            <Route path="/lab"            element={<FlameLabPage />} />
            <Route path="/copilot"        element={<CopilotPage />} />
            <Route path="/about"          element={<AboutPage />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

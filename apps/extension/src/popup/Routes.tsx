import { Route, Routes, useLocation } from 'react-router-dom'
import { GlobalLayout } from './layout'
import Home from './pages/home/page'
import ChatPage from './pages/chat/page'
import WelcomePage from './pages/onboarding/page'
import Protected from './Protected'

export default function AppRoutes() {
  const location = useLocation()
  const isOnboardingPage = location.pathname === '/onboard'

  // Onboarding page takes full screen
  if (isOnboardingPage) {
    return (
      <div className="h-full w-full">
        <Routes>
          <Route path="/onboard" element={<WelcomePage />} />
        </Routes>
      </div>
    )
  }

  // Chat and other pages use side panel layout
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-[28rem] h-[37.5rem] rounded-3xl shadow-xl bg-secondary overflow-hidden">
        <GlobalLayout location={location}>
          <Routes>
            <Route
              path="/"
              element={
                <Protected>
                  <Home />
                </Protected>
              }
            />
            <Route
              path="/chat"
              element={
                <Protected>
                  <ChatPage />
                </Protected>
              }
            />
          </Routes>
        </GlobalLayout>
      </div>
    </div>
  )
}

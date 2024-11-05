import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import FloatingBubble from './components/FloatingBubble'
import { FloatingBubbleProvider } from './hooks/FloatingBubbleContext'
import Dashboard from './components/Dashboard'
import AuthPage from './components/Authpage'
import UserProfile from './components/userProfile'
import SharedPost from './components/SharedPost'
import { useAuth } from './hooks/userAuth'
import { ThemeProvider } from './components/ThemeComponents/theme-provider'
import FacebookStyleMusicPlayer from './components/Music/PlayerMusic'
import Historia from './components/Rutas/QuienesSomos/Historia'
// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

const App: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <ThemeProvider>
      {/* <FloatingBubble component={<FacebookStyleMusicPlayer />} /> */}

      <FloatingBubbleProvider>
        <FloatingBubble component={<FacebookStyleMusicPlayer/>} />

        <Router>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile/:userId" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/post/:slug" element={

              <ProtectedRoute>
                <SharedPost />
              </ProtectedRoute>
            } />
            <Route path="/playlist-music" element={
              <ProtectedRoute>
                <FacebookStyleMusicPlayer />
              </ProtectedRoute>
            } />
            <Route path="/historia" element={
              <ProtectedRoute>
                <Historia />
              </ProtectedRoute>
            } />

          </Routes>

        </Router>
      </FloatingBubbleProvider>
    </ThemeProvider>
  )
}

export default App
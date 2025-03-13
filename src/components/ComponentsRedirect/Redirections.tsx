import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Dashboard from '@//components/Dashboard'
import AuthPage from '@/components/Authpage'
import UserProfile from '@/components/Posts/userProfile'
import SharedPost from '@/components/Posts/ShareComponents/SharedPost'
import Historia from '@/components/Rutas/QuienesSomos/Historia'
import Biblia from '@/components/Rutas/BibliaApi/Biblia/page'
import PortalBiblico from '@/components/Rutas/BibliaApi/Portal-biblico/PortalBiblico'
import SermonesBiblicos from '@/components/Rutas/BibliaApi/Sermones/SermonesBiblicos'
import MessengerChat from '@/components/chat/page'
import { FaithDeclaration } from '@/components/Rutas/QuienesSomos/DeclaracionDeFe/DeclaracionDefe'
import { PrincipiosPracticos } from '@/components/Rutas/QuienesSomos/principios-practicos/PrincipiosPracticos'

import { TreeChart } from '@/components/Rutas/QuienesSomos/Estructura'
import { churchData } from '@/data/churchData';
import FacebookStyleMusicPlayer from '../Music/PlayerMusic'
import StudyBible from '../Rutas/EstudioBiblico/page'
import SeUnLider from '../Rutas/EstudioBiblico/componentes/Lideres'
interface RedirectionsProps {
  user: any; // Replace 'any' with the appropriate type for user if known
  ProtectedRoute: React.ComponentType<{ children: React.ReactNode }>;
}

export default function Redirections({ user, ProtectedRoute }: RedirectionsProps) {
  return (
      <>
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
            <Route path="/biblia" element={
              <ProtectedRoute>
                <Biblia />
              </ProtectedRoute>
            } />
            <Route path="/portal-biblico" element={
              <ProtectedRoute>
                <PortalBiblico />
              </ProtectedRoute>
            } />
            <Route path="/sermones-biblicos" element={
              <ProtectedRoute>
                <SermonesBiblicos />
              </ProtectedRoute>
            } />
            <Route path="/messenger" element={
              <ProtectedRoute>
                <MessengerChat />
              </ProtectedRoute>
            } />
            {/* Ministerios */}

            {/* Quienes somos */}
            <Route path="/declaracion-de-fe" element={
              <ProtectedRoute>
                <FaithDeclaration />
              </ProtectedRoute>
            } />
            <Route path="/principios-practicos" element={
              <ProtectedRoute>
                <PrincipiosPracticos />
              </ProtectedRoute>
            } />
            <Route path="/estructura" element={
              <ProtectedRoute>
                <TreeChart data={churchData} />
              </ProtectedRoute>
            } />
         
            {/* EStudio Biblico */}
            <Route path="/resumen-biblico" element={
              <ProtectedRoute>
                <StudyBible />
              </ProtectedRoute>
            } />
            <Route path="/un-buen-liderazgo" element={
              <ProtectedRoute>
                <SeUnLider/>
              </ProtectedRoute>
            } />

          </Routes>

        </Router>
      </>
  )
}

import React from "react";
import { Navigate } from "react-router-dom";
import "./App.css";
import FloatingBubble from "./components/FloatingBubble";
import { FloatingBubbleProvider } from "./data/hooks/FloatingBubbleContext";
import { useAuth } from "./data/hooks/userAuth";
import { ThemeProvider } from "./components/ThemeComponents/theme-provider";
import FacebookStyleMusicPlayer from "./components/Music/PlayerMusic";

import Redirections from "./components/ComponentsRedirect/Redirections";

// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <ThemeProvider>
      {/* <FloatingBubble component={<FacebookStyleMusicPlayer />} /> */}

      <FloatingBubbleProvider>
        <FloatingBubble component={<FacebookStyleMusicPlayer />} />

        <Redirections user={user} ProtectedRoute={ProtectedRoute} />
      </FloatingBubbleProvider>
    </ThemeProvider>
  );
};

export default App;

/**
 * Componente raíz de MusicStream.
 * Configura el enrutamiento global y la visibilidad de componentes comunes.
 */
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Landing } from "./components/Landing";
import { ArtistPage } from "./components/ArtistPage";
import { Library } from "./components/Library";
import { Auth } from "./components/Auth";
import { Search } from "./components/Search";
import { Account } from "./components/Account";
import { AdminPanel } from "./components/AdminPanel";
import { ArtistDashboard } from "./components/ArtistDashboard";
import { MusicPlayer } from "./components/MusicPlayer";
import { Navigation } from "./components/Navigation";
import { UploadModal } from "./components/UploadModal";
import { useTheme } from "./context/ThemeContext";

export default function App() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { colors } = useTheme();
  const location = useLocation();

  // Lógica para ocultar navegación y reproductor en rutas específicas
  const showNavigation = location.pathname !== "/auth";
  const showPlayer =
    location.pathname !== "/auth" &&
    location.pathname !== "/admin" &&
    location.pathname !== "/artist-dashboard";


  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: colors.bgPrimary }}
    >
      {showNavigation && <Navigation />}

      <main className={showNavigation ? "pt-16" : ""}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/search" element={<Search />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/library" element={<Library onOpenUpload={() => setIsUploadModalOpen(true)} />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/artist-dashboard" element={<ArtistDashboard onOpenUpload={() => setIsUploadModalOpen(true)} />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>

      {showPlayer && <MusicPlayer />}

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
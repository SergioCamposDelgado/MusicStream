import { useState, useEffect } from "react";
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

export type Theme = "dark" | "light";

export interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  accentPrimary: string;
  accentHover: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  navBg: string;
}

const darkTheme: ThemeColors = {
  bgPrimary: "#0F0A1A",
  bgSecondary: "#1A0F2E",
  bgTertiary: "#2A1F3E",
  accentPrimary: "#7B2CBF",
  accentHover: "#9D4EDD",
  textPrimary: "#E8E1FF",
  textSecondary: "#B0A3CC",
  border: "#3E2A66",
  navBg: "rgba(26, 15, 46, 0.95)",
};

const lightTheme: ThemeColors = {
  bgPrimary: "#F5F1E8",
  bgSecondary: "#E8DCC8",
  bgTertiary: "#D4C4A8",
  accentPrimary: "#7B2CBF",
  accentHover: "#9D4EDD",
  textPrimary: "#2A1A4A",
  textSecondary: "#5A4A7A",
  border: "#C8B8A8",
  navBg: "rgba(232, 220, 200, 0.95)",
};

export default function App() {
  const [currentPage, setCurrentPage] =
    useState<string>("home");
  const [selectedArtistId, setSelectedArtistId] = useState<
    number | undefined
  >();
  const [isUploadModalOpen, setIsUploadModalOpen] =
    useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return (saved as Theme) || "dark";
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem("isAuthenticated");
    return saved === "true";
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    const saved = localStorage.getItem("isAdmin");
    return saved === "true";
  });
  const [isArtist, setIsArtist] = useState(() => {
    const saved = localStorage.getItem("isArtist");
    return saved === "true";
  });
  const [userAvatar, setUserAvatar] = useState(() => {
    return localStorage.getItem("userAvatar") || "";
  });

  const colors = theme === "dark" ? darkTheme : lightTheme;

  // Persist authentication state and theme
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(
      "isAuthenticated",
      String(isAuthenticated),
    );
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("isAdmin", String(isAdmin));
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem("isArtist", String(isArtist));
  }, [isArtist]);

  useEffect(() => {
    localStorage.setItem("userAvatar", userAvatar);
  }, [userAvatar]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleNavigate = (page: string, artistId?: number) => {
    setCurrentPage(page);
    if (artistId !== undefined) {
      setSelectedArtistId(artistId);
    }
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = (artistMode: boolean) => {
    setIsAuthenticated(true);
    setIsArtist(artistMode);
    handleNavigate("home");
  };

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isArtist");
    localStorage.removeItem("userAvatar");

    // Resetear estados
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsArtist(false);
    setUserAvatar("");

    // Navegar al login
    handleNavigate("auth");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <Landing
            onNavigate={handleNavigate}
            colors={colors}
          />
        );
      case "search":
        return (
          <Search onNavigate={handleNavigate} colors={colors} />
        );
      case "artist":
        return (
          <ArtistPage
            onNavigate={handleNavigate}
            artistId={selectedArtistId}
            colors={colors}
          />
        );
      case "library":
        return (
          <Library
            onNavigate={handleNavigate}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            colors={colors}
          />
        );
      case "account":
        return (
          <Account
            onNavigate={handleNavigate}
            isAdmin={isAdmin}
            onAdminToggle={setIsAdmin}
            userAvatar={userAvatar}
            onAvatarChange={setUserAvatar}
            onLogout={handleLogout}
            colors={colors}
          />
        );
      case "admin":
        return (
          <AdminPanel
            onNavigate={handleNavigate}
            colors={colors}
          />
        );
      case "artist-dashboard":
        return (
          <ArtistDashboard
            onNavigate={handleNavigate}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            colors={colors}
          />
        );
      case "auth":
        return (
          <Auth
            onNavigate={() => handleNavigate("home")}
            onLogin={handleLogin}
            colors={colors}
          />
        );
      default:
        return (
          <Landing
            onNavigate={handleNavigate}
            colors={colors}
          />
        );
    }
  };

  const showNavigation = currentPage !== "auth";
  const showPlayer =
    currentPage !== "auth" &&
    currentPage !== "admin" &&
    currentPage !== "artist-dashboard";

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.bgPrimary }}
    >
      {showNavigation && (
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          isArtist={isArtist}
          userAvatar={userAvatar}
          theme={theme}
          onToggleTheme={toggleTheme}
          colors={colors}
        />
      )}

      <main className={showNavigation ? "pt-16" : ""}>
        {renderPage()}
      </main>

      {showPlayer && (
        <MusicPlayer
          onNavigate={handleNavigate}
          colors={colors}
        />
      )}

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        colors={colors}
      />
    </div>
  );
}
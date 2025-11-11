import {
  Home,
  Library as LibraryIcon,
  User,
  LogIn,
  Search,
  Shield,
  Music2,
  Sun,
  Moon,
} from "lucide-react";
import { Logo } from "./Logo";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { Theme, ThemeColors } from "../App";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isAuthenticated?: boolean;
  isAdmin?: boolean;
  isArtist?: boolean;
  userAvatar?: string;
  theme?: Theme;
  onToggleTheme?: () => void;
  colors?: ThemeColors;
}

export function Navigation({
  currentPage,
  onNavigate,
  isAuthenticated = false,
  isAdmin = false,
  isArtist = false,
  userAvatar = "",
  theme = "dark",
  onToggleTheme,
  colors,
}: NavigationProps) {
  const navItems = [
    { id: "home", icon: Home, label: "Inicio" },
    { id: "search", icon: Search, label: "Buscar" },
    { id: "library", icon: LibraryIcon, label: "Biblioteca" },
    ...(isArtist
      ? [
          {
            id: "artist-dashboard",
            icon: Music2,
            label: "Mi Dashboard",
          },
        ]
      : []),
    ...(isAdmin
      ? [{ id: "admin", icon: Shield, label: "Admin" }]
      : []),
  ];

  const defaultColors: ThemeColors = {
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

  const themeColors = colors || defaultColors;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 border-b backdrop-blur-lg"
      style={{
        backgroundColor: themeColors.navBg,
        borderColor: themeColors.border,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo y botón de tema */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("home")}
              className="transition-all duration-200 hover:scale-105"
            >
              <Logo
                className="w-7 h-7"
                color={themeColors.textPrimary}
                showText={true}
                textColor={themeColors.textPrimary}
              />
            </button>

            {/* Botón cambio de tema */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: themeColors.bgSecondary,
                color: themeColors.textPrimary,
                border: `1px solid ${themeColors.border}`,
              }}
              title={
                theme === "dark"
                  ? "Cambiar a tema claro"
                  : "Cambiar a tema oscuro"
              }
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Nav Items */}
          <div className="flex items-center gap-3 md:gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPage === item.id ||
                (item.id === "account" &&
                  currentPage === "account") ||
                (item.id === "artist-dashboard" &&
                  currentPage === "artist-dashboard");

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="flex flex-col md:flex-row items-center gap-1 md:gap-2 transition-all duration-200 hover:scale-105"
                  style={{
                    color: isActive
                      ? themeColors.accentHover
                      : themeColors.textSecondary,
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs md:text-sm hidden md:inline">
                    {item.label}
                  </span>
                </button>
              );
            })}

            {/* User Avatar / Login */}
            {isAuthenticated ? (
              <button
                onClick={() => onNavigate("account")}
                className="transition-all duration-200 hover:scale-105"
              >
                <Avatar
                  className="w-8 h-8 border-2"
                  style={{
                    borderColor:
                      currentPage === "account"
                        ? themeColors.accentHover
                        : themeColors.border,
                  }}
                >
                  <AvatarImage src={userAvatar} alt="Usuario" />
                  <AvatarFallback
                    style={{
                      backgroundColor:
                        themeColors.accentPrimary,
                      color: themeColors.textPrimary,
                    }}
                  >
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </button>
            ) : (
              <button
                onClick={() => onNavigate("auth")}
                className="flex flex-col md:flex-row items-center gap-1 md:gap-2 transition-all duration-200 hover:scale-105"
                style={{
                  color:
                    currentPage === "auth"
                      ? themeColors.accentHover
                      : themeColors.textSecondary,
                }}
              >
                <LogIn className="w-5 h-5" />
                <span className="text-xs md:text-sm hidden md:inline">
                  Login
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
/**
 * @file Navigation.tsx
 * @description Barra de navegación principal de MusicStream.
 *
 * Barra fija en la parte superior que muestra:
 * - Logo y botón de cambio de tema claro/oscuro.
 * - Navegación principal adaptada al rol del usuario (inicio, búsqueda, biblioteca,
 *   panel de artista y panel de administración).
 * - Avatar del usuario autenticado con acceso al perfil, o botón de login.
 *
 * Los enlaces de administrador y artista se muestran condicionalmente según
 * los roles `user.isAdmin` e `user.isArtist` del contexto de autenticación.
 */
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
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export function Navigation() {
  const { theme, toggleTheme, colors: themeColors } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Inicio" },
    { path: "/search", icon: Search, label: "Buscar" },
    { path: "/library", icon: LibraryIcon, label: "Biblioteca" },
    ...(user?.isArtist
      ? [
          {
            path: "/artist-dashboard",
            icon: Music2,
            label: "Mi Dashboard",
          },
        ]
      : []),
    ...(user?.isAdmin
      ? [{ path: "/admin", icon: Shield, label: "Admin" }]
      : []),
  ];

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
              onClick={() => navigate("/")}
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
              onClick={toggleTheme}
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
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
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
                onClick={() => navigate("/account")}
                className="transition-all duration-200 hover:scale-105"
              >
                <Avatar
                  className="w-8 h-8 border-2 force-dark-avatar"
                  style={{
                    borderColor: "#7B2CBF",
                  }}
                >
                  <AvatarImage src={user?.avatarUrl} alt="Usuario" />
                  <AvatarFallback
                    style={{
                      backgroundColor: "#7B2CBF !important",
                      color: "#E8E1FF !important",
                    }}
                  >
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </button>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="flex flex-col md:flex-row items-center gap-1 md:gap-2 transition-all duration-200 hover:scale-105"
                style={{
                  color:
                    location.pathname === "/auth"
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
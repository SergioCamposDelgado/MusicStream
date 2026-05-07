/**
 * @file ThemeContext.tsx
 * @description Contexto global para la gestión del tema visual (claro/oscuro).
 *
 * Persiste la preferencia del usuario en localStorage bajo la clave 'theme'.
 * Aplica/elimina la clase 'dark' en el elemento html para activar
 * el modo correspondiente vía Tailwind CSS.
 *
 * @exports ThemeProvider - Componente proveedor que envuelve la aplicación.
 * @exports useTheme      - Hook para acceder al tema actual y la función de cambio.
 */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return (saved as Theme) || "dark";
  });

  const colors = theme === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

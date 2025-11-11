import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Logo } from "./Logo";
import { useState } from "react";
import { ThemeColors } from "../App";

interface AuthProps {
  onNavigate: (page: string) => void;
  onLogin?: (isArtist: boolean) => void;
  colors?: ThemeColors;
}

export function Auth({
  onNavigate,
  onLogin,
  colors,
}: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isArtist, setIsArtist] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin) {
      onLogin(isArtist);
    }
    onNavigate("home");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: `linear-gradient(135deg, ${themeColors.bgPrimary} 0%, ${themeColors.bgSecondary} 100%)`,
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo
            className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4"
            color={themeColors.textPrimary}
          />
          <h1
            className="mb-2 text-4xl md:text-5xl"
            style={{ color: themeColors.textPrimary }}
          >
            MusicStream
          </h1>
          <p style={{ color: themeColors.textSecondary }}>
            {isLogin
              ? "Bienvenido de vuelta"
              : "Únete a la comunidad"}
          </p>
        </div>

        {/* Form Card */}
        <div
          className="p-8 rounded-xl"
          style={{
            backgroundColor: themeColors.bgSecondary,
            border: `1px solid ${themeColors.border}`,
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                style={{ color: themeColors.textPrimary }}
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                required
                className="rounded-lg"
                style={{
                  backgroundColor: themeColors.bgPrimary,
                  borderColor: themeColors.border,
                  color: themeColors.textPrimary,
                }}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                style={{ color: themeColors.textPrimary }}
              >
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="rounded-lg"
                style={{
                  backgroundColor: themeColors.bgPrimary,
                  borderColor: themeColors.border,
                  color: themeColors.textPrimary,
                }}
              />
            </div>

            {/* Confirm Password (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label
                  htmlFor="confirm-password"
                  style={{ color: themeColors.textPrimary }}
                >
                  Confirmar contraseña
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="rounded-lg"
                  style={{
                    backgroundColor: themeColors.bgPrimary,
                    borderColor: themeColors.border,
                    color: themeColors.textPrimary,
                  }}
                />
              </div>
            )}

            {/* Artist Checkbox (Register only) */}
            {!isLogin && (
              <div className="flex items-center gap-3">
                <Checkbox
                  id="artist"
                  checked={isArtist}
                  onCheckedChange={(checked) =>
                    setIsArtist(checked as boolean)
                  }
                  style={{
                    borderColor: themeColors.border,
                  }}
                  className="data-[state=checked]:bg-[#7B2CBF]"
                />
                <Label
                  htmlFor="artist"
                  className="cursor-pointer"
                  style={{ color: themeColors.textSecondary }}
                >
                  Continuar como artista
                </Label>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full rounded-xl transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: themeColors.accentPrimary,
                color: themeColors.textPrimary,
                boxShadow: "0 0 20px rgba(123, 44, 191, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  themeColors.accentHover;
                e.currentTarget.style.boxShadow =
                  "0 0 30px rgba(157, 78, 221, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  themeColors.accentPrimary;
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(123, 44, 191, 0.3)";
              }}
            >
              {isLogin ? "Iniciar sesión" : "Crear cuenta"}
            </Button>

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <button
                type="button"
                className="w-full text-center transition-colors"
                style={{ color: themeColors.textSecondary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color =
                    themeColors.accentHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    themeColors.textSecondary)
                }
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <p style={{ color: themeColors.textSecondary }}>
              {isLogin
                ? "¿No tienes cuenta? "
                : "¿Ya tienes cuenta? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="transition-colors"
                style={{ color: themeColors.accentHover }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color =
                    themeColors.accentPrimary)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    themeColors.accentHover)
                }
              >
                {isLogin ? "Regístrate" : "Inicia sesión"}
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate("home")}
            className="transition-colors"
            style={{ color: themeColors.textSecondary }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color =
                themeColors.textPrimary)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color =
                themeColors.textSecondary)
            }
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
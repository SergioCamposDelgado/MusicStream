import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Logo } from "./Logo";
import { useState } from "react";
import { ThemeColors } from "../App";
import { useAuth } from '../context/AuthContext';

interface AuthProps {
  onNavigate: (page: string) => void;
  onLogin?: (isArtist: boolean) => void;   // Mantenemos para que funcione la sesión
  colors?: ThemeColors;
}

export function Auth({
  onNavigate,
  onLogin,
  colors,
}: AuthProps) {
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [isArtist, setIsArtist] = useState(false);

  // Estados del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados de UI
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      if (isLogin) {
        // Login
        await login(email.trim(), password);
        setMessage({ text: "¡Bienvenido! Sesión iniciada correctamente.", type: 'success' });
      } else {
        // Registro
        if (password !== confirmPassword) {
          setMessage({ text: "Las contraseñas no coinciden", type: 'error' });
          setIsSubmitting(false);
          return;
        }

        await register({
          name: name.trim() || email.split("@")[0],
          email: email.trim(),
          password,
          confirmPassword,
          isArtist,
        });

        setMessage({ text: "¡Cuenta creada exitosamente!", type: 'success' });
      }

      // ←←← ESTO ES LO QUE HACE QUE SE GUARDE LA SESIÓN (igual que tu versión original)
      if (onLogin) {
        onLogin(isArtist);
      }

      // Pequeño delay para mostrar el mensaje de éxito
      setTimeout(() => {
        onNavigate("home");
      }, 900);

    } catch (err: any) {
      let errorText = "Error desconocido";

      if (err.message) {
        errorText = err.message;
      } else if (err.response?.data?.message) {
        errorText = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorText = "Email o contraseña incorrectos";
      } else if (!err.response) {
        errorText = "No se pudo conectar con el servidor. Verifica que Spring Boot esté corriendo.";
      }

      setMessage({ text: errorText, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
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
            {isLogin ? "Bienvenido de vuelta" : "Únete a la comunidad"}
          </p>
        </div>

        {/* Mensaje de feedback */}
        {message && (
          <div
            className={`p-4 mb-6 rounded-xl text-center border ${
              message.type === 'success'
                ? 'bg-green-900/30 text-green-200 border-green-700'
                : 'bg-red-900/30 text-red-200 border-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

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
              <Label htmlFor="email" style={{ color: themeColors.textPrimary }}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="rounded-lg"
                style={{
                  backgroundColor: themeColors.bgPrimary,
                  borderColor: themeColors.border,
                  color: themeColors.textPrimary,
                }}
              />
            </div>

            {/* Nombre - solo registro */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" style={{ color: themeColors.textPrimary }}>
                  Nombre
                </Label>
                <Input
                  id="name"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="rounded-lg"
                  style={{
                    backgroundColor: themeColors.bgPrimary,
                    borderColor: themeColors.border,
                    color: themeColors.textPrimary,
                  }}
                />
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: themeColors.textPrimary }}>
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="rounded-lg"
                style={{
                  backgroundColor: themeColors.bgPrimary,
                  borderColor: themeColors.border,
                  color: themeColors.textPrimary,
                }}
              />
            </div>

            {/* Confirmar contraseña - solo registro */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password" style={{ color: themeColors.textPrimary }}>
                  Confirmar contraseña
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="rounded-lg"
                  style={{
                    backgroundColor: themeColors.bgPrimary,
                    borderColor: themeColors.border,
                    color: themeColors.textPrimary,
                  }}
                />
              </div>
            )}

            {/* Checkbox artista - solo registro */}
            {!isLogin && (
              <div className="flex items-center gap-3">
                <Checkbox
                  id="artist"
                  checked={isArtist}
                  onCheckedChange={(checked : boolean) => setIsArtist(!!checked)}
                  style={{ borderColor: themeColors.border }}
                  className="data-[state=checked]:bg-[#7B2CBF]"
                  disabled={isSubmitting}
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
              disabled={isSubmitting}
              className="w-full rounded-xl transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: themeColors.accentPrimary,
                color: themeColors.textPrimary,
                boxShadow: "0 0 20px rgba(123, 44, 191, 0.3)",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = themeColors.accentHover;
                e.currentTarget.style.boxShadow = "0 0 30px rgba(157, 78, 221, 0.5)";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = themeColors.accentPrimary;
                e.currentTarget.style.boxShadow = "0 0 20px rgba(123, 44, 191, 0.3)";
              }}
            >
              {isSubmitting
                ? (isLogin ? "Iniciando sesión..." : "Creando cuenta...")
                : (isLogin ? "Iniciar sesión" : "Crear cuenta")
              }
            </Button>

            {/* Forgot Password (solo login) */}
            {isLogin && (
              <button
                type="button"
                className="w-full text-center transition-colors"
                style={{ color: themeColors.textSecondary }}
                onMouseEnter={(e) => (e.currentTarget.style.color = themeColors.accentHover)}
                onMouseLeave={(e) => (e.currentTarget.style.color = themeColors.textSecondary)}
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <p style={{ color: themeColors.textSecondary }}>
              {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage(null);
                }}
                className="transition-colors"
                style={{ color: themeColors.accentHover }}
                onMouseEnter={(e) => (e.currentTarget.style.color = themeColors.accentPrimary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = themeColors.accentHover)}
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
            onMouseEnter={(e) => (e.currentTarget.style.color = themeColors.textPrimary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = themeColors.textSecondary)}
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
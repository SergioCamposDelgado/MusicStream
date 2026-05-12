/**
 * Página de autenticación (Login y Registro) de MusicStream.
 * Implementa una interfaz dividida con branding y formularios con validación.
 */

import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader2, Headphones, Radio, Sun, Moon, AlertCircle, CheckCircle2 } from "lucide-react";
import { Logo } from "./Logo";

// ── Floating music note particle ──────────────────────────────────────────────
function MusicParticle({ delay, x, duration, symbol }: { delay: number; x: number; duration: number; symbol: string }) {
  return (
    <div
      className="absolute bottom-0 text-2xl select-none pointer-events-none opacity-0"
      style={{
        left: `${x}%`,
        animation: `floatUp ${duration}s ${delay}s ease-in infinite`,
        color: "rgba(157, 78, 221, 0.3)",
        fontSize: `${Math.random() * 16 + 16}px`,
      }}
    >
      {symbol}
    </div>
  );
}

const PARTICLES = [
  { symbol: "♪", x: 10, delay: 0, duration: 8 },
  { symbol: "♫", x: 25, delay: 2, duration: 10 },
  { symbol: "♩", x: 40, delay: 4, duration: 7 },
  { symbol: "♬", x: 55, delay: 1, duration: 9 },
  { symbol: "♪", x: 70, delay: 3, duration: 11 },
  { symbol: "♫", x: 85, delay: 5, duration: 8 },
  { symbol: "♩", x: 15, delay: 6, duration: 10 },
  { symbol: "♬", x: 92, delay: 1.5, duration: 7 },
];

// ── Animated waveform bars ─────────────────────────────────────────────────────
function WaveformVisual() {
  return (
    <div className="flex items-end gap-1 h-16">
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className="rounded-full w-1.5"
          style={{
            backgroundColor: "rgba(157, 78, 221, 0.6)",
            height: `${Math.random() * 60 + 20}%`,
            animation: `waveBar ${0.8 + Math.random() * 1.2}s ${Math.random() * 0.5}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

// ── Input field with floating icon ──────────────────────────────────────────────
function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  disabled = false,
  rightElement,
  isDark = true,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: React.ElementType;
  disabled?: boolean;
  rightElement?: React.ReactNode;
  isDark?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  const inputBorder    = isDark ? "rgba(255,255,255,0.10)"  : "rgba(0,0,0,0.12)";
  const inputBg        = isDark ? "rgba(255,255,255,0.04)"  : "rgba(0,0,0,0.03)";
  const inputText      = isDark ? "rgba(255,255,255,0.95)"  : "rgba(10,0,30,0.90)";
  const inputPlaceholder = isDark ? "rgba(255,255,255,0.35)" : "rgba(10,0,30,0.35)";
  const labelFloated   = isDark ? "rgba(255,255,255,0.45)"  : "rgba(10,0,30,0.45)";
  const iconColor      = isDark ? "rgba(255,255,255,0.30)"  : "rgba(10,0,30,0.35)";

  return (
    <div className="relative">
      <div
        className="relative flex items-center rounded-xl transition-all duration-300"
        style={{
          background: inputBg,
          border: `1.5px solid ${focused ? "rgba(157, 78, 221, 0.8)" : inputBorder}`,
          boxShadow: focused ? "0 0 0 3px rgba(157, 78, 221, 0.15)" : "none",
          height: "64px",
        }}
      >
        {/* Leading icon */}
        <div className="flex-shrink-0 self-center">
          <Icon
            className="w-[18px] h-[18px] transition-colors duration-300"
            style={{
              color: focused ? "rgba(157, 78, 221, 1)" : iconColor,
              marginLeft: "20px",
              marginRight: "12px",
            }}
          />
        </div>

        {/* Label + Input stacked */}
        <div className="flex-1 flex flex-col justify-center pr-3" style={{ height: "100%" }}>
          {/* Floating label */}
          <label
            htmlFor={id}
            className="transition-all duration-200 cursor-text select-none block"
            style={{
              fontSize: "0.65rem",
              color: isFloating
                ? focused ? "rgba(157, 78, 221, 1)" : labelFloated
                : "rgba(255,255,255,0)",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              height: isFloating ? "16px" : "0px",
              overflow: "hidden",
              lineHeight: "16px",
              marginBottom: isFloating ? "2px" : "0px",
            }}
          >
            {label}
          </label>

          {/* Placeholder shown as label when empty & not focused */}
          {!isFloating && (
            <span
              className="absolute pointer-events-none select-none transition-opacity duration-200"
              style={{
                color: inputPlaceholder,
                fontSize: "0.9rem",
                opacity: focused ? 0 : 1,
              }}
            >
              {label}
            </span>
          )}

          {/* Actual input */}
          <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            placeholder={focused && !isFloating ? placeholder ?? "" : ""}
            className="w-full bg-transparent outline-none disabled:opacity-40"
            style={{
              color: inputText,
              fontSize: "0.9rem",
              caretColor: "rgba(157, 78, 221, 1)",
              lineHeight: "1.4",
            }}
            autoComplete={type === "password" ? "current-password" : id === "email" ? "email" : "off"}
          />
        </div>

        {/* Trailing element */}
        {rightElement && (
          <div
            className="flex-shrink-0 self-center"
            style={{ marginLeft: "12px", marginRight: "16px" }}
          >
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}


// ── Main Auth component ────────────────────────────────────────────────────────
export function Auth() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme, colors: themeColors } = useTheme();

  // Dynamic color palette that responds to light/dark mode
  const isDark = theme === "dark";
  const c = {
    bg:            isDark ? "rgba(255,255,255,0.04)"  : "rgba(0,0,0,0.04)",
    border:        isDark ? "rgba(255,255,255,0.10)"  : "rgba(0,0,0,0.12)",
    borderFocus:   "rgba(157, 78, 221, 0.8)",
    shadowFocus:   "rgba(157, 78, 221, 0.15)",
    text:          isDark ? "rgba(255,255,255,0.95)"  : "rgba(10,0,30,0.90)",
    textSecondary: isDark ? "rgba(255,255,255,0.40)"  : "rgba(10,0,30,0.45)",
    textMuted:     isDark ? "rgba(255,255,255,0.20)"  : "rgba(10,0,30,0.25)",
    labelFloated:  isDark ? "rgba(255,255,255,0.45)"  : "rgba(10,0,30,0.45)",
    placeholder:   isDark ? "rgba(255,255,255,0.35)"  : "rgba(10,0,30,0.35)",
    cardBg:        isDark ? "rgba(255,255,255,0.04)"  : "rgba(255,255,255,0.80)",
    cardShadow:    isDark
      ? "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset"
      : "0 32px 80px rgba(100,0,200,0.10), 0 0 0 1px rgba(0,0,0,0.05) inset",
    toggleBg:      isDark ? "rgba(255,255,255,0.08)"  : "rgba(0,0,0,0.06)",
    toggleText:    isDark ? "rgba(255,255,255,0.7)"   : "rgba(10,0,30,0.6)",
    divider:       isDark ? "rgba(255,255,255,0.08)"  : "rgba(0,0,0,0.10)",
    errBg:         isDark ? "rgba(212,24,61,0.12)"    : "rgba(212,24,61,0.08)",
    errBorder:     isDark ? "rgba(212,24,61,0.3)"     : "rgba(212,24,61,0.3)",
    errText:       "#e8294a",
    okBg:          isDark ? "rgba(34,197,94,0.12)"    : "rgba(34,197,94,0.08)",
    okBorder:      isDark ? "rgba(34,197,94,0.3)"     : "rgba(34,197,94,0.3)",
    okText:        isDark ? "#4ade80"                 : "#15803d",
    artistBg:      (active: boolean) => active
      ? (isDark ? "rgba(157,78,221,0.12)" : "rgba(157,78,221,0.08)")
      : (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"),
    artistBorder:  (active: boolean) => active
      ? "rgba(157,78,221,0.5)"
      : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)"),
    artistIcon:    isDark ? "rgba(255,255,255,0.3)" : "rgba(10,0,30,0.3)",
    iconBg:        isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
    leftPanel:     isDark ? "rgba(255,255,255,0.4)" : "rgba(10,0,30,0.5)",
    waveBg:        isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
    waveBorder:    isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
  };

  const [isLogin, setIsLogin] = useState(true);
  const [isArtist, setIsArtist] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fade-in animation on mode switch
  const [animKey, setAnimKey] = useState(0);

  const switchMode = () => {
    setIsLogin((v) => !v);
    setError(null);
    setAnimKey((k) => k + 1);
    setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        if (password !== confirmPassword) {
          setError("Las contraseñas no coinciden");
          setIsSubmitting(false);
          return;
        }
        await register({ name: name.trim() || email.split("@")[0], email: email.trim(), password, confirmPassword, isArtist });
      }
      setSuccess(true);
      setTimeout(() => navigate("/"), 800);
    } catch (err: any) {
      let msg = "Error desconocido";
      if (err.message) msg = err.message;
      else if (err.response?.data?.message) msg = err.response.data.message;
      else if (err.response?.status === 401) msg = "Email o contraseña incorrectos";
      else if (!err.response) msg = "No se pudo conectar con el servidor";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Global keyframe styles */}
      <style>{`
        @keyframes floatUp {
          0%   { opacity: 0; transform: translateY(0) rotate(0deg); }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-100vh) rotate(20deg); }
        }
        @keyframes waveBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.5); opacity: 0.5; }
        }
        .auth-form-enter {
          animation: fadeSlideIn 0.35s ease forwards;
        }
        .bg-auth-dark {
          background: linear-gradient(-45deg, #0d0017, #130824, #0a0020, #1a0533, #0f0026);
          background-size: 400% 400%;
          animation: gradientShift 12s ease infinite;
        }
        .bg-auth-light {
          background: linear-gradient(-45deg, #f3eeff, #ede5ff, #f8f4ff, #e8d9ff, #f0eaff);
          background-size: 400% 400%;
          animation: gradientShift 12s ease infinite;
        }
      `}</style>

      <div className={`min-h-screen flex overflow-hidden relative ${isDark ? "bg-auth-dark" : "bg-auth-light"}`}>

        {/* Theme toggle button – top right corner */}
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 z-50 p-2.5 rounded-xl transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: c.toggleBg,
            color: c.toggleText,
            border: `1px solid ${c.border}`,
            backdropFilter: "blur(8px)",
          }}
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Floating music particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {PARTICLES.map((p, i) => (
            <MusicParticle key={i} {...p} />
          ))}
        </div>

        {/* ── LEFT PANEL – Brand / Illustration ─────────────────────────────── */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative z-10">
          {/* Logo */}
          <div className="flex flex-col items-start gap-2">
            <Logo className="w-16 h-16" color="#C77DFF" />
            <span className="font-bold text-4xl tracking-tight" style={{ color: c.text }}>MusicStream</span>
          </div>

          {/* Center content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex gap-2">
                {["NUEVA EXPERIENCIA", "MÚSICA SIN LÍMITES"].map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      background: i === 0 ? "rgba(157, 78, 221, 0.2)" : c.bg,
                      color: i === 0 ? "#C77DFF" : c.textSecondary,
                      border: i === 0 ? "1px solid rgba(157,78,221,0.4)" : `1px solid ${c.border}`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-5xl xl:text-6xl font-black leading-tight" style={{ color: c.text }}>
                Tu música,{" "}
                <span
                  className="block"
                  style={{
                    background: "linear-gradient(90deg, #9D4EDD, #C77DFF, #E0AAFF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  tu mundo.
                </span>
              </h1>
              <p className="text-lg leading-relaxed" style={{ color: c.leftPanel }}>
                Descubre, comparte y vive la música como nunca antes. Millones de canciones, artistas y momentos esperan por ti.
              </p>
            </div>

            {/* Waveform visual */}
            <div
              className="p-6 rounded-2xl space-y-3"
              style={{
                background: c.waveBg,
                border: `1px solid ${c.waveBorder}`,
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #7B2CBF, #9D4EDD)" }}
                  >
                    <Headphones className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: c.text }}>Reproduciendo ahora</p>
                    <p className="text-xs" style={{ color: c.textSecondary }}>MusicStream Radio</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#C77DFF", animation: "pulseDot 1.2s ease-in-out infinite" }}
                  />
                  <span className="text-xs font-medium" style={{ color: "#C77DFF" }}>LIVE</span>
                </div>
              </div>
              <WaveformVisual />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "10M+", label: "Canciones" },
                { value: "500K", label: "Artistas" },
                { value: "2M+", label: "Usuarios" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-black" style={{ color: "#C77DFF" }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: c.textSecondary }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom tagline */}
          <p className="text-xs" style={{ color: c.textMuted }}>
            © 2025 MusicStream · Sergio Campos · Todos los derechos reservados
          </p>
        </div>

        {/* ── RIGHT PANEL – Form ──────────────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="lg:hidden flex flex-col items-center gap-2 mb-8">
              <Logo className="w-16 h-16" color="#C77DFF" />
              <span className="font-bold text-4xl tracking-tight" style={{ color: c.text }}>MusicStream</span>
            </div>

            {/* Card */}
            <div
              className="rounded-2xl p-8"
              style={{
                background: c.cardBg,
                border: `1px solid ${c.border}`,
                backdropFilter: "blur(24px)",
                boxShadow: c.cardShadow,
              }}
            >
              {/* Header */}
              <div className="mb-8" key={`header-${animKey}`} style={{ animation: "fadeSlideIn 0.4s ease forwards" }}>
                <h2 className="text-2xl font-bold mb-1" style={{ color: c.text }}>
                  {isLogin ? "Bienvenido de vuelta" : "Crea tu cuenta"}
                </h2>
                <p style={{ color: c.textSecondary, fontSize: "0.875rem" }}>
                  {isLogin
                    ? "Inicia sesión para continuar escuchando"
                    : "Únete a millones de amantes de la música"}
                </p>
              </div>

              {/* Form */}
              <form
                key={`form-${animKey}`}
                onSubmit={handleSubmit}
                className="space-y-4 auth-form-enter"
              >
                {/* Name – only register */}
                {!isLogin && (
                  <FloatingInput
                    id="name"
                    label="Nombre completo"
                    value={name}
                    onChange={setName}
                    placeholder="Tu nombre"
                    icon={User}
                    disabled={isSubmitting}
                    isDark={isDark}
                  />
                )}

                {/* Email */}
                <FloatingInput
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="tu@email.com"
                  icon={Mail}
                  disabled={isSubmitting}
                  isDark={isDark}
                />

                {/* Password */}
                <FloatingInput
                  id="password"
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={setPassword}
                  placeholder="Mínimo 8 caracteres"
                  icon={Lock}
                  disabled={isSubmitting}
                  isDark={isDark}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="p-1 transition-colors"
                      style={{ color: c.textSecondary }}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                {/* Confirm password – only register */}
                {!isLogin && (
                  <FloatingInput
                    id="confirm-password"
                    label="Confirmar contraseña"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Repite tu contraseña"
                    icon={Lock}
                    disabled={isSubmitting}
                    isDark={isDark}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="p-1 transition-colors"
                        style={{ color: c.textSecondary }}
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />
                )}

                {/* Artist toggle – only register */}
                {!isLogin && (
                  <label
                    className="flex items-center gap-3 p-4 rounded-xl cursor-pointer group transition-all duration-200"
                    style={{
                      background: c.artistBg(isArtist),
                      border: `1.5px solid ${c.artistBorder(isArtist)}`,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                      style={{
                        background: isArtist ? "rgba(157,78,221,0.3)" : c.iconBg,
                      }}
                    >
                      <Radio className="w-5 h-5" style={{ color: isArtist ? "#C77DFF" : c.artistIcon }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: c.text }}>Soy artista</p>
                      <p className="text-xs" style={{ color: c.textSecondary }}>
                        Publica tu propia música en la plataforma
                      </p>
                    </div>
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                      style={{
                        background: isArtist ? "#7B2CBF" : c.toggleBg,
                        border: `1.5px solid ${isArtist ? "#7B2CBF" : c.border}`,
                      }}
                    >
                      {isArtist && (
                        <svg viewBox="0 0 12 9" fill="none" className="w-3 h-3">
                          <path d="M1 4l3 3 7-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isArtist}
                      onChange={(e) => setIsArtist(e.target.checked)}
                    />
                  </label>
                )}

                {/* Error message */}
                {error && (
                  <div
                    className="flex items-start gap-3 p-4 rounded-xl text-sm"
                    style={{
                      background: c.errBg,
                      border: `1px solid ${c.errBorder}`,
                      borderLeft: `3px solid ${c.errText}`,
                    }}
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: c.errText }} />
                    <div>
                      <p className="font-semibold mb-0.5" style={{ color: c.errText }}>Error de autenticación</p>
                      <p style={{ color: c.textSecondary }}>{error}</p>
                    </div>
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div
                    className="flex items-start gap-3 p-4 rounded-xl text-sm"
                    style={{
                      background: c.okBg,
                      border: `1px solid ${c.okBorder}`,
                      borderLeft: `3px solid ${c.okText}`,
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: c.okText }} />
                    <div>
                      <p className="font-semibold mb-0.5" style={{ color: c.okText }}>
                        {isLogin ? "¡Sesión iniciada!" : "¡Cuenta creada!"}
                      </p>
                      <p style={{ color: c.textSecondary }}>Redirigiendo al inicio...</p>
                    </div>
                  </div>
                )}

                {/* Submit button – same 64px height as inputs */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl font-semibold text-white text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{
                    height: "64px",
                    background: "linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 50%, #C77DFF 100%)",
                    boxShadow: "0 8px 32px rgba(123, 44, 191, 0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(157, 78, 221, 0.6)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(123, 44, 191, 0.4)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting
                    ? (isLogin ? "Iniciando sesión..." : "Creando cuenta...")
                    : (isLogin ? "Iniciar sesión" : "Crear cuenta gratis")
                  }
                </button>

                {/* Forgot password */}
                {isLogin && (
                  <button
                    type="button"
                    className="w-full text-center text-sm transition-colors duration-200"
                    style={{ color: c.textSecondary }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#C77DFF"}
                    onMouseLeave={(e) => e.currentTarget.style.color = c.textSecondary}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px" style={{ background: c.divider }} />
                <span className="text-xs" style={{ color: c.textMuted }}>o</span>
                <div className="flex-1 h-px" style={{ background: c.divider }} />
              </div>

              {/* Toggle login/register */}
              <p className="text-center text-sm" style={{ color: c.textSecondary }}>
                {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                <button
                  onClick={switchMode}
                  className="font-semibold transition-colors duration-200"
                  style={{ color: "#C77DFF" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#E0AAFF"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#C77DFF"}
                >
                  {isLogin ? "Regístrate gratis" : "Inicia sesión"}
                </button>
              </p>
            </div>

            {/* Back to home */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 mx-auto text-sm transition-colors duration-200"
                style={{ color: c.textMuted }}
                onMouseEnter={(e) => e.currentTarget.style.color = c.textSecondary}
                onMouseLeave={(e) => e.currentTarget.style.color = c.textMuted}
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
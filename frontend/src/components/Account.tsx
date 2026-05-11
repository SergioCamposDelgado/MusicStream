import {
  User,
  Mail,
  Calendar,
  Music2,
  Heart,
  Settings,
  LogOut,
  TrendingUp,
  Shield,
  Camera,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect, useRef } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "./ui/alert-dialog";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../context/AuthContext";
import Swal from "sweetalert2";

const favoriteSongs = [
  { id: 1, title: "Midnight Echoes", artist: "Luna Noir", duration: "3:45", plays: 127 },
  { id: 2, title: "Digital Dreams", artist: "Echo Theory", duration: "4:12", plays: 98 },
  { id: 3, title: "Street Poetry", artist: "The Cipher", duration: "3:28", plays: 156 },
  { id: 4, title: "Rebel Heart", artist: "Velvet Rebels", duration: "4:56", plays: 84 },
];

const listeningStats = [
  { label: "Canciones escuchadas", value: "1,247", icon: Music2 },
  { label: "Horas totales", value: "52.3", icon: TrendingUp },
  { label: "Artistas seguidos", value: "28", icon: User },
  { label: "Canciones favoritas", value: "142", icon: Heart },
];

export function Account() {
  const { user, updateProfile, logout } = useAuth();
  const { colors: themeColors } = useTheme();
  const navigate = useNavigate();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Estados locales sincronizados con el usuario del contexto
  const [userName, setUserName] = useState(user?.name || "");
  const [userEmail, setUserEmail] = useState(user?.email || "");
  const [currentAvatar, setCurrentAvatar] = useState(user?.avatarUrl || "");

  // Efecto para actualizar los campos cuando el usuario cargue o cambie
  useEffect(() => {
    if (user) {
      setUserName(user.name);
      setUserEmail(user.email);
      setCurrentAvatar(user.avatarUrl || "");
    }
  }, [user]);

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ title: 'Archivo muy grande', text: 'La imagen no puede superar los 5MB', icon: 'error', background: themeColors.bgSecondary, color: themeColors.textPrimary });
      return;
    }

    // Preview inmediato antes de subir
    const reader = new FileReader();
    reader.onloadend = () => setCurrentAvatar(reader.result as string);
    reader.readAsDataURL(file);

    // Subir al backend
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/files/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedUrl: string = response.data.url;
      setCurrentAvatar(uploadedUrl);

      // Guardar la nueva URL en el perfil del usuario automáticamente
      await updateProfile(userName, uploadedUrl);
      Swal.fire({ title: '¡Avatar actualizado!', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, background: themeColors.bgSecondary, color: themeColors.textPrimary });
    } catch (err: any) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'No se pudo subir la imagen', icon: 'error', background: themeColors.bgSecondary, color: themeColors.textPrimary });
      // Revertir al avatar anterior en caso de error
      setCurrentAvatar(user?.avatarUrl || '');
    } finally {
      setIsUploadingAvatar(false);
      // Limpiar el input para que se pueda volver a seleccionar el mismo archivo
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    // 1. Validación de longitud en el Frontend (UX inmediata)
    const trimmedName = userName.trim();
    if (trimmedName.length < 2) {
      Swal.fire({ title: 'Nombre muy corto', text: 'El nombre debe tener al menos 2 caracteres.', icon: 'warning', background: themeColors.bgSecondary, color: themeColors.textPrimary });
      return;
    }

    setIsSubmitting(true);
    try {
      // 2. Intentamos la actualización vía Contexto
      await updateProfile(trimmedName, currentAvatar);

      // 3. Éxito
      setIsEditing(false);
      Swal.fire({ title: '¡Perfil actualizado!', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, background: themeColors.bgSecondary, color: themeColors.textPrimary });

    } catch (error: any) {
      const errorMsg = error.message || "No se pudo actualizar el perfil";
      Swal.fire({ title: 'Error', text: errorMsg, icon: 'error', background: themeColors.bgSecondary, color: themeColors.textPrimary });
      console.error("Error al guardar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminToggle = (checked: boolean) => {
    console.log("Admin toggle:", checked);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout(); // Cierre de sesión en el backend
      setLogoutDialogOpen(false);
      navigate("/auth");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <div
      className="min-h-screen pb-32"
      style={{ backgroundColor: themeColors.bgPrimary }}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div
          className="rounded-xl p-8 mb-8"
          style={{
            backgroundColor: themeColors.bgSecondary,
            border: `1px solid ${themeColors.border}`,
          }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <Avatar
                className="w-24 h-24 md:w-32 md:h-32 border-4 force-dark-avatar"
                style={{ borderColor: "#7B2CBF" }}
              >
                <AvatarImage src={currentAvatar} alt={userName} />
                <AvatarFallback
                  style={{
                    backgroundColor: "#7B2CBF !important",
                    color: "#E8E1FF !important",
                  }}
                >
                  <User className="w-12 h-12 md:w-16 md:h-16" />
                </AvatarFallback>
              </Avatar>
              {/* Input oculto para seleccionar archivo */}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={isSubmitting || isUploadingAvatar}
                className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50"
                style={{
                  backgroundColor: "#7B2CBF",
                  border: "2px solid #1A0F2E",
                }}
              >
                {isUploadingAvatar ? (
                  <Loader2
                    className="w-4 h-4 md:w-5 md:h-5 animate-spin"
                    style={{ color: "#E8E1FF" }}
                  />
                ) : (
                  <Camera
                    className="w-4 h-4 md:w-5 md:h-5"
                    style={{ color: "#E8E1FF" }}
                  />
                )}
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="name"
                      style={{ color: themeColors.textPrimary }}
                    >
                      Nombre
                    </Label>
                    <Input
                      id="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      disabled={isSubmitting}
                      className="mt-2 rounded-lg"
                      style={{
                        backgroundColor: themeColors.bgPrimary,
                        borderColor: themeColors.border,
                        color: themeColors.textPrimary,
                      }}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="email"
                      style={{ color: themeColors.textPrimary }}
                    >
                      Email (No editable)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={userEmail}
                      disabled
                      className="mt-2 rounded-lg opacity-60 cursor-not-allowed"
                      style={{
                        backgroundColor: themeColors.bgPrimary,
                        borderColor: themeColors.border,
                        color: themeColors.textPrimary,
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={isSubmitting}
                      className="rounded-lg"
                      style={{
                        backgroundColor: themeColors.accentPrimary,
                        color: themeColors.textPrimary,
                      }}
                    >
                      {isSubmitting ? "Guardando..." : "Guardar"}
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      disabled={isSubmitting}
                      className="rounded-lg"
                      style={{
                        backgroundColor: themeColors.bgSecondary,
                        color: themeColors.textPrimary,
                        border: `1px solid ${themeColors.border}`,
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2
                    className="mb-2 text-2xl font-bold"
                    style={{ color: themeColors.textPrimary }}
                  >
                    {userName}
                  </h2>
                  <div className="flex flex-col md:flex-row items-center md:items-center gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail
                        className="w-4 h-4"
                        style={{ color: themeColors.textSecondary }}
                      />
                      <span style={{ color: themeColors.textSecondary }}>
                        {userEmail}
                      </span>
                    </div>
                    <span
                      className="hidden md:block"
                      style={{ color: themeColors.border }}
                    >
                      •
                    </span>
                    <div className="flex items-center gap-2">
                      <Calendar
                        className="w-4 h-4"
                        style={{ color: themeColors.textSecondary }}
                      />
                      <span style={{ color: themeColors.textSecondary }}>
                        Miembro desde {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }) : "Nov 2024"}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="rounded-lg"
                    style={{
                      backgroundColor: themeColors.accentPrimary,
                      color: themeColors.textPrimary,
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Listening Stats */}
        <div className="mb-8">
          <h3 className="mb-4 font-semibold" style={{ color: themeColors.textPrimary }}>
            Estadísticas de Escucha
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {listeningStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="rounded-xl p-4 text-center transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: themeColors.bgSecondary,
                    border: `1px solid ${themeColors.border}`,
                  }}
                >
                  <Icon
                    className="w-8 h-8 mx-auto mb-3"
                    style={{ color: themeColors.accentPrimary }}
                  />
                  <div
                    className="mb-1 font-bold"
                    style={{
                      color: themeColors.textPrimary,
                      fontSize: "1.5rem",
                    }}
                  >
                    {stat.value}
                  </div>
                  <p
                    style={{
                      color: themeColors.textSecondary,
                      fontSize: "0.75rem",
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Favorite Songs */}
        <div className="mb-8">
          <h3 className="mb-4 font-semibold" style={{ color: themeColors.textPrimary }}>
            Canciones Más Escuchadas
          </h3>
          <div
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: themeColors.bgSecondary,
              border: `1px solid ${themeColors.border}`,
            }}
          >
            {favoriteSongs.map((song, index) => (
              <div key={song.id}>
                {index > 0 && (
                  <Separator
                    style={{ backgroundColor: themeColors.border }}
                  />
                )}
                <div className="p-4 transition-all duration-300 hover:bg-opacity-80 hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span
                        className="flex-shrink-0 w-8 text-center font-bold"
                        style={{ color: themeColors.accentPrimary }}
                      >
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4
                          className="mb-1 truncate font-medium"
                          style={{ color: themeColors.textPrimary }}
                        >
                          {song.title}
                        </h4>
                        <p
                          className="truncate"
                          style={{
                            color: themeColors.textSecondary,
                            fontSize: "0.875rem",
                          }}
                        >
                          {song.artist}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span
                        style={{
                          color: themeColors.textSecondary,
                          fontSize: "0.875rem",
                        }}
                      >
                        {song.plays} plays
                      </span>
                      <span
                        style={{
                          color: themeColors.textSecondary,
                          fontSize: "0.875rem",
                        }}
                      >
                        {song.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Actions */}
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: themeColors.bgSecondary,
            border: `1px solid ${themeColors.border}`,
          }}
        >
          <h3 className="mb-4 font-semibold" style={{ color: themeColors.textPrimary }}>
            Configuración de Cuenta
          </h3>
          <div className="space-y-3">


            <Button
              className="w-full justify-start rounded-lg transition-colors"
              style={{
                backgroundColor: themeColors.bgPrimary,
                color: themeColors.textPrimary,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <Settings className="w-4 h-4 mr-2" />
              Preferencias de Privacidad
            </Button>
            <Button
              className="w-full justify-start rounded-lg transition-colors"
              style={{
                backgroundColor: themeColors.bgPrimary,
                color: themeColors.textPrimary,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <Music2 className="w-4 h-4 mr-2" />
              Calidad de Audio
            </Button>

            <Separator
              style={{
                backgroundColor: themeColors.border,
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            />

            {/* Botón Cerrar Sesión */}
            <Button
              onClick={() => setLogoutDialogOpen(true)}
              className="w-full justify-start rounded-lg hover:scale-105 transition-all duration-300"
              style={{
                backgroundColor: "#d4183d",
                color: themeColors.textPrimary,
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmación de cierre de sesión */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent
          style={{
            backgroundColor: themeColors.bgSecondary,
            border: `1px solid ${themeColors.border}`,
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: themeColors.textPrimary }}>
              ¿Cerrar sesión?
            </AlertDialogTitle>
            <AlertDialogDescription
              style={{ color: themeColors.textSecondary }}
            >
              Se cerrará tu sesión actual. Tendrás que iniciar sesión de nuevo para volver a acceder a tu cuenta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-lg border-none"
              style={{
                backgroundColor: themeColors.border,
                color: themeColors.textPrimary,
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              className="rounded-lg"
              style={{
                backgroundColor: "#d4183d",
                color: themeColors.textPrimary,
              }}
            >
              Cerrar Sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
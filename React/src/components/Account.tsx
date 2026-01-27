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
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { ThemeColors } from "../App";
import { defaultColors } from "../utils/theme";

interface AccountProps {
  onNavigate: (page: string) => void;
  isAdmin?: boolean;
  onAdminToggle?: (isAdmin: boolean) => void;
  userAvatar?: string;
  onAvatarChange?: (avatar: string) => void;
  onLogout?: () => void;
  colors?: ThemeColors;
}

const favoriteSongs = [
  {
    id: 1,
    title: "Midnight Echoes",
    artist: "Luna Noir",
    duration: "3:45",
    plays: 127,
  },
  {
    id: 2,
    title: "Digital Dreams",
    artist: "Echo Theory",
    duration: "4:12",
    plays: 98,
  },
  {
    id: 3,
    title: "Street Poetry",
    artist: "The Cipher",
    duration: "3:28",
    plays: 156,
  },
  {
    id: 4,
    title: "Rebel Heart",
    artist: "Velvet Rebels",
    duration: "4:56",
    plays: 84,
  },
];

const listeningStats = [
  {
    label: "Canciones escuchadas",
    value: "1,247",
    icon: Music2,
  },
  { label: "Horas totales", value: "52.3", icon: TrendingUp },
  { label: "Artistas seguidos", value: "28", icon: User },
  { label: "Canciones favoritas", value: "142", icon: Heart },
];

export function Account({
  onNavigate,
  isAdmin = false,
  onAdminToggle,
  userAvatar = "",
  onAvatarChange,
  onLogout,
  colors,
}: AccountProps) {
  const themeColors = colors || defaultColors;
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("Usuario Demo");
  const [userEmail, setUserEmail] = useState(
    "usuario@musicstream.com",
  );

  // Estado para controlar el diálogo de cierre de sesión
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleAvatarChange = () => {
    // Simulamos la selección de una imagen
    const avatarUrls = [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    ];
    const randomAvatar =
      avatarUrls[Math.floor(Math.random() * avatarUrls.length)];
    if (onAvatarChange) {
      onAvatarChange(randomAvatar);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Aquí se guardarían los cambios en el backend
  };

  const handleAdminToggle = (checked: boolean) => {
    if (onAdminToggle) {
      onAdminToggle(checked);
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
                className="w-24 h-24 md:w-32 md:h-32 border-4"
                style={{ borderColor: themeColors.accentHover }}
              >
                <AvatarImage src={userAvatar} alt="Usuario" />
                <AvatarFallback
                  style={{
                    backgroundColor: themeColors.accentPrimary,
                    color: themeColors.textPrimary,
                  }}
                >
                  <User className="w-12 h-12 md:w-16 md:h-16" />
                </AvatarFallback>
              </Avatar>
              <button
                onClick={handleAvatarChange}
                className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  backgroundColor: themeColors.accentPrimary,
                  border: `2px solid ${themeColors.bgSecondary}`,
                }}
              >
                <Camera
                  className="w-4 h-4 md:w-5 md:h-5"
                  style={{ color: themeColors.textPrimary }}
                />
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
                      onChange={(e) =>
                        setUserName(e.target.value)
                      }
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
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={userEmail}
                      onChange={(e) =>
                        setUserEmail(e.target.value)
                      }
                      className="mt-2 rounded-lg"
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
                      className="rounded-lg"
                      style={{
                        backgroundColor:
                          themeColors.accentPrimary,
                        color: themeColors.textPrimary,
                      }}
                    >
                      Guardar
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      className="rounded-lg"
                      style={{
                        backgroundColor:
                          themeColors.bgSecondary,
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
                    className="mb-2"
                    style={{ color: themeColors.textPrimary }}
                  >
                    {userName}
                  </h2>
                  <div className="flex flex-col md:flex-row items-center md:items-center gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail
                        className="w-4 h-4"
                        style={{
                          color: themeColors.textSecondary,
                        }}
                      />
                      <span
                        style={{
                          color: themeColors.textSecondary,
                        }}
                      >
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
                        style={{
                          color: themeColors.textSecondary,
                        }}
                      />
                      <span
                        style={{
                          color: themeColors.textSecondary,
                        }}
                      >
                        Miembro desde Nov 2024
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="rounded-lg"
                    style={{
                      backgroundColor:
                        themeColors.accentPrimary,
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
          <h3
            className="mb-4"
            style={{ color: themeColors.textPrimary }}
          >
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
                    className="mb-1"
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
          <h3
            className="mb-4"
            style={{ color: themeColors.textPrimary }}
          >
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
                    style={{
                      backgroundColor: themeColors.border,
                    }}
                  />
                )}
                <div className="p-4 transition-all duration-300 hover:bg-opacity-80 hover:scale-[1.02]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span
                        className="flex-shrink-0 w-8 text-center"
                        style={{
                          color: themeColors.accentPrimary,
                        }}
                      >
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4
                          className="mb-1 truncate"
                          style={{
                            color: themeColors.textPrimary,
                          }}
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
          <h3
            className="mb-4"
            style={{ color: themeColors.textPrimary }}
          >
            Configuración de Cuenta
          </h3>
          <div className="space-y-3">
            {/* Admin Mode Toggle */}
            <div
              className="flex items-center justify-between p-4 rounded-lg"
              style={{
                backgroundColor: themeColors.bgPrimary,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <div className="flex items-center gap-3">
                <Shield
                  className="w-5 h-5"
                  style={{ color: themeColors.accentPrimary }}
                />
                <div>
                  <h4
                    className="mb-1"
                    style={{ color: themeColors.textPrimary }}
                  >
                    Modo Administrador
                  </h4>
                  <p
                    style={{
                      color: themeColors.textSecondary,
                      fontSize: "0.875rem",
                    }}
                  >
                    Activa privilegios de administración
                  </p>
                </div>
              </div>
              <Switch
                checked={isAdmin}
                onCheckedChange={handleAdminToggle}
              />
            </div>

            <Button
              className="w-full justify-start rounded-lg transition-colors hover:bg-[${themeColors.bgTertiary}]"
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
              className="w-full justify-start rounded-lg transition-colors hover:bg-[${themeColors.bgTertiary}]"
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
              className="rounded-lg transition-colors hover:bg-[${themeColors.border}]"
              style={{
                backgroundColor: themeColors.border,
                color: themeColors.textPrimary,
                border: "none",
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (onLogout) {
                  onLogout();
                }
                setLogoutDialogOpen(false);
              }}
              className="rounded-lg transition-colors hover:bg-red-600"
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
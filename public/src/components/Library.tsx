import { Plus, Music2, Share2, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeColors } from "../App";
import { defaultColors } from "../utils/theme";

interface LibraryProps {
  onNavigate: (page: string) => void;
  onOpenUpload: () => void;
  colors?: ThemeColors;
}

const playlists = [
  { id: 1, title: "Mis Favoritas", tracks: 24, cover: null },
  { id: 2, title: "Descubrimientos 2024", tracks: 18, cover: null },
  { id: 3, title: "Noche de Estudio", tracks: 32, cover: null },
  { id: 4, title: "Underground Gems", tracks: 45, cover: null },
  { id: 5, title: "Chill Vibes", tracks: 28, cover: null },
  { id: 6, title: "Energía Positiva", tracks: 19, cover: null },
];

export function Library({
  onNavigate,
  onOpenUpload,
  colors,
}: LibraryProps) {
  const themeColors = colors || defaultColors;

  return (
    <div
      className="min-h-screen pb-32"
      style={{ backgroundColor: themeColors.bgPrimary }}
    >
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 transition-colors"
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
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>

          <Button
            onClick={onOpenUpload}
            className="rounded-xl transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: themeColors.accentPrimary,
              color: themeColors.textPrimary,
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) =>
            (e.currentTarget.style.backgroundColor =
              themeColors.accentHover)
            }
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
            (e.currentTarget.style.backgroundColor =
              themeColors.accentPrimary)
            }
          >
            <Plus className="w-5 h-5 mr-2" />
            Subir canción
          </Button>
        </div>

        <h1
          className="mb-2"
          style={{ color: themeColors.textPrimary }}
        >
          Tu Biblioteca
        </h1>
        <p style={{ color: themeColors.textSecondary }}>
          Gestiona tus playlists y colecciones
        </p>
      </div>

      {/* Create Playlist Section */}
      <div className="container mx-auto px-4 py-8">
        <div
          className="p-8 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] flex flex-col md:flex-row items-center gap-6"
          style={{
            backgroundColor: themeColors.bgSecondary,
            border: `2px dashed ${themeColors.accentPrimary}`,
          }}
        >
          <div
            className="w-24 h-24 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: themeColors.border }}
          >
            <Plus
              className="w-12 h-12"
              style={{ color: themeColors.accentHover }}
            />
          </div>
          <div>
            <h3
              className="mb-2"
              style={{ color: themeColors.textPrimary }}
            >
              Crear nueva playlist
            </h3>
            <p style={{ color: themeColors.textSecondary }}>
              Organiza tu música favorita en colecciones
              personalizadas
            </p>
          </div>
        </div>
      </div>

      {/* Playlists Grid */}
      <div className="container mx-auto px-4 pb-8">
        <h3
          className="mb-6"
          style={{ color: themeColors.textPrimary }}
        >
          Tus Playlists
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 group"
              style={{
                backgroundColor: themeColors.bgSecondary,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <div
                className="aspect-square flex items-center justify-center relative"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.accentPrimary} 0%, ${themeColors.border} 100%)`,
                }}
              >
                <Music2
                  className="w-16 h-16"
                  style={{
                    color: themeColors.textPrimary,
                    opacity: 0.5,
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          themeColors.accentPrimary,
                      }}
                    >
                      <Music2
                        className="w-8 h-8"
                        style={{
                          color: themeColors.textPrimary,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4
                      className="mb-2 truncate"
                      style={{ color: themeColors.textPrimary }}
                    >
                      {playlist.title}
                    </h4>
                    <p
                      style={{
                        color: themeColors.textSecondary,
                      }}
                    >
                      {playlist.tracks} canciones
                    </p>
                  </div>
                  <button
                    className="ml-2 transition-all duration-200 hover:scale-110"
                    style={{ color: themeColors.textSecondary }}
                    onMouseEnter={(e) =>
                    (e.currentTarget.style.color =
                      themeColors.accentPrimary)
                    }
                    onMouseLeave={(e) =>
                    (e.currentTarget.style.color =
                      themeColors.textSecondary)
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle share
                    }}
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import { Play, Music2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Logo } from "./Logo";
import { ThemeColors } from "../App";

interface LandingProps {
  onNavigate: (page: string, artistId?: number) => void;
  colors?: ThemeColors;
}

const featuredArtists = [
  {
    id: 1,
    name: "Luna Noir",
    genre: "Alternative",
    image:
      "https://images.unsplash.com/photo-1719353128335-725362ed1c55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2lhbiUyMHBvcnRyYWl0JTIwZGFya3xlbnwxfHx8fDE3NjIxODI3NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    name: "Echo Theory",
    genre: "Electronic",
    image:
      "https://images.unsplash.com/photo-1711157655217-ce587f36f751?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMGFydGlzdCUyMHBlcmZvcm1pbmd8ZW58MXx8fHwxNzYyMTgyNzcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    name: "The Cipher",
    genre: "Hip-Hop",
    image:
      "https://images.unsplash.com/photo-1626021855512-da7f79ed0b18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXBwZXIlMjBzdHVkaW8lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjIxODI1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 4,
    name: "Velvet Rebels",
    genre: "Rock",
    image:
      "https://images.unsplash.com/photo-1698769676419-94609164dd31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMG11c2ljaWFufGVufDF8fHx8MTc2MjE4Mjc3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const recentUploads = [
  {
    id: 1,
    title: "Midnight Echoes",
    artist: "Luna Noir",
    duration: "3:45",
  },
  {
    id: 2,
    title: "Digital Dreams",
    artist: "Echo Theory",
    duration: "4:12",
  },
  {
    id: 3,
    title: "Street Cipher",
    artist: "The Cipher",
    duration: "3:28",
  },
  {
    id: 4,
    title: "Rebel Heart",
    artist: "Velvet Rebels",
    duration: "4:01",
  },
  {
    id: 5,
    title: "Neon Nights",
    artist: "Luna Noir",
    duration: "3:55",
  },
  {
    id: 6,
    title: "Bassline Theory",
    artist: "Echo Theory",
    duration: "5:20",
  },
];

export function Landing({ onNavigate, colors }: LandingProps) {
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
    <div
      className="min-h-screen pb-32"
      style={{
        background: `linear-gradient(to bottom, ${themeColors.bgPrimary} 0%, ${themeColors.bgSecondary} 100%)`,
      }}
    >
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8 flex flex-col items-center">
            <Logo
              className="w-24 h-24 md:w-32 md:h-32 mb-6"
              color={themeColors.textPrimary}
            />
            <h1
              className="mb-4 text-5xl md:text-7xl"
              style={{ color: themeColors.textPrimary }}
            >
              MusicStream
            </h1>
          </div>

          <h2
            className="mb-6 text-xl md:text-3xl"
            style={{ color: themeColors.textPrimary }}
          >
            Aplicación para escuchar artistas underground
          </h2>

          <p
            className="mb-8 max-w-2xl mx-auto text-lg md:text-xl"
            style={{ color: themeColors.textSecondary }}
          >
            Escucha a los artistas que las grandes plataformas
            ignoran. Sube, comparte y apoya el talento real.
          </p>

          <Button
            size="lg"
            className="px-12 py-8 rounded-xl transition-all duration-300 hover:scale-105 text-xl"
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
            onClick={() => onNavigate("search")}
          >
            Explorar ahora
          </Button>
        </div>
      </div>

      {/* Featured Artists */}
      <div className="container mx-auto px-4 py-12">
        <h3
          className="mb-6"
          style={{ color: themeColors.textPrimary }}
        >
          Artistas destacados
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredArtists.map((artist) => (
            <div
              key={artist.id}
              className="rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: themeColors.bgSecondary,
                border: `1px solid ${themeColors.border}`,
              }}
              onClick={() => onNavigate("artist", artist.id)}
            >
              <div className="aspect-square relative overflow-hidden">
                <ImageWithFallback
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          themeColors.accentPrimary,
                      }}
                    >
                      <Play
                        className="w-6 h-6 fill-current"
                        style={{
                          color: themeColors.textPrimary,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4
                  className="mb-2"
                  style={{ color: themeColors.textPrimary }}
                >
                  {artist.name}
                </h4>
                <Badge
                  variant="outline"
                  className="rounded-lg"
                  style={{
                    borderColor: themeColors.accentPrimary,
                    color: themeColors.accentHover,
                  }}
                >
                  {artist.genre}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="container mx-auto px-4 py-12">
        <h3
          className="mb-6"
          style={{ color: themeColors.textPrimary }}
        >
          Últimas subidas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentUploads.map((track) => (
            <div
              key={track.id}
              className="p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 flex items-center gap-4"
              style={{
                backgroundColor: themeColors.bgSecondary,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: themeColors.border }}
              >
                <Music2
                  className="w-6 h-6"
                  style={{ color: themeColors.accentHover }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className="truncate mb-1"
                  style={{ color: themeColors.textPrimary }}
                >
                  {track.title}
                </h4>
                <p
                  className="truncate"
                  style={{ color: themeColors.textSecondary }}
                >
                  {track.artist}
                </p>
              </div>
              <span
                style={{ color: themeColors.textSecondary }}
              >
                {track.duration}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
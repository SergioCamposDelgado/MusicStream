import {
  ArrowLeft,
  Play,
  UserPlus,
  Music2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ThemeColors } from "../App";
import { defaultColors } from "../utils/theme";

interface ArtistPageProps {
  onNavigate: (page: string) => void;
  artistId?: number;
  colors?: ThemeColors;
}

const artistData = {
  1: {
    name: "Luna Noir",
    genre: ["Alternative", "Indie"],
    image:
      "https://images.unsplash.com/photo-1719353128335-725362ed1c55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    bio: "Artista alternativa que fusiona sonidos etéreos con letras introspectivas. Comenzó en pequeños clubs de la ciudad y ahora construye una comunidad global de oyentes.",
    followers: "12.5K",
    songs: [
      {
        id: 1,
        title: "Midnight Echoes",
        plays: "45K",
        duration: "3:45",
      },
      {
        id: 2,
        title: "Neon Nights",
        plays: "38K",
        duration: "3:55",
      },
      {
        id: 3,
        title: "Silent Waves",
        plays: "32K",
        duration: "4:20",
      },
      {
        id: 4,
        title: "Crystal Dreams",
        plays: "28K",
        duration: "3:30",
      },
    ],
    albums: [
      {
        id: 1,
        title: "Nocturnal Tales",
        year: "2024",
        tracks: 8,
      },
      { id: 2, title: "Echoes EP", year: "2023", tracks: 4 },
    ],
  },
};

export function ArtistPage({
  onNavigate,
  artistId = 1,
}: ArtistPageProps) {
  const artist =
    artistData[artistId as keyof typeof artistData] ||
    artistData[1];

  return (
    <div
      className="min-h-screen pb-32"
      style={{ backgroundColor: "#0F0A1A" }}
    >
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 mb-6 transition-colors"
          style={{ color: "#B0A3CC" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "#E8E1FF")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "#B0A3CC")
          }
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
      </div>

      {/* Artist Header */}
      <div
        className="relative pb-8"
        style={{
          background:
            "linear-gradient(to bottom, #1A0F2E 0%, #0F0A1A 100%)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-64 h-64 rounded-xl overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h1 className="mb-4" style={{ color: "#E8E1FF" }}>
                {artist.name}
              </h1>

              <div className="flex flex-wrap gap-2 mb-4">
                {artist.genre.map((g) => (
                  <Badge
                    key={g}
                    className="rounded-lg"
                    style={{
                      backgroundColor: "#7B2CBF",
                      color: "#E8E1FF",
                    }}
                  >
                    {g}
                  </Badge>
                ))}
              </div>

              <p className="mb-4" style={{ color: "#B0A3CC" }}>
                {artist.followers} seguidores
              </p>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: "#7B2CBF",
                    color: "#E8E1FF",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "#9D4EDD")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "#7B2CBF")
                  }
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Reproducir
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: "#7B2CBF",
                    color: "#7B2CBF",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "#7B2CBF";
                    e.currentTarget.style.color = "#E8E1FF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "transparent";
                    e.currentTarget.style.color = "#7B2CBF";
                  }}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Seguir
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="songs" className="w-full">
          <TabsList
            className="mb-8 w-full md:w-auto"
            style={{
              backgroundColor: "#1A0F2E",
              borderColor: "#3E2A66",
            }}
          >
            <TabsTrigger
              value="songs"
              className="data-[state=active]:bg-[#7B2CBF] data-[state=active]:text-[#E8E1FF]"
              style={{ color: "#B0A3CC" }}
            >
              Canciones
            </TabsTrigger>
            <TabsTrigger
              value="albums"
              className="data-[state=active]:bg-[#7B2CBF] data-[state=active]:text-[#E8E1FF]"
              style={{ color: "#B0A3CC" }}
            >
              Álbumes
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="data-[state=active]:bg-[#7B2CBF] data-[state=active]:text-[#E8E1FF]"
              style={{ color: "#B0A3CC" }}
            >
              Sobre mí
            </TabsTrigger>
          </TabsList>

          <TabsContent value="songs">
            <div className="space-y-2">
              {artist.songs.map((song, index) => (
                <div
                  key={song.id}
                  className="p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    backgroundColor: "#1A0F2E",
                    border: "1px solid #3E2A66",
                  }}
                >
                  <span
                    className="w-8 text-center"
                    style={{ color: "#B0A3CC" }}
                  >
                    {index + 1}
                  </span>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#3E2A66" }}
                  >
                    <Music2
                      className="w-6 h-6"
                      style={{ color: "#9D4EDD" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className="mb-1"
                      style={{ color: "#E8E1FF" }}
                    >
                      {song.title}
                    </h4>
                    <p style={{ color: "#B0A3CC" }}>
                      {song.plays} reproducciones
                    </p>
                  </div>
                  <span style={{ color: "#B0A3CC" }}>
                    {song.duration}
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="albums">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artist.albums.map((album) => (
                <div
                  key={album.id}
                  className="p-6 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: "#1A0F2E",
                    border: "1px solid #3E2A66",
                  }}
                >
                  <div
                    className="w-full aspect-square rounded-lg mb-4 flex items-center justify-center"
                    style={{ backgroundColor: "#3E2A66" }}
                  >
                    <Music2
                      className="w-16 h-16"
                      style={{ color: "#9D4EDD" }}
                    />
                  </div>
                  <h4
                    className="mb-2"
                    style={{ color: "#E8E1FF" }}
                  >
                    {album.title}
                  </h4>
                  <p style={{ color: "#B0A3CC" }}>
                    {album.year} • {album.tracks} canciones
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div
              className="p-6 rounded-xl"
              style={{
                backgroundColor: "#1A0F2E",
                border: "1px solid #3E2A66",
              }}
            >
              <h3 className="mb-4" style={{ color: "#E8E1FF" }}>
                Sobre el artista
              </h3>
              <p
                style={{ color: "#B0A3CC", lineHeight: "1.8" }}
              >
                {artist.bio}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
import { useState } from "react";
import {
  Search as SearchIcon,
  Play,
  User,
  Music2,
  Filter,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ThemeColors } from "../App";
import { defaultColors } from "../utils/theme";

interface SearchProps {
  onNavigate: (page: string, artistId?: number) => void;
  colors?: ThemeColors;
}

const allSongs = [
  {
    id: 1,
    title: "Midnight Echoes",
    artist: "Luna Noir",
    artistId: 1,
    genre: "Alternative",
    duration: "3:45",
    image:
      "https://images.unsplash.com/photo-1719353128335-725362ed1c55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2lhbiUyMHBvcnRyYWl0JTIwZGFya3xlbnwxfHx8fDE3NjIxODI3NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    title: "Digital Dreams",
    artist: "Echo Theory",
    artistId: 2,
    genre: "Electronic",
    duration: "4:12",
    image:
      "https://images.unsplash.com/photo-1711157655217-ce587f36f751?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMGFydGlzdCUyMHBlcmZvcm1pbmd8ZW58MXx8fHwxNzYyMTgyNzcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    title: "Street Poetry",
    artist: "The Cipher",
    artistId: 3,
    genre: "Hip-Hop",
    duration: "3:28",
    image:
      "https://images.unsplash.com/photo-1626021855512-da7f79ed0b18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXBwZXIlMjBzdHVkaW8lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjIxODI1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 4,
    title: "Rebel Heart",
    artist: "Velvet Rebels",
    artistId: 4,
    genre: "Rock",
    duration: "4:56",
    image:
      "https://images.unsplash.com/photo-1698769676419-94609164dd31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMG11c2ljaWFufGVufDF8fHx8MTc2MjE4Mjc3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 5,
    title: "Neon Nights",
    artist: "Echo Theory",
    artistId: 2,
    genre: "Electronic",
    duration: "3:55",
    image:
      "https://images.unsplash.com/photo-1711157655217-ce587f36f751?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMGFydGlzdCUyMHBlcmZvcm1pbmd8ZW58MXx8fHwxNzYyMTgyNzcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 6,
    title: "Shadows Fall",
    artist: "Luna Noir",
    artistId: 1,
    genre: "Alternative",
    duration: "4:20",
    image:
      "https://images.unsplash.com/photo-1719353128335-725362ed1c55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2lhbiUyMHBvcnRyYWl0JTIwZGFya3xlbnwxfHx8fDE3NjIxODI3NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 7,
    title: "Urban Legend",
    artist: "The Cipher",
    artistId: 3,
    genre: "Hip-Hop",
    duration: "3:33",
    image:
      "https://images.unsplash.com/photo-1626021855512-da7f79ed0b18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXBwZXIlMjBzdHVkaW8lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjIxODI1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 8,
    title: "Thunder Road",
    artist: "Velvet Rebels",
    artistId: 4,
    genre: "Rock",
    duration: "5:12",
    image:
      "https://images.unsplash.com/photo-1698769676419-94609164dd31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMG11c2ljaWFufGVufDF8fHx8MTc2MjE4Mjc3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const allArtists = [
  {
    id: 1,
    name: "Luna Noir",
    genre: "Alternative",
    followers: "12.5K",
    image:
      "https://images.unsplash.com/photo-1719353128335-725362ed1c55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2lhbiUyMHBvcnRyYWl0JTIwZGFya3xlbnwxfHx8fDE3NjIxODI3NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    name: "Echo Theory",
    genre: "Electronic",
    followers: "8.9K",
    image:
      "https://images.unsplash.com/photo-1711157655217-ce587f36f751?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMGFydGlzdCUyMHBlcmZvcm1pbmd8ZW58MXx8fHwxNzYyMTgyNzcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    name: "The Cipher",
    genre: "Hip-Hop",
    followers: "15.2K",
    image:
      "https://images.unsplash.com/photo-1626021855512-da7f79ed0b18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXBwZXIlMjBzdHVkaW8lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjIxODI1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 4,
    name: "Velvet Rebels",
    genre: "Rock",
    followers: "20.1K",
    image:
      "https://images.unsplash.com/photo-1698769676419-94609164dd31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMG11c2ljaWFufGVufDF8fHx8MTc2MjE4Mjc3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function Search({ onNavigate, colors }: SearchProps) {
  const themeColors = colors || defaultColors;
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");

  const filteredSongs = allSongs.filter((song) => {
    const matchesSearch =
      song.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      song.artist
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesGenre =
      genreFilter === "all" || song.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const filteredArtists = allArtists.filter((artist) =>
    artist.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      className="min-h-screen pb-32"
      style={{ backgroundColor: themeColors.bgPrimary }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h2
            className="mb-6"
            style={{ color: themeColors.textPrimary }}
          >
            Buscar Música
          </h2>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <SearchIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: themeColors.textSecondary }}
              />
              <Input
                type="text"
                placeholder="Buscar canciones, artistas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl"
                style={{
                  backgroundColor: themeColors.bgSecondary,
                  borderColor: themeColors.border,
                  color: themeColors.textPrimary,
                }}
              />
            </div>

            {/* Genre Filter */}
            <Select
              value={genreFilter}
              onValueChange={setGenreFilter}
            >
              <SelectTrigger
                className="w-full md:w-48 rounded-xl"
                style={{
                  backgroundColor: themeColors.bgSecondary,
                  borderColor: themeColors.border,
                  color: themeColors.textPrimary,
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Género" />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: themeColors.bgSecondary,
                  borderColor: themeColors.border,
                }}
              >
                <SelectItem
                  value="all"
                  style={{ color: themeColors.textPrimary }}
                >
                  Todos los géneros
                </SelectItem>
                <SelectItem
                  value="Alternative"
                  style={{ color: themeColors.textPrimary }}
                >
                  Alternative
                </SelectItem>
                <SelectItem
                  value="Electronic"
                  style={{ color: themeColors.textPrimary }}
                >
                  Electronic
                </SelectItem>
                <SelectItem
                  value="Hip-Hop"
                  style={{ color: themeColors.textPrimary }}
                >
                  Hip-Hop
                </SelectItem>
                <SelectItem
                  value="Rock"
                  style={{ color: themeColors.textPrimary }}
                >
                  Rock
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {searchQuery && (
          <>
            {/* Artists Results */}
            {filteredArtists.length > 0 && (
              <div className="mb-8">
                <h3
                  className="mb-4"
                  style={{ color: themeColors.textPrimary }}
                >
                  Artistas
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredArtists.map((artist) => (
                    <button
                      key={artist.id}
                      onClick={() =>
                        onNavigate("artist", artist.id)
                      }
                      className="group transition-all duration-300 hover:scale-105"
                    >
                      <div
                        className="rounded-xl p-4"
                        style={{
                          backgroundColor:
                            themeColors.bgSecondary,
                          border: `1px solid ${themeColors.border}`,
                        }}
                      >
                        <div className="aspect-square rounded-xl overflow-hidden mb-3">
                          <ImageWithFallback
                            src={artist.image}
                            alt={artist.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h4
                          className="mb-1"
                          style={{
                            color: themeColors.textPrimary,
                          }}
                        >
                          {artist.name}
                        </h4>
                        <p
                          className="mb-1"
                          style={{
                            color: themeColors.textSecondary,
                            fontSize: "0.875rem",
                          }}
                        >
                          {artist.genre}
                        </p>
                        <p
                          style={{
                            color: themeColors.accentPrimary,
                            fontSize: "0.75rem",
                          }}
                        >
                          {artist.followers} seguidores
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Songs Results */}
        <div>
          <h3
            className="mb-4"
            style={{ color: themeColors.textPrimary }}
          >
            {searchQuery ? "Canciones" : "Todas las canciones"}
          </h3>

          {filteredSongs.length === 0 ? (
            <div className="text-center py-12">
              <Music2
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: themeColors.border }}
              />
              <p style={{ color: themeColors.textSecondary }}>
                No se encontraron resultados
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSongs.map((song) => (
                <div
                  key={song.id}
                  className="group rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    backgroundColor: themeColors.bgSecondary,
                    border: `1px solid ${themeColors.border}`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Song Image */}
                    <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={song.image}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                        <Play
                          className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            color: themeColors.textPrimary,
                          }}
                          fill={themeColors.textPrimary}
                        />
                      </div>
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className="mb-1 truncate"
                        style={{
                          color: themeColors.textPrimary,
                        }}
                      >
                        {song.title}
                      </h4>
                      <button
                        onClick={() =>
                          onNavigate("artist", song.artistId)
                        }
                        className="hover:underline"
                        style={{
                          color: themeColors.textSecondary,
                          fontSize: "0.875rem",
                        }}
                      >
                        {song.artist}
                      </button>
                    </div>

                    {/* Genre Badge */}
                    <Badge
                      className="hidden md:block"
                      style={{
                        backgroundColor: `${themeColors.accentPrimary}33`,
                        color: themeColors.accentHover,
                        border: `1px solid ${themeColors.accentPrimary}`,
                      }}
                    >
                      {song.genre}
                    </Badge>

                    {/* Duration */}
                    <span
                      className="flex-shrink-0"
                      style={{
                        color: themeColors.textSecondary,
                        fontSize: "0.875rem",
                      }}
                    >
                      {song.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import {
  Music2,
  TrendingUp,
  Users,
  Play,
  Upload,
  Edit,
  Trash2,
  Eye,
  Heart,
  BarChart3,
  Plus,
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
import { Progress } from "./ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
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

interface ArtistDashboardProps {
  onNavigate: (page: string) => void;
  onOpenUpload: () => void;
  colors?: ThemeColors;
}

const artistStats = [
  {
    label: "Total Reproducciones",
    value: "124.5K",
    change: "+12.5%",
    icon: Play,
    color: "#7B2CBF",
  },
  {
    label: "Seguidores",
    value: "8,942",
    change: "+8.2%",
    icon: Users,
    color: "#9D4EDD",
  },
  {
    label: "Canciones",
    value: "23",
    change: "+2",
    icon: Music2,
    color: "#C77DFF",
  },
  {
    label: "Me Gusta",
    value: "45.2K",
    change: "+15.3%",
    icon: Heart,
    color: "#E0AAFF",
  },
];

const mySongs = [
  {
    id: 1,
    title: "Midnight Echoes",
    status: "published",
    plays: 12547,
    likes: 1823,
    uploadDate: "2024-10-15",
    duration: "3:45",
    image:
      "https://images.unsplash.com/photo-1719353128335-725362ed1c55?w=100",
  },
  {
    id: 2,
    title: "Shadows Fall",
    status: "published",
    plays: 8934,
    likes: 1245,
    uploadDate: "2024-10-20",
    duration: "4:20",
    image:
      "https://images.unsplash.com/photo-1719353128335-725362ed1c55?w=100",
  },
  {
    id: 3,
    title: "Dark Symphony",
    status: "pending",
    plays: 0,
    likes: 0,
    uploadDate: "2024-11-03",
    duration: "5:12",
    image:
      "https://images.unsplash.com/photo-1719353128335-725362ed1c55?w=100",
  },
  {
    id: 4,
    title: "Echo Chamber",
    status: "published",
    plays: 15234,
    likes: 2156,
    uploadDate: "2024-09-28",
    duration: "3:58",
    image:
      "https://images.unsplash.com/photo-1719353128335-725362ed1c55?w=100",
  },
];

const monthlyStats = [
  { month: "Jun", plays: 8500, followers: 120 },
  { month: "Jul", plays: 12300, followers: 215 },
  { month: "Ago", plays: 15600, followers: 342 },
  { month: "Sep", plays: 18900, followers: 428 },
  { month: "Oct", plays: 24500, followers: 567 },
  { month: "Nov", plays: 31200, followers: 689 },
];

const topSongs = [
  { title: "Echo Chamber", plays: 15234, percentage: 100 },
  { title: "Midnight Echoes", plays: 12547, percentage: 82 },
  { title: "Shadows Fall", plays: 8934, percentage: 59 },
];

export function ArtistDashboard({
  onNavigate,
  onOpenUpload,
  colors,
}: ArtistDashboardProps) {
  const themeColors = colors || defaultColors;
  const [songs, setSongs] = useState(mySongs);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: number | null;
  }>({
    open: false,
    id: null,
  });

  const handleDeleteSong = (songId: number) => {
    setSongs(songs.filter((song) => song.id !== songId));
    setDeleteDialog({ open: false, id: null });
  };

  return (
    <div
      className="min-h-screen pb-32"
      style={{ backgroundColor: themeColors.bgPrimary }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2
                className="mb-2"
                style={{ color: themeColors.textPrimary }}
              >
                Panel de Artista
              </h2>
              <p style={{ color: themeColors.textSecondary }}>
                Gestiona tu música y visualiza tus estadísticas
              </p>
            </div>
            <Button
              onClick={onOpenUpload}
              className="rounded-xl w-full md:w-auto"
              style={{
                backgroundColor: themeColors.accentHover,
                color: themeColors.textPrimary,
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Subir Nueva Canción
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {artistStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="rounded-xl p-4 transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: themeColors.bgSecondary,
                  border: `1px solid ${themeColors.border}`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon
                    className="w-6 h-6"
                    style={{ color: stat.color }}
                  />
                  <Badge
                    style={{
                      backgroundColor: `${themeColors.accentPrimary}33`,
                      color: themeColors.accentHover,
                      border: "none",
                      fontSize: "0.75rem",
                    }}
                  >
                    {stat.change}
                  </Badge>
                </div>
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

        {/* Main Content Tabs */}
        <Tabs defaultValue="songs" className="w-full">
          <TabsList
            className="w-full md:w-auto rounded-xl mb-6"
            style={{
              backgroundColor: themeColors.bgSecondary,
              border: `1px solid ${themeColors.border}`,
            }}
          >
            <TabsTrigger
              value="songs"
              className="rounded-lg data-[state=active]:bg-[#7B2CBF] data-[state=active]:text-[#E8E1FF]"
              style={{ color: themeColors.textPrimary }}
            >
              <Music2 className="w-4 h-4 mr-2" />
              Mis Canciones
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="rounded-lg data-[state=active]:bg-[#7B2CBF] data-[state=active]:text-[#E8E1FF]"
              style={{ color: themeColors.textPrimary }}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analíticas
            </TabsTrigger>
          </TabsList>

          {/* Songs Tab */}
          <TabsContent value="songs">
            <div
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: themeColors.bgSecondary,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <div className="p-6">
                <h3
                  className="mb-6"
                  style={{ color: themeColors.textPrimary }}
                >
                  Gestión de Canciones
                </h3>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow
                        style={{ borderColor: themeColors.border }}
                      >
                        <TableHead style={{ color: themeColors.textSecondary }}>
                          Canción
                        </TableHead>
                        <TableHead style={{ color: themeColors.textSecondary }}>
                          Estado
                        </TableHead>
                        <TableHead style={{ color: themeColors.textSecondary }}>
                          Reproducciones
                        </TableHead>
                        <TableHead style={{ color: themeColors.textSecondary }}>
                          Me Gusta
                        </TableHead>
                        <TableHead style={{ color: themeColors.textSecondary }}>
                          Fecha
                        </TableHead>
                        <TableHead style={{ color: themeColors.textSecondary }}>
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {songs.map((song) => (
                        <TableRow
                          key={song.id}
                          style={{ borderColor: themeColors.border }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                <ImageWithFallback
                                  src={song.image}
                                  alt={song.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div
                                  style={{ color: themeColors.textPrimary }}
                                >
                                  {song.title}
                                </div>
                                <div
                                  style={{
                                    color: themeColors.textSecondary,
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {song.duration}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              style={{
                                backgroundColor:
                                  song.status === "published"
                                    ? `${themeColors.accentPrimary}33`
                                    : `${themeColors.accentHover}33`,
                                color:
                                  song.status === "published"
                                    ? themeColors.accentHover
                                    : themeColors.accentPrimary,
                                border: "none",
                              }}
                            >
                              {song.status === "published"
                                ? "Publicada"
                                : "Pendiente"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Play
                                className="w-4 h-4"
                                style={{ color: themeColors.accentPrimary }}
                              />
                              <span
                                style={{ color: themeColors.textPrimary }}
                              >
                                {song.plays.toLocaleString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Heart
                                className="w-4 h-4"
                                style={{ color: themeColors.accentPrimary }}
                              />
                              <span
                                style={{ color: themeColors.textPrimary }}
                              >
                                {song.likes.toLocaleString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell
                            style={{ color: themeColors.textSecondary }}
                          >
                            {song.uploadDate}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                className="rounded-lg"
                                style={{
                                  backgroundColor: themeColors.accentPrimary,
                                  color: themeColors.textPrimary,
                                }}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                className="rounded-lg"
                                style={{
                                  backgroundColor: themeColors.border,
                                  color: themeColors.textPrimary,
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() =>
                                  setDeleteDialog({
                                    open: true,
                                    id: song.id,
                                  })
                                }
                                className="rounded-lg"
                                style={{
                                  backgroundColor: "#d4183d",
                                  color: themeColors.textPrimary,
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Monthly Growth */}
              <Card
                className="rounded-xl"
                style={{
                  backgroundColor: themeColors.bgSecondary,
                  border: `1px solid ${themeColors.border}`,
                }}
              >
                <CardHeader>
                  <CardTitle style={{ color: themeColors.textPrimary }}>
                    Crecimiento Mensual
                  </CardTitle>
                  <CardDescription style={{ color: themeColors.textSecondary }}>
                    Reproducciones y seguidores por mes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyStats.map((stat, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span style={{ color: themeColors.textSecondary }}>
                            {stat.month}
                          </span>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Play
                                className="w-3 h-3"
                                style={{ color: themeColors.accentPrimary }}
                              />
                              <span
                                style={{
                                  color: themeColors.textPrimary,
                                  fontSize: "0.875rem",
                                }}
                              >
                                {stat.plays.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users
                                className="w-3 h-3"
                                style={{ color: themeColors.accentHover }}
                              />
                              <span
                                style={{
                                  color: themeColors.textPrimary,
                                  fontSize: "0.875rem",
                                }}
                              >
                                +{stat.followers}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Progress
                          value={(stat.plays / 31200) * 100}
                          className="h-2"
                          style={{
                            backgroundColor: themeColors.border,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Songs */}
              <Card
                className="rounded-xl"
                style={{
                  backgroundColor: themeColors.bgSecondary,
                  border: `1px solid ${themeColors.border}`,
                }}
              >
                <CardHeader>
                  <CardTitle style={{ color: themeColors.textPrimary }}>
                    Canciones Más Populares
                  </CardTitle>
                  <CardDescription style={{ color: themeColors.textSecondary }}>
                    Tus canciones con más reproducciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {topSongs.map((song, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundColor:
                                  index === 0
                                    ? themeColors.accentPrimary
                                    : themeColors.border,
                                color: themeColors.textPrimary,
                              }}
                            >
                              {index + 1}
                            </div>
                            <span style={{ color: themeColors.textPrimary }}>
                              {song.title}
                            </span>
                          </div>
                          <span
                            style={{
                              color: themeColors.textSecondary,
                              fontSize: "0.875rem",
                            }}
                          >
                            {song.plays.toLocaleString()}
                          </span>
                        </div>
                        <Progress
                          value={song.percentage}
                          className="h-2"
                          style={{
                            backgroundColor: themeColors.border,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Stats */}
              <Card
                className="rounded-xl md:col-span-2"
                style={{
                  backgroundColor: themeColors.bgSecondary,
                  border: `1px solid ${themeColors.border}`,
                }}
              >
                <CardHeader>
                  <CardTitle style={{ color: themeColors.textPrimary }}>
                    Estadísticas de Engagement
                  </CardTitle>
                  <CardDescription style={{ color: themeColors.textSecondary }}>
                    Interacción de los oyentes con tu música
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div
                        className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                        style={{
                          backgroundColor: `${themeColors.accentPrimary}33`,
                          border: `2px solid ${themeColors.accentPrimary}`,
                        }}
                      >
                        <TrendingUp
                          className="w-8 h-8"
                          style={{ color: themeColors.accentPrimary }}
                        />
                      </div>
                      <div
                        className="mb-1"
                        style={{
                          color: themeColors.textPrimary,
                          fontSize: "1.5rem",
                        }}
                      >
                        87%
                      </div>
                      <p
                        style={{
                          color: themeColors.textSecondary,
                          fontSize: "0.875rem",
                        }}
                      >
                        Tasa de Retención
                      </p>
                    </div>
                    <div className="text-center">
                      <div
                        className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                        style={{
                          backgroundColor: `${themeColors.accentHover}33`,
                          border: `2px solid ${themeColors.accentHover}`,
                        }}
                      >
                        <Heart
                          className="w-8 h-8"
                          style={{ color: themeColors.accentHover }}
                        />
                      </div>
                      <div
                        className="mb-1"
                        style={{
                          color: themeColors.textPrimary,
                          fontSize: "1.5rem",
                        }}
                      >
                        36.2%
                      </div>
                      <p
                        style={{
                          color: themeColors.textSecondary,
                          fontSize: "0.875rem",
                        }}
                      >
                        Tasa de Me Gusta
                      </p>
                    </div>
                    <div className="text-center">
                      <div
                        className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                        style={{
                          backgroundColor: `${themeColors.accentHover}33`,
                          border: `2px solid ${themeColors.accentHover}`,
                        }}
                      >
                        <Users
                          className="w-8 h-8"
                          style={{ color: themeColors.accentHover }}
                        />
                      </div>
                      <div
                        className="mb-1"
                        style={{
                          color: themeColors.textPrimary,
                          fontSize: "1.5rem",
                        }}
                      >
                        4.2K
                      </div>
                      <p
                        style={{
                          color: themeColors.textSecondary,
                          fontSize: "0.875rem",
                        }}
                      >
                        Oyentes Mensuales
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open: boolean) =>
          setDeleteDialog({ ...deleteDialog, open })
        }
      >
        <AlertDialogContent
          style={{
            backgroundColor: themeColors.bgSecondary,
            border: `1px solid ${themeColors.border}`,
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: themeColors.textPrimary }}>
              ¿Eliminar canción?
            </AlertDialogTitle>
            <AlertDialogDescription
              style={{ color: themeColors.textSecondary }}
            >
              Esta acción no se puede deshacer. La canción será
              eliminada permanentemente de la plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-lg"
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
                if (deleteDialog.id) {
                  handleDeleteSong(deleteDialog.id);
                }
              }}
              className="rounded-lg"
              style={{
                backgroundColor: "#d4183d",
                color: themeColors.textPrimary,
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
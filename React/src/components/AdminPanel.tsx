import { useState } from "react";
import {
  Users,
  Music2,
  TrendingUp,
  Shield,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  BarChart3,
  AlertCircle,
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
import { Input } from "./ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ThemeColors } from "../App";
import { defaultColors } from "../utils/theme";

interface AdminPanelProps {
  onNavigate: (page: string) => void;
  colors?: ThemeColors;
}

const platformStats = [
  {
    label: "Total Usuarios",
    value: "1,247",
    change: "+12%",
    icon: Users,
    color: "#7B2CBF",
  },
  {
    label: "Total Canciones",
    value: "3,891",
    change: "+8%",
    icon: Music2,
    color: "#9D4EDD",
  },
  {
    label: "Artistas Activos",
    value: "284",
    change: "+15%",
    icon: TrendingUp,
    color: "#C77DFF",
  },
  {
    label: "Reportes Pendientes",
    value: "12",
    change: "-3%",
    icon: AlertCircle,
    color: "#d4183d",
  },
];

const usersData = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan@email.com",
    role: "Usuario",
    status: "active",
    joinDate: "2024-10-15",
    songs: 23,
  },
  {
    id: 2,
    name: "María García",
    email: "maria@email.com",
    role: "Artista",
    status: "active",
    joinDate: "2024-09-20",
    songs: 45,
  },
  {
    id: 3,
    name: "Carlos Ruiz",
    email: "carlos@email.com",
    role: "Usuario",
    status: "blocked",
    joinDate: "2024-08-10",
    songs: 8,
  },
  {
    id: 4,
    name: "Ana López",
    email: "ana@email.com",
    role: "Artista",
    status: "active",
    joinDate: "2024-11-01",
    songs: 67,
  },
  {
    id: 5,
    name: "Pedro Martínez",
    email: "pedro@email.com",
    role: "Usuario",
    status: "active",
    joinDate: "2024-07-25",
    songs: 12,
  },
];

const songsData = [
  {
    id: 1,
    title: "Midnight Echoes",
    artist: "Luna Noir",
    genre: "Alternative",
    status: "approved",
    uploadDate: "2024-11-01",
    plays: 1247,
    image:
      "https://images.unsplash.com/photo-1719353128335-725362ed1c55?w=100",
  },
  {
    id: 2,
    title: "Digital Dreams",
    artist: "Echo Theory",
    genre: "Electronic",
    status: "approved",
    uploadDate: "2024-10-28",
    plays: 892,
    image:
      "https://images.unsplash.com/photo-1711157655217-ce587f36f751?w=100",
  },
  {
    id: 3,
    title: "Street Poetry",
    artist: "The Cipher",
    genre: "Hip-Hop",
    status: "pending",
    uploadDate: "2024-11-03",
    plays: 0,
    image:
      "https://images.unsplash.com/photo-1626021855512-da7f79ed0b18?w=100",
  },
  {
    id: 4,
    title: "Rebel Heart",
    artist: "Velvet Rebels",
    genre: "Rock",
    status: "approved",
    uploadDate: "2024-10-15",
    plays: 2341,
    image:
      "https://images.unsplash.com/photo-1698769676419-94609164dd31?w=100",
  },
  {
    id: 5,
    title: "Night Visions",
    artist: "Shadow Beats",
    genre: "Electronic",
    status: "pending",
    uploadDate: "2024-11-04",
    plays: 0,
    image:
      "https://images.unsplash.com/photo-1711157655217-ce587f36f751?w=100",
  },
];

export function AdminPanel({
  onNavigate,
  colors,
}: AdminPanelProps) {
  const themeColors = colors || defaultColors;
  const [users, setUsers] = useState(usersData);
  const [songs, setSongs] = useState(songsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: string;
    id: number | null;
  }>({
    open: false,
    type: "",
    id: null,
  });

  const handleBlockUser = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status:
                user.status === "active" ? "blocked" : "active",
            }
          : user,
      ),
    );
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId));
    setDeleteDialog({ open: false, type: "", id: null });
  };

  const handleApproveSong = (songId: number) => {
    setSongs(
      songs.map((song) =>
        song.id === songId
          ? { ...song, status: "approved" }
          : song,
      ),
    );
  };

  const handleRejectSong = (songId: number) => {
    setSongs(
      songs.map((song) =>
        song.id === songId
          ? { ...song, status: "rejected" }
          : song,
      ),
    );
  };

  const handleDeleteSong = (songId: number) => {
    setSongs(songs.filter((song) => song.id !== songId));
    setDeleteDialog({ open: false, type: "", id: null });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const filteredSongs = songs.filter(
    (song) =>
      song.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      song.artist
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      className="min-h-screen pb-32"
      style={{ backgroundColor: themeColors.bgPrimary }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield
              className="w-8 h-8"
              style={{ color: "#7B2CBF" }}
            />
            <h2 style={{ color: "#E8E1FF" }}>
              Panel de Administración
            </h2>
          </div>
          <p style={{ color: "#B0A3CC" }}>
            Gestiona usuarios, canciones y contenido de la
            plataforma
          </p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {platformStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="rounded-xl p-4 transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: "#1A0F2E",
                  border: "1px solid #3E2A66",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon
                    className="w-6 h-6"
                    style={{ color: stat.color }}
                  />
                  <Badge
                    style={{
                      backgroundColor: stat.change.startsWith(
                        "+",
                      )
                        ? "#7B2CBF33"
                        : "#d4183d33",
                      color: stat.change.startsWith("+")
                        ? "#9D4EDD"
                        : "#d4183d",
                      border: "none",
                    }}
                  >
                    {stat.change}
                  </Badge>
                </div>
                <div
                  className="mb-1"
                  style={{
                    color: "#E8E1FF",
                    fontSize: "1.5rem",
                  }}
                >
                  {stat.value}
                </div>
                <p
                  style={{
                    color: "#B0A3CC",
                    fontSize: "0.75rem",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList
            className="w-full md:w-auto rounded-xl mb-6"
            style={{
              backgroundColor: "#1A0F2E",
              border: "1px solid #3E2A66",
            }}
          >
            <TabsTrigger
              value="users"
              className="rounded-lg data-[state=active]:bg-[#7B2CBF] data-[state=active]:text-[#E8E1FF]"
              style={{ color: "#B0A3CC" }}
            >
              <Users className="w-4 h-4 mr-2" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger
              value="songs"
              className="rounded-lg data-[state=active]:bg-[#7B2CBF] data-[state=active]:text-[#E8E1FF]"
              style={{ color: "#B0A3CC" }}
            >
              <Music2 className="w-4 h-4 mr-2" />
              Canciones
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="rounded-lg data-[state=active]:bg-[#7B2CBF] data-[state=active]:text-[#E8E1FF]"
              style={{ color: "#B0A3CC" }}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Estadísticas
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: "#1A0F2E",
                border: "1px solid #3E2A66",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 style={{ color: "#E8E1FF" }}>
                  Gestión de Usuarios
                </h3>
                <Input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="max-w-xs rounded-lg"
                  style={{
                    backgroundColor: "#0F0A1A",
                    borderColor: "#3E2A66",
                    color: "#E8E1FF",
                  }}
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow
                      style={{ borderColor: "#3E2A66" }}
                    >
                      <TableHead style={{ color: "#B0A3CC" }}>
                        Usuario
                      </TableHead>
                      <TableHead style={{ color: "#B0A3CC" }}>
                        Email
                      </TableHead>
                      <TableHead style={{ color: "#B0A3CC" }}>
                        Rol
                      </TableHead>
                      <TableHead style={{ color: "#B0A3CC" }}>
                        Estado
                      </TableHead>
                      <TableHead style={{ color: "#B0A3CC" }}>
                        Canciones
                      </TableHead>
                      <TableHead style={{ color: "#B0A3CC" }}>
                        Fecha Registro
                      </TableHead>
                      <TableHead style={{ color: "#B0A3CC" }}>
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        style={{ borderColor: "#3E2A66" }}
                      >
                        <TableCell style={{ color: "#E8E1FF" }}>
                          {user.name}
                        </TableCell>
                        <TableCell style={{ color: "#B0A3CC" }}>
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            style={{
                              backgroundColor:
                                user.role === "Artista"
                                  ? "#7B2CBF33"
                                  : "#3E2A6633",
                              color:
                                user.role === "Artista"
                                  ? "#9D4EDD"
                                  : "#B0A3CC",
                              border: "none",
                            }}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            style={{
                              backgroundColor:
                                user.status === "active"
                                  ? "#7B2CBF33"
                                  : "#d4183d33",
                              color:
                                user.status === "active"
                                  ? "#9D4EDD"
                                  : "#d4183d",
                              border: "none",
                            }}
                          >
                            {user.status === "active"
                              ? "Activo"
                              : "Bloqueado"}
                          </Badge>
                        </TableCell>
                        <TableCell style={{ color: "#B0A3CC" }}>
                          {user.songs}
                        </TableCell>
                        <TableCell style={{ color: "#B0A3CC" }}>
                          {user.joinDate}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleBlockUser(user.id)
                              }
                              className="rounded-lg"
                              style={{
                                backgroundColor:
                                  user.status === "active"
                                    ? "#d4183d"
                                    : "#7B2CBF",
                                color: "#E8E1FF",
                              }}
                            >
                              <Ban className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  type: "user",
                                  id: user.id,
                                })
                              }
                              className="rounded-lg"
                              style={{
                                backgroundColor: "#3E2A66",
                                color: "#E8E1FF",
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
          </TabsContent>

          {/* Songs Tab */}
          <TabsContent value="songs">
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: "#1A0F2E",
                border: "1px solid #3E2A66",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 style={{ color: "#E8E1FF" }}>
                  Gestión de Canciones
                </h3>
                <Input
                  type="text"
                  placeholder="Buscar canciones..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="max-w-xs rounded-lg"
                  style={{
                    backgroundColor: "#0F0A1A",
                    borderColor: "#3E2A66",
                    color: "#E8E1FF",
                  }}
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow
                      style={{ borderColor: "#3E2A66" }}
                    >
                      <TableHead style={{ color: "#B0A3CC" }}>
                        Canción
                      </TableHead>
                      <TableHead style={{ color: "#B0A3CC" }}>
                        Artista
                      </TableHead>
                      <TableHead style={{ color: "#B0A3CC" }}>
                        Género
                      </TableHead>
                      <TableHead style={{ color: "#B0A3CC" }}>
                        Estado
                      </TableHead>
                      <TableHead style={{ color: "#B0A3CC" }}>
                        Reproducciones
                      </TableHead>
                      <TableHead style={{ color: "#B0A3CC" }}>
                        Fecha Subida
                      </TableHead>
                      <TableHead style={{ color: "#B0A3CC" }}>
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSongs.map((song) => (
                      <TableRow
                        key={song.id}
                        style={{ borderColor: "#3E2A66" }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              <ImageWithFallback
                                src={song.image}
                                alt={song.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span style={{ color: "#E8E1FF" }}>
                              {song.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell style={{ color: "#B0A3CC" }}>
                          {song.artist}
                        </TableCell>
                        <TableCell>
                          <Badge
                            style={{
                              backgroundColor: "#3E2A6633",
                              color: "#B0A3CC",
                              border: "none",
                            }}
                          >
                            {song.genre}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            style={{
                              backgroundColor:
                                song.status === "approved"
                                  ? "#7B2CBF33"
                                  : song.status === "pending"
                                    ? "#9D4EDD33"
                                    : "#d4183d33",
                              color:
                                song.status === "approved"
                                  ? "#9D4EDD"
                                  : song.status === "pending"
                                    ? "#C77DFF"
                                    : "#d4183d",
                              border: "none",
                            }}
                          >
                            {song.status === "approved"
                              ? "Aprobada"
                              : song.status === "pending"
                                ? "Pendiente"
                                : "Rechazada"}
                          </Badge>
                        </TableCell>
                        <TableCell style={{ color: "#B0A3CC" }}>
                          {song.plays.toLocaleString()}
                        </TableCell>
                        <TableCell style={{ color: "#B0A3CC" }}>
                          {song.uploadDate}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {song.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleApproveSong(song.id)
                                  }
                                  className="rounded-lg"
                                  style={{
                                    backgroundColor: "#7B2CBF",
                                    color: "#E8E1FF",
                                  }}
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleRejectSong(song.id)
                                  }
                                  className="rounded-lg"
                                  style={{
                                    backgroundColor: "#d4183d",
                                    color: "#E8E1FF",
                                  }}
                                >
                                  <XCircle className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  type: "song",
                                  id: song.id,
                                })
                              }
                              className="rounded-lg"
                              style={{
                                backgroundColor: "#3E2A66",
                                color: "#E8E1FF",
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
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="grid md:grid-cols-2 gap-6">
              <div
                className="rounded-xl p-6"
                style={{
                  backgroundColor: "#1A0F2E",
                  border: "1px solid #3E2A66",
                }}
              >
                <h3
                  className="mb-4"
                  style={{ color: "#E8E1FF" }}
                >
                  Actividad Reciente
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#B0A3CC" }}>
                      Nuevos usuarios (hoy)
                    </span>
                    <span style={{ color: "#E8E1FF" }}>
                      +24
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#B0A3CC" }}>
                      Canciones subidas (hoy)
                    </span>
                    <span style={{ color: "#E8E1FF" }}>
                      +18
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#B0A3CC" }}>
                      Total reproducciones (hoy)
                    </span>
                    <span style={{ color: "#E8E1FF" }}>
                      12,847
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#B0A3CC" }}>
                      Usuarios activos (ahora)
                    </span>
                    <span style={{ color: "#E8E1FF" }}>
                      342
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="rounded-xl p-6"
                style={{
                  backgroundColor: "#1A0F2E",
                  border: "1px solid #3E2A66",
                }}
              >
                <h3
                  className="mb-4"
                  style={{ color: "#E8E1FF" }}
                >
                  Géneros Populares
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ color: "#B0A3CC" }}>
                        Rock
                      </span>
                      <span style={{ color: "#E8E1FF" }}>
                        35%
                      </span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full"
                      style={{ backgroundColor: "#3E2A66" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: "35%",
                          backgroundColor: "#7B2CBF",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ color: "#B0A3CC" }}>
                        Electronic
                      </span>
                      <span style={{ color: "#E8E1FF" }}>
                        28%
                      </span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full"
                      style={{ backgroundColor: "#3E2A66" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: "28%",
                          backgroundColor: "#9D4EDD",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ color: "#B0A3CC" }}>
                        Hip-Hop
                      </span>
                      <span style={{ color: "#E8E1FF" }}>
                        22%
                      </span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full"
                      style={{ backgroundColor: "#3E2A66" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: "22%",
                          backgroundColor: "#C77DFF",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ color: "#B0A3CC" }}>
                        Alternative
                      </span>
                      <span style={{ color: "#E8E1FF" }}>
                        15%
                      </span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full"
                      style={{ backgroundColor: "#3E2A66" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: "15%",
                          backgroundColor: "#E0AAFF",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
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
            backgroundColor: "#1A0F2E",
            border: "1px solid #3E2A66",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: "#E8E1FF" }}>
              ¿Estás seguro?
            </AlertDialogTitle>
            <AlertDialogDescription
              style={{ color: "#B0A3CC" }}
            >
              Esta acción no se puede deshacer. Esto eliminará
              permanentemente{" "}
              {deleteDialog.type === "user"
                ? "el usuario"
                : "la canción"}{" "}
              de la plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-lg"
              style={{
                backgroundColor: "#3E2A66",
                color: "#E8E1FF",
                border: "none",
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (
                  deleteDialog.type === "user" &&
                  deleteDialog.id
                ) {
                  handleDeleteUser(deleteDialog.id);
                } else if (
                  deleteDialog.type === "song" &&
                  deleteDialog.id
                ) {
                  handleDeleteSong(deleteDialog.id);
                }
              }}
              className="rounded-lg"
              style={{
                backgroundColor: "#d4183d",
                color: "#E8E1FF",
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
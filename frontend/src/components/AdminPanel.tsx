import { useState, useEffect } from "react";
import { api } from "../context/AuthContext";
import Swal from "sweetalert2";
import { AdminUserModal, AdminUserData } from "./AdminUserModal";
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
  Edit,
  UserPlus
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
import { useTheme } from "../context/ThemeContext";

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

export function AdminPanel() {
  const { colors: themeColors } = useTheme();
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserData | undefined>(undefined);
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

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire({ title: 'Error', text: 'Error al cargar usuarios', icon: 'error', background: themeColors.bgSecondary, color: themeColors.textPrimary });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockUser = async (userId: number) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-block`);
      fetchUsers();
      Swal.fire({ title: 'Éxito', text: 'Estado de bloqueo actualizado', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, background: themeColors.bgSecondary, color: themeColors.textPrimary });
    } catch (err: any) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Error al actualizar estado', icon: 'error', background: themeColors.bgSecondary, color: themeColors.textPrimary });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
      Swal.fire({ title: 'Eliminado', text: 'Usuario eliminado correctamente', icon: 'success', background: themeColors.bgSecondary, color: themeColors.textPrimary });
    } catch (err: any) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Error al eliminar usuario', icon: 'error', background: themeColors.bgSecondary, color: themeColors.textPrimary });
    } finally {
      setDeleteDialog({ open: false, type: "", id: null });
    }
  };

  const handleSaveUser = async (data: AdminUserData) => {
    try {
      if (data.id) {
        await api.put(`/admin/users/${data.id}`, data);
        Swal.fire({ title: 'Actualizado', text: 'Usuario actualizado correctamente', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, background: themeColors.bgSecondary, color: themeColors.textPrimary });
      } else {
        await api.post('/admin/users', data);
        Swal.fire({ title: 'Creado', text: 'Usuario creado correctamente', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, background: themeColors.bgSecondary, color: themeColors.textPrimary });
      }
      fetchUsers();
    } catch (err: any) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Error al guardar usuario', icon: 'error', background: themeColors.bgSecondary, color: themeColors.textPrimary });
      throw err;
    }
  };

  const openCreateModal = () => {
    setEditingUser(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleApproveSong = (songId: number) => {
    setSongs(
      songs.map((song) =>
        song.id === songId ? { ...song, status: "approved" } : song
      )
    );
  };

  const handleRejectSong = (songId: number) => {
    setSongs(
      songs.map((song) =>
        song.id === songId ? { ...song, status: "rejected" } : song
      )
    );
  };

  const handleDeleteSong = (songId: number) => {
    setSongs(songs.filter((song) => song.id !== songId));
    setDeleteDialog({ open: false, type: "", id: null });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
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
              style={{ color: themeColors.accentPrimary }}
            />
            <h2 style={{ color: themeColors.textPrimary }}>
              Panel de Administración
            </h2>
          </div>
          <p style={{ color: themeColors.textSecondary }}>
            Gestiona usuarios, canciones y contenido de la plataforma
          </p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {platformStats.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.change.startsWith("+");
            return (
              <div
                key={index}
                className="rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: themeColors.bgSecondary,
                  border: `1px solid ${themeColors.border}`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  <Badge
                    style={{
                      backgroundColor: isPositive
                        ? `${themeColors.accentPrimary}33`
                        : "#d4183d33",
                      color: isPositive
                        ? themeColors.accentHover
                        : "#d4183d",
                      border: "none",
                    }}
                  >
                    {stat.change}
                  </Badge>
                </div>
                <div
                  className="mb-1 text-2xl font-bold"
                  style={{ color: themeColors.textPrimary }}
                >
                  {stat.value}
                </div>
                <p
                  className="text-sm"
                  style={{ color: themeColors.textSecondary }}
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
              backgroundColor: themeColors.bgSecondary,
              border: `1px solid ${themeColors.border}`,
            }}
          >
            <TabsTrigger
              value="users"
              className={`rounded-lg data-[state=active]:bg-[${themeColors.accentPrimary}] data-[state=active]:text-[${themeColors.textPrimary}] hover:bg-[${themeColors.bgTertiary}] transition-colors`}
              style={{ color: themeColors.textPrimary }}
            >
              <Users className="w-4 h-4 mr-2" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger
              value="songs"
              className={`rounded-lg data-[state=active]:bg-[${themeColors.accentPrimary}] data-[state=active]:text-[${themeColors.textPrimary}] hover:bg-[${themeColors.bgTertiary}] transition-colors`}
              style={{ color: themeColors.textPrimary }}
            >
              <Music2 className="w-4 h-4 mr-2" />
              Canciones
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className={`rounded-lg data-[state=active]:bg-[${themeColors.accentPrimary}] data-[state=active]:text-[${themeColors.textPrimary}] hover:bg-[${themeColors.bgTertiary}] transition-colors`}
              style={{ color: themeColors.textPrimary }}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Estadísticas
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <div
              className="rounded-xl p-6 transition-all duration-300"
              style={{
                backgroundColor: themeColors.bgSecondary,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 style={{ color: themeColors.textPrimary }}>
                  Gestión de Usuarios
                </h3>
                <div className="flex gap-4">
                  <Input
                    type="text"
                    placeholder="Buscar usuarios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-xs rounded-lg transition-colors focus:border-[${themeColors.accentPrimary}] focus:ring-[${themeColors.accentPrimary}]"
                    style={{
                      backgroundColor: themeColors.bgPrimary,
                      borderColor: themeColors.border,
                      color: themeColors.textPrimary,
                    }}
                  />
                  <Button 
                    onClick={openCreateModal}
                    style={{ backgroundColor: themeColors.accentPrimary, color: themeColors.textPrimary }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Nuevo Usuario
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow style={{ borderColor: themeColors.border }}>
                      <TableHead style={{ color: themeColors.textSecondary }}>
                        Usuario
                      </TableHead>
                      <TableHead style={{ color: themeColors.textSecondary }}>
                        Email
                      </TableHead>
                      <TableHead style={{ color: themeColors.textSecondary }}>
                        Rol
                      </TableHead>
                      <TableHead style={{ color: themeColors.textSecondary }}>
                        Estado
                      </TableHead>
                      <TableHead style={{ color: themeColors.textSecondary }}>
                        Canciones
                      </TableHead>
                      <TableHead style={{ color: themeColors.textSecondary }}>
                        Fecha Registro
                      </TableHead>
                      <TableHead style={{ color: themeColors.textSecondary }}>
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="transition-colors hover:bg-[${themeColors.bgTertiary}80]"
                        style={{ borderColor: themeColors.border }}
                      >
                        <TableCell style={{ color: themeColors.textPrimary }}>
                          {user.name}
                        </TableCell>
                        <TableCell style={{ color: themeColors.textSecondary }}>
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            style={{
                              backgroundColor:
                                user.isArtist
                                  ? `${themeColors.accentPrimary}33`
                                  : `${themeColors.border}33`,
                              color:
                                user.isArtist
                                  ? themeColors.accentHover
                                  : themeColors.textSecondary,
                              border: "none",
                            }}
                          >
                            {user.isAdmin ? "Admin" : (user.isArtist ? "Artista" : "Usuario")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            style={{
                              backgroundColor:
                                !user.locked
                                  ? `${themeColors.accentPrimary}33`
                                  : "#d4183d33",
                              color:
                                !user.locked
                                  ? themeColors.accentHover
                                  : "#d4183d",
                              border: "none",
                            }}
                          >
                            {!user.locked ? "Activo" : "Bloqueado"}
                          </Badge>
                        </TableCell>
                        <TableCell style={{ color: themeColors.textSecondary }}>
                          {user.songs || 0}
                        </TableCell>
                        <TableCell style={{ color: themeColors.textSecondary }}>
                          {user.memberSince}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => openEditModal(user)}
                              className="rounded-lg transition-all hover:scale-105"
                              style={{
                                backgroundColor: themeColors.bgTertiary,
                                color: themeColors.textPrimary,
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleBlockUser(user.id)}
                              className="rounded-lg transition-all hover:scale-105 hover:bg-red-600"
                              style={{
                                backgroundColor:
                                  !user.locked
                                    ? "#d4183d"
                                    : themeColors.accentPrimary,
                                color: themeColors.textPrimary,
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
                              className="rounded-lg transition-all hover:scale-105 hover:bg-[${themeColors.border}]"
                              style={{
                                backgroundColor: themeColors.border,
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
            
            <AdminUserModal 
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveUser}
              initialData={editingUser}
            />
          </TabsContent>

          {/* Songs Tab */}
          <TabsContent value="songs">
            <div
              className="rounded-xl p-6 transition-all duration-300"
              style={{
                backgroundColor: themeColors.bgSecondary,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 style={{ color: themeColors.textPrimary }}>
                  Gestión de Canciones
                </h3>
                <Input
                  type="text"
                  placeholder="Buscar canciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs rounded-lg transition-colors focus:border-[${themeColors.accentPrimary}] focus:ring-[${themeColors.accentPrimary}]"
                  style={{
                    backgroundColor: themeColors.bgPrimary,
                    borderColor: themeColors.border,
                    color: themeColors.textPrimary,
                  }}
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow style={{ borderColor: themeColors.border }}>
                      <TableHead style={{ color: themeColors.textSecondary }}>
                        Canción
                      </TableHead>
                      <TableHead style={{ color: themeColors.textSecondary }}>
                        Artista
                      </TableHead>
                      <TableHead style={{ color: themeColors.textSecondary }}>
                        Género
                      </TableHead>
                      <TableHead style={{ color: themeColors.textSecondary }}>
                        Estado
                      </TableHead>
                      <TableHead style={{ color: themeColors.textSecondary }}>
                        Reproducciones
                      </TableHead>
                      <TableHead style={{ color: themeColors.textSecondary }}>
                        Fecha Subida
                      </TableHead>
                      <TableHead style={{ color: themeColors.textSecondary }}>
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSongs.map((song) => (
                      <TableRow
                        key={song.id}
                        className="transition-colors hover:bg-[${themeColors.bgTertiary}80]"
                        style={{ borderColor: themeColors.border }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                              <ImageWithFallback
                                src={song.image}
                                alt={song.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span style={{ color: themeColors.textPrimary }}>
                              {song.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell style={{ color: themeColors.textSecondary }}>
                          {song.artist}
                        </TableCell>
                        <TableCell>
                          <Badge
                            style={{
                              backgroundColor: `${themeColors.border}33`,
                              color: themeColors.textSecondary,
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
                                  ? `${themeColors.accentPrimary}33`
                                  : song.status === "pending"
                                    ? `${themeColors.accentHover}33`
                                    : "#d4183d33",
                              color:
                                song.status === "approved"
                                  ? themeColors.accentHover
                                  : song.status === "pending"
                                    ? themeColors.accentPrimary
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
                        <TableCell style={{ color: themeColors.textSecondary }}>
                          {song.plays.toLocaleString()}
                        </TableCell>
                        <TableCell style={{ color: themeColors.textSecondary }}>
                          {song.uploadDate}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {song.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveSong(song.id)}
                                  className="rounded-lg transition-all hover:scale-105 hover:bg-[${themeColors.accentHover}]"
                                  style={{
                                    backgroundColor: themeColors.accentPrimary,
                                    color: themeColors.textPrimary,
                                  }}
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleRejectSong(song.id)}
                                  className="rounded-lg transition-all hover:scale-105 hover:bg-red-600"
                                  style={{
                                    backgroundColor: "#d4183d",
                                    color: themeColors.textPrimary,
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
                              className="rounded-lg transition-all hover:scale-105 hover:bg-[${themeColors.border}]"
                              style={{
                                backgroundColor: themeColors.border,
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
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="grid md:grid-cols-2 gap-6">
              <div
                className="rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: themeColors.bgSecondary,
                  border: `1px solid ${themeColors.border}`,
                }}
              >
                <h3
                  className="mb-4"
                  style={{ color: themeColors.textPrimary }}
                >
                  Actividad Reciente
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span style={{ color: themeColors.textSecondary }}>
                      Nuevos usuarios (hoy)
                    </span>
                    <span style={{ color: themeColors.textPrimary }}>+24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: themeColors.textSecondary }}>
                      Canciones subidas (hoy)
                    </span>
                    <span style={{ color: themeColors.textPrimary }}>+18</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: themeColors.textSecondary }}>
                      Total reproducciones (hoy)
                    </span>
                    <span style={{ color: themeColors.textPrimary }}>
                      12,847
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: themeColors.textSecondary }}>
                      Usuarios activos (ahora)
                    </span>
                    <span style={{ color: themeColors.textPrimary }}>342</span>
                  </div>
                </div>
              </div>

              <div
                className="rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: themeColors.bgSecondary,
                  border: `1px solid ${themeColors.border}`,
                }}
              >
                <h3
                  className="mb-4"
                  style={{ color: themeColors.textPrimary }}
                >
                  Géneros Populares
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ color: themeColors.textSecondary }}>
                        Rock
                      </span>
                      <span style={{ color: themeColors.textPrimary }}>35%</span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full"
                      style={{ backgroundColor: themeColors.border }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: "35%",
                          backgroundColor: themeColors.accentPrimary,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ color: themeColors.textSecondary }}>
                        Electronic
                      </span>
                      <span style={{ color: themeColors.textPrimary }}>28%</span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full"
                      style={{ backgroundColor: themeColors.border }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: "28%",
                          backgroundColor: themeColors.accentHover,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ color: themeColors.textSecondary }}>
                        Hip-Hop
                      </span>
                      <span style={{ color: themeColors.textPrimary }}>22%</span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full"
                      style={{ backgroundColor: themeColors.border }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: "22%",
                          backgroundColor: themeColors.accentPrimary,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ color: themeColors.textSecondary }}>
                        Alternative
                      </span>
                      <span style={{ color: themeColors.textPrimary }}>15%</span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full"
                      style={{ backgroundColor: themeColors.border }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: "15%",
                          backgroundColor: themeColors.accentHover,
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
            backgroundColor: themeColors.bgSecondary,
            border: `1px solid ${themeColors.border}`,
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: themeColors.textPrimary }}>
              ¿Estás seguro?
            </AlertDialogTitle>
            <AlertDialogDescription
              style={{ color: themeColors.textSecondary }}
            >
              Esta acción no se puede deshacer. Esto eliminará permanentemente{" "}
              {deleteDialog.type === "user" ? "el usuario" : "la canción"} de la
              plataforma.
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
                if (deleteDialog.type === "user" && deleteDialog.id) {
                  handleDeleteUser(deleteDialog.id);
                } else if (deleteDialog.type === "song" && deleteDialog.id) {
                  handleDeleteSong(deleteDialog.id);
                }
              }}
              className="rounded-lg transition-colors hover:bg-red-600"
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
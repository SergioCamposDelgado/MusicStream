import {
  X,
  Upload,
  Music2,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { useState, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { api } from "../context/AuthContext";
import Swal from "sweetalert2";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (data: {
    title: string;
    genre: string;
    audioUrl: string;
    coverUrl: string | null;
  }) => void;
}

export function UploadModal({
  isOpen,
  onClose,
  onUpload,
}: UploadModalProps) {
  const { colors: themeColors } = useTheme();

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title?: string; genre?: string; audio?: string }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const isFormValid = title.trim() !== "" && genre !== "";

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = "El título es obligatorio";
    if (!genre) newErrors.genre = "Selecciona un género";
    if (!audioFile) newErrors.audio = "El archivo de audio es obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsUploading(true);
    try {
      // 1. Subir el archivo de audio
      setUploadProgress('Subiendo audio...');
      const audioFormData = new FormData();
      audioFormData.append('file', audioFile!);
      const audioResponse = await api.post('/files/upload/audio', audioFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const audioUrl: string = audioResponse.data.url;

      // 2. Subir la carátula (si se proporcionó)
      let coverUrl: string | null = null;
      if (coverFile) {
        setUploadProgress('Subiendo carátula...');
        const coverFormData = new FormData();
        coverFormData.append('file', coverFile);
        const coverResponse = await api.post('/files/upload/image', coverFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        coverUrl = coverResponse.data.url;
      }

      // 3. Notificar al componente padre con las URLs reales
      if (onUpload) {
        onUpload({ title, genre, audioUrl, coverUrl });
      }

      Swal.fire({
        title: '¡Canción subida!',
        html: `<p>Audio: <a href="${audioUrl}" target="_blank" style="color:#9D4EDD">Ver archivo</a></p>${coverUrl ? `<p>Carátula: <a href="${coverUrl}" target="_blank" style="color:#9D4EDD">Ver imagen</a></p>` : ''}`,
        icon: 'success',
        background: '#1a1a2e',
        color: '#ffffff'
      });

      // Resetear formulario y cerrar
      setTitle('');
      setGenre('');
      setAudioFile(null);
      setCoverFile(null);
      setCoverPreview(null);
      setErrors({});
      onClose();
    } catch (err: any) {
      console.error('Error al subir archivos:', err);
      Swal.fire({
        title: 'Error al subir',
        text: err.response?.data?.message || 'No se pudo subir la canción. Inténtalo de nuevo.',
        icon: 'error',
        background: '#1a1a2e',
        color: '#ffffff',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: themeColors.bgSecondary,
          border: `1px solid ${themeColors.border}`,
          color: themeColors.textPrimary,
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: themeColors.textPrimary }}>
            Subir nueva canción
          </DialogTitle>
          <DialogDescription style={{ color: themeColors.textSecondary }}>
            Completa la información de tu canción para publicarla en la plataforma
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title" style={{ color: themeColors.textPrimary }}>
              Título de la canción *
            </Label>
            <Input
              id="title"
              placeholder="Ej: Midnight Echoes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-lg transition-colors focus:border-[${themeColors.accentPrimary}]"
              style={{
                backgroundColor: themeColors.bgPrimary,
                borderColor: errors.title ? "#d4183d" : themeColors.border,
                color: themeColors.textPrimary,
              }}
            />
            {errors.title && (
              <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Género */}
          <div className="space-y-2">
            <Label htmlFor="genre" style={{ color: themeColors.textPrimary }}>
              Género *
            </Label>
            <Select value={genre} onValueChange={setGenre} required>
              <SelectTrigger
                className="rounded-lg transition-colors focus:border-[${themeColors.accentPrimary}]"
                style={{
                  backgroundColor: themeColors.bgPrimary,
                  borderColor: errors.genre ? "#d4183d" : themeColors.border,
                  color: themeColors.textPrimary,
                }}
              >
                <SelectValue placeholder="Selecciona un género" />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: themeColors.bgSecondary,
                  borderColor: themeColors.border,
                  color: themeColors.textPrimary,
                }}
              >
                <SelectItem value="alternative">Alternative</SelectItem>
                <SelectItem value="electronic">Electronic</SelectItem>
                <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="indie">Indie</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
                <SelectItem value="experimental">Experimental</SelectItem>
              </SelectContent>
            </Select>
            {errors.genre && (
              <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors.genre}
              </p>
            )}
          </div>

          {/* Archivo de audio */}
          <div className="space-y-2">
            <Label style={{ color: themeColors.textPrimary }}>
              Archivo de audio (MP3) *
            </Label>
            <div
              className="p-8 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] flex flex-col items-center gap-4 border-2 border-dashed"
              style={{
                borderColor: themeColors.border,
                backgroundColor: themeColors.bgPrimary,
              }}
              onClick={() => audioInputRef.current?.click()}
            >
              {audioFile ? (
                <>
                  <Music2
                    className="w-12 h-12"
                    style={{ color: themeColors.accentPrimary }}
                  />
                  <div className="text-center">
                    <p style={{ color: themeColors.textPrimary }}>
                      {audioFile.name}
                    </p>
                    <p style={{ color: themeColors.textSecondary }}>
                      {(audioFile.size / 1024 / 1024).toFixed(2)} MB &mdash; Click para cambiar
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload
                    className="w-12 h-12"
                    style={{ color: themeColors.accentPrimary }}
                  />
                  <div className="text-center">
                    <p style={{ color: themeColors.textPrimary }}>
                      Click para seleccionar archivo
                    </p>
                    <p style={{ color: themeColors.textSecondary }}>
                      MP3, máx. 50MB
                    </p>
                  </div>
                </>
              )}
              <input
                type="file"
                accept="audio/mp3"
                ref={audioInputRef}
                className="hidden"
                onChange={handleAudioChange}
              />
            </div>
          </div>

          {/* Carátula */}
          <div className="space-y-2">
            <Label style={{ color: themeColors.textPrimary }}>
              Carátula (opcional)
            </Label>
            <div
              className="p-8 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] flex flex-col items-center gap-4 border-2 border-dashed"
              style={{
                borderColor: themeColors.border,
                backgroundColor: themeColors.bgPrimary,
              }}
              onClick={() => coverInputRef.current?.click()}
            >
              {coverPreview ? (
                <div className="w-32 h-32 rounded-lg overflow-hidden">
                  <img
                    src={coverPreview}
                    alt="Vista previa carátula"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <ImageIcon
                  className="w-12 h-12"
                  style={{ color: themeColors.textSecondary }}
                />
              )}
              <div className="text-center">
                <p style={{ color: themeColors.textPrimary }}>
                  {coverFile ? coverFile.name : "Click para seleccionar imagen"}
                </p>
                <p style={{ color: themeColors.textSecondary }}>
                  JPG o PNG, máx. 5MB
                </p>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png"
                ref={coverInputRef}
                className="hidden"
                onChange={handleCoverChange}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#d4183d",
                color: themeColors.textPrimary,
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isUploading}
              className="flex-1 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: themeColors.accentPrimary,
                color: themeColors.textPrimary,
                boxShadow: "0 0 20px rgba(123, 44, 191, 0.3)",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                if (!isUploading) {
                  e.currentTarget.style.backgroundColor = themeColors.accentHover;
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(157, 78, 221, 0.5)";
                }
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = themeColors.accentPrimary;
                e.currentTarget.style.boxShadow = "0 0 20px rgba(123, 44, 191, 0.3)";
              }}
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {uploadProgress || 'Subiendo...'}
                </span>
              ) : 'Publicar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
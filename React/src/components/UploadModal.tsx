import {
  X,
  Upload,
  Music2,
  Image as ImageIcon,
  AlertCircle,
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
import { ThemeColors } from "../App";
import { defaultColors } from "../utils/theme";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors?: ThemeColors;
  onUpload?: (data: {
    title: string;
    genre: string;
    audioFile: File | null;
    coverFile: File | null;
  }) => void; // Opcional: callback para enviar datos al padre
}

export function UploadModal({
  isOpen,
  onClose,
  colors,
  onUpload,
}: UploadModalProps) {
  const themeColors = colors || defaultColors;

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title?: string; genre?: string }>({});

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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Aquí podrías enviar los datos al backend o al padre
    if (onUpload) {
      onUpload({
        title,
        genre,
        audioFile,
        coverFile,
      });
    }

    // Resetear formulario y cerrar
    setTitle("");
    setGenre("");
    setAudioFile(null);
    setCoverFile(null);
    setCoverPreview(null);
    setErrors({});
    onClose();
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
                      Click para cambiar
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
              disabled={!isFormValid}
              className="flex-1 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: themeColors.accentPrimary,
                color: themeColors.textPrimary,
                boxShadow: "0 0 20px rgba(123, 44, 191, 0.3)",
              }}
              onMouseEnter={(e : React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = themeColors.accentHover;
                e.currentTarget.style.boxShadow =
                  "0 0 30px rgba(157, 78, 221, 0.5)";
              }}
              onMouseLeave={(e : React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = themeColors.accentPrimary;
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(123, 44, 191, 0.3)";
              }}
            >
              Publicar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
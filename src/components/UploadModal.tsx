import {
  X,
  Upload,
  Music2,
  Image as ImageIcon,
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
import { useState } from "react";
import { ThemeColors } from "../App";
import { defaultColors } from "../utils/theme";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors?: ThemeColors;
}

export function UploadModal({
  isOpen,
  onClose,
  colors,
}: UploadModalProps) {
  const themeColors = colors || defaultColors;
  const [selectedFile, setSelectedFile] = useState<
    string | null
  >(null);
  const [selectedCover, setSelectedCover] = useState<
    string | null
  >(null);

  const handleFileSelect = (type: "audio" | "cover") => {
    if (type === "audio") {
      setSelectedFile("track.mp3");
    } else {
      setSelectedCover("cover.jpg");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle upload
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "#1A0F2E",
          border: "1px solid #3E2A66",
          color: "#E8E1FF",
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "#E8E1FF" }}>
            Subir nueva canción
          </DialogTitle>
          <DialogDescription style={{ color: "#B0A3CC" }}>
            Completa la información de tu canción para
            publicarla en la plataforma
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 mt-4"
        >
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" style={{ color: "#E8E1FF" }}>
              Título de la canción *
            </Label>
            <Input
              id="title"
              placeholder="Ej: Midnight Echoes"
              required
              className="rounded-lg"
              style={{
                backgroundColor: "#0F0A1A",
                borderColor: "#3E2A66",
                color: "#E8E1FF",
              }}
            />
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label htmlFor="genre" style={{ color: "#E8E1FF" }}>
              Género *
            </Label>
            <Select required>
              <SelectTrigger
                className="rounded-lg"
                style={{
                  backgroundColor: "#0F0A1A",
                  borderColor: "#3E2A66",
                  color: "#E8E1FF",
                }}
              >
                <SelectValue placeholder="Selecciona un género" />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: "#1A0F2E",
                  borderColor: "#3E2A66",
                  color: "#E8E1FF",
                }}
              >
                <SelectItem value="alternative">
                  Alternative
                </SelectItem>
                <SelectItem value="electronic">
                  Electronic
                </SelectItem>
                <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="indie">Indie</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
                <SelectItem value="experimental">
                  Experimental
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Audio File */}
          <div className="space-y-2">
            <Label style={{ color: "#E8E1FF" }}>
              Archivo de audio (MP3) *
            </Label>
            <div
              className="p-8 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] flex flex-col items-center gap-4"
              style={{
                backgroundColor: "#0F0A1A",
                border: "2px dashed #7B2CBF",
              }}
              onClick={() => handleFileSelect("audio")}
            >
              {selectedFile ? (
                <>
                  <Music2
                    className="w-12 h-12"
                    style={{ color: "#9D4EDD" }}
                  />
                  <div className="text-center">
                    <p style={{ color: "#E8E1FF" }}>
                      {selectedFile}
                    </p>
                    <p style={{ color: "#B0A3CC" }}>
                      Click para cambiar
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload
                    className="w-12 h-12"
                    style={{ color: "#9D4EDD" }}
                  />
                  <div className="text-center">
                    <p style={{ color: "#E8E1FF" }}>
                      Click para seleccionar archivo
                    </p>
                    <p style={{ color: "#B0A3CC" }}>
                      MP3, máx. 50MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Cover Art */}
          <div className="space-y-2">
            <Label style={{ color: "#E8E1FF" }}>
              Carátula (opcional)
            </Label>
            <div
              className="p-8 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] flex flex-col items-center gap-4"
              style={{
                backgroundColor: "#0F0A1A",
                border: "2px dashed #3E2A66",
              }}
              onClick={() => handleFileSelect("cover")}
            >
              {selectedCover ? (
                <>
                  <ImageIcon
                    className="w-12 h-12"
                    style={{ color: "#9D4EDD" }}
                  />
                  <div className="text-center">
                    <p style={{ color: "#E8E1FF" }}>
                      {selectedCover}
                    </p>
                    <p style={{ color: "#B0A3CC" }}>
                      Click para cambiar
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon
                    className="w-12 h-12"
                    style={{ color: "#B0A3CC" }}
                  />
                  <div className="text-center">
                    <p style={{ color: "#E8E1FF" }}>
                      Click para seleccionar imagen
                    </p>
                    <p style={{ color: "#B0A3CC" }}>
                      JPG o PNG, máx. 5MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl"
              style={{
                borderColor: "#3E2A66",
                color: "#B0A3CC",
                backgroundColor: "transparent",
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "#7B2CBF",
                color: "#E8E1FF",
                boxShadow: "0 0 20px rgba(123, 44, 191, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "#9D4EDD";
                e.currentTarget.style.boxShadow =
                  "0 0 30px rgba(157, 78, 221, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "#7B2CBF";
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
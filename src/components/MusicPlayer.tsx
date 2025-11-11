import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  ListMusic,
} from "lucide-react";
import { Slider } from "./ui/slider";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ThemeColors } from "../App";

interface MusicPlayerProps {
  onNavigate: (page: string) => void;
  colors?: ThemeColors;
}

export function MusicPlayer({
  onNavigate,
  colors,
}: MusicPlayerProps) {
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([33]);
  const [volume, setVolume] = useState([70]);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-lg"
      style={{
        backgroundColor: themeColors.navBg,
        borderColor: themeColors.border,
      }}
    >
      <div className="container mx-auto px-4 py-3">
        {/* Progress Bar */}
        <div className="mb-3">
          <Slider
            value={progress}
            onValueChange={setProgress}
            max={100}
            step={1}
            className="w-full"
            style={
              {
                "--slider-track": themeColors.border,
                "--slider-range": themeColors.accentPrimary,
                "--slider-thumb": themeColors.accentHover,
              } as React.CSSProperties
            }
          />
          <div className="flex justify-between mt-1">
            <span
              style={{
                color: themeColors.textSecondary,
                fontSize: "0.75rem",
              }}
            >
              1:23
            </span>
            <span
              style={{
                color: themeColors.textSecondary,
                fontSize: "0.75rem",
              }}
            >
              3:45
            </span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-14 h-14 rounded-lg flex-shrink-0 overflow-hidden"
              style={{ backgroundColor: themeColors.border }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1719353128335-725362ed1c55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200"
                alt="Current track"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4
                className="truncate mb-1"
                style={{ color: themeColors.textPrimary }}
              >
                Midnight Echoes
              </h4>
              <p
                className="truncate"
                style={{ color: themeColors.textSecondary }}
              >
                Luna Noir
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              className="transition-all duration-200 hover:scale-110"
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
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                backgroundColor: themeColors.accentPrimary,
                color: themeColors.textPrimary,
                boxShadow: "0 0 20px rgba(123, 44, 191, 0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  themeColors.accentHover;
                e.currentTarget.style.boxShadow =
                  "0 0 30px rgba(157, 78, 221, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  themeColors.accentPrimary;
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(123, 44, 191, 0.4)";
              }}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5" />
              )}
            </button>

            <button
              className="transition-all duration-200 hover:scale-110"
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
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Volume & Playlist */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Volume2
                className="w-5 h-5"
                style={{ color: themeColors.textSecondary }}
              />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-24"
                style={
                  {
                    "--slider-track": themeColors.border,
                    "--slider-range": themeColors.accentPrimary,
                    "--slider-thumb": themeColors.accentHover,
                  } as React.CSSProperties
                }
              />
            </div>

            <button
              onClick={() => onNavigate("library")}
              className="transition-all duration-200 hover:scale-110"
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
              <ListMusic className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
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
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export function MusicPlayer() {
  const { theme, colors: themeColors } = useTheme();
  const navigate = useNavigate();
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
                color: themeColors.textPrimary,
                boxShadow: theme === "dark" ? "0 0 20px rgba(123, 44, 191, 0.3)" : "none",
              } as React.CSSProperties
            }

            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (theme === "dark") {
                e.currentTarget.style.boxShadow =
                  "0 0 30px rgba(157, 78, 221, 0.5)";
              }
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (theme === "dark") {
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(123, 44, 191, 0.3)";
              }
            }}

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
                color: "#FFFFFF",
                boxShadow: theme === "dark" ? "0 0 20px rgba(123, 44, 191, 0.4)" : "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  themeColors.accentHover;
                if (theme === "dark") {
                  e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(157, 78, 221, 0.6)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  themeColors.accentPrimary;
                if (theme === "dark") {
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(123, 44, 191, 0.4)";
                }
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
                    color: themeColors.textPrimary,
                    boxShadow: theme === "dark" ? "0 0 20px rgba(123, 44, 191, 0.3)" : "none",
                  } as React.CSSProperties
                }

                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (theme === "dark") {
                    e.currentTarget.style.boxShadow =
                      "0 0 30px rgba(157, 78, 221, 0.5)";
                  }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (theme === "dark") {
                    e.currentTarget.style.boxShadow =
                      "0 0 20px rgba(123, 44, 191, 0.3)";
                  }
                }}
              />
            </div>

            <button
              onClick={() => navigate("/library")}
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
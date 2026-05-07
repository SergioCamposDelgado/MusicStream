package com.musicstream.controller;

import com.musicstream.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;
    private static final String BASE_URL = "http://localhost:9000/api/files";

    // ─────────────────────────────────────────────────────────────────────────
    // Upload endpoints (require JWT auth - configured in SecurityConfig)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * POST /api/files/upload/image
     * Sube una imagen (avatar de usuario o carátula de canción).
     * Requiere: Authorization: Bearer <token>
     */
    @PostMapping("/upload/image")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file) {
        String filename = fileStorageService.storeImage(file);
        String url = BASE_URL + "/images/" + filename;
        return ResponseEntity.ok(Map.of("url", url, "filename", filename));
    }

    /**
     * POST /api/files/upload/audio
     * Sube un archivo de audio (MP3).
     * Requiere: Authorization: Bearer <token>
     */
    @PostMapping("/upload/audio")
    public ResponseEntity<Map<String, String>> uploadAudio(
            @RequestParam("file") MultipartFile file) {
        String filename = fileStorageService.storeAudio(file);
        String url = BASE_URL + "/audio/" + filename;
        return ResponseEntity.ok(Map.of("url", url, "filename", filename));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Serve endpoints (PUBLIC - no auth needed for <img src="">, <audio src="">)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * GET /api/files/images/{filename}
     * Sirve una imagen almacenada localmente.
     */
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> serveImage(
            @PathVariable String filename,
            HttpServletRequest request) {
        Resource resource = fileStorageService.loadImageAsResource(filename);
        String contentType = resolveContentType(request, resource, MediaType.IMAGE_JPEG_VALUE);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    /**
     * GET /api/files/audio/{filename}
     * Sirve un archivo de audio almacenado localmente.
     */
    @GetMapping("/audio/{filename:.+}")
    public ResponseEntity<Resource> serveAudio(
            @PathVariable String filename,
            HttpServletRequest request) {
        Resource resource = fileStorageService.loadAudioAsResource(filename);
        String contentType = resolveContentType(request, resource, "audio/mpeg");
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper
    // ─────────────────────────────────────────────────────────────────────────

    private String resolveContentType(HttpServletRequest request, Resource resource, String fallback) {
        try {
            String contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            return (contentType != null && !contentType.isBlank()) ? contentType : fallback;
        } catch (IOException e) {
            return fallback;
        }
    }
}

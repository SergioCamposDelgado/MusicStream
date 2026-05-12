package com.musicstream.service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

  @Value("${file.upload-dir:./uploads}")
  private String uploadDir;

  private Path imagesLocation;
  private Path audioLocation;

  @PostConstruct
  public void init() {
    imagesLocation = Paths.get(uploadDir, "images");
    audioLocation = Paths.get(uploadDir, "audio");
    try {
      Files.createDirectories(imagesLocation);
      Files.createDirectories(audioLocation);
    } catch (IOException e) {
      throw new RuntimeException("No se pudo crear el directorio de uploads: " + e.getMessage(), e);
    }
  }

  /** Almacena una imagen (avatar o carátula) asignando un nombre único. */
  public String storeImage(MultipartFile file) {
    return store(
        file, imagesLocation, new String[] {"image/jpeg", "image/png", "image/gif", "image/webp"});
  }

  /** Almacena un archivo de audio MP3 asignando un nombre único. */
  public String storeAudio(MultipartFile file) {
    return store(
        file, audioLocation, new String[] {"audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"});
  }

  /** Recupera una imagen almacenada como recurso. */
  public Resource loadImageAsResource(String filename) {
    return loadResource(imagesLocation, filename);
  }

  /** Recupera un audio almacenado como recurso. */
  public Resource loadAudioAsResource(String filename) {
    return loadResource(audioLocation, filename);
  }

  // Lógica de almacenamiento y validación de archivos
  private String store(MultipartFile file, Path location, String[] allowedTypes) {
    if (file == null || file.isEmpty()) {
      throw new IllegalArgumentException("El archivo no puede estar vacío");
    }

    // Validación de tipo MIME
    String contentType = file.getContentType();
    boolean typeAllowed = false;
    for (String allowed : allowedTypes) {
      if (allowed.equalsIgnoreCase(contentType)) {
        typeAllowed = true;
        break;
      }
    }
    if (!typeAllowed) {
      throw new IllegalArgumentException("Tipo de archivo no permitido: " + contentType);
    }

    // Generación de nombre único para evitar colisiones
    String originalFilename =
        StringUtils.cleanPath(
            file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
    String extension = "";
    int dotIndex = originalFilename.lastIndexOf('.');
    if (dotIndex >= 0) {
      extension = originalFilename.substring(dotIndex);
    }
    String uniqueFilename = UUID.randomUUID().toString() + extension;

    if (uniqueFilename.contains("..")) {
      throw new IllegalArgumentException("Nombre de archivo inválido");
    }

    try {
      Path targetLocation = location.resolve(uniqueFilename);
      Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
      return uniqueFilename;
    } catch (IOException e) {
      throw new RuntimeException("Error al guardar el archivo físico", e);
    }
  }

  // Carga de archivos desde el sistema de ficheros
  private Resource loadResource(Path location, String filename) {
    try {
      String cleanFilename = StringUtils.cleanPath(filename);
      if (cleanFilename.contains("..")) {
        throw new IllegalArgumentException("Ruta de archivo inválida");
      }
      Path filePath = location.resolve(cleanFilename).normalize();
      Resource resource = new UrlResource(filePath.toUri());
      if (resource.exists() && resource.isReadable()) {
        return resource;
      } else {
        throw new RuntimeException("El recurso no existe o no es legible");
      }
    } catch (MalformedURLException e) {
      throw new RuntimeException("URL del recurso malformada", e);
    }
  }
}

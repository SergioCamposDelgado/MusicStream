package com.musicstream.controller;

import com.musicstream.dto.AdminUserCreateDTO;
import com.musicstream.dto.AdminUserUpdateDTO;
import com.musicstream.dto.UserProfileDTO;
import com.musicstream.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para la gestión administrativa de usuarios.
 *
 * <p>Todos los endpoints de este controlador están protegidos con el rol {@code ADMIN} a través de
 * {@code SecurityConfig}. Proporciona las operaciones CRUD completas sobre los usuarios de la
 * plataforma.
 *
 * <ul>
 *   <li>{@code GET /api/admin/users} → Lista todos los usuarios
 *   <li>{@code POST /api/admin/users} → Crea un usuario manualmente
 *   <li>{@code PUT /api/admin/users/{id}} → Actualiza datos de un usuario
 *   <li>{@code PUT /api/admin/users/{id}/toggle-block} → Bloquea/desbloquea un usuario
 *   <li>{@code DELETE /api/admin/users/{id}} → Elimina permanentemente un usuario
 * </ul>
 */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminController {

  /** Servicio con la lógica de negocio de gestión de usuarios. */
  private final UserService userService;

  /**
   * Devuelve la lista completa de usuarios registrados en la plataforma.
   *
   * @return Lista de {@link com.musicstream.dto.UserProfileDTO} con el perfil de cada usuario.
   */
  @GetMapping
  public ResponseEntity<List<UserProfileDTO>> getAllUsers() {
    return ResponseEntity.ok(userService.getAllUsers());
  }

  @PostMapping
  public ResponseEntity<UserProfileDTO> createUser(@Valid @RequestBody AdminUserCreateDTO dto) {
    return ResponseEntity.status(HttpStatus.CREATED).body(userService.adminCreateUser(dto));
  }

  @PutMapping("/{id}")
  public ResponseEntity<UserProfileDTO> updateUser(
      @PathVariable Long id, @Valid @RequestBody AdminUserUpdateDTO dto) {
    return ResponseEntity.ok(userService.adminUpdateUser(id, dto));
  }

  @PutMapping("/{id}/toggle-block")
  public ResponseEntity<UserProfileDTO> toggleBlock(@PathVariable Long id) {
    return ResponseEntity.ok(userService.toggleUserBlock(id));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.deleteUser(id);
    return ResponseEntity.noContent().build();
  }
}

package com.musicstream.controller;

import com.musicstream.dto.UserProfileDTO;
import com.musicstream.dto.UserUpdateDTO;
import com.musicstream.entity.User;
import com.musicstream.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Obtiene el perfil completo del usuario autenticado
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getMyProfile(@AuthenticationPrincipal User user) {
        // @AuthenticationPrincipal inyecta directamente el User (porque implementa UserDetails)
        UserProfileDTO profile = userService.getUserProfile(user.getId());
        return ResponseEntity.ok(profile);
    }

    /**
     * Actualiza el perfil del usuario autenticado
     * (nombre, avatar, posiblemente contraseña)
     */
    @PutMapping("/me")
    public ResponseEntity<UserProfileDTO> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UserUpdateDTO updateDTO) {

        User updatedUser = userService.updateProfile(user.getId(), updateDTO);

        UserProfileDTO response = UserProfileDTO.builder()
                .id(updatedUser.getId())
                .name(updatedUser.getName())
                .email(updatedUser.getEmail())
                .avatarUrl(updatedUser.getAvatarUrl())
                .isArtist(updatedUser.isArtist())
                .isAdmin(updatedUser.isAdmin())
                .createdAt(updatedUser.getCreatedAt())
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para que un admin pueda ver perfil de cualquier usuario (opcional)
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileDTO> getUserById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        if (!currentUser.isAdmin()) {
            throw new org.springframework.security.access.AccessDeniedException("Solo administradores");
        }

        UserProfileDTO profile = userService.getUserProfile(id);
        return ResponseEntity.ok(profile);
    }
}
package com.musicstream.service;

import com.musicstream.dto.RegisterRequestDTO;
import com.musicstream.dto.UserProfileDTO;
import com.musicstream.dto.UserUpdateDTO;
import com.musicstream.entity.User;
import com.musicstream.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ───────────────────────────────────────────────
    // Registro (usualmente llamado desde AuthService, pero también puede estar aquí)
    // ───────────────────────────────────────────────
    @Transactional
    public User register(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        if (dto.getConfirmPassword() != null && !dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new IllegalArgumentException("Las contraseñas no coinciden");
        }

        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .avatarUrl(dto.getAvatarUrl() != null ? dto.getAvatarUrl() : null)
                .isArtist(dto.isArtist())
                .isAdmin(false)           // Nadie se registra como admin
                .build();

        return userRepository.save(user);
    }

    // ───────────────────────────────────────────────
    // Obtener perfil completo (para /api/users/me o por ID)
    // ───────────────────────────────────────────────
    public UserProfileDTO getUserProfile(Long userId) {
        User user = getUserOrThrow(userId);

        return UserProfileDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .isArtist(user.isArtist())
                .isAdmin(user.isAdmin())
                .createdAt(user.getCreatedAt())
                .build();
    }

    // Versión conveniente para el usuario actual (desde SecurityContext)
    public UserProfileDTO getCurrentUserProfile() {
        User currentUser = getCurrentAuthenticatedUser();
        return getUserProfile(currentUser.getId());
    }

    // ───────────────────────────────────────────────
    // Actualizar perfil propio
    // ───────────────────────────────────────────────
    @Transactional
    public User updateProfile(Long userId, UserUpdateDTO dto) {
        User user = getUserOrThrow(userId);

        // Solo el propio usuario puede editar su perfil (o admin, si lo permites)
        User currentUser = getCurrentAuthenticatedUser();
        if (!currentUser.getId().equals(userId) && !currentUser.isAdmin()) {
            throw new AccessDeniedException("No tienes permiso para editar este perfil");
        }

        // Actualizar campos permitidos
        if (dto.getName() != null && !dto.getName().isBlank()) {
            user.setName(dto.getName().trim());
        }

        if (dto.getAvatarUrl() != null) {
            user.setAvatarUrl(dto.getAvatarUrl().trim());
        }

        // Cambio de contraseña (opcional)
        if (dto.getNewPassword() != null && !dto.getNewPassword().isBlank()) {
            if (dto.getCurrentPassword() == null || dto.getCurrentPassword().isBlank()) {
                throw new IllegalArgumentException("Debes proporcionar la contraseña actual");
            }

            if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("La contraseña actual es incorrecta");
            }

            if (dto.getNewPassword().length() < 8) {
                throw new IllegalArgumentException("La nueva contraseña debe tener al menos 8 caracteres");
            }

            user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        }

        return userRepository.save(user);
    }

    // ───────────────────────────────────────────────
    // Métodos auxiliares útiles
    // ───────────────────────────────────────────────

    private User getUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));
    }

    private User getCurrentAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User user) {
            return user;
        }
        throw new IllegalStateException("Usuario no autenticado o principal no es de tipo User");
    }

    // Opcional: Método para que un admin promueva/revoke roles
    @Transactional
    public User toggleArtistStatus(Long userId, boolean makeArtist) {
        User current = getCurrentAuthenticatedUser();
        if (!current.isAdmin()) {
            throw new AccessDeniedException("Solo administradores pueden cambiar el estado de artista");
        }

        User target = getUserOrThrow(userId);
        target.setArtist(makeArtist);
        return userRepository.save(target);
    }

    @Transactional
    public User toggleAdminStatus(Long userId, boolean makeAdmin) {
        User current = getCurrentAuthenticatedUser();
        if (!current.isAdmin()) {
            throw new AccessDeniedException("Solo administradores pueden cambiar el estado de admin");
        }

        // Opcional: evitar que un admin se quite a sí mismo el rol
        if (current.getId().equals(userId) && !makeAdmin) {
            throw new IllegalArgumentException("No puedes quitarte tu propio rol de administrador");
        }

        User target = getUserOrThrow(userId);
        target.setAdmin(makeAdmin);
        return userRepository.save(target);
    }

    // Opcional: Método simple para obtener el usuario actual como entidad
    public User getCurrentUserEntity() {
        return getCurrentAuthenticatedUser();
    }
}
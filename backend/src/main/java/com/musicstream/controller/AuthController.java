package com.musicstream.controller;

import com.musicstream.dto.AuthResponseDTO;
import com.musicstream.dto.LoginRequestDTO;
import com.musicstream.dto.RegisterRequestDTO;
import com.musicstream.entity.User;
import com.musicstream.service.AuthService;
import com.musicstream.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    /**
     * Registro de nuevo usuario
     * - Crea el usuario
     * - NO autentica automáticamente (común en muchas apps: obliga a hacer login después)
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(
            @Valid @RequestBody RegisterRequestDTO request,
            HttpSession session) {

        if (request.getConfirmPassword() != null && !request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Las contraseñas no coinciden");
        }

        User newUser = authService.register(request);

        AuthResponseDTO response = AuthResponseDTO.builder()
                .email(newUser.getEmail())
                .name(newUser.getName())
                .avatarUrl(newUser.getAvatarUrl())
                .isArtist(newUser.isArtist())
                .isAdmin(newUser.isAdmin())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Login con credenciales
     * - Autentica al usuario y crea la sesión
     * - Devuelve datos básicos del usuario autenticado
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO request,
            HttpServletRequest httpRequest) {

        try {
            // Autenticación manual
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            // Establece la autenticación en el contexto de seguridad
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Opcional: fuerza la creación/actualización de la sesión
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            // Obtenemos el usuario autenticado
            User user = (User) authentication.getPrincipal();

            AuthResponseDTO response = AuthResponseDTO.builder()
                    .email(user.getEmail())
                    .name(user.getName())
                    .avatarUrl(user.getAvatarUrl())
                    .isArtist(user.isArtist())
                    .isAdmin(user.isAdmin())
                    .build();

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Email o contraseña incorrectos");
        }
    }

    /**
     * Obtiene la información del usuario actualmente autenticado
     * (útil para que el frontend verifique si hay sesión activa al cargar)
     */
    @GetMapping("/me")
    public ResponseEntity<AuthResponseDTO> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = (User) auth.getPrincipal();

        AuthResponseDTO response = AuthResponseDTO.builder()
                .email(user.getEmail())
                .name(user.getName())
                .avatarUrl(user.getAvatarUrl())
                .isArtist(user.isArtist())
                .isAdmin(user.isAdmin())
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Cierre de sesión explícito
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Sesión cerrada correctamente");
    }
}
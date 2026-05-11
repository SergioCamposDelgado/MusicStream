package com.musicstream.controller;

import com.musicstream.dto.AuthResponseDTO;
import com.musicstream.dto.ErrorResponseDTO;
import com.musicstream.dto.LoginRequestDTO;
import com.musicstream.dto.RegisterRequestDTO;
import com.musicstream.entity.User;
import com.musicstream.exception.EmailAlreadyExistsException;
import com.musicstream.service.AuthService;
import com.musicstream.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
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

/**
 * Controlador REST para la autenticación de usuarios.
 *
 * <p>
 * Gestiona el ciclo completo de autenticación basado en tokens JWT stateless:
 * registro, inicio de sesión, consulta del perfil propio y cierre de sesión.
 * </p>
 *
 * <p>
 * Rutas expuestas (configuradas como públicas en {@code SecurityConfig}):
 * </p>
 * <ul>
 * <li>{@code POST /api/auth/register} — Crea una nueva cuenta de usuario</li>
 * <li>{@code POST /api/auth/login} — Autentica credenciales y devuelve un
 * JWT</li>
 * <li>{@code GET  /api/auth/me} — Retorna el perfil del usuario
 * autenticado</li>
 * <li>{@code POST /api/auth/logout} — Limpia el contexto de seguridad del
 * servidor</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    /** Servicio con la lógica de negocio de autenticación y registro. */
    private final AuthService authService;

    /**
     * Gestor de autenticación de Spring Security (valida credenciales contra la
     * base de datos).
     */
    private final AuthenticationManager authenticationManager;

    /** Componente para generar y validar tokens JWT. */
    private final JwtTokenProvider tokenProvider;

    /**
     * Registro de nuevo usuario
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO request) {

        try {
            if (request.getConfirmPassword() != null &&
                    !request.getPassword().equals(request.getConfirmPassword())) {

                return ResponseEntity.badRequest().body(
                        ErrorResponseDTO.builder()
                                .message("Las contraseñas no coinciden")
                                .errorCode("PASSWORD_MISMATCH")
                                .status(400)
                                .build());
            }

            User newUser = authService.register(request);

            Authentication auth = new UsernamePasswordAuthenticationToken(newUser.getEmail(), null);
            String token = tokenProvider.generateToken(auth);

            AuthResponseDTO response = AuthResponseDTO.builder()
                    .email(newUser.getEmail())
                    .name(newUser.getName())
                    .avatarUrl(newUser.getAvatarUrl())
                    .isArtist(newUser.isArtist())
                    .isAdmin(newUser.isAdmin())
                    .token(token)
                    .build();

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (EmailAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    ErrorResponseDTO.builder()
                            .message(e.getMessage())
                            .errorCode("EMAIL_ALREADY_EXISTS")
                            .status(409)
                            .build());
        }

        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    ErrorResponseDTO.builder()
                            .message(e.getMessage())
                            .errorCode("BAD_REQUEST")
                            .status(400)
                            .build());
        }

        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ErrorResponseDTO.builder()
                            .message("Error al registrar el usuario")
                            .errorCode("REGISTRATION_ERROR")
                            .status(500)
                            .build());
        }
    }

    /**
     * Login con credenciales
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequestDTO request,
            HttpServletRequest httpRequest) {

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = tokenProvider.generateToken(authentication);

            User user = (User) authentication.getPrincipal();

            AuthResponseDTO response = AuthResponseDTO.builder()
                    .email(user.getEmail())
                    .name(user.getName())
                    .avatarUrl(user.getAvatarUrl())
                    .isArtist(user.isArtist())
                    .isAdmin(user.isAdmin())
                    .token(token)
                    .build();

            return ResponseEntity.ok(response);

        }
        // Credenciales incorrectas
        catch (BadCredentialsException e) {
            ErrorResponseDTO error = ErrorResponseDTO.builder()
                    .message("Email o contraseña incorrectos")
                    .errorCode("INVALID_CREDENTIALS")
                    .status(401)
                    .build();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
        // Errores de validación (@Valid)

        // Otros errores
        catch (Exception e) {
            ErrorResponseDTO error = ErrorResponseDTO.builder()
                    .message("Error interno del servidor")
                    .errorCode("INTERNAL_ERROR")
                    .status(500)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Obtiene el usuario actualmente autenticado
     */
    @GetMapping("/me")
    public ResponseEntity<AuthResponseDTO> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
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
     * Cierre de sesión
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Sesión cerrada correctamente");
    }
}
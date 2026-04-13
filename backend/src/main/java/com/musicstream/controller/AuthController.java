package com.musicstream.controller;

import com.musicstream.dto.AuthResponseDTO;
import com.musicstream.dto.ErrorResponseDTO;
import com.musicstream.dto.LoginRequestDTO;
import com.musicstream.dto.RegisterRequestDTO;
import com.musicstream.entity.User;
import com.musicstream.exception.EmailAlreadyExistsException;
import com.musicstream.service.AuthService;
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
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;

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
                        .build()
                );
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
        catch (EmailAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                ErrorResponseDTO.builder()
                    .message(e.getMessage())
                    .errorCode("EMAIL_ALREADY_EXISTS")
                    .status(409)
                    .build()
            );
        } 
        
        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                ErrorResponseDTO.builder()
                    .message(e.getMessage())
                    .errorCode("BAD_REQUEST")
                    .status(400)
                    .build()
            );
        }

        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ErrorResponseDTO.builder()
                    .message("Error al registrar el usuario")
                    .errorCode("REGISTRATION_ERROR")
                    .status(500)
                    .build()
            );
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
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Crear/actualizar sesión
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            User user = (User) authentication.getPrincipal();

            AuthResponseDTO response = AuthResponseDTO.builder()
                    .email(user.getEmail())
                    .name(user.getName())
                    .avatarUrl(user.getAvatarUrl())
                    .isArtist(user.isArtist())
                    .isAdmin(user.isAdmin())
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
    public ResponseEntity<String> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Sesión cerrada correctamente");
    }
}
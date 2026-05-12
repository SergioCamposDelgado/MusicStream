package com.musicstream.controller;

import com.musicstream.dto.AuthResponseDTO;
import com.musicstream.dto.ErrorResponseDTO;
import com.musicstream.dto.LoginRequestDTO;
import com.musicstream.dto.RegisterRequestDTO;
import com.musicstream.entity.User;
import com.musicstream.exception.EmailAlreadyExistsException;
import com.musicstream.security.JwtTokenProvider;
import com.musicstream.service.AuthService;
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

/** Controlador REST para la gestión de autenticación y registro de usuarios. */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final AuthenticationManager authenticationManager;
  private final JwtTokenProvider tokenProvider;

  /** Registro de nuevos usuarios en el sistema. */
  @PostMapping("/register")
  public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO request) {
    try {
      if (request.getConfirmPassword() != null
          && !request.getPassword().equals(request.getConfirmPassword())) {
        return ResponseEntity.badRequest()
            .body(
                ErrorResponseDTO.builder()
                    .message("Las contraseñas no coinciden")
                    .errorCode("PASSWORD_MISMATCH")
                    .status(400)
                    .build());
      }

      User newUser = authService.register(request);
      Authentication auth = new UsernamePasswordAuthenticationToken(newUser.getEmail(), null);
      String token = tokenProvider.generateToken(auth);

      AuthResponseDTO response =
          AuthResponseDTO.builder()
              .email(newUser.getEmail())
              .name(newUser.getName())
              .avatarUrl(newUser.getAvatarUrl())
              .isArtist(newUser.isArtist())
              .isAdmin(newUser.isAdmin())
              .token(token)
              .build();

      return ResponseEntity.status(HttpStatus.CREATED).body(response);
    } catch (EmailAlreadyExistsException e) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body(
              ErrorResponseDTO.builder()
                  .message(e.getMessage())
                  .errorCode("EMAIL_ALREADY_EXISTS")
                  .status(409)
                  .build());
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(
              ErrorResponseDTO.builder()
                  .message("Error interno en el proceso de registro")
                  .errorCode("REGISTRATION_ERROR")
                  .status(500)
                  .build());
    }
  }

  /** Autenticación de usuario y generación de token JWT. */
  @PostMapping("/login")
  public ResponseEntity<?> login(
      @Valid @RequestBody LoginRequestDTO request, HttpServletRequest httpRequest) {
    try {
      Authentication authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

      SecurityContextHolder.getContext().setAuthentication(authentication);
      String token = tokenProvider.generateToken(authentication);
      User user = (User) authentication.getPrincipal();

      AuthResponseDTO response =
          AuthResponseDTO.builder()
              .email(user.getEmail())
              .name(user.getName())
              .avatarUrl(user.getAvatarUrl())
              .isArtist(user.isArtist())
              .isAdmin(user.isAdmin())
              .token(token)
              .build();

      return ResponseEntity.ok(response);
    } catch (BadCredentialsException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(
              ErrorResponseDTO.builder()
                  .message("Credenciales inválidas")
                  .errorCode("INVALID_CREDENTIALS")
                  .status(401)
                  .build());
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(
              ErrorResponseDTO.builder()
                  .message("Error interno del servidor")
                  .errorCode("INTERNAL_ERROR")
                  .status(500)
                  .build());
    }
  }

  /** Retorna la información del usuario autenticado actualmente. */
  @GetMapping("/me")
  public ResponseEntity<AuthResponseDTO> getCurrentUser() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    User user = (User) auth.getPrincipal();
    AuthResponseDTO response =
        AuthResponseDTO.builder()
            .email(user.getEmail())
            .name(user.getName())
            .avatarUrl(user.getAvatarUrl())
            .isArtist(user.isArtist())
            .isAdmin(user.isAdmin())
            .build();

    return ResponseEntity.ok(response);
  }

  /** Finaliza la sesión del usuario actual. */
  @PostMapping("/logout")
  public ResponseEntity<String> logout() {
    SecurityContextHolder.clearContext();
    return ResponseEntity.ok("Sesión finalizada");
  }
}

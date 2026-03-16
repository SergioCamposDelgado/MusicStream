package com.musicstream.service;

import com.musicstream.dto.RegisterRequestDTO;
import com.musicstream.dto.AuthResponseDTO;
import com.musicstream.entity.User;
import com.musicstream.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    // Si usas JWT → private final JwtService jwtService;

    /**
     * Registro de nuevo usuario
     */
    public User register(RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .avatarUrl(request.getAvatarUrl() != null ? request.getAvatarUrl() : null)
                .isArtist(request.isArtist())   // del checkbox "Continuar como artista"
                .isAdmin(false)                 // por defecto nadie es admin al registrarse
                .build();

        return userRepository.save(user);
    }

    /**
     * Autenticación manual (útil para API REST con /login endpoint)
     * Devuelve token JWT o solo confirma autenticación
     */
    public AuthResponseDTO login(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        User user = (User) authentication.getPrincipal();

        // Si usas JWT → genera token aquí
        // String token = jwtService.generateToken(user);

        return AuthResponseDTO.builder()
                .email(user.getEmail())
                .name(user.getName())
                .isArtist(user.isArtist())
                .isAdmin(user.isAdmin())
                // .token(token)   // si implementas JWT
                .build();
    }
}
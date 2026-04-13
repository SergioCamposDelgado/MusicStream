package com.musicstream.service;

import com.musicstream.dto.RegisterRequestDTO;
import com.musicstream.dto.AuthResponseDTO;
import com.musicstream.entity.User;
import com.musicstream.repository.UserRepository;
import com.musicstream.exception.EmailAlreadyExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
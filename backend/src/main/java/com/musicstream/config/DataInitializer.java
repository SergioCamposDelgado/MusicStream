package com.musicstream.config;

import com.musicstream.entity.User;
import com.musicstream.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {

            // Solo inicializa si no hay usuarios (o puedes comprobar por email específico)
            if (userRepository.count() == 0) {

                System.out.println("Base de datos vacía → insertando datos iniciales...");

                // Usuario normal de prueba
                User userNormal = User.builder()
                        .name("Usuario Prueba")
                        .email("usuario@prueba.com")
                        .password(passwordEncoder.encode("1234"))
                        .isArtist(false)
                        .isAdmin(false)
                        .avatarUrl("")
                        .build();

                userRepository.save(userNormal);

                // Usuario artista de prueba
                User userArtista = User.builder()
                        .name("Artista Demo")
                        .email("artista@demo.com")
                        .password(passwordEncoder.encode("1234"))
                        .isArtist(true)
                        .isAdmin(false)
                        .avatarUrl("")
                        .build();

                userRepository.save(userArtista);

                // Superadmin (para pruebas)
                User admin = User.builder()
                        .name("Administrador")
                        .email("admin@musicstream.com")
                        .password(passwordEncoder.encode("1234"))
                        .isArtist(false)
                        .isAdmin(true)
                        .avatarUrl("")
                        .build();

                userRepository.save(admin);

                System.out.println("Datos iniciales creados: " + userRepository.count() + " usuarios");
            } else {
                System.out.println("Ya existen datos en la BD → no se inserta nada");
            }
        };
    }
}
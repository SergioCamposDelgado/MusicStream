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
      // Inicialización de datos solo si la base de datos está vacía
      if (userRepository.count() == 0) {
        System.out.println("Inicializando base de datos con usuarios de prueba...");

        // Registro de usuario estándar
        User userNormal =
            User.builder()
                .name("Usuario Prueba")
                .email("usuario@prueba.com")
                .password(passwordEncoder.encode("1234"))
                .isArtist(false)
                .isAdmin(false)
                .avatarUrl("")
                .build();
        userRepository.save(userNormal);

        // Registro de usuario artista
        User userArtista =
            User.builder()
                .name("Artista Demo")
                .email("artista@demo.com")
                .password(passwordEncoder.encode("1234"))
                .isArtist(true)
                .isAdmin(false)
                .avatarUrl("")
                .build();
        userRepository.save(userArtista);

        // Registro de administrador del sistema
        User admin =
            User.builder()
                .name("Administrador")
                .email("admin@musicstream.com")
                .password(passwordEncoder.encode("1234"))
                .isArtist(false)
                .isAdmin(true)
                .avatarUrl("")
                .build();
        userRepository.save(admin);

        System.out.println("Carga inicial completada: " + userRepository.count() + " usuarios");
      }
    };
  }
}

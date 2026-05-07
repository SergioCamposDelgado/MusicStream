package com.musicstream.config;

import com.musicstream.service.CustomUserDetailsService;
import com.musicstream.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Habilitamos CORS usando el bean corsConfigurationSource definido abajo
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 2. Desactivamos CSRF ya que estamos usando cookies con SameSite/Sessión controlada o JWT
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/auth/register",
                    "/api/auth/login",
                    "/api/auth/me",
                    "/api/auth/logout",
                    "/error",
                    "/actuator/health"
                ).permitAll()

                // Servir archivos públicamente (imágenes y audio) sin necesidad de token
                // para que <img src="..."> y <audio src="..."> funcionen en el navegador
                .requestMatchers("/api/files/images/**").permitAll()
                .requestMatchers("/api/files/audio/**").permitAll()

                // Subir archivos requiere estar autenticado
                .requestMatchers("/api/files/upload/**").authenticated()

                .requestMatchers("/api/users/**").authenticated()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/artist/**").hasRole("ARTIST")

                .anyRequest().authenticated()
            )

            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            .logout(logout -> logout.disable())

            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

            .headers(headers -> headers
                .frameOptions(frame -> frame.deny())
                // Ajustamos CSP para permitir las conexiones de desarrollo si fuera necesario
                .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'"))
            );

        return http.build();
    }

    // Bean de configuración de CORS nativo de Spring Security
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Origen permitido (Tu React en puerto 3000)
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        
        // Métodos permitidos (Importante incluir PUT y OPTIONS)
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        
        // Cabeceras permitidas
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"));
        
        // Permitir envío de Cookies (JSESSIONID)
        config.setAllowCredentials(true);
        
        // Tiempo que el navegador guarda la configuración de CORS para no repetir OPTIONS
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
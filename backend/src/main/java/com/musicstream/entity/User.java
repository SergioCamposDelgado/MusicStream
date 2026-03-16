package com.musicstream.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = "email")
           // Si más adelante decides tener username separado, descomenta:
           // @UniqueConstraint(columnNames = "username")
       })
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "password")  // Evita exponer la contraseña en logs / toString
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    @Column(nullable = false, unique = true)
    private String email;

    // Si en el futuro quieres username diferente al email, descomenta:
    // @Column(unique = true)
    // private String username;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Column(nullable = false)
    private String password;

    @Column(length = 512)
    private String avatarUrl;

    @Column(nullable = false)
    @Builder.Default
    private boolean isArtist = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean isAdmin = false;

    // Auditoría
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // ───────────────────────────────────────────────
    // Implementación de UserDetails para Spring Security
    // ───────────────────────────────────────────────

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = new java.util.ArrayList<>();

        // Siempre agregamos ROLE_USER por defecto (buena práctica)
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        if (isArtist) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ARTIST"));
        }

        if (isAdmin) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }

        return authorities;
    }

    @Override
    public String getUsername() {
        return this.email;  // Login con email (lo más común hoy en día)
        // Si prefieres username separado → return this.username;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;  // Puedes agregar un campo boolean enabled más adelante
    }

    // Métodos de conveniencia útiles
    public boolean isAdmin() {
        return isAdmin;
    }

    public boolean isArtist() {
        return isArtist;
    }

    // Opcional: métodos para facilitar cambios de rol desde el servicio
    public void grantAdmin() {
        this.isAdmin = true;
    }

    public void revokeAdmin() {
        this.isAdmin = false;
    }

    public void grantArtist() {
        this.isArtist = true;
    }

    public void revokeArtist() {
        this.isArtist = false;
    }
}
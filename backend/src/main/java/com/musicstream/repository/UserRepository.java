package com.musicstream.repository;

import com.musicstream.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Método principal para login (Spring Security lo usa vía UserDetailsService)
    Optional<User> findByEmail(String email);

    // Verificar si existe un email (útil en registro para evitar duplicados)
    boolean existsByEmail(String email);

    // Búsqueda por nombre (parcial, útil para búsquedas o autocompletado)
    @Query("SELECT u FROM User u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<User> findByNameContainingIgnoreCase(@Param("name") String name);

    // Usuarios que son artistas
    List<User> findByIsArtistTrue();

    // Usuarios administradores
    List<User> findByIsAdminTrue();

    // Usuarios que son artistas Y administradores (si aplica en tu app)
    List<User> findByIsArtistTrueAndIsAdminTrue();

    // Opcional: buscar por avatarUrl (por si quieres chequear duplicados o algo)
    Optional<User> findByAvatarUrl(String avatarUrl);

    // Conteo rápido de artistas / admins (útil para dashboard)
    long countByIsArtistTrue();

    long countByIsAdminTrue();

    // Ejemplo de consulta más avanzada si necesitas filtrar por fecha de creación
    List<User> findByCreatedAtAfter(LocalDateTime date);
}
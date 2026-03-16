package com.musicstream.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {

    private String email;
    private String name;
    private String avatarUrl;       // puede ser null
    private boolean isArtist;
    private boolean isAdmin;

    // Si usas JWT o token de sesión
    private String token;           // opcional - agrégalo si implementas JWT

    // Opcional: fecha de creación o "miembro desde"
    private String memberSince;     // ej: "Noviembre 2024" o ISO format
}
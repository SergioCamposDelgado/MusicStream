package com.musicstream.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {

    private Long id;
    private String name;
    private String email;
    private String avatarUrl;

    private boolean isArtist;
    private boolean isAdmin;

    private LocalDateTime createdAt;

    // Campo calculado para el frontend ("Miembro desde...")
    public String getMemberSince() {
        if (createdAt == null) return "Recién llegado";
        return createdAt.format(DateTimeFormatter.ofPattern("MMMM yyyy"));
    }
}
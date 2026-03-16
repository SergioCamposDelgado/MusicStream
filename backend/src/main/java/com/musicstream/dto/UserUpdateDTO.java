package com.musicstream.dto;

import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDTO {

    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String name;

    private String avatarUrl;

    // Opcional: si permites cambiar contraseña desde perfil
    private String currentPassword;
    private String newPassword;
}
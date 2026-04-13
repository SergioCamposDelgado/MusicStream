package com.musicstream.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ErrorResponseDTO {
    
    private String message;
    private String errorCode;
    private int status;
    
    // Constructor para casos simples
    public ErrorResponseDTO(String message) {
        this.message = message;
        this.errorCode = "ERROR";
        this.status = 400;
    }
}
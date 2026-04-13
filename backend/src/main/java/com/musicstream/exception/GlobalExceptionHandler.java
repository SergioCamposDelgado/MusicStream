package com.musicstream.exception;

import com.musicstream.dto.ErrorResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidationErrors(MethodArgumentNotValidException ex) {
        // Extrae el mensaje de tus anotaciones @Size, @NotBlank, etc.
        String firstErrorMessage = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();

        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .message(firstErrorMessage)
                .errorCode("VALIDATION_ERROR")
                .status(400)
                .build();

        return ResponseEntity.badRequest().body(error);
    }
    
    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDTO> handleEmailExists(EmailAlreadyExistsException ex) {
        return ResponseEntity.status(409).body(
            ErrorResponseDTO.builder()
                .message(ex.getMessage())
                .errorCode("EMAIL_ALREADY_EXISTS")
                .status(409)
                .build()
        );
    }
}
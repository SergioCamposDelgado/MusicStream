package com.musicstream.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.security.Key;
import java.util.Date;

/**
 * Proveedor de tokens JWT (JSON Web Token) para la autenticación stateless.
 *
 * <p>Responsabilidades:</p>
 * <ul>
 *   <li>Generación de tokens firmados con HMAC-SHA256 tras un login exitoso.</li>
 *   <li>Extracción del nombre de usuario (subject) a partir de un token.</li>
 *   <li>Validación de la firma, expiración y formato del token recibido.</li>
 * </ul>
 *
 * <p><strong>Nota de seguridad:</strong> La clave secreta ({@code jwtSecret}) debe
 * externalizarse a variables de entorno o a {@code application.properties} antes
 * de desplegar en producción.</p>
 */
@Component
public class JwtTokenProvider {

    // Clave secreta para firmar los tokens (inyectada desde properties)
    @Value("${app.jwt.secret}")
    private String jwtSecret;

    // Duración del token (inyectada desde properties)
    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    /** Construye la clave de firma HMAC a partir de la cadena secreta. */
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /**
     * Genera un token JWT firmado para el usuario autenticado.
     *
     * @param authentication Objeto de autenticación de Spring Security con el principal.
     * @return Token JWT compacto listo para enviar al cliente.
     */
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expireDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException ex) {
            System.err.println("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            System.err.println("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            System.err.println("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            System.err.println("JWT claims string is empty.");
        }
        return false;
    }
}

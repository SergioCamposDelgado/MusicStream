package com.musicstream.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

/**
 * Proveedor de servicios para la gestión de tokens JWT (generación, validación
 * y extracción).
 */
@Component
public class JwtTokenProvider {

  @Value("${app.jwt.secret}")
  private String jwtSecret;

  @Value("${app.jwt.expiration-ms}")
  private long jwtExpirationMs;

  /** Obtiene la clave de firma a partir del secreto configurado. */
  private Key getSigningKey() {
    return Keys.hmacShaKeyFor(jwtSecret.getBytes());
  }

  /** Genera un token JWT para el usuario autenticado. */
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
    Claims claims = Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();

    return claims.getSubject();
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
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

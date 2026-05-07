package com.musicstream.security;

import com.musicstream.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro de autenticación JWT que se ejecuta una vez por petición HTTP.
 *
 * <p>Intercepta cada solicitud entrante, extrae el token JWT del encabezado
 * {@code Authorization: Bearer <token>}, lo valida y, si es correcto,
 * carga el {@link org.springframework.security.core.userdetails.UserDetails}
 * correspondiente y establece la autenticación en el
 * {@link org.springframework.security.core.context.SecurityContext}.</p>
 *
 * <p>Si el token no está presente o no es válido, la cadena de filtros
 * continúa sin establecer autenticación, lo que permitirá que
 * {@code SecurityConfig} rechace la petición con 401 si la ruta está protegida.</p>
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /** Proveedor JWT para validar y decodificar el token. */
    @Autowired
    private JwtTokenProvider tokenProvider;

    /** Servicio que carga los detalles del usuario desde la base de datos. */
    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    /**
     * Lógica principal del filtro: extrae, valida y aplica el JWT de la petición.
     *
     * @param request     Petición HTTP entrante.
     * @param response    Respuesta HTTP saliente.
     * @param filterChain Cadena de filtros de Spring Security.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String username = tokenProvider.getUsernameFromJWT(jwt);

                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

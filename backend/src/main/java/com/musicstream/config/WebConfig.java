package com.musicstream.config;

import java.util.Locale;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

/**
 * Configuración de Web MVC simplificada para internacionalización automática.
 * <p>
 * Esta clase implementa {@link WebMvcConfigurer} para gestionar la
 * internacionalización (i18n) de la plataforma, permitiendo el cambio dinámico
 * de idioma y definiendo una localización por defecto.
 * </p>
 * * @author Sergio Campos Delgado
 * 
 * @version 1.0
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

	/**
	 * Resuelve la localización basada estrictamente en las cabeceras HTTP.
	 * <p>
	 * Utiliza el encabezado "Accept-Language". Si el idioma solicitado no está
	 * disponible en la aplicación, se utilizará el español como recurso de reserva.
	 * </p>
	 * * @return El resolvedor de localización basado en el navegador.
	 */
	@Bean
	public LocaleResolver localeResolver() {
		AcceptHeaderLocaleResolver ahlr = new AcceptHeaderLocaleResolver();
		ahlr.setDefaultLocale(Locale.forLanguageTag("es"));
		return ahlr;
	}

}
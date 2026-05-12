package com.musicstream.config;

import java.util.Locale;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

/** Configuración para la internacionalización de la aplicación. */
@Configuration
public class WebConfig implements WebMvcConfigurer {

  /** Define el español como localización por defecto basada en cabeceras HTTP. */
  @Bean
  public LocaleResolver localeResolver() {
    AcceptHeaderLocaleResolver ahlr = new AcceptHeaderLocaleResolver();
    ahlr.setDefaultLocale(Locale.forLanguageTag("es"));
    return ahlr;
  }
}

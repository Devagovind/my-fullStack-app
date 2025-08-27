package com.myFullStackApp.main.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Applies to all endpoints under /api/
                .allowedOrigins("http://localhost:3000", "https://incomparable-concha-29c4ba.netlify.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Explicitly allow OPTIONS
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
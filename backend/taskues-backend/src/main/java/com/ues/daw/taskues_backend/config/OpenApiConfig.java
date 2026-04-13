package com.ues.daw.taskues_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("TaskUES API") 
                        .version("1.0.0")
                        .description("API REST para la gestión de tareas colaborativas (TaskUES). "
                                + "Desarrollada con Spring Boot y PostgreSQL para el "
                                + "La aplicación tiene como objetivo facilitar la organización de "
                                + "actividades académicas y profesionales")
                        .contact(new Contact()
                                .name("Mario Montoya")
                                .email("mv16013@ues.edu.sv")));
    }
}
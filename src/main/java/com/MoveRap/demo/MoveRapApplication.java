package com.MoveRap.demo;

import io.github.cdimascio.dotenv.Dotenv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MoveRapApplication {

    public static void main(String[] args) {
        // Carregar variáveis do .env explicitamente
        Dotenv dotenv = Dotenv.configure()
                .directory("C:/Users/Buffer/Documents/Rap") // Caminho explícito para o arquivo .env
                .load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        SpringApplication.run(MoveRapApplication.class, args);
    }
}

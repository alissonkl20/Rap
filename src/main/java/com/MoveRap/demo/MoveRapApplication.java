package com.MoveRap.demo;

import io.github.cdimascio.dotenv.Dotenv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MoveRapApplication {

    public static void main(String[] args) {
        // Carrega .env apenas se existir (desenvolvimento local)
        // No Docker, as variáveis já vêm do docker-compose.yml
        try {
            Dotenv dotenv = Dotenv.configure()
                    .ignoreIfMissing() // Não falha se .env não existir
                    .load();
            dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
        } catch (Exception e) {
            // .env não encontrado, usa variáveis de ambiente do sistema (Docker)
            System.out.println("Arquivo .env não encontrado, usando variáveis de ambiente do sistema");
        }
        SpringApplication.run(MoveRapApplication.class, args);
    }
}

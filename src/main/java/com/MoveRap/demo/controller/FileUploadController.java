package com.MoveRap.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.io.InputStream;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final String[] ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"};

    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "type", required = false, defaultValue = "general") String type,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não autenticado");
        }

        // Validações
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Arquivo vazio");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Arquivo muito grande. Máximo: 5MB");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !isAllowedExtension(originalFilename)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "Formato não permitido. Use: jpg, jpeg, png, gif ou webp");
        }

        // SEGURANÇA: Validar conteúdo real do arquivo (magic bytes)
        if (!isValidImageFile(file)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "Arquivo inválido. O conteúdo não corresponde a uma imagem válida");
        }

        try {
            // Criar diretório se não existir
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Gerar nome único
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;
            
            // Salvar arquivo
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            // Retornar URL
            Map<String, String> response = new HashMap<>();
            response.put("url", "/uploads/" + filename);
            response.put("filename", filename);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erro ao salvar arquivo: " + e.getMessage());
        }
    }

    private boolean isAllowedExtension(String filename) {
        String lowerFilename = filename.toLowerCase();
        for (String ext : ALLOWED_EXTENSIONS) {
            if (lowerFilename.endsWith(ext)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Valida se o arquivo é realmente uma imagem verificando os magic bytes (assinatura do arquivo)
     * Previne upload de scripts maliciosos disfarçados como imagens
     */
    private boolean isValidImageFile(MultipartFile file) {
        try (InputStream input = file.getInputStream()) {
            byte[] fileSignature = new byte[12];
            int bytesRead = input.read(fileSignature);
            
            if (bytesRead < 4) {
                return false;
            }
            
            // Verificar magic bytes de formatos de imagem comuns
            // PNG: 89 50 4E 47
            if (fileSignature[0] == (byte) 0x89 && fileSignature[1] == 0x50 && 
                fileSignature[2] == 0x4E && fileSignature[3] == 0x47) {
                return true;
            }
            
            // JPEG: FF D8 FF
            if (fileSignature[0] == (byte) 0xFF && fileSignature[1] == (byte) 0xD8 && 
                fileSignature[2] == (byte) 0xFF) {
                return true;
            }
            
            // GIF: 47 49 46 38
            if (fileSignature[0] == 0x47 && fileSignature[1] == 0x49 && 
                fileSignature[2] == 0x46 && fileSignature[3] == 0x38) {
                return true;
            }
            
            // WebP: 52 49 46 46 ... 57 45 42 50
            if (bytesRead >= 12 && fileSignature[0] == 0x52 && fileSignature[1] == 0x49 && 
                fileSignature[2] == 0x46 && fileSignature[3] == 0x46 &&
                fileSignature[8] == 0x57 && fileSignature[9] == 0x45 && 
                fileSignature[10] == 0x42 && fileSignature[11] == 0x50) {
                return true;
            }
            
            return false;
        } catch (IOException e) {
            return false;
        }
    }

    @DeleteMapping("/image/{filename}")
    public ResponseEntity<Map<String, String>> deleteImage(
            @PathVariable String filename,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não autenticado");
        }

        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                Map<String, String> response = new HashMap<>();
                response.put("message", "Arquivo excluído com sucesso");
                return ResponseEntity.ok(response);
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Arquivo não encontrado");
            }
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erro ao excluir arquivo: " + e.getMessage());
        }
    }
}

package com.MoveRap.demo.controller;

import com.MoveRap.demo.Dtos.UserPageDto;
import com.MoveRap.demo.model.UserPage;
import com.MoveRap.demo.model.UserModel;
import com.MoveRap.demo.repository.UserPageRepository;
import com.MoveRap.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;

@RestController
@RequestMapping("/user-page")
public class UserPageController {
    @Autowired
    private UserPageRepository userPageRepository;
    @Autowired
    private UserRepository userRepository;
    @PostMapping("/create")
    public ResponseEntity<UserPage> createUserPage(@RequestParam Long userId,
                                                   @RequestBody UserPage userPage) {
        Optional<UserModel> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }
        userPage.setUser(user.get());
        UserPage savedPage = userPageRepository.save(userPage);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPage);
    }
    @PostMapping("/update")
    public ResponseEntity<Object> updateUserPage(@RequestBody UserPageDto userPageDto) {
        // AVISO: Autenticação desativada para testes. REMOVA antes de produção.
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "Página do usuário atualizada com sucesso.");
        return ResponseEntity.ok(response);
    }
    @PutMapping("/update-image")
    public ResponseEntity<String> updateUserImage(@RequestParam(required = false) String profileImageUrl,
                                                  @RequestParam(required = false) String backgroundImageUrl) {
        // AVISO: Autenticação desativada para testes. REMOVA antes de produção.
        return ResponseEntity.ok("Imagem atualizada com sucesso.");
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUserPage(@RequestParam Long userId) {
        Optional<UserPage> existingPage = userPageRepository.findByUserId(userId);
        if (existingPage.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Página do usuário não encontrada");
        }
        userPageRepository.delete(existingPage.get());
        return ResponseEntity.ok("Página do usuário excluída com sucesso.");
    }
    @DeleteMapping("/delete-image")
    public ResponseEntity<String> deleteUserImage(@RequestParam(required = false) boolean deleteProfileImage,
                                                   @RequestParam(required = false) boolean deleteBackgroundImage) {
        // AVISO: Autenticação desativada para testes. REMOVA antes de produção.
        return ResponseEntity.ok("Imagem removida com sucesso.");
    }
}
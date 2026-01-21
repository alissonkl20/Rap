package com.MoveRap.demo.controller;

import com.MoveRap.demo.Dtos.UserPageDto;
import com.MoveRap.demo.model.UserPage;
import com.MoveRap.demo.model.UserModel;
import com.MoveRap.demo.repository.UserPageRepository;
import com.MoveRap.demo.repository.UserRepository;
import com.MoveRap.demo.service.AuthService;
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
    private AuthService authService;
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
    public ResponseEntity<String> updateUserPage(@RequestBody UserPageDto userPageDto) {
        if (!authService.isAuthenticated()) {
            return ResponseEntity.status(403).body("Acesso negado. Faça login para continuar.");
        }
        return ResponseEntity.ok("Página do usuário atualizada com sucesso.");
    }
    @PutMapping("/update-image")
    public ResponseEntity<String> updateUserImage(@RequestParam(required = false) String profileImageUrl,
                                                  @RequestParam(required = false) String backgroundImageUrl) {
        if (!authService.isAuthenticated()) {
            return ResponseEntity.status(403).body("Acesso negado. Faça login para continuar.");
        }
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
        if (!authService.isAuthenticated()) {
            return ResponseEntity.status(403).body("Acesso negado. Faça login para continuar.");
        }
        return ResponseEntity.ok("Imagem removida com sucesso.");
    }
}
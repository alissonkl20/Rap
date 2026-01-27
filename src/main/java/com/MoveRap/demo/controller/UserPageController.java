package com.MoveRap.demo.controller;

import com.MoveRap.demo.Dtos.UserPageDto;
import com.MoveRap.demo.model.UserPage;
import com.MoveRap.demo.model.UserModel;
import com.MoveRap.demo.repository.UserPageRepository;
import com.MoveRap.demo.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.Authentication;
import java.util.Optional;

@RestController
@RequestMapping("/user-page") 
public class UserPageController {
    @Autowired
    private UserPageRepository userPageRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<UserPage> createUserPage(@Valid @RequestBody UserPageDto userPageDto, 
                                                   Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não autenticado");
        }
        String username = authentication.getName();
        UserModel user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }
        
        Optional<UserPage> existingPage = userPageRepository.findByUser_Id(user.getId());
        if (existingPage.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Usuário já possui uma página");
        }
        UserPage userPage = new UserPage();
        userPage.setUser(user);
        userPage.setBiography(userPageDto.getBiography());
        userPage.setProfileImageUrl(userPageDto.getProfileImageUrl());
        userPage.setBackgroundImageUrl(userPageDto.getBackgroundImageUrl());
        if (userPageDto.getMusicUrlsList() != null && !userPageDto.getMusicUrlsList().isEmpty()) {
            userPage.setMusicUrls(String.join(",", userPageDto.getMusicUrlsList()));
        }
        
        UserPage savedPage = userPageRepository.save(userPage);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPage);
    }

    @PutMapping("/update")
    public ResponseEntity<Object> updateUserPage(@Valid @RequestBody UserPageDto userPageDto, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não autenticado");
        }
        String username = authentication.getName();
        UserModel user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }
        UserPage userPage = userPageRepository.findByUser_Id(user.getId()).orElse(new UserPage());
        userPage.setUser(user);
        userPage.setBiography(userPageDto.getBiography());
        userPage.setProfileImageUrl(userPageDto.getProfileImageUrl());
        userPage.setBackgroundImageUrl(userPageDto.getBackgroundImageUrl());
        if (userPageDto.getMusicUrlsList() != null && !userPageDto.getMusicUrlsList().isEmpty()) {
            userPage.setMusicUrls(String.join(",", userPageDto.getMusicUrlsList()));
        }
        userPageRepository.save(userPage);
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "Página do usuário atualizada com sucesso.");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUserPage(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não autenticado");
        }
        String username = authentication.getName();
        UserModel user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }
        
        Optional<UserPage> existingPage = userPageRepository.findByUser_Id(user.getId());
        if (existingPage.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Página do usuário não encontrada");
        }
        
        // Quebrar o relacionamento bidirecional antes de deletar
        UserPage userPage = existingPage.get();
        user.setUserPage(null);
        userPage.setUser(null);
        
        // Salvar o usuário sem a página associada
        userRepository.save(user);
        
        // Agora deletar a página
        userPageRepository.delete(userPage);
        
        return ResponseEntity.ok("Página do usuário excluída com sucesso.");
    }

    @PostMapping("/save")
    public ResponseEntity<Object> saveUserPage(@RequestParam(required = false) String biography,
                                               @RequestParam(required = false) String musicUrls,
                                               @RequestParam(required = false) String profileImageUrl,
                                               @RequestParam(required = false) String backgroundImageUrl,
                                               Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não autenticado");
        }
        String username = authentication.getName();
        UserModel user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }
        Optional<UserPage> optionalUserPage = userPageRepository.findByUser_Id(user.getId());
        UserPage userPage;
        
        if (optionalUserPage.isPresent()) {
            userPage = optionalUserPage.get();
        } else {
            userPage = new UserPage();
            userPage.setUser(user);
        }
        
        if (biography != null) {
            userPage.setBiography(biography);
        }
        if (profileImageUrl != null) {
            userPage.setProfileImageUrl(profileImageUrl);
        }
        if (backgroundImageUrl != null) {
            userPage.setBackgroundImageUrl(backgroundImageUrl);
        }
        if (musicUrls != null) {
            userPage.setMusicUrls(musicUrls);
        }
        
        userPageRepository.save(userPage);
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "Página do usuário salva com sucesso.");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserPageDto> getMyUserPage(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não autenticado");
        }
        String username = authentication.getName();
        UserModel user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }
        Optional<UserPage> userPageOpt = userPageRepository.findByUser_Id(user.getId());
        if (userPageOpt.isEmpty()) {
            return ResponseEntity.ok(new UserPageDto()); // Retorna vazio se não existir
        }
        UserPage page = userPageOpt.get();
        UserPageDto dto = new UserPageDto();
        dto.setBiography(page.getBiography());
        dto.setProfileImageUrl(page.getProfileImageUrl());
        dto.setBackgroundImageUrl(page.getBackgroundImageUrl());
        // Converte string em lista de URLs
        if (page.getMusicUrls() != null && !page.getMusicUrls().isEmpty()) {
            dto.setMusicUrlsList(java.util.Arrays.asList(page.getMusicUrls().split(",")));
        }
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/public/{username}")
    public ResponseEntity<java.util.Map<String, Object>> getPublicUserPage(@PathVariable String username) {
        UserModel user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }
        
        Optional<UserPage> userPageOpt = userPageRepository.findByUser_Id(user.getId());
        if (userPageOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Página do usuário não encontrada");
        }
        
        UserPage page = userPageOpt.get();
        
        // Cria response com informações públicas
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("username", user.getUsername());
        response.put("name", user.getUsername()); // Pode adicionar campo 'name' no UserModel se desejar
        response.put("biography", page.getBiography());
        response.put("profileImageUrl", page.getProfileImageUrl());
        response.put("backgroundImageUrl", page.getBackgroundImageUrl());
        
        // Converte string em lista de URLs
        if (page.getMusicUrls() != null && !page.getMusicUrls().isEmpty()) {
            response.put("musicUrlsList", java.util.Arrays.asList(page.getMusicUrls().split(",")));
        } else {
            response.put("musicUrlsList", new java.util.ArrayList<>());
        }
        
        return ResponseEntity.ok(response);
    }
}
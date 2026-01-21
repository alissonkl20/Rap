package com.MoveRap.demo.controller;

import com.MoveRap.demo.Dtos.UserCadastroDto;
import com.MoveRap.demo.Dtos.UserDetalhamentoDto;
import com.MoveRap.demo.Dtos.UserLoginDto;
import com.MoveRap.demo.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

class ErrorResponse {
    private String message;
    public ErrorResponse(String message) {
        this.message = message;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
}

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    @PostMapping("/register")
    public ResponseEntity<UserDetalhamentoDto> registerUser(@Valid @RequestBody UserCadastroDto userCadastroDto) {
        UserDetalhamentoDto userDetalhamentoDto = authService.registerUser(userCadastroDto);
        return new ResponseEntity<>(userDetalhamentoDto, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody UserLoginDto userLoginDto) {
        try {
            if (userLoginDto.getEmail() == null || userLoginDto.getEmail().isEmpty() ||
                userLoginDto.getSenha() == null || userLoginDto.getSenha().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Email e senha são obrigatórios"));
            }

            UserDetalhamentoDto userDetalhamentoDto = authService.loginUser(userLoginDto);
            if (userDetalhamentoDto == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Credenciais inválidas"));
            }
            return ResponseEntity.ok(userDetalhamentoDto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Erro interno no servidor"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            UserDetalhamentoDto userDetalhamentoDto = authService.getAuthenticatedUserDetails();
            return ResponseEntity.ok(userDetalhamentoDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Usuário não autenticado"));
        }
    }
}
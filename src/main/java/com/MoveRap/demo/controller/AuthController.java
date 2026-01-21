package com.MoveRap.demo.controller;

import com.MoveRap.demo.Dtos.UserCadastroDto;
import com.MoveRap.demo.Dtos.UserDetalhamentoDto;
import com.MoveRap.demo.Dtos.UserLoginDto;
import com.MoveRap.demo.service.AuthService;
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
    public ResponseEntity<UserDetalhamentoDto> registerUser(@RequestBody UserCadastroDto userCadastroDto) {
        UserDetalhamentoDto userDetalhamentoDto = authService.registerUser(userCadastroDto);
        return new ResponseEntity<>(userDetalhamentoDto, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginDto userLoginDto) {
        UserDetalhamentoDto userDetalhamentoDto = authService.loginUser(userLoginDto);
        if (userDetalhamentoDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Credenciais inválidas"));
        }
        return ResponseEntity.ok(userDetalhamentoDto);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDetalhamentoDto> getCurrentUser() {
        // AVISO: Autenticação desativada para testes. REMOVA antes de produção.
        UserDetalhamentoDto userDetalhamentoDto = new UserDetalhamentoDto(1L, "testuser", "testuser@example.com");
        return ResponseEntity.ok(userDetalhamentoDto);
    }
}
package com.MoveRap.demo.controller;

import com.MoveRap.demo.Dtos.UserCadastroDto;
import com.MoveRap.demo.Dtos.UserDetalhamentoDto;
import com.MoveRap.demo.Dtos.UserLoginDto;
import com.MoveRap.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<UserDetalhamentoDto> loginUser(@RequestBody UserLoginDto userLoginDto) {
        UserDetalhamentoDto userDetalhamentoDto = authService.loginUser(userLoginDto);
        return ResponseEntity.ok(userDetalhamentoDto);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDetalhamentoDto> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserDetalhamentoDto userDetalhamentoDto = authService.getUserDetailsByUsername(username);
        return ResponseEntity.ok(userDetalhamentoDto);
    }
}
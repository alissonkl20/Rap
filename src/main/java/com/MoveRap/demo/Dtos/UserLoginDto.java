package com.MoveRap.demo.Dtos;

import jakarta.validation.constraints.NotBlank;
public class UserLoginDto {

    @NotBlank(message = "O campo email é obrigatório.")
    private String email;
    @NotBlank(message = "O campo senha é obrigatório.")
    private String senha;

    // Getters e Setters
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getSenha() {
        return senha;
    }
    public void setSenha(String senha) {
        this.senha = senha;
    }
}
package com.MoveRap.demo.Dtos;

import jakarta.validation.constraints.NotBlank;
public class UserLoginDto {

    @NotBlank(message = "O campo email é obrigatório.")
    private String email;
    @NotBlank(message = "O campo password é obrigatório.")
    private String password;
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
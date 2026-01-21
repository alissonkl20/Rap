package com.MoveRap.demo.service;

import com.MoveRap.demo.Dtos.UserCadastroDto;
import com.MoveRap.demo.Dtos.UserDetalhamentoDto;
import com.MoveRap.demo.Dtos.UserLoginDto;
import com.MoveRap.demo.model.UserModel;
import com.MoveRap.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public UserDetalhamentoDto registerUser(UserCadastroDto userCadastroDto) {
        UserModel user = new UserModel();
        user.setUsername(userCadastroDto.getUsername());
        user.setEmail(userCadastroDto.getEmail());
        user.setPassword(passwordEncoder.encode(userCadastroDto.getPassword()));
        user = userRepository.save(user);
        return new UserDetalhamentoDto(user.getId(), user.getUsername(), user.getEmail());
    }
    public UserDetalhamentoDto authenticateUser(String emailOrUsername, String password) {
        // Tenta buscar por email primeiro
        UserModel user = userRepository.findByEmail(emailOrUsername);
        
        // Se não encontrou, tenta buscar por username
        if (user == null) {
            user = userRepository.findByUsername(emailOrUsername);
        }
        
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return new UserDetalhamentoDto(user.getId(), user.getUsername(), user.getEmail());
        }
        return null;
    }
    public UserDetalhamentoDto loginUser(UserLoginDto userLoginDto) {
        return authenticateUser(userLoginDto.getEmail(), userLoginDto.getSenha());
    }
    public UserDetalhamentoDto getUserDetailsByUsername(String username) {
        UserModel user = userRepository.findByUsername(username);
        if (user != null) {
            return new UserDetalhamentoDto(user.getId(), user.getUsername(), user.getEmail());
        }
        return null;
    }
    public boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated();
    }
    public UserDetalhamentoDto getAuthenticatedUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof User) {
            User user = (User) authentication.getPrincipal();
            UserModel userModel = userRepository.findByUsername(user.getUsername());
            if (userModel != null) {
                return new UserDetalhamentoDto(userModel.getId(), userModel.getUsername(), userModel.getEmail());
            }
        }
        throw new ResponseStatusException(UNAUTHORIZED, "Usuário não autenticado");
    }
}
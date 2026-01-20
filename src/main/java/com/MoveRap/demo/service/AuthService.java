package com.MoveRap.demo.service;

import com.MoveRap.demo.Dtos.UserCadastroDto;
import com.MoveRap.demo.Dtos.UserDetalhamentoDto;
import com.MoveRap.demo.model.UserModel;
import com.MoveRap.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    public UserDetalhamentoDto registerUser(UserCadastroDto userCadastroDto) {
        UserModel user = new UserModel();
        user.setUsername(userCadastroDto.getUsername());
        user.setEmail(userCadastroDto.getEmail());
        user.setPassword(passwordEncoder.encode(userCadastroDto.getPassword()));
        user = userRepository.save(user);
        return new UserDetalhamentoDto(user.getId(), user.getUsername(), user.getEmail());
    }
}
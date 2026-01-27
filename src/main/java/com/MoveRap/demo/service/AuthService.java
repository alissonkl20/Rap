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
import static org.springframework.http.HttpStatus.TOO_MANY_REQUESTS;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int LOCKOUT_DURATION_MINUTES = 15;
    private final Map<String, Integer> loginAttempts = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> lockoutTime = new ConcurrentHashMap<>();

    public UserDetalhamentoDto registerUser(UserCadastroDto userCadastroDto) {
        UserModel user = new UserModel();
        user.setUsername(userCadastroDto.getUsername());
        user.setEmail(userCadastroDto.getEmail());
        user.setPassword(passwordEncoder.encode(userCadastroDto.getPassword()));
        user = userRepository.save(user);
        return new UserDetalhamentoDto(user.getId(), user.getUsername(), user.getEmail());
    }
    public UserDetalhamentoDto authenticateUser(String emailOrUsername, String password) {
        // Remover logs de segurança que expunham dados sensíveis
        
        // Verificar se a conta está bloqueada
        if (isAccountLocked(emailOrUsername)) {
            long minutesRemaining = getMinutesUntilUnlock(emailOrUsername);
            throw new ResponseStatusException(TOO_MANY_REQUESTS, 
                "Conta temporariamente bloqueada devido a múltiplas tentativas de login falhadas. Tente novamente em " + minutesRemaining + " minuto(s).");
        }
        UserModel user = userRepository.findByEmail(emailOrUsername);
        if (user == null) {
            user = userRepository.findByUsername(emailOrUsername);
        }
        if (user != null) {
            if (passwordEncoder.matches(password, user.getPassword())) {
                // Login bem-sucedido - resetar contador de tentativas
                resetLoginAttempts(emailOrUsername);
                return new UserDetalhamentoDto(user.getId(), user.getUsername(), user.getEmail());
            } else {
                // Incrementar tentativas falhadas
                recordFailedLoginAttempt(emailOrUsername);
            }
        } else {
            // Incrementar tentativas falhadas mesmo se usuário não existir (segurança)
            recordFailedLoginAttempt(emailOrUsername);
        }
        return null;
    }
    public UserDetalhamentoDto loginUser(UserLoginDto userLoginDto) {
        return authenticateUser(userLoginDto.getEmail(), userLoginDto.getPassword());
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
    private void recordFailedLoginAttempt(String emailOrUsername) {
        int attempts = loginAttempts.getOrDefault(emailOrUsername, 0) + 1;
        loginAttempts.put(emailOrUsername, attempts);
        
        if (attempts >= MAX_LOGIN_ATTEMPTS) {
            lockoutTime.put(emailOrUsername, LocalDateTime.now());
            // Log seguro - não expõe dados completos do usuário
            System.out.println("[SECURITY] Conta bloqueada após " + attempts + " tentativas falhadas");
        }
    }
    private void resetLoginAttempts(String emailOrUsername) {
        loginAttempts.remove(emailOrUsername);
        lockoutTime.remove(emailOrUsername);
    }
    private boolean isAccountLocked(String emailOrUsername) {
        if (!lockoutTime.containsKey(emailOrUsername)) {
            return false;
        }
        LocalDateTime lockTime = lockoutTime.get(emailOrUsername);
        LocalDateTime unlockTime = lockTime.plusMinutes(LOCKOUT_DURATION_MINUTES);
        if (LocalDateTime.now().isAfter(unlockTime)) {
            resetLoginAttempts(emailOrUsername);
            return false;
        }
        return true;
    }
    private long getMinutesUntilUnlock(String emailOrUsername) {
        LocalDateTime lockTime = lockoutTime.get(emailOrUsername);
        if (lockTime == null) {
            return 0;
        }
        LocalDateTime unlockTime = lockTime.plusMinutes(LOCKOUT_DURATION_MINUTES);
        return ChronoUnit.MINUTES.between(LocalDateTime.now(), unlockTime) + 1;
    }
}
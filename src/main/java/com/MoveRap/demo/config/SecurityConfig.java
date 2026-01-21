package com.MoveRap.demo.config;

import com.MoveRap.demo.repository.UserRepository;
import com.MoveRap.demo.model.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private UserRepository userRepository;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            UserModel user = userRepository.findByEmail(username);
            if (user == null) {
                user = userRepository.findByUsername(username);
            }
            if (user == null) {
                throw new UsernameNotFoundException("Usuário não encontrado: " + username);
            }
            return User.builder()
                    .username(user.getUsername())
                    .password(user.getPassword())
                    .roles("USER")
                    .build();
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .httpBasic(httpBasic -> {}) // Habilita HTTP Basic Authentication
            .authorizeHttpRequests(auth -> auth
                    // Permitir rotas públicas
                    .requestMatchers("/", "/index", "/index.html").permitAll()
                    .requestMatchers("/auth/register", "/auth/login").permitAll()
                    .requestMatchers("/css/**", "/scripts/**", "/static/**").permitAll()
                    .requestMatchers("/favicon.ico").permitAll()
                    // User-page GET é público para visualização
                    .requestMatchers(HttpMethod.GET, "/user-page").permitAll()
                    // Endpoints de API da user-page requerem autenticação
                    .requestMatchers("/user-page/**").authenticated()
                    // Qualquer outra requisição requer autenticação
                    .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:8080"); // Spring Boot
        configuration.addAllowedOrigin("http://localhost:3000"); // Frontend local
        configuration.addAllowedOrigin("http://127.0.0.1:5500"); // Live Server
        configuration.addAllowedOrigin("http://localhost:5500"); // Live Server alternativo
        configuration.addAllowedOrigin("http://127.0.0.1:8080"); // Acesso local
        configuration.addAllowedOrigin("null"); // Arquivo local aberto diretamente
        configuration.addAllowedMethod("*"); // Permite todos os métodos
        configuration.addAllowedHeader("*"); // Permite todos os headers
        configuration.setAllowCredentials(true); // Permite credenciais
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
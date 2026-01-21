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
import org.springframework.security.config.Customizer;

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
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/auth/register", "/auth/login", "/index", "/", "/index.html", 
                                     "/static/**", "/css/**", "/scripts/**", 
                                     "/favicon.ico", "/static/css/**", "/static/scripts/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/user-page/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/**").authenticated()
                    .requestMatchers(HttpMethod.PUT, "/**").authenticated()
                    .requestMatchers(HttpMethod.DELETE, "/**").authenticated()
                    .anyRequest().authenticated()
                )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:3000"); // Frontend local
        configuration.addAllowedOrigin("http://127.0.0.1:5500"); // Live Server
        configuration.addAllowedOrigin("http://localhost:5500"); // Live Server alternativo
        configuration.addAllowedMethod("*"); // Permite todos os métodos
        configuration.addAllowedHeader("*"); // Permite todos os headers
        configuration.setAllowCredentials(true); // Permite credenciais
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
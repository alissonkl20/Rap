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
            .authorizeHttpRequests(auth -> auth
                    // Permitir rotas públicas (ordem IMPORTANTE - regras mais específicas primeiro)
                    .requestMatchers("/", "/index", "/index.html").permitAll()
                    .requestMatchers("/css/**", "/scripts/**", "/static/**").permitAll()
                    .requestMatchers("/uploads/**").permitAll() // Permitir acesso às imagens
                    .requestMatchers("/favicon.ico").permitAll()
                    // Permitir endpoints de autenticação sem autenticação prévia
                    .requestMatchers("/auth/**").permitAll()
                    // User-page GET público para visualização
                    .requestMatchers(HttpMethod.GET, "/user-page").permitAll()
                    .requestMatchers(HttpMethod.GET, "/user-page/public/**").permitAll()
                    // Endpoints de API requerem autenticação
                    .requestMatchers("/user-page/me").authenticated()
                    .requestMatchers("/api/**").authenticated()
                    // IMPORTANTE: Exigir autenticação HTTP Basic para outros métodos POST, PUT e DELETE
                    // Isso força o cliente a enviar credenciais (username:password) no header Authorization
                    .requestMatchers(HttpMethod.POST, "/**").authenticated()
                    .requestMatchers(HttpMethod.PUT, "/**").authenticated()
                    .requestMatchers(HttpMethod.DELETE, "/**").authenticated()
                    // Qualquer outra requisição requer autenticação
                    .anyRequest().authenticated()
                )
            .httpBasic(httpBasic -> httpBasic
                .realmName("MoveRap")
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
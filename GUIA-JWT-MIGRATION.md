# 🔧 GUIA RÁPIDO: Implementando JWT no MoveRap

## Por que trocar Basic Auth por JWT?

**Problema Atual:**
```javascript
// ❌ INSEGURO - Senha armazenada em localStorage
localStorage.setItem('authCredentials', btoa('email:password'));
```

**Solução JWT:**
```javascript
// ✅ SEGURO - Apenas token sem senha
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
```

---

## 📦 Passo 1: Adicionar Dependências

Edite `pom.xml`:

```xml
<dependencies>
    <!-- Dependências existentes ... -->
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

---

## 🔑 Passo 2: Criar JwtUtil

Crie `src/main/java/com/MoveRap/demo/security/JwtUtil.java`:

```java
package com.MoveRap.demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    
    @Value("${jwt.secret:MoveRapSecretKeyForJWTTokenGenerationMustBeLongEnough}")
    private String secret;
    
    @Value("${jwt.expiration:3600000}") // 1 hora em ms
    private Long expiration;
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
    
    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        
        return claims.getSubject();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

---

## 🔒 Passo 3: Criar Filtro JWT

Crie `src/main/java/com/MoveRap/demo/security/JwtAuthenticationFilter.java`:

```java
package com.MoveRap.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) 
            throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;
        
        // Extrair token do header
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = jwtUtil.getUsernameFromToken(token);
            } catch (Exception e) {
                // Token inválido
            }
        }
        
        // Validar token e autenticar
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(token)) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                    );
                
                authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

---

## ⚙️ Passo 4: Atualizar SecurityConfig

Modifique `SecurityConfig.java`:

```java
package com.MoveRap.demo.config;

import com.MoveRap.demo.security.JwtAuthenticationFilter;
// ... outros imports

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    // ... beans existentes (passwordEncoder, userDetailsService, corsConfigurationSource)
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/auth/**", "/user-page/public/**")
            )
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp
                    .policyDirectives("default-src 'self'; ...")
                )
                .xssProtection(xss -> xss.headerValue("1; mode=block"))
                .frameOptions(frame -> frame.deny())
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/index", "/index.html").permitAll()
                .requestMatchers("/css/**", "/scripts/**", "/static/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/favicon.ico").permitAll()
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/user-page/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            // Adicionar filtro JWT ANTES do UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthenticationFilter, 
                            UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

---

## 🎯 Passo 5: Atualizar AuthController

Modifique `AuthController.java`:

```java
package com.MoveRap.demo.controller;

import com.MoveRap.demo.security.JwtUtil;
// ... outros imports

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    // ... método registerUser (sem mudanças)
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody UserLoginDto userLoginDto) {
        try {
            if (userLoginDto.getEmail() == null || userLoginDto.getEmail().isEmpty() ||
                userLoginDto.getPassword() == null || userLoginDto.getPassword().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Email e senha são obrigatórios"));
            }

            UserDetalhamentoDto userDetalhamentoDto = authService.loginUser(userLoginDto);
            if (userDetalhamentoDto == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Credenciais inválidas"));
            }
            
            // ✅ NOVO: Gerar token JWT
            String token = jwtUtil.generateToken(userDetalhamentoDto.getUsername());
            
            // Retornar token + dados do usuário
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", userDetalhamentoDto);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Erro interno no servidor"));
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            UserDetalhamentoDto userDetalhamentoDto = authService.getAuthenticatedUserDetails();
            return ResponseEntity.ok(userDetalhamentoDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Usuário não autenticado"));
        }
    }
}
```

---

## 🌐 Passo 6: Atualizar Frontend (auth.js)

```javascript
// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    
    errorDiv.classList.remove('show');
    errorDiv.textContent = '';
    
    if (!email || !password) {
        errorDiv.textContent = 'Email e senha são obrigatórios';
        errorDiv.classList.add('show');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            
            // ✅ MUDANÇA: Armazenar apenas token JWT (não a senha!)
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // ❌ REMOVER: Não armazenar mais credenciais
            // localStorage.setItem('authCredentials', btoa(`${email}:${password}`));
            
            window.location.href = 'dashboard.html';
        } else {
            const data = await response.json().catch(() => ({ message: 'Erro ao fazer login' }));
            errorDiv.textContent = data.message || 'Credenciais inválidas';
            errorDiv.classList.add('show');
        }
    } catch (error) {
        errorDiv.textContent = 'Erro ao conectar com o servidor.';
        errorDiv.classList.add('show');
        console.error('Erro:', error);
    }
});

// Registro
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // ... validações ...
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            
            // ✅ MUDANÇA: Fazer login automático após registro
            const loginResponse = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                localStorage.setItem('token', loginData.token);
                localStorage.setItem('user', JSON.stringify(loginData.user));
                window.location.href = 'dashboard.html';
            }
        } else {
            // ... tratamento de erros ...
        }
    } catch (error) {
        // ... tratamento de erros ...
    }
});
```

---

## 🔄 Passo 7: Atualizar api.js

```javascript
const API_URL = 'http://localhost:8080';

/**
 * Obtém o token JWT armazenado
 */
function getAuthToken() {
    return localStorage.getItem('token');
}

/**
 * Verifica se o usuário está autenticado
 */
function isAuthenticated() {
    return !!localStorage.getItem('user') && !!getAuthToken();
}

/**
 * Realiza uma requisição autenticada à API com JWT
 */
async function authenticatedFetch(endpoint, options = {}) {
    const token = getAuthToken();
    
    // Configurações padrão
    const defaultHeaders = {
        'Content-Type': 'application/json'
    };
    
    // ✅ MUDANÇA: Usar Bearer token ao invés de Basic Auth
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    // Remove Content-Type se for FormData
    if (options.body instanceof FormData) {
        delete defaultHeaders['Content-Type'];
    }
    
    const fetchOptions = {
        ...options,
        credentials: 'include',
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };
    
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
    
    try {
        const response = await fetch(url, fetchOptions);
        
        // Se retornar 401, token expirado
        if (response.status === 401) {
            console.warn('Token expirado ou inválido');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = 'index.html';
            throw new Error('Não autorizado');
        }
        
        return response;
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}

// ... resto das funções (apiGet, apiPost, apiPut, apiDelete) permanecem iguais
```

---

## 🔧 Passo 8: Atualizar dashboard.js

```javascript
let currentUser = null;

// ✅ MUDANÇA: Verificar token ao invés de authCredentials
if (!localStorage.getItem('user') || !localStorage.getItem('token')) {
    window.location.href = 'index.html';
}

currentUser = JSON.parse(localStorage.getItem('user'));

// ❌ REMOVER esta linha:
// authCredentials = localStorage.getItem('authCredentials');

// Agora todas as requisições usam a função authenticatedFetch do api.js
// que automaticamente adiciona o Bearer token
```

---

## 🧪 Passo 9: Testar

### Teste 1: Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"12345678"}'

# Esperado:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": {"id":1,"username":"test","email":"test@test.com"}
# }
```

### Teste 2: Usar Token
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:8080/user-page/me \
  -H "Authorization: Bearer $TOKEN"

# Esperado: Dados da página do usuário
```

### Teste 3: Token Inválido
```bash
curl -X GET http://localhost:8080/user-page/me \
  -H "Authorization: Bearer invalid_token"

# Esperado: 401 Unauthorized
```

---

## ⚙️ Passo 10: Configurar application.yaml

```yaml
jwt:
  secret: ${JWT_SECRET:MoveRapSuperSecretKeyForJWTTokenGenerationMustBeAtLeast256BitsLong}
  expiration: 3600000  # 1 hora em milissegundos

spring:
  # ... resto da configuração
```

**IMPORTANTE:** Em produção, use variável de ambiente:
```bash
export JWT_SECRET="sua-chave-secreta-muito-longa-e-aleatoria"
```

---

## ✅ Checklist de Implementação

- [ ] Adicionar dependências JWT no pom.xml
- [ ] Criar JwtUtil.java
- [ ] Criar JwtAuthenticationFilter.java
- [ ] Atualizar SecurityConfig.java
- [ ] Atualizar AuthController.java (retornar token)
- [ ] Atualizar auth.js (armazenar token)
- [ ] Atualizar api.js (usar Bearer token)
- [ ] Atualizar dashboard.js (remover authCredentials)
- [ ] Adicionar configuração JWT no application.yaml
- [ ] Testar login e endpoints protegidos
- [ ] Remover todos os usos de `authCredentials`

---

## 🚀 Benefícios da Migração

**ANTES (Basic Auth + localStorage):**
```javascript
// ❌ Senha exposta
localStorage.setItem('authCredentials', btoa('email:senha123'));
// Qualquer script pode decodificar: atob('ZW1haWw6c2VuaGExMjM=')
```

**DEPOIS (JWT):**
```javascript
// ✅ Token seguro e temporário
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR...');
// Token expira em 1 hora
// Não contém senha
// Verificado criptograficamente no backend
```

**Segurança Aumentada:**
- ✅ Senhas nunca armazenadas no cliente
- ✅ Tokens expiram automaticamente
- ✅ Tokens não podem ser forjados (assinatura HMAC)
- ✅ Stateless (não depende de sessões no servidor)
- ✅ Escalável para múltiplas instâncias

---

## 📚 Referências

- [JWT.io](https://jwt.io/) - Decodificador e documentação
- [JJWT GitHub](https://github.com/jwtk/jjwt) - Biblioteca usada
- [Spring Security + JWT](https://www.baeldung.com/spring-security-jwt)
- [RFC 7519 - JWT](https://tools.ietf.org/html/rfc7519)

---

**Próximos Passos:**
1. Implementar refresh tokens (tokens de longa duração)
2. Adicionar logout no backend (blacklist de tokens)
3. Implementar "Lembrar-me" de forma segura

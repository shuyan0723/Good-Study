package com.fullstack.demo.auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * 认证服务 —— 对应 NestJS 的 AuthService
 * 包含注册和登录核心逻辑
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * 注册 —— 对应 NestJS 的 authService.register()
     */
    public User register(RegisterDto dto) {
        // 检查用户名或邮箱是否已存在
        if (userRepository.existsByUsernameOrEmail(dto.getUsername(), dto.getEmail())) {
            // 区分是用户名冲突还是邮箱冲突
            boolean usernameExists = userRepository.findByUsername(dto.getUsername()).isPresent();
            if (usernameExists) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "用户名已被使用");
            }
            throw new ResponseStatusException(HttpStatus.CONFLICT, "邮箱已被注册");
        }

        // BCrypt 加密密码（salt rounds = 10，在 SecurityConfig 中配置）
        String hashedPassword = passwordEncoder.encode(dto.getPassword());

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }

    /**
     * 登录 —— 对应 NestJS 的 authService.login()
     */
    public LoginResult login(LoginDto dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "用户名或密码错误"));

        // BCrypt 校验密码
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "用户名或密码错误");
        }

        // 生成 JWT
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());

        // 返回用户信息（剔除 password）
        SafeUser safeUser = toSafeUser(user);
        return new LoginResult(token, safeUser);
    }

    /**
     * 将 User 转换为不含 password 的安全 DTO
     */
    private SafeUser toSafeUser(User user) {
        SafeUser safe = new SafeUser();
        safe.setId(user.getId());
        safe.setUsername(user.getUsername());
        safe.setEmail(user.getEmail());
        safe.setCreatedAt(user.getCreatedAt());
        safe.setUpdatedAt(user.getUpdatedAt());
        return safe;
    }

    /**
     * 登录结果 DTO
     */
    public static class LoginResult {
        private String token;
        private SafeUser user;

        public LoginResult(String token, SafeUser user) {
            this.token = token;
            this.user = user;
        }
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public SafeUser getUser() { return user; }
        public void setUser(SafeUser user) { this.user = user; }
    }

    /**
     * 安全用户信息（不含密码）
     */
    public static class SafeUser {
        private Long id;
        private String username;
        private String email;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime updatedAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public java.time.LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
        public java.time.LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(java.time.LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    }
}

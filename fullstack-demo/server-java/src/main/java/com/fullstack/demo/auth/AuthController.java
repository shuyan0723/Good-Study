package com.fullstack.demo.auth;

import com.fullstack.demo.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 认证控制器 —— 对应 NestJS 的 AuthController
 * 路由前缀: /auth
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    /**
     * GET /auth/users —— 调试：查看所有注册用户
     * 对应 NestJS listUsers()
     */
    @GetMapping("/users")
    public ApiResponse<List<AuthService.SafeUser>> listUsers() {
        List<AuthService.SafeUser> safe = userRepository.findAll().stream()
                .map(user -> {
                    AuthService.SafeUser s = new AuthService.SafeUser();
                    s.setId(user.getId());
                    s.setUsername(user.getUsername());
                    s.setEmail(user.getEmail());
                    s.setCreatedAt(user.getCreatedAt());
                    s.setUpdatedAt(user.getUpdatedAt());
                    return s;
                })
                .collect(Collectors.toList());
        return ApiResponse.success(safe);
    }

    /**
     * POST /auth/register —— 注册
     * 对应 NestJS register()
     */
    @PostMapping("/register")
    public ApiResponse<AuthService.SafeUser> register(@Valid @RequestBody RegisterDto dto) {
        User user = authService.register(dto);
        AuthService.SafeUser safe = new AuthService.SafeUser();
        safe.setId(user.getId());
        safe.setUsername(user.getUsername());
        safe.setEmail(user.getEmail());
        safe.setCreatedAt(user.getCreatedAt());
        safe.setUpdatedAt(user.getUpdatedAt());
        return ApiResponse.success(safe, "注册成功");
    }

    /**
     * POST /auth/login —— 登录
     * 对应 NestJS login()
     */
    @PostMapping("/login")
    public ApiResponse<AuthService.LoginResult> login(@Valid @RequestBody LoginDto dto) {
        AuthService.LoginResult result = authService.login(dto);
        return ApiResponse.success(result, "登录成功");
    }
}

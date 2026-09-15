package com.fullstack.demo.common;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security 配置
 * - CORS（允许前端 localhost:5173 跨域）
 * - 密码编码器（BCrypt，对应 bcrypt npm 包）
 * - 无状态 Session（因为我们用 JWT，不依赖 Session）
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt salt rounds = 10，与 NestJS 端 bcrypt.hash(dto.password, 10) 一致
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173")); // 对应 NestJS enableCors origin
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // 关闭 CSRF（无状态 JWT 不需要）
            .csrf(csrf -> csrf.disable())
            // 无状态 Session
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // 暂时所有接口放行（认证逻辑在 Controller 里自己处理）
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());

        return http.build();
    }
}

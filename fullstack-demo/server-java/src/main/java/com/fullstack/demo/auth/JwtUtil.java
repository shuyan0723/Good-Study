package com.fullstack.demo.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT 工具类 —— 对应 NestJS 中的 JwtService
 * 负责生成和解析 JWT Token
 */
@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long expiration;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expiration
    ) {
        // jjwt 0.12.x 要求密钥至少 32 字节
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            // 补长到 32 字节
            byte[] padded = new byte[32];
            System.arraycopy(keyBytes, 0, padded, 0, Math.min(keyBytes.length, 32));
            keyBytes = padded;
        }
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        this.expiration = expiration;
    }

    /**
     * 生成 JWT Token —— 对应 jwtService.sign({ sub: user.id, username: user.username })
     */
    public String generateToken(Long userId, String username) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(String.valueOf(userId))       // sub = user.id
                .claim("username", username)            // 自定义 claim
                .issuedAt(new Date(now))
                .expiration(new Date(now + expiration)) // 7 天有效
                .signWith(secretKey)
                .compact();
    }

    /**
     * 解析 JWT Token
     */
    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

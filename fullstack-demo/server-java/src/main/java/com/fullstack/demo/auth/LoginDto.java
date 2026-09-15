package com.fullstack.demo.auth;

import jakarta.validation.constraints.NotBlank;

/**
 * 登录 DTO —— 对应 NestJS 的 LoginDto
 */
public class LoginDto {

    @NotBlank(message = "用户名不能为空")
    private String username;

    @NotBlank(message = "密码不能为空")
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

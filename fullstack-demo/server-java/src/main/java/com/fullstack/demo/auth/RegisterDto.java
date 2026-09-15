package com.fullstack.demo.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 注册 DTO —— 对应 NestJS 的 RegisterDto
 * 使用 Jakarta Bean Validation 注解替代 class-validator
 */
public class RegisterDto {

    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, message = "用户名至少 3 位")
    private String username;

    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, message = "密码至少 6 位")
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

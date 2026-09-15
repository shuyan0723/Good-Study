package com.fullstack.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spring Boot 主入口 —— 对应 NestJS 的 main.ts
 */
@SpringBootApplication
public class FullstackDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(FullstackDemoApplication.class, args);
        System.out.println("🚀 Spring Boot 后端已启动: http://localhost:3000");
    }
}

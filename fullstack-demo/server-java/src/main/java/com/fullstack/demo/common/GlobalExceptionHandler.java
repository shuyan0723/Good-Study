package com.fullstack.demo.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.util.stream.Collectors;

/**
 * 全局异常处理器 —— 对应 NestJS 的异常过滤器
 * 将所有异常转换为统一的 { code, data, message } 格式
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理业务异常（ConflictException / UnauthorizedException / NotFoundException / BadRequestException）
     * 在 Spring Boot 中统一使用 ResponseStatusException 替代
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatusException(ResponseStatusException ex) {
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());
        int code = status.value();
        // 业务层返回 4xx 时使用具体 HTTP 状态码作为业务 code
        ApiResponse<Void> body = new ApiResponse<>(code, null, ex.getReason());
        return ResponseEntity.status(status).body(body);
    }

    /**
     * 处理参数校验异常（@Valid 校验失败）
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        ApiResponse<Void> body = new ApiResponse<>(400, null, message);
        return ResponseEntity.badRequest().body(body);
    }

    /**
     * 兜底：处理所有未捕获异常（对应 Bug 模块的 crash 场景）
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception ex) {
        ApiResponse<Void> body = new ApiResponse<>(500, null, "服务器内部错误: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}

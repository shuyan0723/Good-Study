package com.fullstack.demo.common;

/**
 * 统一响应格式 —— 对应 NestJS 的 { code, data, message }
 */
public class ApiResponse<T> {

    private int code;
    private T data;
    private String message;

    public ApiResponse() {}

    public ApiResponse(int code, T data, String message) {
        this.code = code;
        this.data = data;
        this.message = message;
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(0, data, "success");
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(0, data, message);
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(code, null, message);
    }

    public int getCode() { return code; }
    public void setCode(int code) { this.code = code; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}

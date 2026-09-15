package com.fullstack.demo.bug;

import com.fullstack.demo.common.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Bug 演示控制器 —— 对应 NestJS 的 BugController
 * 用于演示各种前后端联调时可能遇到的异常场景
 * 路由前缀: /bug
 */
@RestController
@RequestMapping("/bug")
public class BugController {

    /**
     * 场景 1: 模拟慢接口（3秒后才返回）
     * 前端如果设了 timeout < 3s，就会报超时错误
     */
    @GetMapping("/timeout")
    public ApiResponse<String> slowApi() throws InterruptedException {
        Thread.sleep(3000); // 对应 NestJS setTimeout(resolve, 3000)
        return ApiResponse.success("终于返回了...");
    }

    /**
     * 场景 2: 故意 crash（未捕获异常）
     * 会返回 500 Internal Server Error，由 GlobalExceptionHandler 兜底
     */
    @GetMapping("/crash")
    public ApiResponse<Void> crashApi() {
        throw new RuntimeException("💥 后端崩了！这是故意制造的错误");
    }

    /**
     * 场景 3: 返回数据格式和前端期望不一致
     * 前端期望 { code: 0, data, message }，这里没按格式来
     * 注意：这里故意不用 ApiResponse，保持原始 JSON 返回
     */
    @GetMapping("/format")
    public Map<String, Object> wrongFormat() {
        // 对应 NestJS 返回 { success: true, items: [1,2,3] }
        return Map.of("success", true, "items", new int[]{1, 2, 3});
    }

    /**
     * 场景 4: 演示状态码 401（未授权）
     * 前端没带 token 访问，后端返回 401
     */
    @GetMapping("/unauthorized")
    public ApiResponse<Object> noAuth(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || token.isEmpty()) {
            return new ApiResponse<>(401, null, "未授权访问，请先登录");
        }
        return ApiResponse.success(Map.of("user", "张三"));
    }
}

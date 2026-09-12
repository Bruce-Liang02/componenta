package com.componenta.auth.controller;

import cn.dev33.stp.StpUtil;
import com.componenta.common.response.R;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    /**
     * 登录
     */
    @PostMapping("/login")
    public R<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        // Phase 0: mock 登录
        if (!"admin".equals(request.getUsername()) || !"admin123".equals(request.getPassword())) {
            return R.fail(401, "用户名或密码错误");
        }

        // Sa-Token 登录
        StpUtil.login(1);

        Map<String, Object> data = new HashMap<>();
        data.put("token", StpUtil.getTokenValue());
        data.put("userId", 1);
        data.put("username", "admin");
        data.put("nickname", "管理员");
        data.put("roles", new String[]{"admin"});

        return R.ok(data);
    }

    /**
     * 登出
     */
    @PostMapping("/logout")
    public R<Void> logout() {
        StpUtil.logout();
        return R.ok();
    }

    /**
     * 获取当前用户信息
     */
    @GetMapping("/current")
    public R<Map<String, Object>> currentUser() {
        if (!StpUtil.isLogin()) {
            return R.fail(401, "未登录");
        }
        Map<String, Object> data = new HashMap<>();
        data.put("userId", StpUtil.getLoginIdAsLong());
        data.put("username", "admin");
        data.put("nickname", "管理员");
        data.put("roles", new String[]{"admin"});
        return R.ok(data);
    }

    @Data
    public static class LoginRequest {
        @NotBlank(message = "用户名不能为空")
        private String username;
        @NotBlank(message = "密码不能为空")
        private String password;
    }
}

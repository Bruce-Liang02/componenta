package com.componenta.system.controller;

import com.componenta.common.response.R;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 用户管理控制器（Phase 0 占位）
 */
@RestController
@RequestMapping("/api/system/users")
public class UserController {

    @GetMapping("/me")
    public R<Map<String, Object>> me() {
        Map<String, Object> user = new HashMap<>();
        user.put("id", 1);
        user.put("username", "admin");
        user.put("nickname", "管理员");
        user.put("email", "admin@componenta.com");
        user.put("roles", new String[]{"admin"});
        return R.ok(user);
    }
}

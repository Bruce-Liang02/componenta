package com.componenta.admin.controller;

import com.componenta.common.response.R;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 主题管理控制器
 */
@RestController
@RequestMapping("/api/admin/themes")
public class ThemeController {

    /**
     * 获取可用主题包列表
     */
    @GetMapping
    public R<List<Map<String, Object>>> listThemes() {
        List<Map<String, Object>> themes = new ArrayList<>();

        themes.add(buildTheme("default-light", "默认亮色",
                "基于 Ant Design 默认风格，清爽明亮",
                "#1677ff", 6, 14, "dashboard"));

        themes.add(buildTheme("business-blue", "商务蓝",
                "深蓝色主色，稳重商务风格",
                "#0052d9", 4, 14, "dashboard"));

        themes.add(buildTheme("default-dark", "默认暗色",
                "暗色模式，适合夜间使用",
                "#1668dc", 6, 14, "dashboard"));

        themes.add(buildTheme("compact-tech", "紧凑科技风",
                "紧凑排版，科技感配色",
                "#722ed1", 8, 12, "dashboard"));

        return R.ok(themes);
    }

    /**
     * 保存用户主题偏好
     */
    @PutMapping("/users/{userId}/preference")
    public R<Void> saveUserTheme(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {
        String themeName = body.get("themeName");
        if (themeName == null || themeName.isEmpty()) {
            return R.fail(400, "主题名不能为空");
        }
        // Phase 0: 仅记录日志，未来持久化到数据库
        return R.ok("主题偏好已保存", null);
    }

    private Map<String, Object> buildTheme(String name, String displayName, String description,
                                           String colorPrimary, int borderRadius, int fontSize,
                                           String layoutTemplate) {
        Map<String, Object> theme = new HashMap<>();
        theme.put("name", name);
        theme.put("displayName", displayName);
        theme.put("description", description);
        theme.put("version", "1.0.0");

        Map<String, Object> tokens = new HashMap<>();
        tokens.put("colorPrimary", colorPrimary);
        tokens.put("borderRadius", borderRadius);
        tokens.put("fontSize", fontSize);
        theme.put("tokens", tokens);

        theme.put("layoutTemplate", layoutTemplate);
        return theme;
    }
}

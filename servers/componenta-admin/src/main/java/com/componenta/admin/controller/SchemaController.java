package com.componenta.admin.controller;

import com.componenta.common.response.R;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Schema 管理控制器
 *
 * Phase 0: 返回静态 Schema，未来持久化到数据库。
 */
@RestController
@RequestMapping("/api/admin/schemas")
public class SchemaController {

    /**
     * 获取指定页面的 Schema
     */
    @GetMapping("/{pageId}")
    public R<Map<String, Object>> getSchema(@PathVariable String pageId) {
        Map<String, Object> schema = getDemoSchema(pageId);
        if (schema == null) {
            return R.fail(404, "Schema not found: " + pageId);
        }
        return R.ok(schema);
    }

    /**
     * 列出所有可用页面 Schema
     */
    @GetMapping
    public R<List<Map<String, Object>>> listSchemas() {
        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("id", "dashboard");
        dashboard.put("title", "仪表盘");
        dashboard.put("version", "0.1");
        list.add(dashboard);

        Map<String, Object> showcase = new HashMap<>();
        showcase.put("id", "component-showcase");
        showcase.put("title", "组件展示");
        showcase.put("version", "0.1");
        list.add(showcase);

        return R.ok(list);
    }

    private Map<String, Object> getDemoSchema(String pageId) {
        if ("dashboard".equals(pageId)) {
            return buildDashboardSchema();
        }
        if ("component-showcase".equals(pageId)) {
            return buildShowcaseSchema();
        }
        return null;
    }

    private Map<String, Object> buildDashboardSchema() {
        Map<String, Object> schema = new HashMap<>();
        schema.put("id", "dashboard");
        schema.put("version", "0.1");
        schema.put("title", "仪表盘");

        Map<String, Object> layout = new HashMap<>();
        layout.put("type", "dashboard");

        List<Map<String, Object>> regions = new ArrayList<>();

        // 统计卡片区
        Map<String, Object> statsRegion = new HashMap<>();
        statsRegion.put("name", "stats");
        List<Map<String, Object>> statBlocks = new ArrayList<>();
        statBlocks.add(buildCardBlock("stat-orders", "今日订单", 1234));
        statBlocks.add(buildCardBlock("stat-revenue", "今日营收", "¥23,456"));
        statBlocks.add(buildCardBlock("stat-users", "活跃用户", 892));
        statBlocks.add(buildCardBlock("stat-conversion", "转化率", "65.4%"));
        statsRegion.put("blocks", statBlocks);
        regions.add(statsRegion);

        layout.put("regions", regions);
        schema.put("layout", layout);
        return schema;
    }

    private Map<String, Object> buildShowcaseSchema() {
        Map<String, Object> schema = new HashMap<>();
        schema.put("id", "component-showcase");
        schema.put("version", "0.1");
        schema.put("title", "组件展示");

        Map<String, Object> layout = new HashMap<>();
        layout.put("type", "blank");

        List<Map<String, Object>> regions = new ArrayList<>();
        Map<String, Object> mainRegion = new HashMap<>();
        mainRegion.put("name", "main");
        List<Map<String, Object>> blocks = new ArrayList<>();

        Map<String, Object> cardBlock = new HashMap<>();
        cardBlock.put("id", "demo-card");
        cardBlock.put("componentType", "Card");
        Map<String, Object> cardProps = new HashMap<>();
        cardProps.put("title", "演示卡片");
        cardProps.put("children", "这是卡片内容");
        cardBlock.put("props", cardProps);
        blocks.add(cardBlock);

        mainRegion.put("blocks", blocks);
        regions.add(mainRegion);

        layout.put("regions", regions);
        schema.put("layout", layout);
        return schema;
    }

    private Map<String, Object> buildCardBlock(String id, String title, Object value) {
        Map<String, Object> block = new HashMap<>();
        block.put("id", id);
        block.put("componentType", "Card");

        Map<String, Object> props = new HashMap<>();
        Map<String, Object> statistic = new HashMap<>();
        statistic.put("title", title);
        statistic.put("value", value);
        props.put("statistic", statistic);
        block.put("props", props);
        return block;
    }
}

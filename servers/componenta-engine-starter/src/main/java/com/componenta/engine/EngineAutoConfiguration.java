package com.componenta.engine;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

/**
 * 引擎自动配置入口
 *
 * 未来的流程引擎、表单引擎、AI 服务等通过此模块接入。
 */
@AutoConfiguration
@ComponentScan(basePackages = "com.componenta.engine")
public class EngineAutoConfiguration {
}

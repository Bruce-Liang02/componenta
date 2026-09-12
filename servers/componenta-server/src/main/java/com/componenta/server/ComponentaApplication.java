package com.componenta.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * Componenta 主启动类
 */
@SpringBootApplication
@ComponentScan(basePackages = "com.componenta")
public class ComponentaApplication {

    public static void main(String[] args) {
        SpringApplication.run(ComponentaApplication.class, args);
    }
}

package com.componenta.server.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI 配置
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("componenta")
                .pathsToMatch("/api/**")
                .build();
    }

    @Bean
    public OpenAPI componentaOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Componenta API")
                        .description("组件塔 - B 端业务管理平台 API")
                        .version("0.1.0")
                        .contact(new Contact()
                                .name("Componenta Team")
                                .email("dev@componenta.com")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer"))
                .schemaRequirement("Bearer", new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT"));
    }
}

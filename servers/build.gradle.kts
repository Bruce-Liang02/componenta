import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    java
    id("org.springframework.boot") version "3.2.1" apply false
    id("io.spring.dependency-management") version "1.1.4" apply false
}

// 统一版本
val springBootVersion = "3.2.1"
val saTokenVersion = "1.37.0"
val hutoolVersion = "5.8.25"
val mybatisPlusVersion = "3.5.5"
val swaggerVersion = "2.3.0"
val lombokVersion = "1.18.30"

// 全局配置
allprojects {
    group = "com.componenta"
    version = "0.1.0"

    repositories {
        mavenLocal()
        maven { url = uri("https://maven.aliyun.com/repository/public") }
        maven { url = uri("https://maven.aliyun.com/repository/spring") }
        mavenCentral()
    }
}

// 子模块通用配置
subprojects {
    apply(plugin = "java")
    apply(plugin = "io.spring.dependency-management")

    java {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    the<io.spring.gradle.dependencymanagement.dsl.DependencyManagementExtension>().apply {
        imports {
            mavenBom("org.springframework.boot:spring-boot-dependencies:$springBootVersion")
        }
        dependencies {
            // Sa-Token
            dependency("cn.dev33:sa-token-spring-boot3-starter:$saTokenVersion")
            dependency("cn.dev33:sa-token-redis-jackson:$saTokenVersion")
            // Hutool
            dependency("cn.hutool:hutool-all:$hutoolVersion")
            // MyBatis Plus
            dependency("com.baomidou:mybatis-plus-spring-boot3-starter:$mybatisPlusVersion")
            // Swagger / OpenAPI
            dependency("org.springdoc:springdoc-openapi-starter-webmvc-ui:$swaggerVersion")
            // Lombok
            dependency("org.projectlombok:lombok:$lombokVersion")
        }
    }

    dependencies {
        // 所有子模块默认带 Lombok
        "compileOnly"("org.projectlombok:lombok")
        "annotationProcessor"("org.projectlombok:lombok")
        "testCompileOnly"("org.projectlombok:lombok")
        "testAnnotationProcessor"("org.projectlombok:lombok")

        // 日志（Slf4j + Logback 由 spring-boot-starter 提供）
        "implementation"("org.slf4j:slf4j-api")
    }

    tasks.withType<JavaCompile> {
        options.encoding = "UTF-8"
        options.compilerArgs.addAll(listOf("-parameters"))
    }

    tasks.withType<Test> {
        useJUnitPlatform()
    }
}

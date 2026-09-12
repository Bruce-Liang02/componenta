plugins {
    `java-library`
}

description = "Componenta 配置管理模块（主题/组件注册/Schema 存储）"

dependencies {
    api(project(":componenta-common"))
    api(project(":componenta-auth"))

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

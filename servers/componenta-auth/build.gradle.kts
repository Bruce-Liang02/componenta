plugins {
    `java-library`
}

description = "Componenta 认证授权模块"

dependencies {
    api(project(":componenta-common"))

    // Sa-Token
    api("cn.dev33:sa-token-spring-boot3-starter")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

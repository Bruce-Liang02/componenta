plugins {
    id("org.springframework.boot")
}

description = "Componenta 主启动模块"

dependencies {
    implementation(project(":componenta-common"))
    implementation(project(":componenta-auth"))
    implementation(project(":componenta-system"))
    implementation(project(":componenta-admin"))
    implementation(project(":componenta-engine-starter"))

    // Spring Boot starters
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    // OpenAPI / Swagger
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

// 打包可执行 jar
tasks.named<org.springframework.boot.gradle.tasks.bundling.BootJar>("bootJar") {
    archiveBaseName.set("componenta-server")
    archiveClassifier.set("")
    mainClass.set("com.componenta.server.ComponentaApplication")
}

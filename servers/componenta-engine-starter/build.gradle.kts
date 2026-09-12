plugins {
    `java-library`
}

description = "Componenta 引擎接入 Starter（预留，供流程/表单/AI 等引擎接入）"

dependencies {
    api(project(":componenta-common"))

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

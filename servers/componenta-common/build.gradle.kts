plugins {
    `java-library`
}

description = "Componenta 通用工具模块"

dependencies {
    api("org.springframework.boot:spring-boot-starter-web")
    api("org.springframework.boot:spring-boot-starter-validation")
    api("cn.hutool:hutool-all")

    // Jackson 扩展
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")

    // 工具
    implementation("org.apache.commons:commons-lang3:3.14.0")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

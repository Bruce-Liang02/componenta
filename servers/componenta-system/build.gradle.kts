plugins {
    `java-library`
}

description = "Componenta 系统管理模块（用户/组织/菜单/字典）"

dependencies {
    api(project(":componenta-common"))
    api(project(":componenta-auth"))

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

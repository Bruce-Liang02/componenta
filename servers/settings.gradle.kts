rootProject.name = "componenta"

// 子模块
include(":componenta-common")
include(":componenta-auth")
include(":componenta-system")
include(":componenta-admin")
include(":componenta-engine-starter")
include(":componenta-server")

// 每个子模块的项目目录
project(":componenta-common").projectDir = file("componenta-common")
project(":componenta-auth").projectDir = file("componenta-auth")
project(":componenta-system").projectDir = file("componenta-system")
project(":componenta-admin").projectDir = file("componenta-admin")
project(":componenta-engine-starter").projectDir = file("componenta-engine-starter")
project(":componenta-server").projectDir = file("componenta-server")

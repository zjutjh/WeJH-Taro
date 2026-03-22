# WeJH-Taro — AGENTS.md

微精弘（WeJH）是面向浙江工业大学学生的一站式校园移动门户微信小程序，使用 [Taro](https://docs.taro.zone/docs) + Vue 3 开发，编译目标为微信小程序（weapp）。

---

## 项目概览

| 属性 | 值 |
|------|-----|
| 框架 | Taro 4.x + Vue 3 (Composition API) |
| 语言 | TypeScript + SCSS |
| 包管理 | pnpm（具体版本参照 package.json 中写的）|
| 编译目标 | 微信小程序（weapp） |
| 状态管理 | 新页面推荐 Pinia，存量页面还使用着 Vuex 4（`src/store/`）待迁移 |
| 数据请求 | `@tanstack/vue-query`（在 `src/api/` 注册新服务） / 旧版服务（`src/services/`） |
| 样式规范 | 业务组件使用 SCSS Modules（`*.module.scss`）,通用组件使用 scss + BEM 命名法； 存量页面还使用 scss，待迁移 |

---

## 环境准备

1. 复制环境变量模板并按实际情况填写：
   ```bash
   cp .env.sample .env
   ```

2. 安装依赖（会自动执行 `simple-git-hooks` 配置）：
   ```bash
   pnpm install
   ```

---

## 常用命令

| 用途 | 命令 |
|------|------|
| 开发（监听模式） | `pnpm dev` |
| 构建测试包 | `pnpm build:test` |
| 构建生产包 | `pnpm build:prod` |
| Lint 检查 | `pnpm lint` |
| 类型检查 | `pnpm typecheck` |

> 编译产物输出到 `dist/`，使用微信开发者工具打开该目录进行预览与调试。

---

## 目录结构

```
src/
├── api/            # 新版 API 服务（class 风格，代表接口文档的内容）
├── components/     # 全局共享组件
├── constants/      # 常量（如文案 copywriting、枚举）
├── hooks/          # 可复用 Composable
├── pages/          # 页面（每个页面一个目录）
│   └── <page-name>/
│       ├── index.vue           # 页面入口
│       ├── index.module.scss   # 页面样式（SCSS Modules）
│       ├── index.config.ts     # 小程序页面元信息配置
│       ├── _composables/       # 页面私有业务 Composable
│       └── _components/        # 页面私有业务组件
├── plugins/        # Taro 插件 / 运行时插件
├── services/       # 旧版服务层（逐步迁移至 src/api/）
├── store/          # Vuex store（system / service 模块）
├── style/          # 全局样式 token
├── types/          # 全局 TypeScript 类型声明（*.d.ts）
└── utils/          # 全局共享工具函数
```

---

## 代码规范

### 通用原则

- 使用 **Composition API + `<script setup lang="ts">`**，不使用 Options API。
- 新文件名统一使用 **kebab-case**，部分存量文件还使用了 PascalCase 待迁移。
- 页面私有的模块（如组件、业务逻辑、工具函数），都放在页面目录下。

### 样式

- 新页面、新组件统一使用 **SCSS Modules**，拆分出 `index.module.scss` 编写，避免写在 vue 文件中。
- 颜色等设计 token 以 CSS 变量形式定义，遵循 `--wjh-` 前缀命名（如 `--wjh-color-primary-dark`）。
- 避免在模板中写内联 `style`（仅动态条件色彩等极少数场景可使用）。
- 避免定义和消费 scss 变量。

### 数据请求与状态

- **新页面** 优先使用 `src/api/` 下的服务类，通过 `useQuery` / `useMutation` 管理请求状态。
- 旧页面使用 `ZFService` / `UserService` 等（`src/services/`），后续逐步迁移。
- 全局状态：目前全局状态还依赖 Vuex，包含 `systemStore`（系统信息）和 `serviceStore`（服务相关），通过 `src/store/index.ts` 导入。

---

## Lint 规则要点

配置文件：`eslint.config.mjs`，使用 `@zjutjh/eslint-config` 作为基础配置。

- 每次提交前会通过 `lint-staged` 自动校验变更文件。
- Agent 每次完成任务后，需要执行一遍 Lint 和 typecheck 查看并修复问题。

---

## 新增页面指南

1. 在 `src/pages/<page-name>/` 下创建：
   - `index.vue`（页面组件）
   - `index.module.scss`（SCSS Modules 样式）
   - `index.config.ts`（小程序页面元信息配置）
2. 在 `src/app.config.ts` 的 `pages` 数组中注册页面路径。

---

## 新增全局组件指南

1. 在 `src/components/<component-name>/` 下创建 `index.vue`（及子文件）。
2. 在 `src/components/index.ts` 中导出该组件。
3. 组件名以 `W` 前缀开头（如 `WModal`、`WCollapse`）表示项目内部组件，以区分 Taro 内置组件。

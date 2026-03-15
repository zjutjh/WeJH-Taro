# WeJH-Taro — AGENTS.md

微精弘（WeJH）是面向浙江工业大学学生的一站式校园移动门户微信小程序，使用 [Taro](https://taro.zone/) + Vue 3 开发，编译目标为微信小程序（weapp）。

---

## 项目概览

| 属性 | 值 |
|------|-----|
| 框架 | Taro 4.x + Vue 3 (Composition API) |
| 语言 | TypeScript + SCSS |
| 包管理 | pnpm（需 Node ≥ 20.19.0，pnpm 10.x） |
| 编译目标 | 微信小程序（weapp） |
| 状态管理 | Vuex 4（`src/store/`）；新页面推荐 Pinia |
| 数据请求 | `@tanstack/vue-query`（`src/api/`，新服务） / 旧版服务（`src/services/`） |
| 样式规范 | SCSS Modules（`*.module.scss`）；新页面使用 Module 方式 |

---

## 环境准备

1. 复制环境变量模板并按实际情况填写：
   ```bash
   cp .env.sample .env
   ```
   关键变量：
   - `VITE_HOST` — 后端 API 基础地址
   - `TARO_APP_ID` — 微信小程序 AppID

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
├── api/            # 新版 API 服务（基于 vue-query，class 风格）
├── components/     # 全局共享组件（PascalCase 命名）
├── constants/      # 常量（如文案 copywriting、枚举）
├── hooks/          # 可复用 Composable
├── pages/          # 页面（每个页面一个目录）
│   └── <page>/
│       ├── index.vue           # 页面入口
│       ├── index.module.scss   # 样式（SCSS Modules）
│       └── _components/        # 页面私有子组件
├── plugins/        # Taro 插件 / 运行时插件
├── services/       # 旧版服务层（逐步迁移至 src/api/）
├── store/          # Vuex store（system / service 模块）
├── style/          # 全局样式 token、混入
├── types/          # 全局 TypeScript 类型声明（*.d.ts）
└── utils/          # 工具函数
```

---

## 代码规范

### 通用原则

- 使用 **Composition API + `<script setup lang="ts">`**，不使用 Options API。
- 组件文件名使用 **PascalCase**（全局组件目录 `src/components/<ComponentName>/index.vue`）。
- 页面私有子组件放在页面目录下的 `_components/` 子目录中。
- 文件名使用 **kebab-case**（ESLint `unicorn/filename-case` 规则会检查）。
- 所有导出需从对应模块的 `index.ts` 统一导出，不要在页面中直接引入深层路径。

### 样式

- 新页面、新组件统一使用 **SCSS Modules**（`<style module lang="scss">`），在模板中通过 `$style.className` 引用。
- 颜色、间距等设计 token 以 CSS 变量形式定义，遵循 `--wjh-` 前缀命名（如 `--wjh-color-primary-dark`）。
- 避免在模板中写内联 `style`（仅动态条件色彩等极少数场景可使用）。

### 数据请求与状态

- **新页面** 优先使用 `src/api/` 下的服务类（基于 `vue-query`），通过 `useQuery` / `useMutation` 管理请求状态。
- 旧页面使用 `ZFService` / `UserService` 等（`src/services/`），后续逐步迁移。
- 全局状态：`systemStore`（系统信息）和 `serviceStore`（服务相关），通过 `src/store/index.ts` 导入。

### TypeScript

- 严格模式（`tsconfig.json` 已开启）；禁止使用 `any`，必要时用 `unknown`。
- 未使用变量统一以 `_` 前缀标识（`_unused`），ESLint 会忽略带该前缀的未使用变量。

---

## Lint 规则要点

配置文件：`eslint.config.mjs`，使用 `@zjutjh/eslint-config` 作为基础配置。

- **文件名** 需符合 `unicorn/filename-case`（kebab-case）。
- **未使用变量** 错误级别为 `error`；以 `_` 开头的参数/变量为豁免。
- SCSS 格式化由 Prettier 处理（CSS 格式化被禁用，仅 SCSS 生效）。
- 每次提交前会通过 `lint-staged` 自动校验变更文件。

在提交代码前，请手动运行：
```bash
pnpm lint
pnpm typecheck
```

---

## 新增页面指南

1. 在 `src/pages/<page-name>/` 下创建：
   - `index.vue`（页面组件）
   - `index.module.scss`（SCSS Modules 样式）
2. 在 `src/app.config.ts` 的 `pages` 数组中注册页面路径。
3. 如有私有子组件，放在 `src/pages/<page-name>/_components/` 中。
4. API 调用优先在 `src/api/services/` 下新建服务类，通过 `vue-query` 暴露。

---

## 新增全局组件指南

1. 在 `src/components/<ComponentName>/` 下创建 `index.vue`（及子文件）。
2. 在 `src/components/index.ts` 中导出该组件。
3. 组件名以 `W` 前缀开头（如 `WModal`、`WCollapse`）表示项目内部组件，以区分 Taro 内置组件。

---

## CI / PR 规范

- 查看 CI 流程：`.github/workflows/`
- PR 标题格式：`<scope>: <简短描述>`（例：`feat(exam): 支持按学期筛选`）
- 提交前确保 `pnpm lint` 和 `pnpm typecheck` 均无报错。
- 不要在 PR 中提交 `dist/` 或 `.env`（已在 `.gitignore` 中）。

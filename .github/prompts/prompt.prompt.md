---
agent: agent
---
# WeJH-Taro AI 编码指南

微精弘小程序 - 为浙江工业大学学生提供课表、成绩、考试、图书馆、一卡通等校园服务的一站式移动门户。

## 核心架构

### 技术栈
- **框架**: Taro 3.7+ + Vue 3 (Composition API)
- **状态管理**: Vuex (持久化) + Pinia + TanStack Query
- **构建**: Vite + TypeScript
- **样式**: SCSS + CSS Modules
- **包管理**: pnpm@10.20.0 (Node.js >= 20.19.0)

### 项目结构
```
src/
  ├── api/           # API 类定义（BaseService 派生类）
  ├── services/      # 服务实例和请求配置（实例化 API 类）
  ├── pages/         # 页面组件
  ├── components/    # 可复用组件
  ├── store/         # Vuex 状态管理
  ├── hooks/         # 组合式函数
  └── utils/         # 工具函数
```

## 开发规范

### 1. API 服务设计模式
**三层架构**：API 类定义 → 服务实例化 → 页面使用

```typescript
// 1. 在 src/api/services/yxy.ts 定义 API 类
class YxyService<TOptions> extends BaseService<TOptions> {
  QueryBalance(req: Request, options?: TOptions): Promise<Response> {
    return this.request(
      { url: this.genBaseURL("/api/func/electricity/balance"), method: "GET", data: req },
      options
    );
  }
}

// 2. 在 src/services/index.ts 实例化服务
export const yxyServiceNext = new YxyServiceNext<RequestCustomOptions>({
  request: requestNext,  // 统一请求函数（自动处理认证、错误）
  baseURL: import.meta.env.VITE_HOST
});

// 3. 在页面中使用 TanStack Query
const { data } = useQuery({
  queryKey: [QUERY_KEY.ELECTRICITY_BALANCE],
  queryFn: () => yxyServiceNext.QueryBalance({})
});
```

### 2. 数据获取策略
**现代方式**（推荐）：使用 TanStack Query
- 在 [src/services/api/query-key.ts](src/services/api/query-key.ts) 中定义 `QUERY_KEY` 常量
- 使用 `useQuery`（单次查询）或 `useInfiniteQuery`（分页）
- 配置见 [src/utils/vue-query.ts](src/utils/vue-query.ts)：
  - 默认 staleTime: 30 秒
  - 持久化 1 天（localStorage）
  - 自动重试 2 次
  - 失败时显示 Toast

```typescript
// 分页示例（参考 src/pages/school-bus/announce/index.vue）
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: [QUERY_KEY.SCHOOL_BUS_ANNOUNCE] as const,
  queryFn: ({ pageParam }) => yxyServiceNext.QueryBusAnnounce({ page: pageParam.toString() }),
  initialPageParam: 1,
  getNextPageParam: (lastPage, pages) => {
    return lastPage.list.length === 0 ? undefined : pages.length + 1;
  }
});
```

**传统方式**：`useRequest` hook（见 [src/hooks/useRequest.ts](src/hooks/useRequest.ts)），仅用于不需要缓存的简单场景

### 3. 样式约定
**CSS Modules 模式**（强制）：
```vue
<template>
  <view :class="styles['announce-list']">
    <view :class="styles['card-title']">内容</view>
  </view>
</template>

<script setup>
import styles from './index.module.scss';
</script>
```

- **文件名**: `index.module.scss`（必须包含 `.module`）
- **类名引用**: `styles['class-name']`（kebab-case）
- **全局变量**: [src/style/variables/](src/style/variables/) 定义主题色、间距等
- **暗黑模式**: [src/style/darkmode/](src/style/darkmode/) 管理（自动切换）

### 4. 路由和页面规范
- **路由注册**: 在 [src/app.config.ts](src/app.config.ts) 的 `pages` 数组中添加
- **自定义导航栏**: 所有页面必须包含 `<theme-config>` 和 `<title-bar>`
- **页面模板**:
```vue
<template>
  <theme-config>
    <title-bar title="页面标题" :back-button="true" />
    <scroll-view :scroll-y="true">
      <!-- 页面内容 -->
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import { ThemeConfig, TitleBar } from '@/components';
import styles from './index.module.scss';
</script>
```

### 5. 认证和请求流程
**自动认证机制**（见 [src/utils/request-next.ts](src/utils/request-next.ts)）：
- 所有请求默认携带 Cookie（`auth: true`）
- Cookie 通过 `refreshCookie()` 自动获取（微信登录 `Taro.login()`）
- Cookie 过期时自动刷新并重试请求
- Cookie 存储在 TanStack Query 缓存中（queryKey: `QUERY_KEY.USER_COOKIE`）

**请求函数**: `requestNext()` 统一处理：
- 参数拼接（GET 请求 query 参数）
- 错误处理（网络错误、业务错误）
- 响应解析（自动提取 `data` 字段）

### 6. 类型定义规范
- **API 类型**: `src/api/types/*.ts`（如 `YxyAPI.QueryBalanceRequest`）
- **业务类型**: `src/types/*.ts`（如 `Lesson.ts`、`Score.ts`）
- **命名转换**: 使用 `Camelize` 工具类型将后端 `snake_case` 转为前端 `camelCase`

### 7. 组件和工具导入
**统一导出**（避免路径嵌套）：
```typescript
// 组件
import { TitleBar, ThemeConfig, WButton } from '@/components';

// 工具函数
import { checkBind, formatTime } from '@/utils';

// 服务
import { yxyServiceNext, zfServiceNext } from '@/services';
```

## 开发工作流

### 构建命令
```bash
pnpm dev          # 开发模式（自动重编译）
pnpm build:test   # 测试环境构建（VITE_BUILD_ENV=test）
pnpm build:prod   # 生产环境构建（VITE_BUILD_ENV=production）
```

### 环境配置
- **配置文件**: [config/index.ts](config/index.ts)、[config/dev.ts](config/dev.ts)、[config/prod.ts](config/prod.ts)
- **环境变量**: `VITE_BUILD_ENV`（development/test/production）
- **API 地址**: `import.meta.env.VITE_HOST`

### 代码质量
- **Lint**: `pnpm lint`（基于 `@zjutjh/eslint-config`）
- **Git Hooks**: `simple-git-hooks` + `lint-staged`（提交前自动 lint）
- **命名约定**:
  - 文件名: kebab-case（如 `bus-announce-card.vue`）
  - 组件名: PascalCase（如 `BusAnnounceCard`）
  - 类名: kebab-case（如 `announce-list`）

## 常见任务

### 添加新页面
1. 创建 `src/pages/your-page/index.vue` 和 `index.module.scss`
2. 在 [src/app.config.ts](src/app.config.ts) 的 `pages` 数组中注册：
   ```typescript
   pages: ["pages/your-page/index"]
   ```
3. 使用页面模板（包含 `<theme-config>` 和 `<title-bar>`）

### 添加新 API
1. 在 `src/api/types/yxy.ts` 定义请求/响应类型
2. 在 `src/api/services/yxy.ts` 添加方法（继承 `BaseService`）
3. 在 `src/services/index.ts` 中服务实例已存在，直接调用
4. 在 `src/services/api/query-key.ts` 添加查询键
5. 页面中使用 `useQuery` 调用

### 调试技巧
- **开发者工具**: 微信开发者工具（推荐最新版）
- **日志**: 使用 `console.log`（会在开发者工具控制台显示）
- **网络请求**: 在 Network 面板查看请求/响应
- **状态查看**: 安装 Vue Devtools（需要特殊配置）

## 注意事项
- 所有路径使用 `@/` 别名（指向 `src/`）
- Taro API 从 `@tarojs/taro` 导入（如 `Taro.showToast`）
- 不要直接修改 Vuex store，使用 TanStack Query 管理服务端数据
- 暗黑模式自动生效，无需手动处理（依赖 `theme.json` 配置）
- POST 请求使用 `data` 字段，GET 请求使用 `params` 字段（`requestNext` 会自动处理）

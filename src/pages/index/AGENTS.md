# 首页测试用例

> 本文件是本页面的测试用例文档，同时为在本目录工作的 Agent 提供页面级约束。

## 课表速览

### LT-HOME-01 首页速览在 22:00 边界保持初始化时的今日/明日状态

- 优先级：P1
- 执行方式：可 mock；发布前在真实时点抽查
- 前置条件：今天和明天有不同课程，且明天为周一时另准备下一周周次数据。
- 操作步骤：让首页停留并跨过 22:00；不切换页面，观察标题、课程和周次；再重新进入首页对照。
- 预期结果：停留跨过 22:00 后仍保持页面初始化时的今日/明日状态；重新进入首页后按新时点重新计算，22:00 后展示明日课程，周日夜间查询周一及下一周课程。
- 关联代码：`src/components/Home/components/lessons-table-quick-view/index.vue` → `tenPM`、`showTomorrow`、`lessonTable`
- 已知风险：`showTomorrow` 在 setup 时计算一次，页面停留跨过 22:00 不会自动切换，停留结果与重新进入后的结果可能不一致。

### LT-HOME-02 首页上课状态在 5 秒轮询内切换

- 优先级：P2
- 执行方式：可 mock
- 前置条件：准备一门即将开始和结束的课程，并控制设备时间靠近边界。
- 操作步骤：停留首页跨过上课和下课瞬间，观察“还有 N 分钟上课”“上课中”和文案消失的时间。
- 预期结果：每次状态在最多 5 秒内切换；剩余时间不出现负数、空字符串或跳回；课后不再显示上课状态。
- 关联代码：`src/components/Home/components/lessons-table-quick-view/index.vue` → `useIntervalFn`、`lessonState`、`getRestTimeString`

## 跨页面课表场景

首页课表速览与课表主页共享查询键、缓存和周次过滤逻辑。共享数据用例由[课表页面测试文档](../lessonstable/AGENTS.md)维护，首页不复制其步骤和预期。

### HOME-LT-REF-01 执行课表数据所有者的首页回归用例

- 优先级：P1
- 执行方式：可 mock；时间边界按被引用用例执行
- 前置条件：首页已启用课表速览卡片，并具备正方账号和可控课表响应。
- 操作步骤：执行课表文档中的 `LT-CACHE-01` 和 `LT-NET-01`。
- 预期结果：所有被引用用例通过；若共享查询或周次逻辑变更，只更新课表文档中的完整用例，不在本文件生成副本。
- 关联代码：`src/pages/index/index.vue` → `home`；`src/components/Home/components/lessons-table-quick-view/index.vue` → `useQuery`、`lessonTable`

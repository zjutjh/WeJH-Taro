# 课表页面测试用例

> 本文件是本页面的测试用例文档，同时为在本目录工作的 Agent 提供页面级约束。

## 周次、学期与模式切换

### LT-MODE-01 周模式与学期模式切换时重置为第 1 周

- 优先级：P0
- 执行方式：可 mock
- 前置条件：当前学期有课，将当前周次设为第 8 周，并准备第 1 周与第 8 周不同的课程数据。
- 操作步骤：在周模式选择第 8 周；切换到学期模式；再切回周模式并重新打开周选择器。
- 预期结果：切到学期模式时所选周次立即变为第 1 周；切回周模式后选择器选中并高亮第 1 周，课表展示第 1 周课程，不保留此前选择的第 8 周。
- 关联代码：`src/pages/lessonstable/index.vue` → `handlePickerModeSwitch`；`src/components/WeekPicker/index.vue` → `selectorValue`
- 已知风险：模式切换无条件把 `selectWeek` 重置为 `1`，会丢失用户选择，也会把放假态或本周语义暂时改成第 1 周。

### LT-MODE-02 学期模式展示整学期课程且保持可交互

- 优先级：P0
- 执行方式：可 mock
- 前置条件：准备同一天、同节次、分属不同周次的多门课程，并至少形成 3 层堆叠。
- 操作步骤：由周模式切换到学期模式；检查各周课程；依次点击基础层和各冲突层卡片。
- 预期结果：学期模式不按当前周过滤，整学期课程均可见；堆叠卡片的课程名和地点可辨认，每一层都可点击，弹窗内容与所点课程一致。
- 关联代码：`src/pages/lessonstable/index.vue` → `lessonsData`、`lessonsTableWeek`、模板 `lessons` 绑定；`src/pages/lessonstable/_components/lesson-grid/index.vue` → `lessonsTable`

### LT-WEEK-01 外部周次变化只更新页面周次

- 优先级：P0
- 执行方式：可 mock
- 前置条件：当前学期周次不是第 16 周。
- 操作步骤：用周选择器跳到第 16 周；点击“返回本周”；再次打开周选择器。
- 预期结果：课表数据和按钮文案回到本周；再次打开原生周选择器时，高亮项仍停留在第 16 周，直到用户重新选择、使用箭头或组件重新挂载。
- 关联代码：`src/components/WeekPicker/index.vue` → `selectorValue`、`onChange`；`src/pages/lessonstable/index.vue` → `handleBackToOriginWeek`
- 已知风险：`selectorValue` 只在组件初始化时读取 `props.week`，父组件后续修改周次不会同步其内部索引。

### LT-WEEK-02 周选择器覆盖第 1 至 20 周，箭头覆盖第 1 至 19 周

- 优先级：P1
- 执行方式：可 mock
- 前置条件：当前学期准备第 1、19、20 周可辨认的课程。
- 操作步骤：使用选择器分别选择第 1、19、20 周；使用前进/后退箭头遍历边界；在第 19 周尝试继续前进，并从选择器进入第 20 周后尝试前进和后退。
- 预期结果：选择器可到达第 1 至 20 周；箭头从第 1 周最多前进到第 19 周，第 19 周已禁用前进；通过选择器进入第 20 周后仍可后退到第 19 周，不产生第 0 或 21 周。
- 关联代码：`src/components/WeekPicker/index.vue` → `selector`、`backwardWeek`、`forwardWeek`
- 已知风险：前进箭头的上界比原生选择器少一周，用户无法仅靠箭头到达第 20 周。

### LT-WEEK-03 周次过滤覆盖普通周、单双周和跳周

- 优先级：P0
- 执行方式：可 mock
- 前置条件：准备 `1-16周`、`1-16周单`、`1-16周双`、`1,3,5` 等课程数据。
- 操作步骤：在相邻单双周之间切换，再从第 3 周跳到第 16 周。
- 预期结果：仅展示当前周生效的课程；单双周课程交替出现，跳周后没有上一周残留数据。
- 关联代码：`src/pages/lessonstable/index.vue` → `lessonsTableWeek`；`src/pages/lessonstable/_utils/weeks.ts` → `isLessonActiveInWeek`

### LT-TERM-01 学期选择范围完整，无课学期显示空网格

- 优先级：P1
- 执行方式：可 mock
- 前置条件：准备上、下、短学期以及历史有课、未来无课的数据。
- 操作步骤：切换“上/下/短”三类学期；检查当前学年前 3 年、后 1 年的选项；选择有课和无课学期。
- 预期结果：学期类型和学年范围完整；每次选择请求对应 `year`、`term`；无课学期清空上一学期课程并保留七列空网格，不显示专门的“暂无课程”文案。
- 关联代码：`src/components/TermPicker/index.vue` → `SELECT_OPTIONS`、`innerField`、`onChange`；`src/pages/lessonstable/index.vue` → `selectTerm`、`useQuery`
- 已知风险：无课、加载中和请求失败都可能表现为空网格，只能结合全局 toast 或更新时间判断状态。

### LT-CALENDAR-01 放假周次归零，延迟基础信息保留初始化快照

- 优先级：P0
- 执行方式：可 mock
- 前置条件：分别在进入页面前把 `systemStore.generalInfo.week` 设为 `0`、负数；再构造 `generalInfo` 初始为空且延迟 3 至 5 秒返回完整数据的冷启动状态。
- 操作步骤：每种状态下立即进入课表页，打开周选择器和学期选择器；在延迟场景中等待基础信息到达后再次观察，并重新进入页面对照。
- 预期结果：进入页面前已有 `0` 或负数周次时，`originWeek` 归零并显示“放假中”；基础信息在页面初始化后才到达时，页面继续使用初始化阶段的学期与周次快照，周次可能为 `NaN`、学年选项可能由 `NaN` 生成，课程查询不会自动切到新学期；重新进入页面后才按完整基础信息初始化。
- 关联代码：`src/pages/lessonstable/index.vue` → `originWeek`、`originTerm`；`src/store/system/index.ts` → `SystemStore.state.generalInfo`、`setGeneralInfo`
- 已知风险：`originWeek`、`originTerm` 和选择状态不是响应式派生值，弱网冷启动可能发出无效学年/学期请求，并且只能通过重新进入页面恢复。

### LT-CALENDAR-02 返回本周恢复页面数据但保留选择器内部索引

- 优先级：P1
- 执行方式：可 mock
- 前置条件：当前学期不是第 1 周，另准备一个历史学期。
- 操作步骤：切换历史学期并选择非本周周次；切回周模式；点击“返回本周”。
- 预期结果：学期、页面周次、按钮文案和课程一次恢复为进入页面时的本学期、本周；原生周选择器的内部高亮仍保留切回周模式时初始化的第 1 周。
- 关联代码：`src/pages/lessonstable/index.vue` → `isThisWeek`、`handleBackToOriginWeek`
- 已知风险：页面值与周选择器内部索引可能不一致，原因与 `LT-WEEK-01` 相同。

## 底部操作与弹窗状态

### LT-ACTION-01 刷新按钮只在本周本学期出现，后台刷新不进入旋转态

- 优先级：P1
- 执行方式：可 mock
- 前置条件：处于本周本学期，并能观察课表请求次数。
- 操作步骤：依次检查本周周模式、非本周周模式、历史学期和学期模式；在按钮可见时点击刷新。
- 预期结果：刷新按钮仅在“周模式 + 本周 + 本学期”可见；每次点击触发一次显式 `refetch`；已有数据时后台刷新不会令 `isPending` 变为 `true`，因此图标不进入旋转态，按钮在请求期间仍可继续点击。
- 关联代码：`src/pages/lessonstable/index.vue` → 模板 `showWeekPicker && isThisWeek`、`refetch`
- 已知风险：刷新状态使用 `isPending` 而不是 `isFetching`，用户缺少后台刷新反馈，也可以在请求期间重复触发刷新。

### LT-ACTION-02 实践课程入口只在学期模式且有数据时出现

- 优先级：P1
- 执行方式：可 mock
- 前置条件：分别准备有、无 `practiceLessons` 的成功响应及请求失败响应。
- 操作步骤：在周模式和学期模式检查入口；有数据时打开弹窗；无数据、加载中和失败时再次检查。
- 预期结果：入口只在“学期模式 + 实践课程非空”时出现；弹窗字段正确；无数据、加载中或失败时入口隐藏且页面不出现空弹窗。
- 关联代码：`src/pages/lessonstable/index.vue` → 模板 `!showWeekPicker && !isEmpty(practiceLessonsData)`；`src/pages/lessonstable/_components/practice-lesson-popover/index.vue` → 弹窗模板

## 鉴权、网络与缓存

### LT-AUTH-01 Cookie 过期后自动续期对用户无感

- 优先级：P0
- 执行方式：可 mock
- 前置条件：缓存一个已过期 Cookie；让首次课表请求返回 `USER_NOT_LOGIN(200503)`，登录接口随后返回新 Cookie，重试请求成功。
- 操作步骤：进入课表页并记录登录、课表请求和 toast；等待查询完成。
- 预期结果：旧 Cookie 被失效，新一轮请求携带新 Cookie 并加载课表；中间失败不显示错误 toast、不停留空白页；总尝试次数不超过首次请求加 2 次重试。
- 关联代码：`src/utils/request-next.ts` → `requestNext`、`refreshCookie`；`src/utils/vue-query.ts` → `globalQueryClientConfig.defaultOptions.queries.retry`

### LT-AUTH-02 未激活由首页引导，未绑定和登录失败使用通用提示

- 优先级：P0
- 执行方式：可 mock
- 前置条件：分别构造微信登录失败、账号未激活、正方账号未绑定三种状态，并清空课表缓存。
- 操作步骤：从首页正常入口和课表路由直达两种路径进入；观察空态、toast 和可操作入口。
- 预期结果：账号未激活时，首页显示“激活”按钮并可进入激活页；账号已激活但未绑定任何服务时，首页显示“请到我的页面绑定”的通用文字，不提供直达绑定页的按钮；直达课表页发生登录或未绑定错误时，课表保持空网格，查询按全局策略重试后展示错误原文 toast，不提供页面内分类提示或导航入口。
- 关联代码：`src/utils/request-next.ts` → `refreshCookie`；`src/components/Home/index.vue` → 未绑定提示模板；`src/pages/lessonstable/index.vue` → `useQuery`
- 已知风险：登录失败与未绑定状态缺少课表页内的可执行引导，用户需要自行前往“我的 → 绑定”或激活页。

### LT-AUTH-03 教务密码变更后直接展示服务端错误原文

- 优先级：P1
- 执行方式：可 mock
- 前置条件：已登录且已绑定，让课表接口返回教务凭证失效的真实服务端错误。
- 操作步骤：进入课表页并等待重试结束；记录最终 toast；从首页帮助或“我的 → 绑定”手动进入正方绑定页，重新绑定后返回课表刷新。
- 预期结果：最终 toast 直接使用服务端 `RequestError.message`，不自动映射为更新正方密码的说明，也不自动导航；首页课表速览的帮助文案包含重新绑定说明；重新绑定后返回并手动刷新可恢复课表，无需清理小程序数据。
- 关联代码：`src/utils/vue-query.ts` → `QueryCache.onError`；`src/utils/request-next.ts` → `RequestError`；`src/constants/copywriting.ts` → `faqText`、`helpText.lessonsTable`
- 已知风险：服务端错误原文可能不够易懂，且帮助文案与实际错误 toast 分离。

### LT-NET-01 离线时按 1 天有效期使用缓存并退化为空网格或无课文案

- 优先级：P0
- 执行方式：可 mock
- 前置条件：分别准备更新时间小于 1 天和大于 1 天的持久化课表缓存，然后断网。
- 操作步骤：冷启动进入首页速览和课表主页，观察内容与错误提示。
- 预期结果：1 天内缓存可立即显示，后台刷新失败后由全局错误 toast 提示；超过 1 天的缓存被忽略，课表主页显示空网格并在重试结束后显示错误 toast，首页速览显示“更新失败”以及当天/明天无课文案，不提供独立的页面级错误状态。
- 关联代码：`src/utils/vue-query.ts` → `createQueryPersister`、`maxAge`；`src/pages/lessonstable/index.vue` → `useQuery`
- 已知风险：无有效缓存且离线时，首页速览会把请求失败同时表现为“无课”，课表主页也只有全局 toast，可能被误解为真实空课表。

### LT-NET-02 超时与重试次数符合全局请求策略并展示错误原文

- 优先级：P0
- 执行方式：可 mock
- 前置条件：清空当前查询缓存，将每次课表请求延迟到 12 秒以上，并记录请求次数。
- 操作步骤：进入课表页并等待最终失败；随后恢复网络并重新进入。
- 预期结果：单次请求在约 12 秒超时，首次失败后最多重试 2 次，最终由 `QueryCache.onError` 显示一次 `err.message` 原文；恢复网络并重新进入后可正常加载，旧的失败请求不覆盖新数据。
- 关联代码：`src/utils/request-next.ts` → `globalConfig.timeout`；`src/utils/vue-query.ts` → `retry`
- 已知风险：错误 toast 不做错误码到用户文案的映射，原文不一定易于理解。

### LT-NET-03 学期切换中断网时清空表格并使用全局 toast

- 优先级：P1
- 执行方式：可 mock
- 前置条件：当前学期已加载，目标历史学期无缓存；请求目标学期时断网。
- 操作步骤：切换到目标学期并在请求发出后断网；等待失败；恢复网络后重新选择目标学期或重新进入页面。
- 预期结果：选择器立即显示目标学期，目标查询无缓存时课表清空为七列空网格，不继续显示原学期课程；加载中没有专门提示，重试结束后由全局 toast 显示错误原文；恢复网络并重新触发查询后加载目标学期数据。
- 关联代码：`src/pages/lessonstable/index.vue` → `selectTerm`、查询 `queryKey`；`src/utils/vue-query.ts` → 全局查询策略
- 已知风险：历史学期和学期模式没有显式刷新按钮，失败后的恢复入口不明显。

### LT-CACHE-01 首页速览与课表主页共享同一查询缓存

- 优先级：P1
- 执行方式：可 mock
- 前置条件：两个入口使用同一学年、学期；准备可识别响应并记录接口次数。
- 操作步骤：先进入首页完成速览加载，再在 30 秒内进入课表主页；交换进入顺序重复；最后让首次加载失败后切换页面。
- 预期结果：成功数据由同一查询缓存复用，30 秒内切页不重复请求；失败或旧缓存状态在两个消费者间一致，不出现同一学期两份互相矛盾的数据。
- 关联代码：`src/components/Home/components/lessons-table-quick-view/index.vue` → `useQuery`；`src/pages/lessonstable/index.vue` → `useQuery`；`src/services/api/query-key.ts` → `QUERY_KEY.ZF_LESSONS_TABLE`

### LT-CACHE-02 30 秒新鲜期前后重新进入的刷新时机正确

- 优先级：P2
- 执行方式：可 mock
- 前置条件：已成功加载课表，并能控制经过时间及观察请求次数。
- 操作步骤：在 30 秒内退出再进入；超过 30 秒后再次进入；后台刷新时同时观察旧数据。
- 预期结果：30 秒内不重新请求；变为 stale 后重新进入会触发后台刷新；刷新期间已有数据保持可读，成功后原位更新，失败时保留可用旧数据并提示错误。
- 关联代码：`src/utils/vue-query.ts` → `staleTime`；`src/pages/lessonstable/index.vue` → `useQuery`

## 接口字段与布局边界

### LT-DATA-01 单节次 sections 在布局阶段被忽略

- 优先级：P1
- 执行方式：可 mock
- 前置条件：准备 `sections: "3"` 的课程，并增加一门 `2-3` 节重叠课程。
- 操作步骤：进入周模式和学期模式，检查卡片尺寸、字号、时间详情和冲突弹窗。
- 预期结果：`sections: "3"` 的课程不会进入二维时间网格，因此不渲染、不可点击，也不参与与 `2-3` 课程的冲突判断；`2-3` 课程正常显示，页面不为单节课生成包含 `NaN` 的卡片样式。
- 关联代码：`src/pages/lessonstable/_components/lesson-grid/index.vue` → `getPosition`；`src/pages/lessonstable/_utils/sections.ts` → `isSectionsOverlap`；`src/pages/lessonstable/_utils/layout-color.ts` → `getLessonDuration`；`src/pages/lessonstable/index.vue` → `detailTimeInterval`
- 已知风险：布局、重叠和时长逻辑都假定 `sections` 包含 `-`，合法的单节次数据会被静默丢弃；只有详情时间格式化逻辑支持单节次。

### LT-DATA-02 越界 sections 溢出网格，反向和非数字 sections 被忽略

- 优先级：P1
- 执行方式：可 mock
- 前置条件：分别准备 `11-13`、`0-2`、`4-2` 和非数字节次。
- 操作步骤：加载每组数据，滚动/点击网格并观察控制台与其他正常课程。
- 预期结果：`11-13` 课程从第 11 行开始按 3 行高度渲染并溢出网格底部；`0-2` 课程从网格上方开始按 3 行高度渲染；`4-2` 和非数字节次不会进入时间网格，因而被静默忽略；其他正常课程继续渲染，页面不出现死循环。
- 关联代码：`src/pages/lessonstable/_utils/layout-color.ts` → `createTimeGrid`、`buildTwoDimensionalLayout`；`src/pages/lessonstable/_components/lesson-grid/index.vue` → `getPosition`
- 已知风险：节次缺少边界校验和诊断，越界卡片可能遮挡相邻界面，反向或非数字数据会无提示丢失。

### LT-DATA-03 非法 weekday 被静默忽略

- 优先级：P2
- 执行方式：可 mock
- 前置条件：准备 `weekday` 为 `0`、`8`、空串和非数字的课程，同时保留正常课程。
- 操作步骤：加载数据并检查七列布局、点击区域和控制台。
- 预期结果：非法 `weekday` 课程不会进入 1 至 7 的时间网格，因此不渲染，也不生成负位置或第八列；正常课程保持在周一至周日正确列；控制台不提供非法数据诊断。
- 关联代码：`src/pages/lessonstable/_utils/layout-color.ts` → `createTimeGrid`、`toLessonColorNode`；`src/pages/lessonstable/_components/lesson-grid/index.vue` → `getPosition`
- 已知风险：非法星期数据会无提示丢失，无法区分接口数据异常和真实无课。

### LT-DATA-04 常见 week 格式一致，部分非法格式在两套解析中分歧

- 优先级：P1
- 执行方式：可 mock
- 前置条件：准备空串、`1,3,5`、`1-9周单`、`2-10周双`、单独“单/双”和非法字符串。
- 操作步骤：逐周检查主体过滤；点击冲突课程并比较弹窗交集周次。
- 预期结果：空串、`1,3,5`、单双周范围以及不含数字的非法字符串在课程过滤和冲突交集中结果一致；类似 `1-foo` 的部分数字非法格式在主体过滤中不生效，但 `parseWeeks` 会提取第 1 周，冲突交集可能因此显示第 1 周。
- 关联代码：`src/pages/lessonstable/_utils/weeks.ts` → `parseWeeks`、`isLessonActiveInWeek`、`formatWeeks`
- 已知风险：过滤与冲突交集使用两套独立解析实现，对部分非法格式会给出不同结果。

### LT-DATA-05 教室名称退化格式仍可读

- 优先级：P1
- 执行方式：可 mock
- 前置条件：准备 `子良A347`、`屏峰体育馆`、`3号楼A101`、空字符串和包含全角字符的地点。
- 操作步骤：在课表卡片和详情弹窗中逐项核对地点。
- 预期结果：每种地点至少完整显示一次，不丢字、不把整段挤入错误行；纯中文与数字开头地点保持可读。
- 关联代码：`src/pages/lessonstable/_components/lesson-grid/_utils.ts` → `splitNameAndRoom`；`src/pages/lessonstable/_components/lesson-grid/index.vue` → 地点模板

### LT-DATA-06 完全重复课程按布局唯一 ID 保留一条

- 优先级：P2
- 执行方式：可 mock
- 前置条件：返回两条完全相同的 `id + week + weekday + sections` 课程。
- 操作步骤：加载课表，多次切换周次和模式，并观察卡片数量、点击内容及控制台告警。
- 预期结果：两条完全相同的课程共享布局唯一 ID，最终只渲染其中一条；切换周次和模式后结果保持一条，不出现重复 key 告警或复用错误 DOM。
- 关联代码：`src/pages/lessonstable/_components/lesson-grid/_utils.ts` → `lessonKey`；`src/pages/lessonstable/_utils/layout-color.ts` → `getLessonUniqueId`
- 已知风险：去重由复合字符串隐式完成；若两条同 ID 课程携带不同的其他字段，后出现的数据仍可能被静默丢弃。

## 冲突课程

### LT-CONFLICT-01 冲突周次交集覆盖完全、部分、单双周和无交集

- 优先级：P0
- 执行方式：可 mock
- 前置条件：同一天按 mock 返回顺序先返回 `1-2`、再返回 `2-3` 两门课程，并形成两个层级；若调换返回顺序，基础层与冲突层对应课程也会调换。
- 操作步骤：在上述固定返回顺序下分别点击基础层 `1-2` 和冲突层 `2-3`，比较弹窗列表；可选调换返回顺序后再次观察层级变化。
- 预期结果：固定返回顺序下，点击基础层 `1-2` 课程时只按 `sections` 完全相等查找，弹窗显示该课程的单项详情；点击冲突层 `2-3` 课程时按区间重叠查找，弹窗显示两门课程的冲突列表；调换返回顺序时基础层和冲突层对应课程随之互换，但两种入口的匹配规则仍不对称。
- 关联代码：`src/pages/lessonstable/index.vue` → `conflictTime`；`src/pages/lessonstable/_utils/weeks.ts` → `parseWeeks`、`formatWeeks`

### LT-CONFLICT-02 基础层与冲突层使用不同的节次匹配规则

- 优先级：P1
- 执行方式：可 mock
- 前置条件：同一天准备 `1-2` 与 `2-3` 两门课程并形成两个层级。
- 操作步骤：分别点击基础层课程和冲突层课程，比较弹窗列表。
- 预期结果：点击基础层 `1-2` 课程时只按 `sections` 完全相等查找，弹窗显示该课程的单项详情；点击冲突层 `2-3` 课程时按区间重叠查找，弹窗显示两门课程的冲突列表；两种入口结果不对称。
- 关联代码：`src/pages/lessonstable/index.vue` → `handleLessonClick`；`src/pages/lessonstable/_utils/sections.ts` → `isSectionsOverlap`
- 已知风险：相同的重叠课程因点击层级不同展示不同弹窗，可能让用户误判是否存在冲突。

### LT-CONFLICT-03 学期模式冲突列表清楚表达跨周关系

- 优先级：P2
- 执行方式：可 mock
- 前置条件：准备同一天同节次但周次相交、部分相交和完全不相交的课程。
- 操作步骤：切到学期模式，依次点击每层课程并核对列表中的周次与交集文案。
- 预期结果：学期模式可列出整学期同时间段课程，每项完整展示自己的周次；共同周次准确，无共同周次明确显示“无”，用户不会把跨周叠放误解为真实撞课。
- 关联代码：`src/pages/lessonstable/index.vue` → `handleLessonClick`、`conflictTime`、`showWeekPicker`

### LT-CONFLICT-04 三层以上冲突卡片仍可读可点

- 优先级：P2
- 执行方式：可 mock
- 前置条件：同一天同节次准备至少 4 门课程。
- 操作步骤：在周模式和学期模式逐层点击，从最上层点击到基础层。
- 预期结果：各层仍有可识别的点击区域和文字，点击命中对应课程；缩放不导致卡片完全遮挡或超出网格。
- 关联代码：`src/pages/lessonstable/_components/lesson-grid/index.vue` → `getPosition` 中 `0.9^stack` 缩放；`src/pages/lessonstable/_utils/layout-color.ts` → `buildTwoDimensionalLayout`

## 时间实时性

### LT-TIME-01 当前时间指示线按首次计算位置保持不变

- 优先级：P1
- 执行方式：可 mock
- 前置条件：处于本周本学期；分别模拟课前、课中、午休和第 12 节后，并让页面停留至少跨过一个分钟边界。
- 操作步骤：记录指示线初始位置；跨分钟或课程边界后不进行任何交互；比较新位置。
- 预期结果：首次渲染时，课中指示线按已进行分钟数定位，课前和课间定位到下一节起点，第 12 节后定位在网格底部；页面继续停留并跨过分钟或课程边界后，指示线保持首次计算的位置不变。
- 关联代码：`src/pages/lessonstable/_components/current-time-indicator/index.vue` → `nowStyle`；`src/utils/time-diff.ts` → `getMinuteInterval`
- 已知风险：`nowStyle` 没有响应式时间依赖或定时器，停留越久，指示位置与真实时间偏差越大。

### LT-TIME-02 今日列高亮跨自然日保持原列

- 优先级：P1
- 执行方式：需真实时点
- 前置条件：真机停留在本周课表页并让小程序在前台或后台跨过 00:00。
- 操作步骤：跨日前记录高亮列；跨日后恢复前台，不切换页面，观察高亮列和当前周状态。
- 预期结果：跨日后恢复前台但不重新挂载页面时，高亮仍停留在跨日前的列；周日跨周一后也不会自动更新当前周语义；重新进入页面后才按新日期重新计算。
- 关联代码：`src/pages/lessonstable/_components/lesson-grid/index.vue` → `nowWeekStyle`；`src/pages/lessonstable/index.vue` → `isThisWeek`
- 已知风险：高亮列由无响应式依赖的 `dayjs().day()` 计算，跨日停留期间会指向错误日期。

## 设备、主题与视觉

### LT-DEVICE-01 小屏设备完整展示 12 节课表

- 优先级：P2
- 执行方式：可 mock
- 前置条件：iPhone SE 等小屏视口，12 个节次均有课程且底部面板展开。
- 操作步骤：检查顶部、12 行网格、当前时间线、冲突卡片和底部操作区；尝试点击首尾课程。
- 预期结果：12 节网格完整可见或有明确可用的浏览方式；首尾卡片均可点击，底部面板不遮挡课程且页面无意外滚动锁死。
- 关联代码：`src/pages/lessonstable/index.config.ts` → `disableScroll`；`src/pages/lessonstable/index.module.scss` → `table-wrapper`、`lessons-table-bottom-panel`

### LT-THEME-01 深浅主题下卡片和文字满足可读性

- 优先级：P2
- 执行方式：可 mock
- 前置条件：准备普通、冲突、选中和空态课程，微信分别设为浅色和深色主题。
- 操作步骤：切换主题并检查课名、地点、节次、时间线、底部按钮和弹窗。
- 预期结果：所有文字与背景有清晰对比，状态不只依赖颜色表达；主题切换后无残留旧色或不可见图标。
- 关联代码：`src/pages/lessonstable/index.vue` → `theme-config`；`src/pages/lessonstable/_constants/colors.ts` → `COLOR_SET`

### LT-COLOR-01 着色在相邻、重叠和密集课程下稳定

- 优先级：P2
- 执行方式：可 mock
- 前置条件：准备相邻课程、重叠课程、同一 `classID` 且处于同一层的多条课程，以及超过 7 个颜色需求的密集课表。
- 操作步骤：在同一次渲染结果中记录各课程颜色与相邻对比；再刷新、切周和切模式，记录颜色是否因参与课程和邻接关系变化而重算。
- 预期结果：同一次布局计算内，相邻/重叠课程尽量不撞色，同层同一 `classID` 在可用颜色不冲突时优先复用颜色；调色板耗尽时退化结果仍可辨认。刷新、切周或切模式后颜色会重新计算，允许同一 `classID` 因课程集合或邻接关系变化而变色。
- 关联代码：`src/pages/lessonstable/_utils/layout-color.ts` → `colorLessons`、`isHardConflict`；`src/pages/lessonstable/_constants/colors.ts` → `COLOR_SET`

### LT-META-01 页面标题元信息与可见标题一致

- 优先级：P2
- 执行方式：可 mock
- 前置条件：构建微信小程序并进入课表页。
- 操作步骤：检查自定义标题栏、页面配置及微信开发者工具中的页面元信息。
- 预期结果：用户可见标题和页面元信息均表达“课程表”，不存在复制自首页的错误标题。
- 关联代码：`src/pages/lessonstable/index.vue` → `title-bar`；`src/pages/lessonstable/index.config.ts` → `navigationBarTitleText`

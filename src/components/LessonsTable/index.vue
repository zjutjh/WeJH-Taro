<template>
  <view class="lessons-table-wrapper">
    <view class="jc-index-panel index-panel">
      <view v-for="i in 12" :key="i">
        <view class="num-index">
          {{ i }}
        </view>
      </view>
    </view>
    <view class="lessons-table">
      <view class="col" />
      <view class="col">
        <view v-show="isThisWeek" class="now-week-index" :style="nowWeekStyle" />
        <view class="weekday-index-panel index-panel">
          <view v-for="i in weekdayEnum" :key="i">
            <view class="num-index">
              {{ i }}
            </view>
          </view>
        </view>
        <view v-if="lessonsTable && lessonsTable.length !== 0" class="table table-box">
          <view
            v-for="cl in lessonsTable"
            :key="lessonKey(cl)"
            class="class"
            :style="getPosition(cl)"
          >
            <view
              class="class-card"
              :style="classCardColor(cl.color) as any"
              @tap="classCardClick(cl)"
            >
              <view class="row">
                <view class="title">
                  {{ splitNameAndRoom(cl.lessonPlace)[0] }}
                </view>
                <view class="title">
                  {{ splitNameAndRoom(cl.lessonPlace)[1] }}
                </view>
              </view>
              <view class="row">
                <text class="item-content" :style="`-webkit-line-clamp: ${2}` as any">
                  {{ cl.lessonName }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-show="isThisWeek" class="now-index" :style="nowStyle" />
    </view>
  </view>
</template>

<script setup lang="ts">
import "./index.scss";

import { computed, toRefs } from "vue";

import { dayScheduleStartTime } from "@/constants/index";
import { Lesson } from "@/types/Lesson";

const props = defineProps<{ lessons: Lesson[]; isThisWeek: boolean }>();
const { lessons } = toRefs(props);
const emit = defineEmits(["classClick"]);

const colorSet = [
  "green-600",
  "green-700",
  "blue-600",
  "yellow-600",
  "orange-600",
  "red-600",
  "purple-600"
];
const weekdayEnum = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

const lessonsTable = computed(() => {
  return processLessonsLayout(lessons.value);
});

/**
 * 生成课程在 v-for 中的唯一 key
 * 为了避免重复 key 出现，使用 id、week、weekday、sections、stack 五个属性组合
 * 新增了 stack（层数）作为 key 的一部分，用于区分冲突层的相同课程
 */
const lessonKey = (cl: Lesson) => {
  return `${cl.id}-${cl.week}-${cl.weekday}-${cl.sections}-${cl.stack || 0}`;
};

const nowWeekStyle = computed(() => {
  const now = new Date();
  const weekday = now.getDay() ? now.getDay() : 7;
  const left = `calc(100% / 7 * ${weekday - 1})`;
  return { left };
});

// 计算当前时间线的位置
const nowStyle = computed(() => {
  const now = new Date();
  const hour = now.getHours();
  const min = now.getMinutes();
  let duration = 0;
  const nowTime = hour * 60 + min;

  // 这节课的开始时间
  let thisLesson = dayScheduleStartTime.find((item) => {
    if (nowTime >= item.hour * 60 + item.min && nowTime <= item.hour * 60 + item.min + 45)
      return true;
  });

  if (!thisLesson) {
    thisLesson = dayScheduleStartTime.find((item) => {
      if (nowTime < item.hour * 60 + item.min) return true;
    }) || { hour: 21, min: 10 };
  } else duration = hour * 60 + min - (thisLesson.hour * 60 + thisLesson.min);

  let jc = 0; // 第 ${jc + 1} 节课
  jc = dayScheduleStartTime.indexOf(thisLesson);

  return {
    top: `calc((100% - 2rem) / 12 * ${jc + duration / 45} + 2rem)`
  };
});

/**
 * 创建时间网格映射
 * 将课程列表转换为二维网格结构，方便后续按时间格查找课程
 * 结构：Map<weekday（周几）, Map<section（第几节）, Lesson[]（该时间格的所有课程）>>
 */
function createTimeGrid(lessonsList: Lesson[]): Map<number, Map<number, Lesson[]>> {
  const grid = new Map<number, Map<number, Lesson[]>>();

  // 初始化：7天 × 12节课
  for (let weekday = 1; weekday <= 7; weekday++) {
    const dayGrid = new Map<number, Lesson[]>();
    for (let section = 1; section <= 12; section++) {
      dayGrid.set(section, []);
    }
    grid.set(weekday, dayGrid);
  }

  // 一个课程可能占用多个时间格
  lessonsList.forEach((lesson) => {
    const weekday = parseInt(lesson.weekday);
    const [start, end] = lesson.sections.split("-").map(Number);

    // 将课程添加到它占用的每个时间格
    for (let section = start; section <= end; section++) {
      grid.get(weekday)?.get(section)?.push(lesson);
    }
  });

  return grid;
}

// 分层排布算法核心函数
function processLessonsLayout(lessonsList: Lesson[]): Lesson[] {
  if (lessonsList.length === 0) return [];

  // 1. 创建时间网格
  const timeGrid = createTimeGrid(lessonsList);

  // 2. 存储已排布的课程
  const laidOutLessons: Lesson[] = [];
  const processedLessons = new Set<string>(); // 记录已处理的课程ID，避免重复处理

  // 3. 按天进行排布
  for (let weekday = 1; weekday <= 7; weekday++) {
    const dayGrid = timeGrid.get(weekday);
    if (!dayGrid) continue;

    let stack = 0; // 0为正常层，>=1为冲突层

    // 持续排布直到该天所有课程都被处理
    for (;;) {
      let hasRemainingLessons = false; // 标记该天是否还有未处理的课程
      let nowCell = 1; // 当前扫描的时间格位置（1-12节）

      // 从上到下扫描12个时间格
      while (nowCell <= 12) {
        const cellLessons = dayGrid.get(nowCell) || [];

        // 过滤出该单元格中未处理的课程
        const unprocessedLessons = cellLessons.filter(
          (lesson) => !processedLessons.has(getLessonUniqueId(lesson))
        );

        if (unprocessedLessons.length > 0) {
          hasRemainingLessons = true;

          // 选择课时最长的课程（优先展示长课程）
          const longestLesson = selectLongestLesson(unprocessedLessons);

          // 添加到布局结果
          const laidOutLesson: Lesson = {
            ...longestLesson,
            stack // 层数
          };

          laidOutLessons.push(laidOutLesson);

          // 标记为已处理
          processedLessons.add(getLessonUniqueId(longestLesson));

          // 从该课程占用的所有时间格中移除
          const [start, end] = longestLesson.sections.split("-").map(Number);
          for (let section = start; section <= end; section++) {
            const sectionLessons = dayGrid.get(section);
            if (sectionLessons) {
              const index = sectionLessons.findIndex(
                (l) => getLessonUniqueId(l) === getLessonUniqueId(longestLesson)
              );
              if (index !== -1) {
                sectionLessons.splice(index, 1);
              }
            }
          }

          // 跳转到课程结束后的下一个单元格
          nowCell = end + 1;
        } else {
          // 当前单元格无未处理课程，移动到下一个
          nowCell++;
        }
      }

      // 如果该天没有剩余课程，结束该天的排布
      if (!hasRemainingLessons) break;

      // 否则进入下一层（冲突层）
      stack++;
    }
  }

  initialLessonsColor(laidOutLessons);

  return laidOutLessons;
}

// 获取课程唯一标识
function getLessonUniqueId(lesson: Lesson): string {
  return `${lesson.id}-${lesson.week}-${lesson.weekday}-${lesson.sections}`;
}

// 从多个课程中选择课时最长的课程
function selectLongestLesson(lessonsList: Lesson[]): Lesson {
  return lessonsList.reduce((longest, current) => {
    const longestDuration = getLessonDuration(longest);
    const currentDuration = getLessonDuration(current);
    return currentDuration > longestDuration ? current : longest;
  });
}

// 获取课程持续时长（节数）
function getLessonDuration(lesson: Lesson): number {
  const [start, end] = lesson.sections.split("-").map(Number);
  return end - start + 1;
}

function getLessonStack(lesson: Lesson): number {
  return lesson.stack || 0;
}

function isSectionsOverlap(sectionsA: string, sectionsB: string): boolean {
  const [startA, endA] = sectionsA.split("-").map(Number);
  const [startB, endB] = sectionsB.split("-").map(Number);
  return !(endA < startB || endB < startA);
}

/*
 * 新方案将“不能同色”的关系统一建图，再一次性做贪心着色，约束更稳定。
 * 1) 建图：两两判断 isHardConflict，冲突就连边。
 * 2) 排序：按“度数高 > 时长长 > weekday/start/stack/index”排序。
 *    - 度数越高约束越强，越应优先着色，减少后续冲突。
 * 3) 选色：
 *    - 先排除邻居已用色，得到 availableColors；
 *    - 若 classPreferredColor 在可用集合中，优先复用（保持同课视觉一致）；
 *    - 否则选可用集合里“全局使用次数最少”的颜色；
 *    - 若可用色为空（极端约束下），从全量颜色中选使用最少色兜底。
 * 4) 回写：将 selectedColor 写回节点 lesson.color 和 lessonsList 原始项。
 *
 * 约束优先级：
 * 硬约束（相邻/重叠不撞色） > 偏好约束（同 classID+stack 尽量同色）
 */
type LessonColorNode = {
  index: number;
  lesson: Lesson;
  weekday: number;
  start: number;
  end: number;
  stack: number;
  duration: number;
};

function toLessonColorNode(lesson: Lesson, index: number): LessonColorNode {
  const [start, end] = lesson.sections.split("-").map(Number);
  return {
    index,
    lesson,
    weekday: parseInt(lesson.weekday),
    start,
    end,
    stack: getLessonStack(lesson),
    duration: end - start + 1
  };
}

function isVerticalAdjacent(a: LessonColorNode, b: LessonColorNode): boolean {
  return a.weekday === b.weekday && (a.end + 1 === b.start || b.end + 1 === a.start);
}

function isHorizontalAdjacent(a: LessonColorNode, b: LessonColorNode): boolean {
  return (
    Math.abs(a.weekday - b.weekday) === 1 && isSectionsOverlap(a.lesson.sections, b.lesson.sections)
  );
}

function isHardConflict(a: LessonColorNode, b: LessonColorNode): boolean {
  const sameDayOverlap =
    a.weekday === b.weekday && isSectionsOverlap(a.lesson.sections, b.lesson.sections);
  return sameDayOverlap || isHorizontalAdjacent(a, b) || isVerticalAdjacent(a, b);
}

function initialLessonsColor(lessonsList: Lesson[]) {
  const nodes = lessonsList.map((lesson, index) => toLessonColorNode(lesson, index));
  const adjacency = nodes.map(() => new Set<number>());

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (!isHardConflict(nodes[i], nodes[j])) continue;
      adjacency[i].add(j);
      adjacency[j].add(i);
    }
  }

  const order = nodes
    .map((node, idx) => ({ node, idx, degree: adjacency[idx].size }))
    .sort((a, b) => {
      if (b.degree !== a.degree) return b.degree - a.degree;
      if (b.node.duration !== a.node.duration) return b.node.duration - a.node.duration;
      if (a.node.weekday !== b.node.weekday) return a.node.weekday - b.node.weekday;
      if (a.node.start !== b.node.start) return a.node.start - b.node.start;
      if (a.node.stack !== b.node.stack) return a.node.stack - b.node.stack;
      return a.node.index - b.node.index;
    });

  const assigned = new Map<number, string>();
  const colorUseCount = new Map<string, number>();
  const classPreferredColor = new Map<string, string>();

  colorSet.forEach((color) => colorUseCount.set(color, 0));

  for (const { node, idx } of order) {
    const neighborColors = new Set<string>();
    adjacency[idx].forEach((neighborIdx) => {
      const color = assigned.get(neighborIdx);
      if (color) neighborColors.add(color);
    });

    const availableColors = colorSet.filter((color) => !neighborColors.has(color));
    const classKey = `${node.stack}-${node.lesson.classID}`;
    const preferred = classPreferredColor.get(classKey);

    let selectedColor = "";

    if (preferred && availableColors.includes(preferred)) {
      selectedColor = preferred;
    } else if (availableColors.length > 0) {
      selectedColor = availableColors.sort(
        (a, b) => (colorUseCount.get(a) || 0) - (colorUseCount.get(b) || 0)
      )[0];
    } else {
      selectedColor = [...colorSet].sort(
        (a, b) => (colorUseCount.get(a) || 0) - (colorUseCount.get(b) || 0)
      )[0];
    }

    assigned.set(idx, selectedColor);
    colorUseCount.set(selectedColor, (colorUseCount.get(selectedColor) || 0) + 1);
    classPreferredColor.set(classKey, selectedColor);
    node.lesson.color = selectedColor;
    lessonsList[node.index].color = selectedColor;
  }
}

function classCardColor(color = "primary") {
  return { "--bg-color": `var(--wjh-color-${color})` };
}

function splitNameAndRoom(str: string) {
  let index = 0;
  for (; index < str.length; index++) {
    if (str.charCodeAt(index) <= 255) break;
  }
  return [str.slice(0, index), str.slice(index)];
}

function classCardClick(theClass: Lesson) {
  emit("classClick", theClass);
}

function getPosition(theClass: Lesson) {
  const begin = parseInt(theClass.sections.split("-")[0]);
  const end = parseInt(theClass.sections.split("-")[1]);
  const weekday = parseInt(theClass.weekday);
  const stack = theClass.stack || 0;

  // 基础尺寸计算
  const fontSize = `${Math.min(12, (end - begin + 2) * 4)}px`;
  const height = `calc(100% / 12 * ${end - begin + 1})`;
  const top = `calc(100% / 12 * ${begin - 1})`;
  const left = `calc(100% / 7 * ${weekday - 1})`;

  // 冲突层特殊处理
  if (stack > 0) {
    const baseScale = 0.9;
    const scale = Math.pow(baseScale, stack);

    return {
      top,
      left,
      height,
      fontSize,
      transform: `scale(${scale})`,
      transformOrigin: "bottom right",
      zIndex: 100 + stack
    };
  }

  // 正常层返回基础位置
  return { top, left, height, fontSize, zIndex: 0 };
}
</script>

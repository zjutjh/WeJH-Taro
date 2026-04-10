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

import { buildTwoDimensionalLayout, colorLessons } from "./utils/layout-color";

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

// 分层排布 + 着色（统一抽到 utils）
function processLessonsLayout(lessonsList: Lesson[]): Lesson[] {
  const layoutResult = buildTwoDimensionalLayout(lessonsList);
  return colorLessons(layoutResult, colorSet);
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

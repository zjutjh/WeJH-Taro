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
          <view v-for="i in WEEKDAYS" :key="i">
            <view class="num-index">
              {{ i }}
            </view>
          </view>
        </view>
        <view
          v-if="lessons && lessons.length !== 0"
          class="table table-box"
        >
          <view
            v-for="(l, index) in lessons"
            :key="l.id + l.week + l.weekday"
            class="class"
            :style="composeLessonBlockStyle(l)"
          >
            <view
              class="class-card"
              :style="composeBgColorStyle(l)"
              :class="{ conflict: !!lessonIndexHasConflictMap.get(index) }"
              @tap="handleTapLesson(l)"
            >
              <view class="row">
                <view class="title">
                  {{ composeLessonName(l) }}
                </view>
                <view class="title">
                  {{ composeLessonRoom(l) }}
                </view>
              </view>
              <view class="row">
                <text class="item-content" style="-webkit-line-clamp: 2">
                  {{ l.lessonName }}
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
import { dayScheduleStartTime } from "@/constants/index";
import { Lesson } from "@/types/Lesson";
import { computed, StyleValue } from "vue";
import { findSurroundingLessons, toSortedLessons } from "./utils";
import "./index.scss";

const props = defineProps<{ lessons: Lesson[]; isThisWeek: boolean }>();
const emit = defineEmits(["classClick"]);
const BUILTIN_COLORS = [
  "green-600",
  "green-700",
  "blue-600",
  "yellow-600",
  "orange-600",
  "red-600",
  "purple-600"
] as const;
const WEEKDAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"] as const;

/** 课程方块的背景色 Map */
const lessonIdColorMap = computed(() => {
  const map = new Map<Lesson["classID"], typeof BUILTIN_COLORS[number]>();
  const sortedLessons = toSortedLessons(props.lessons);
  let colorSet = new Set(BUILTIN_COLORS);

  for (const current of sortedLessons) {
    if (map.get(current.classID)) continue;

    const surrounding = findSurroundingLessons(current, sortedLessons);

    /** 粗筛。周边的课程未使用的颜色 */
    const unusedColors = BUILTIN_COLORS.filter(
      c => !surrounding.some(l => map.get(l.classID) === c)
    );
    /** 精筛。结合四周课程未使用的颜色，继续筛选出前面的课程也未使用的颜色 */
    const fineFiltered = unusedColors.filter(c => colorSet.has(c));

    // 取色规则为，优先使用精筛的结果，再使用粗筛的
    let newColor = fineFiltered.at(0);

    if (!newColor) {
      if (unusedColors.length > 0) {
        newColor = unusedColors[0];
      } else {
        // 兜底处理，没颜色用了，就重置颜色集合，使用默认的颜色
        colorSet = new Set(BUILTIN_COLORS);
        newColor = colorSet.values().next().value;
      }
    }
    map.set(current.classID, newColor!);
    colorSet.delete(newColor!);
  }

  return map;
});

const lessonIndexHasConflictMap = computed(() => {
  const map = new Map<number, boolean>();

  for (let i = 0; i < props.lessons.length; i++) {
    for (let j = i + 1; j < props.lessons.length; j++) {
      const item = props.lessons[i];
      const item2 = props.lessons[j];
      if (item.weekday !== item2.weekday) continue;
      const from1 = parseInt(item.sections.split("-")[0]);
      const to1 = parseInt(item.sections.split("-")[1]);
      const from2 = parseInt(item2.sections.split("-")[0]);
      const to2 = parseInt(item2.sections.split("-")[1]);

      if (!(to1 < from2 || to2 < from1)) {
        map.set(i, true);
        map.set(j, true);
      }
    }
  }

  return map;
});

const nowWeekStyle = computed(() => {
  const now = new Date();
  const weekday = now.getDay() ? now.getDay() : 7;
  const left = `calc(100% / 7 * ${weekday - 1})`;
  return { left };
});

const nowStyle = computed(() => {
  const now = new Date();
  const hour = now.getHours();
  const min = now.getMinutes();
  let duration = 0;
  const nowTime = hour * 60 + min;

  // 这节课的开始时间
  let thisLesson = dayScheduleStartTime.find((item) => {
    if (
      nowTime >= item.hour * 60 + item.min &&
        nowTime <= item.hour * 60 + item.min + 45
    )
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

function composeBgColorStyle(lesson: Lesson): StyleValue {
  const color = lessonIdColorMap.value.get(lesson.classID) ?? BUILTIN_COLORS[0];
  return { "--bg-color": `var(--wjh-color-${color})` };
}

function composeLessonName(lesson: Lesson) {
  const str = lesson.lessonPlace;
  const index = str.split("").findIndex(c => c.charCodeAt(0) <= 255);
  return str.slice(0, index === -1 ? str.length : index);
}

function composeLessonRoom(lesson: Lesson) {
  const str = lesson.lessonPlace;
  const index = str.split("").findIndex(c => c.charCodeAt(0) <= 255);
  return str.slice(index === -1 ? str.length : index);
}

function composeLessonBlockStyle(lesson: Lesson) {
  const begin = parseInt(lesson.sections.split("-")[0]);
  const end = parseInt(lesson.sections.split("-")[1]);
  const weekday = parseInt(lesson.weekday);
  const fontSize = Math.min(12, (end - begin + 2) * 4) + "px";
  const height = `calc(100% / 12 * ${end - begin + 1})`;
  const top = `calc(100% / 12 * ${begin - 1})`;
  const left = `calc(100% / 7 * ${weekday - 1})`;
  return { top, left, height, fontSize };
}

function handleTapLesson(lesson: Lesson) {
  emit("classClick", lesson);
}

</script>

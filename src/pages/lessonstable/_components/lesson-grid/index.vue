<template>
  <view :class="styles['lessons-table-wrapper']">
    <view :class="[styles['jc-index-panel'], styles['index-panel']]">
      <view v-for="i in 12" :key="i">
        <view :class="styles['num-index']">{{ i }}</view>
      </view>
    </view>
    <view :class="styles['lessons-table']">
      <view :class="styles['col']" />
      <view :class="styles['col']">
        <view
          v-show="isThisWeek"
          :class="styles['now-week-index']"
          :style="{ left: `calc(100% / 7 * ${(new Date().getDay() || 7) - 1})` }"
        />
        <view :class="[styles['weekday-index-panel'], styles['index-panel']]">
          <view v-for="i in weekdayEnum" :key="i">
            <view :class="styles['num-index']">{{ i }}</view>
          </view>
        </view>
        <view
          v-if="lessonsTable && lessonsTable.length !== 0"
          :class="[styles['table'], styles['table-box']]"
        >
          <view
            v-for="cl in lessonsTable"
            :key="lessonKey(cl)"
            :class="styles['class']"
            :style="getPosition(cl)"
          >
            <view
              :class="styles['class-card']"
              :style="{ '--bg-color': `var(--wjh-color-${cl.color ?? 'primary'})` }"
              @tap="emit('lessonClick', cl)"
            >
              <view :class="styles['row']">
                <view :class="styles['title']">
                  {{ splitNameAndRoom(cl.lessonPlace)[0] }}
                </view>
                <view :class="styles['title']">
                  {{ splitNameAndRoom(cl.lessonPlace)[1] }}
                </view>
              </view>
              <view
                :class="[
                  styles['row'],
                  { [styles['row-content-visible']]: !isEmpty(cl.lessonName) }
                ]"
              >
                <text :class="styles['item-content']" :style="`-webkit-line-clamp: ${2}` as any">
                  {{ cl.lessonName }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-show="isThisWeek" :class="styles['now-index']" :style="nowStyle" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { isEmpty } from "lodash-es";
import { computed, toRefs } from "vue";

import { DAY_SCHEDULE_START_TIME } from "@/constants/day-schedule-start-time";
import type { Lesson } from "@/types/Lesson";

import { COLOR_SET } from "../../_constants/colors";
import styles from "./index.module.scss";
import { lessonKey } from "./utils/key";
import { buildTwoDimensionalLayout, colorLessons } from "./utils/layout-color";

const props = defineProps<{ lessons: Lesson[]; isThisWeek: boolean }>();
const { lessons } = toRefs(props);
const emit = defineEmits(["lessonClick"]);

const weekdayEnum = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

// 分层排布 + 着色（统一抽到 utils）
const lessonsTable = computed(() => {
  const layoutResult = buildTwoDimensionalLayout(lessons.value);
  return colorLessons(layoutResult, COLOR_SET);
});

// 计算当前时间线的位置
const nowStyle = computed(() => {
  const now = new Date();
  const hour = now.getHours();
  const min = now.getMinutes();
  let duration = 0;
  const nowTime = hour * 60 + min;

  // 这节课的开始时间
  let thisLesson = DAY_SCHEDULE_START_TIME.find((item) => {
    if (nowTime >= item.hour * 60 + item.min && nowTime <= item.hour * 60 + item.min + 45)
      return true;
  });

  if (thisLesson) duration = hour * 60 + min - (thisLesson.hour * 60 + thisLesson.min);
  else
    thisLesson = DAY_SCHEDULE_START_TIME.find((item) => {
      if (nowTime < item.hour * 60 + item.min) return true;
    }) ?? { hour: 21, min: 10 };

  // 第 ${jc + 1} 节课
  let jc = DAY_SCHEDULE_START_TIME.indexOf(thisLesson);

  jc = jc === -1 ? DAY_SCHEDULE_START_TIME.length : jc;
  return { top: `calc((100% - 2rem) / 12 * ${jc + duration / 45} + 2rem)` };
});

function splitNameAndRoom(str: string) {
  let index = 0;
  while (index < str.length) {
    const code = str.codePointAt(index);
    if (code && code <= 255) break;
    index++;
  }
  return [str.slice(0, index), str.slice(index)];
}

function getPosition(lesson: Lesson) {
  const begin = Number.parseInt(lesson.sections.split("-")[0]);
  const end = Number.parseInt(lesson.sections.split("-")[1]);
  const weekday = Number.parseInt(lesson.weekday);
  const stack = lesson.stack || 0;

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

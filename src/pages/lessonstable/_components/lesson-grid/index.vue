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
        <view v-show="isThisWeek" :class="styles['now-week-index']" :style="nowWeekStyle" />
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
        <current-time-indicator v-show="isThisWeek" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { isEmpty } from "lodash-es";
import { computed, toRefs } from "vue";

import type { Lesson } from "@/types/lesson";

import { COLOR_SET } from "../../_constants/colors";
import { buildTwoDimensionalLayout, colorLessons } from "../../_utils/layout-color";
import CurrentTimeIndicator from "../current-time-indicator/index.vue";
import { lessonKey, splitNameAndRoom } from "./_utils";
import styles from "./index.module.scss";

const props = defineProps<{ lessons: Lesson[]; isThisWeek: boolean }>();
const { lessons } = toRefs(props);
const emit = defineEmits(["lessonClick"]);

const weekdayEnum = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

const nowWeekStyle = computed(() => ({
  left: `calc(100% / 7 * ${(new Date().getDay() || 7) - 1})`
}));

// 分层排布 + 着色（统一抽到 utils）
const lessonsTable = computed(() => {
  const layoutResult = buildTwoDimensionalLayout(lessons.value);
  return colorLessons(layoutResult, COLOR_SET);
});

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

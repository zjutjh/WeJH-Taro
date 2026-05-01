<template>
  <pop-view v-model:show="show" style="z-index: 4000">
    <view v-if="practiceLessons && practiceLessons.length > 0" :class="styles['lesson-detail']">
      <view :class="styles['lesson-list']">
        <view
          v-for="(c, idx) in practiceLessons"
          :key="`${c.lessonName}-${c.className}-${c.teacherName}-${idx}`"
          :class="styles['practice-item']"
        >
          <view :class="styles['row']">
            <view
              :class="styles['lesson-title']"
              :style="{ color: `var(--wjh-color-${COLOR_SET[idx % COLOR_SET.length]})` }"
            >
              {{ c.lessonName }}
            </view>
            <!-- 这里没写错，className 返回的确实是时间 -->
            <view>时间：{{ c.className }}</view>
            <view>教师：{{ c.teacherName }}</view>
            <view>学分：{{ c.credits }}</view>
          </view>
        </view>
      </view>
    </view>
  </pop-view>
</template>

<script setup lang="ts">
import { PopView } from "@/components";
import type { PracticeLesson } from "@/types/lesson";

import { COLOR_SET } from "../../_constants/colors";
import styles from "./index.module.scss";

defineProps<{ practiceLessons?: PracticeLesson[] }>();

const show = defineModel<boolean>({ required: true });
</script>

<template>
  <pop-view :show="show" style="z-index: 4000" @update:show="emit('update:show', $event)">
    <view v-if="selection" :class="styles['lesson-detail']">
      <view :class="styles['lesson-title']">{{ selection.lessonName }}</view>
      <view>地点：{{ selection.campus }}-{{ selection.lessonPlace }} </view>
      <view>班级：{{ selection.className }} </view>
      <view>教师：{{ selection.teacherName }} </view>
      <view>
        时间：{{ selection.week }}丨{{ detailWeekDay(selection.weekday) }} ({{
          selection.sections
        }})丨{{ detailTimeInterval }}
      </view>
      <view>学分：{{ selection.credits }} </view>
    </view>

    <view
      v-else-if="selectionConflicts && selectionConflicts.length > 0"
      :class="styles['lesson-detail']"
    >
      <view :class="styles['conflict-header']">
        <view :class="styles['conflict-title-fixed']"
          >冲突课程({{ selectionConflicts.length }})</view
        >
        <view :class="styles['conflict-time-inline']">冲突时间：{{ conflictTime }}</view>
      </view>
      <view :class="styles['conflict-list']">
        <view
          v-for="(c, idx) in selectionConflicts"
          :key="`${c.id}-${c.week}-${c.weekday}-${c.sections}-${idx}`"
          :class="styles['conflict-item']"
        >
          <view :class="styles['row']">
            <view>地点：{{ c.campus }}-{{ c.lessonPlace }} </view>
            <view>班级：{{ c.className }} </view>
            <view>教师：{{ c.teacherName }} </view>
            <view>时间：{{ c.week }}丨{{ detailWeekDay(c.weekday) }} ({{ c.sections }}) </view>
            <view>学分：{{ c.credits }} </view>
          </view>
        </view>
      </view>
    </view>
  </pop-view>
</template>

<script setup lang="ts">
import { PopView } from "@/components";
import type { Lesson } from "@/types/Lesson";

import styles from "./index.module.scss";

defineProps<{
  show: boolean;
  selection?: Lesson;
  selectionConflicts: Lesson[] | null;
  conflictTime: string;
  detailTimeInterval: string;
}>();

const emit = defineEmits<{
  "update:show": [value: boolean];
}>();

function detailWeekDay(weekDay: string) {
  const charEnum = ["一", "二", "三", "四", "五", "六", "日"];
  return `周${charEnum[parseInt(weekDay) - 1]}`;
}
</script>

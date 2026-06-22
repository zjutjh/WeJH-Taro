<template>
  <pop-view v-model:show="show" style="z-index: 4000">
    <view v-if="selection" :class="styles['lesson-detail']">
      <view :class="styles['lesson-title']">{{ selection.lessonName }}</view>
      <view>地点：{{ selection.campus }}-{{ selection.lessonPlace }} </view>
      <view>班级：{{ selection.className }} </view>
      <view>教师：{{ selection.teacherName }} </view>
      <view>
        时间：{{ selection.week }}丨{{ detailWeekDay }} ({{ selection.sections }})丨{{
          detailTimeInterval
        }}
      </view>
      <view>学分：{{ selection.credits }} </view>
    </view>

    <view v-else-if="detailSelectionConflicts.length > 0" :class="styles['lesson-detail']">
      <view :class="styles['conflict-header']">
        <view :class="styles['conflict-title-fixed']">
          重叠课程({{ detailSelectionConflicts.length }})
        </view>
        <view :class="styles['conflict-time-inline']">冲突时间：{{ conflictTime }}</view>
      </view>
      <view :class="styles['lesson-list']">
        <view
          v-for="(c, idx) in detailSelectionConflicts"
          :key="`${c.id}-${c.week}-${c.weekday}-${c.sections}-${idx}`"
          :class="styles['conflict-item']"
        >
          <view :class="styles['row']">
            <view>地点：{{ c.campus }}-{{ c.lessonPlace }} </view>
            <view>班级：{{ c.className }} </view>
            <view>教师：{{ c.teacherName }} </view>
            <view>时间：{{ c.week }}丨{{ c.detailWeekDay }} ({{ c.sections }}) </view>
            <view>学分：{{ c.credits }} </view>
          </view>
        </view>
      </view>
    </view>
  </pop-view>
</template>

<script setup lang="ts">
import { useArrayMap } from "@vueuse/core";
import { computed } from "vue";

import { PopView } from "@/components";
import type { Lesson } from "@/types/lesson";

import styles from "./index.module.scss";

const props = defineProps<{
  selection?: Lesson;
  selectionConflicts?: Lesson[];
  conflictTime?: string;
  detailTimeInterval?: string;
}>();

const show = defineModel<boolean>({ required: true });

const detailWeekDay = computed(() => formatWeekDay(props.selection?.weekday));

const detailSelectionConflicts = useArrayMap(
  () => props.selectionConflicts ?? [],
  (lesson) => ({ ...lesson, detailWeekDay: formatWeekDay(lesson.weekday) })
);

function formatWeekDay(weekDay?: string) {
  if (!weekDay) return "";

  const charEnum = ["一", "二", "三", "四", "五", "六", "日"];
  const char = charEnum.at(Number.parseInt(weekDay) - 1);
  return char ? `周${char}` : weekDay;
}
</script>

<template>
  <card size="small" :class="styles.component">
    <w-collapse :class="[styles.examCollapseItem, isExamInOneDay ? styles.highlight : '']">
      <w-collapse-panel :arrow="true">
        <template #header>
          <view :class="styles.collapseHeader">
            <view :class="styles.lessonName">
              {{ props.data.lessonName }}
            </view>
            <view :class="styles.basicInfo">
              <view v-if="examTimeDiff.diffType === 'later'">距离考试还有 {{ timeDiffText }}</view>
              <view v-if="props.data.examTime !== '未放开不可查'" :class="styles.examTime">
                {{ props.data.examTime }}
              </view>
              <view v-if="props.data.examPlace !== '未放开不可查'" :class="styles.examPlace">
                {{ `${props.data.examPlace} - 座位号：${props.data.seatNum}` }}
              </view>
            </view>
          </view>
        </template>
        <w-descriptions :class="styles.examDetailList" size="small">
          <w-descriptions-item label="日期" :label-span="6">
            <template v-if="examTime.startAt.isValid()">
              {{ examTime.startAt.format("YYYY-MM-DD") }}{{ examDateTextSuffix }}
            </template>
            <template v-else>{{ props.data.examTime }}</template>
          </w-descriptions-item>
          <w-descriptions-item label="考试地点" :label-span="6">
            {{ props.data.examPlace }}
            <template v-if="props.data.seatNum !== '未放开不可查'">
              {{ ` - 座位号：${props.data.seatNum}` }}
            </template>
          </w-descriptions-item>
          <w-descriptions-item label="考试全称" :label-span="6">
            {{ props.data.className }}
          </w-descriptions-item>
          <w-descriptions-item label="教师列表" :label-span="6">
            {{ teacherNameText }}
          </w-descriptions-item>
        </w-descriptions>
      </w-collapse-panel>
    </w-collapse>
  </card>
</template>

<script setup lang="ts">
import { defaultTo } from "lodash-es";
import { computed } from "vue";

import type { ExamInfo } from "@/api/types/zf";
import { Card, WCollapse, WCollapsePanel, WDescriptions, WDescriptionsItem } from "@/components";
import { diffTime, formatDuration, getWeekday, parseZfExamTime } from "@/utils";

import styles from "./index.module.scss";

const props = defineProps<{
  /** 考试安排数据 */
  data: ExamInfo;
  /** 基准时间 */
  now: Date;
}>();

/** 解析出的考试时间 */
const examTime = computed(() => parseZfExamTime(props.data.examTime));

/** 考试开始时间距今时间 */
const examTimeDiff = computed(() => {
  return diffTime(examTime.value.startAt, {
    baseTime: props.now
  });
});

/** 考试距离是否短于一天 */
const isExamInOneDay = computed(() => defaultTo(examTimeDiff.value.abs.asDays(), Infinity) < 1);

/** 考试开始距今时间文本 */
const timeDiffText = computed(() =>
  formatDuration(
    diffTime(examTime.value.startAt, {
      baseTime: props.now,
      minUnit: "minutes",
      roundingMethod: "floor",
      roundToLargestUnit: !isExamInOneDay.value
    }).abs
  )
);

/** 考试日期文本的后缀 */
const examDateTextSuffix = computed(() => {
  if (!examTime.value.startAt.isValid()) return "";
  return ` - 周${getWeekday(examTime.value.startAt)}`;
});

/** 教师列表文本 */
const teacherNameText = computed(() =>
  // 替换分号为全角，去除姓名以外的内容
  props.data.teacherName.replace(/;/g, "；").replace(/[^；]*?\//g, "")
);
</script>

<template>
  <card size="small" :class="styles.component">
    <w-collapse :class="[styles.examCollapseItem, { [styles.highlight]: isExamInOneDay }]">
      <w-collapse-panel :arrow="true">
        <template #header>
          <view :class="styles.collapseHeader">
            <view :class="styles.lessonName">
              {{ props.data.lessonName }}
            </view>
            <view :class="styles.basicInfo">
              <view v-if="meta.startAtDiff.diffType === 'later'">
                距离考试还有 {{ timeDiffText }}
              </view>
              <view v-else-if="meta.endAt.isAfter(props.now)">正在考试</view>
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
            <template v-if="meta.startAt.isValid()">
              {{ meta.startAt.format("YYYY-MM-DD") }}{{ examDateTextSuffix }}
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
import { computed, toRef } from "vue";

import { Card, WCollapse, WCollapsePanel, WDescriptions, WDescriptionsItem } from "@/components";
import { ExamInfoExtended } from "@/types/exam";
import { formatDuration, getWeekday } from "@/utils";

import styles from "./index.module.scss";

const props = defineProps<{
  /** 考试安排数据 */
  data: ExamInfoExtended;
  /** 当前时间 */
  now: Date;
}>();

/** 考试安排的拓展数据 */
const meta = toRef(() => props.data.meta);

/** 考试距离是否短于一天且未结束 */
const isExamInOneDay = computed(
  () => meta.value.startAtDiff.abs.asDays() < 1 && meta.value.endAt.isAfter(props.now)
);

/** 考试开始距今时间文本 */
const timeDiffText = computed(() =>
  formatDuration(meta.value.startAtDiff.abs, {
    // 若考试距离介于1小时到1天之间，显示2单位，否则显示1单位
    largest:
      meta.value.startAtDiff.abs.asDays() < 1 && meta.value.startAtDiff.abs.asHours() > 1 ? 2 : 1
  })
);

/** 考试日期文本的后缀 */
const examDateTextSuffix = computed(() => {
  if (!meta.value.startAt.isValid()) return "";
  return ` - 周${getWeekday(meta.value.startAt)}`;
});

/** 教师列表文本 */
const teacherNameText = computed(() =>
  // 替换分号为全角，去除姓名以外的内容
  props.data.teacherName.replaceAll(";", "；").replaceAll(/[^；]*?\//g, "")
);
</script>

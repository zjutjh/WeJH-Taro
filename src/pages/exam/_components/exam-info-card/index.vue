<template>
  <card size="small" :class="styles.component">
    <w-collapse :class="styles.examCollapseItem">
      <w-collapse-panel :arrow="true">
        <template #header>
          <view
            :class="styles.lessonName"
            :style="
              timeInterval(props.data.examTime) === 0
                ? 'color: var(--wjh-color-primary-dark)'
                : undefined
            "
          >
            {{ props.data.lessonName }}
          </view>
          <view style="font-size: 14px; color: var(--wjh-color-text-secondary)">
            <view
              v-if="
                timeInterval(props.data.examTime) >= 0 && timeInterval(props.data.examTime) <= 14
              "
              :style="
                timeInterval(props.data.examTime) === 0
                  ? 'color: var(--wjh-color-primary-dark)'
                  : undefined
              "
            >
              距离考试还有 {{ timeInterval(props.data.examTime) }} 天
            </view>
            <view
              :class="styles.examTime"
              :style="
                timeInterval(props.data.examTime) === 0
                  ? 'color: var(--wjh-color-primary-dark)'
                  : undefined
              "
            >
              {{ props.data.examTime }}
            </view>
            <view
              v-if="props.data.examTime !== '未放开不可查'"
              :class="styles.examPlace"
              :style="
                timeInterval(props.data.examTime) === 0
                  ? 'color: var(--wjh-color-primary-dark)'
                  : undefined
              "
            >
              {{ `${props.data.examPlace} - 座位号：${props.data.seatNum}` }}
            </view>
          </view>
        </template>
        <w-descriptions :class="styles.examDetailList" size="small">
          <w-descriptions-item label="日期" :label-span="6">
            {{ getDetailedTime(props.data.examTime) }}
          </w-descriptions-item>
          <w-descriptions-item label="考试地点" :label-span="6">
            <text>{{ props.data.examPlace }}</text
            ><text v-if="props.data.seatNum !== '未放开不可查'">
              {{ ` - 座位号：${props.data.seatNum}` }}
            </text>
          </w-descriptions-item>
          <w-descriptions-item label="考试全称" :label-span="6">
            {{ props.data.className }}
          </w-descriptions-item>
          <w-descriptions-item label="教师列表" :label-span="6">
            {{
              props.data.teacherName
                .split(";")
                .map((item) => item.split("/")[1])
                .join("；")
            }}
          </w-descriptions-item>
        </w-descriptions>
      </w-collapse-panel>
    </w-collapse>
  </card>
</template>

<script setup lang="ts">
import dayjs, { ConfigType } from "dayjs";

import type { ExamInfo } from "@/api/types/zf";
import { Card, WCollapse, WCollapsePanel, WDescriptions, WDescriptionsItem } from "@/components";

import styles from "./index.module.scss";

const props = defineProps<{
  data: ExamInfo;
}>();

const getDetailedTime = (timeString: string) => {
  const tmp: ConfigType = timeString.split("(")[0];
  const dayChars = ["日", "一", "二", "三", "四", "五", "六"];
  if (dayChars[dayjs(tmp).day()]) {
    return `${tmp} - 周${dayChars[dayjs(tmp).day()]}`;
  }
  return `${tmp}`;
};

const timeInterval = (timeString: string) => {
  const tmp: ConfigType = timeString.split("(")[0];
  return dayjs(tmp).diff(dayjs(dayjs().format("YYYY-MM-DD")), "day");
};
</script>

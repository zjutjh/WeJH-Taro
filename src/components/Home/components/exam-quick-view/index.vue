<template>
  <quick-view-container
    title="考试安排"
    icon-name="exam"
    :help="true"
    :class="styles.examQuickView"
    @tap="nav2Exam"
    @handle-tap-help="handleHelpTap"
  >
    <text class="sub-text">近期考试 ({{ updateTimeText }})</text>
    <card v-if="!examDerivativeList || examDerivativeList.length === 0" style="text-align: center">
      未查询到近日考试信息
    </card>
    <card
      v-for="item in examDerivativeList"
      v-else
      :key="`${item.id}-${item.examTime}-${item.lessonPlace}-${item.seatNum}`"
      :class="styles.examCard"
    >
      <view :class="styles.textWrapper">
        <view :class="[styles.examName, { [styles.highlight]: item.meta.phase === 'inProgress' }]">
          {{ item.lessonName }}
        </view>
        <view :class="styles.examTime">
          <text>{{ item.meta.startAt.format("MM/DD") }}</text>
          <text>{{ item.meta.startAt.format("HH:mm") }}</text>
        </view>
      </view>
      <view :class="styles.textWrapper">
        <text :class="styles.examPlace">{{ `${item.examPlace} - 座位号：${item.seatNum}` }}</text>
        <view :class="styles.examState">
          <text v-if="item.meta.phase === 'inProgress'" :class="styles.highlight">正在考试</text>
          <text v-else-if="item.meta.phase === 'notStarted' && item.meta.startAt.isValid()"
            >还有 {{ formatDuration(item.meta.startAtDiff.abs, { largest: 1 }) }}开始</text
          >
        </view>
      </view>
    </card>
  </quick-view-container>
</template>

<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import Taro from "@tarojs/taro";
import { useNow } from "@vueuse/core";
import dayjs from "dayjs";
import { compact, map, sortBy } from "lodash-es";
import { computed } from "vue";

import { Card } from "@/components";
import { zfServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { systemStore } from "@/store";
import { diffTime, formatDuration, parseZfExamTime } from "@/utils";

import QuickViewContainer from "../quick-view-container/index.vue";
import type { ExamPhase } from "./_types";
import styles from "./index.module.scss";

const emit = defineEmits<{
  showHelp: [helpType: string];
}>();

const refNow = useNow({ interval: 1000 * 10 });

/** 所选学年 */
const selectYear = computed(() => systemStore.generalInfo.termYear);
/** 所选学期 */
const selectTerm = computed(() => systemStore.generalInfo.term);

// 获取考试安排列表
const { data: examInfoData, dataUpdatedAt: examInfoUpdatedAt } = useQuery({
  queryKey: [QUERY_KEY.ZF_EXAM, selectYear, selectTerm] as const,
  queryFn: ({ queryKey }) => zfServiceNext.QueryExamInfo({ year: queryKey[1], term: queryKey[2] })
});

/** 更新时间文本 */
const updateTimeText = computed(() => {
  if (examInfoUpdatedAt.value) return dayjs(examInfoUpdatedAt.value).fromNow();
  return "更新失败!";
});

/** 加工筛选后的考试信息列表 */
const examDerivativeList = computed(() => {
  // 同时完成字段拓展和筛选
  let list = compact(
    map(examInfoData.value, (exam) => {
      // 过滤未放开不可查的
      if (exam.examTime === "未放开不可查") return null;

      // 解析考试时间
      const { startAt, endAt } = parseZfExamTime(exam.examTime);

      // 过滤无效时间
      if (!startAt.isValid()) return null;

      /** 考试开始时间距今 */
      const startAtDiff = diffTime(startAt, {
        baseTime: refNow.value,
        minUnit: "minutes"
      });

      // 过滤不在3天内的
      if (startAtDiff.abs.asDays() > 3) return null;

      // 判断考试时间范围
      let phase: ExamPhase;
      if (endAt.isBefore(refNow.value)) {
        phase = "finished";
      } else if (startAt.isAfter(refNow.value)) {
        phase = "notStarted";
      } else {
        phase = "inProgress";
      }

      // 过滤已结束的
      if (phase === "finished") return null;

      return {
        ...exam,
        meta: {
          startAt,
          endAt,
          startAtDiff,
          phase
        }
      };
    })
  );

  // 从近到远排序
  list = sortBy(list, (exam) => parseZfExamTime(exam.examTime).startAt.valueOf());

  return list;
});

/** 点击显示帮助弹窗 */
const handleHelpTap = () => {
  emit("showHelp", "exam-card");
};

/** 跳转考试安排页 */
const nav2Exam = () => {
  Taro.navigateTo({ url: "/pages/exam/index" });
};
</script>

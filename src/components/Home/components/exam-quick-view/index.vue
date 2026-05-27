<template>
  <quick-view-container
    title="考试安排"
    icon-name="exam"
    :help="true"
    :class="styles.examQuickView"
    @tap="nav2Exam"
    @handle-tap-help="handleTapHelp"
  >
    <text class="sub-text">近期考试 ({{ updateTimeString }})</text>
    <card v-if="!filteredExamItems || filteredExamItems.length === 0" style="text-align: center">
      未查询到近日考试信息
    </card>
    <card v-for="item in filteredExamItems" v-else :key="item.id" :class="styles.examCard">
      <view style="display: flex; flex-direction: column; gap: 10px; align-items: flex-start">
        <view :class="styles.textWrapper">
          <view :class="[styles.examName, examState(item.examTime)]">{{ item.lessonName }}</view>
          <view :class="styles.examTime">
            <text>{{ dayjs(getExamTime(item.examTime).date).format("MM/DD") }}</text>
            <text>{{ getExamTime(item.examTime).start }}</text>
          </view>
        </view>
        <view :class="styles.textWrapper">
          <text :class="styles.examPlace">{{ `${item.examPlace} - 座位号：${item.seatNum}` }}</text>
          <view :class="styles.examState">
            <text v-if="examState(item.examTime) === 'taking'" :class="styles.highlight"
              >正在考试</text
            >
            <text v-else-if="examState(item.examTime) === 'after'">考试已结束</text>
            <template v-else-if="examState(item.examTime) === 'before'">
              <text v-if="timeUtils.getDayInterval(getExamTime(item.examTime).date) > 0"
                >还有 {{ timeUtils.getDayInterval(getExamTime(item.examTime).date) }} 天开始</text
              >
              <template v-else>
                <text v-if="minuteInterval(getExamTime(item.examTime).start) >= 60"
                  >还有
                  {{ Math.floor(minuteInterval(getExamTime(item.examTime).start) / 60) }}
                  小时开始</text
                >
                <text v-else
                  >还有 {{ minuteInterval(getExamTime(item.examTime).start) }} 分钟开始</text
                >
              </template>
            </template>
          </view>
        </view>
      </view>
    </card>
  </quick-view-container>
</template>

<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { isNil } from "lodash-es";
import { computed } from "vue";

import { Card } from "@/components";
import { zfServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { systemStore } from "@/store";
import { Exam } from "@/types/Exam";
import { timeUtils } from "@/utils";

import QuickViewContainer from "../quick-view-container/index.vue";
import styles from "./index.module.scss";

const emit = defineEmits(["showHelp"]);

const selectYear = computed(() => systemStore.generalInfo.termYear);
const selectTerm = computed(() => systemStore.generalInfo.score || systemStore.generalInfo.term);

const { data: examInfoData, dataUpdatedAt: examInfoUpdatedAt } = useQuery({
  queryKey: [QUERY_KEY.ZF_EXAM, selectYear, selectTerm] as const,
  queryFn: ({ queryKey }) => zfServiceNext.QueryExamInfo({ year: queryKey[1], term: queryKey[2] })
});

const updateTimeString = computed(() => {
  if (examInfoUpdatedAt.value) return dayjs(examInfoUpdatedAt.value).fromNow();
  return "更新失败!";
});

/** 筛选近期考试(未来3日内) */
const filteredExamItems = computed(() => {
  if (isNil(examInfoData.value)) return [];
  let list: Exam[] = [];
  list = examInfoData.value.filter((item) => {
    if (item.examTime === "未放开不可查") return 0;
    const { date, start } = getExamTime(item.examTime);
    const resDay = timeUtils.getDayInterval(new Date(`${date} ${start}:00`));
    return resDay <= 3 && resDay >= 0 && examState(item.examTime) !== "after";
  });
  return list.sort((a, b) => {
    const { date: dateA, start: timeA } = getExamTime(a.examTime);
    const { date: dateB, start: timeB } = getExamTime(b.examTime);
    return dayjs(`${dateA}-${timeA}`) < dayjs(`${dateB}-${timeB}`) ? 1 : -1;
  });
});

const nav2Exam = () => {
  Taro.navigateTo({ url: "/pages/exam/index" });
};

const handleTapHelp = () => {
  emit("showHelp", "exam-card");
};

const getExamTime = (examTimeString: string) => {
  const examTime = examTimeString.split("(");
  const detailedTime: string[] = examTime[1].split("-");
  detailedTime[1] = detailedTime[1].slice(0, detailedTime[1].length - 1);
  return {
    date: examTime[0], // e.g. 2023-02-17
    start: detailedTime[0], // e.g. 13:30
    end: detailedTime[1] // e.g. 15:30
  };
};

const minuteInterval = (clock: string) => {
  const [hour, minute] = clock.split(":").map((item) => parseInt(item));
  const { hours, minutes } = timeUtils.getHMInterval({ hour, minute });
  return hours * 60 + minutes;
};

/**
 * 考试状态
 * @param examTimeString
 * @returns "before" | "taking" | "after"
 */
const examState = (examTimeString: string) => {
  const { date, start, end } = getExamTime(examTimeString);
  const nowTime = new Date();
  const startTime = new Date(`${date} ${start}:00`);
  const endTime = new Date(`${date} ${end}`);
  if (nowTime.getTime() - startTime.getTime() < 0) return "before";
  else if (nowTime.getTime() - endTime.getTime() <= 0) return "taking";
  return "after";
};
</script>

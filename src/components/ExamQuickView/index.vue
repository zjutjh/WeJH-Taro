<template>
  <quick-view
    title="考试安排"
    icon-name="exam"
    :help="true"
    class="exam-quick-view"
    @tap="nav2Exam"
    @handle-tap-help="handleTapHelp"
  >
    <text class="sub-text"> 近期考试 ({{ updateTimeString }}) </text>
    <card v-if="!filteredExamItems || filteredExamItems.length === 0" style="text-align: center">
      未查询到近日考试信息
    </card>
    <card v-for="item in filteredExamItems" v-else :key="item.id" class="exam-card">
      <view style="display: flex; flex-direction: column; gap: 10px; align-items: flex-start">
        <view class="text-wrapper">
          <view :class="['exam-name', examState(item.examTime)]">
            {{ item.lessonName }}
          </view>
          <view class="exam-time">
            <text> {{ dayjs(getExamTime(item.examTime).date).format("MM/DD") }} </text>
            <text> {{ getExamTime(item.examTime).start }} </text>
          </view>
        </view>
        <view class="text-wrapper">
          <text class="exam-place">
            {{ `${item.examPlace} - 座位号：${item.seatNum}` }}
          </text>
          <view class="exam-state">
            <text v-if="examState(item.examTime) === 'taking'" class="taking"> 正在考试 </text>
            <text v-else-if="examState(item.examTime) === 'after'"> 考试已结束 </text>
            <template v-else-if="examState(item.examTime) === 'before'">
              <text v-if="timeUtils.getDayInterval(getExamTime(item.examTime).date) > 0">
                还有 {{ timeUtils.getDayInterval(getExamTime(item.examTime).date) }} 天开始
              </text>
              <template v-else>
                <text v-if="minuteInterval(getExamTime(item.examTime).start) >= 60">
                  还有
                  {{ Math.floor(minuteInterval(getExamTime(item.examTime).start) / 60) }} 小时开始
                </text>
                <text v-else>
                  还有 {{ minuteInterval(getExamTime(item.examTime).start) }} 分钟开始
                </text>
              </template>
            </template>
          </view>
        </view>
      </view>
    </card>
  </quick-view>
</template>

<script lang="ts" setup>
import "./index.scss";

import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { computed, onMounted, ref } from "vue";

import { ZFService } from "@/services";
import { systemStore } from "@/store";
import { Exam } from "@/types/Exam";
import { timeUtils } from "@/utils";

import Card from "../Card/index.vue";
import QuickView from "../QuickView/index.vue";

const emit = defineEmits(["showHelp"]);

const selectTerm = ref({
  year: systemStore.generalInfo.termYear,
  term: systemStore.generalInfo.score || systemStore.generalInfo.term
});

const updateTimeString = computed(() => {
  if (updateTime.value !== undefined) return dayjs(updateTime.value).fromNow();
  return "更新失败!";
});

/**
 * 筛选近期考试
 *
 * 未来3日
 */
const filteredExamItems = computed(() => {
  let list: Exam[] = [];
  const exam = ZFService.getExamInfo(selectTerm.value).data;
  try {
    list = exam.filter((item) => {
      if (item.examTime === "未放开不可查") return 0;
      const { date, start } = getExamTime(item.examTime);
      // 距离考试的剩余时间(ms)，为正表示考试为开始，为负表示考试结束
      const resDay = timeUtils.getDayInterval(new Date(`${date} ${start}:00`));
      return resDay <= 3 && resDay >= 0 && examState(item.examTime) !== "after";
    });
  } catch (e) {
    console.error(e);
  }
  return list.sort((a, b) => {
    const { date: dateA, start: timeA } = getExamTime(a.examTime);
    const { date: dateB, start: timeB } = getExamTime(b.examTime);
    return dayjs(`${dateA}-${timeA}`) < dayjs(`${dateB}-${timeB}`) ? 1 : -1;
  });
});

const updateTime = computed(() => {
  let updata: Date | null = null;
  try {
    updata = ZFService.getExamInfo(selectTerm.value).updateTime;
    if (updata === null) return undefined;
    return updata;
  } catch {
    return undefined;
  }
});

function nav2Exam() {
  Taro.navigateTo({ url: "/pages/exam/index" });
}

function handleTapHelp() {
  emit("showHelp", "exam-card");
}

function getExamTime(examTimeString: string) {
  const examTime = examTimeString.split("(");
  const detailedTime: string[] = examTime[1].split("-");
  detailedTime[1] = detailedTime[1].slice(0, detailedTime[1].length - 1);
  return {
    date: examTime[0], // e.g. 2023-02-17
    start: detailedTime[0], // e.g. 13:30
    end: detailedTime[1] // e.g. 15:30
  };
}

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
function examState(examTimeString: string) {
  const { date, start, end } = getExamTime(examTimeString);
  const nowTime = new Date();
  const startTime = new Date(`${date} ${start}:00`);
  const endTime = new Date(`${date} ${end}`);
  if (nowTime.getTime() - startTime.getTime() < 0) return "before";
  else if (nowTime.getTime() - endTime.getTime() <= 0) return "taking";
  return "after";
}

onMounted(() => {
  ZFService.updateExamInfo(selectTerm.value);
});
</script>

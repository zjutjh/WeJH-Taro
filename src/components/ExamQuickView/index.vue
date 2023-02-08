<template>
  <quick-view
    title="考试安排"
    icon-name="exam"
    @tap="nav2Exam"
    help
    @handle-tap-help="handleTapHelp"
    class="exam-quick-view"
  >
    <text class="sub-text">近期考试 ({{ updateTimeString }})</text>
    <card v-if="!filteredExamItems || filteredExamItems.length === 0"
      style="text-align: center">
      未查询到近日考试信息
    </card>
    <card v-else v-for="item in filteredExamItems" :key=item.id class="exam-card">
      <view style="display: flex; flex-direction: column; gap: 10Px; align-items: flex-start;">
        <view :class="['exam-name', examState(item.examTime)]"> {{ item.lessonName }} </view>
        <view class="text-wrapper">
          <text class="exam-place">
            {{ `${item.examPlace} - 座位号：${item.seatNum}` }}
          </text>
          <view class="exam-time">
            <text class="taking" v-if="examState(item.examTime) === 'taking'">
              正在考试
            </text>
            <text v-else-if="examState(item.examTime) === 'after'">
              考试已结束
            </text>
            <text v-else-if="examState(item.examTime) === 'before'">
              还有 {{ timeUtils.getDayInterval(item.examTime) }} 天开始
            </text>
          </view>
        </view>
      </view>
    </card>
  </quick-view>
</template>

<script lang="ts" setup>
import Card from "../Card/index.vue";
import QuickView from "../QuickView/index.vue";
import Taro from "@tarojs/taro";
import "./index.scss";
import { computed, onMounted, ref } from "vue";
import { systemStore } from "@/store";
import { ZFService } from "@/services";
import dayjs from "dayjs";
import { timeUtils } from "@/utils";
import { Exam } from "@/types/Exam";

const emit = defineEmits(["showHelp"]);

const selectTerm = ref({
  year: systemStore.generalInfo.termYear,
  term: systemStore.generalInfo.term
});

const updateTimeString = computed( () => {
  if(updateTime.value !== undefined) return dayjs(updateTime.value).fromNow();
  else return "更新失败!";
});

/**
 * 筛选近期考试
 *
 * 未来2日，过去1日
 */
const filteredExamItems = computed(() => {
  let list: Exam[] = [];
  const exam = ZFService.getExamInfo(selectTerm.value)?.data;
  try {
    list = exam.filter(item => {
      if (item.examTime === "未放开不可查") return 0;
      const { date, start } = getExamTime(item.examTime);
      // 距离考试的剩余时间(ms)，为正表示考试为开始，为负表示考试结束
      const resDay = timeUtils.getDayInterval(
        new Date(date + " " + start + ":00")
      );
      return (resDay <= 3 && resDay >= -1);
    });
  } catch (e) {
    console.log(e);
  }
  return list;
});

const updateTime = computed(() => {
  let updata: Date | null = null;
  try {
    updata = ZFService.getExamInfo(selectTerm.value)?.updateTime;
    if(updata === null) return undefined;
    else return updata;
  }
  catch (e) {
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
  detailedTime[1] = detailedTime[1].slice( 0 , detailedTime[1].length - 1);
  return {
    date: examTime[0], // e.g. 2023-02-17
    start: detailedTime[0], // e.g. 13:30
    end: detailedTime[1], // e.g. 15:30
  };
}

/**
 * 考试状态
 * @param examTimeString
 * @returns "before" | "taking" | "after"
 */
function examState(examTimeString: string) {
  const { date, start, end } = getExamTime(examTimeString);
  let nowTime = new Date();
  let startTime = new Date(date + " " + start + ":00");
  let endTime = new Date(date + " " + end);
  if (nowTime.getTime() - startTime.getTime() < 0) return "before";
  else if (nowTime.getTime() - endTime.getTime() <= 0) return "taking";
  else return "after";
}

onMounted(() => {
  ZFService.updateExamInfo(selectTerm.value);
});

</script>

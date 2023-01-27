<template>
  <quick-view
    title="考试安排"
    icon-name="lessonstable"
    @tap="nav3Exam"
    help
    @handle-tap-help="handleTapHelp"
    class="exam-quick-view"
  >
    <text class="sub-text">近期考试 ({{ updateTimeString }})</text>
    <card
      v-if="!filteredExamItems || filteredExamItems.length === 0"
      style="text-align: center"
      >未查询到近日考试信息</card
    >
    <card v-for="item in filteredExamItems" :key="item.id" class="exam-card">
      <view>
        <view>
          <text class="exam-name">{{ item.lessonName }}</text>
        </view>
        <view>
          <text class="exam-place">{{
            `${item.examPlace} - 座位号：${item.seatNum}`
          }}</text>
          <view class="exam-res">
            <text v-if="examState(item.examTime) === 'taking'">正在考试</text>
            <text v-if="examState(item.examTime) === 'after'">考试已结束</text>
            <text v-if="examState(item.examTime) === 'before'"
              >还有 {{ getRestTimeString(item.examTime) }} 开始</text
            >
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
import { computed, ref } from "vue";
import { systemStore } from "@/store";
import { ZFService } from "@/services";
import dayjs from "dayjs";
import { useTimeInstance } from "@/hooks";
const emit = defineEmits(["showHelp"]);

const selectTerm = ref({
  year: systemStore.generalInfo.termYear,
  term: systemStore.generalInfo.term,
});

const updateTimeString = computed(() => {
  if (updateTime.value !== undefined) return dayjs(updateTime.value).fromNow();
  else return "更新失败!";
});

const filteredExamItems = computed(() => {
  return exam.value?.filter((item) => {
    try {
      if (item.examTime === "未开放不可查") return 0;
      const examTime = getExamTime(item.examTime);
      const resTime =
        new Date().getTime() -
        new Date(examTime[0] + " " + examTime[1] + ":00").getTime();
      const resDay = Math.floor(resTime / 1000 / 60 / 60 / 24); //算出剩下的天数有多少
      return resDay <= 2 && resDay >= -1;
    } catch (e) {
      console.log(e);
    }
  });
});

const exam = computed(() => {
  return ZFService.getExamInfo(selectTerm.value)?.data;
});

const updateTime = computed(() => {
  let updata: Date | null = null;
  try {
    updata = ZFService.getExamInfo(selectTerm.value)?.updateTime;
    if (updata === null) return undefined;
    else return updata;
  } catch (e) {
    return undefined;
  }
});

function nav3Exam() {
  Taro.navigateTo({ url: "/pages/exam/index" });
}
function handleTapHelp() {
  emit("showHelp", "exam-card");
}

function getExamTime(examTimeString: string) {
  const examTime = examTimeString.split("(");
  const detailedTime: string[] = examTime[1].split("-");
  detailedTime[1] = detailedTime[1].slice(0, detailedTime[1].length - 1);
  return [examTime[0], detailedTime[0], detailedTime[1]];
}

function getResTime(leftTime: number) {
  return [
    Math.floor(leftTime / 1000 / 60 / 60 / 24) + "天",
    Math.floor((leftTime / 1000 / 60 / 60) % 24) + "小时",
    Math.floor((leftTime / 1000 / 60) % 60) + "分钟",
  ];
}

// FIXME: 下面这段代码不写在try语句块里的话split就会报错,不知道为啥 (?)
function examState(examTimeString: string) {
  try {
    const examTime = getExamTime(examTimeString);
    let nowTime = new Date();
    let startTime = new Date(examTime[0] + " " + examTime[1] + ":00");
    let endTime = new Date(examTime[0] + " " + examTime[2]);
    if (nowTime.getTime() - startTime.getTime() < 0) return "before";
    else if (nowTime.getTime() - endTime.getTime() <= 0) return "taking";
    else return "after";
  } catch (e) {
    console.log(e);
  }
}

function getRestTimeString(examTimeString: string) {
  try {
    const examTime = getExamTime(examTimeString);
    let res =
      new Date(examTime[0] + " " + examTime[1] + ":00").getTime() -
      new Date().getTime();
    const resTime = getResTime(res);
    for (let i = 0; i < 3; i++) if (resTime[i][0] !== "0") return resTime[i];
  } catch (e) {
    console.log(e);
  }
}
</script>

<style scoped>
</style>

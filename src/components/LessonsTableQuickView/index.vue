<template>
  <quick-view @tap="nav2Lesson" title="课程表" icon-name="lessonstable" class="lessons-table-quick-view" help
              @handle-tap-help="handleTapHelp">
    <text class="sub-text" v-if="!showTomorrow">今日课表 ({{ updateTimeString }})</text>
    <text class="sub-text" v-else>明日课表 ({{ updateTimeString }})</text>

    <card
      v-for="(item, index) in lessonTable"
      :key="item.lessonName"
      :style="{
        '--bg-color': index % 2 ? 'var(--wjh-color-primary)' : 'var(--wjh-color-primary-dark)'
      } as CSSProperties"
    >
      <view class="lesson-item" :key="updateRestTimeCounter + index">
        <view class="important-line">
          <text class="lesson-place">{{ item.lessonPlace }}</text>
          <text v-if="lessonState(item.sections) === 'before'" class="before-lesson">
            还有 {{ getRestTimeString(item.sections) }} 上课
          </text>
          <text v-else-if="lessonState(item.sections) === 'taking'" class="taking-lesson">
            上课中
          </text>
        </view>
        <view class="teacher">
          <text class="iconfont icon-teacher"></text>
          <text class="teacher-name">
            {{ ` ${item.teacherName}` }}
          </text>
          <text class="duration">
            ({{ sectionsTimeString(item.sections) }})
          </text>
        </view>
        <text class="lesson-name">{{ item.lessonName }}</text>
      </view>
    </card>

    <view class="default-content" v-if="lessonTable?.length === 0 && !showTomorrow" >
      今天居然没有课😄
    </view>
    <view class="default-content" v-if="lessonTable?.length === 0 && showTomorrow" >
      明天居然没有课😄
    </view>
    <view class="default-content" v-if="!lessonTable">
      点击获取你的课表 ～</view>
  </quick-view>
</template>

<script setup lang="ts">
import Card from "../Card/index.vue";
import QuickView from "../QuickView/index.vue";
import Taro from "@tarojs/taro";
import { ZFService } from "@/services";
import dayjs from "dayjs";
import { CSSProperties, computed, onMounted, ref, onUnmounted, Ref } from "vue";
import { serviceStore, systemStore } from "@/store";
import "./index.scss";
import { dayScheduleStartTime } from "@/constants/dayScheduleStartTime";
import { useTimeInstance } from "@/hooks";
import { Lesson } from "@/types/Lesson";

const tenPM = dayjs().set("hour", 22).set("minute", 0).set("second", 0);
const emit = defineEmits(["showHelp"]);
const timer: Ref<ReturnType<typeof setInterval> | null> = ref(null);

const showTomorrow = dayjs().isAfter(tenPM);

const lessonTable = computed(() => {
  const year = systemStore.generalInfo.termYear;
  const term = systemStore.generalInfo.term;
  let tmp: Lesson[] | undefined;
  try {
    tmp =  showTomorrow ? ZFService.getDayLessonTable("tomorrow") : ZFService.getDayLessonTable("today");
    serviceStore.zf.lessonsTableInfo[year][term].data.lessonsTable;
  } catch (error) {
    tmp = undefined;
  }
  return tmp;
});

const updateRestTimeCounter = ref(0);
// TODO: 计时器控制渲染

onMounted(() => {
  timer.value = setInterval(() => {
    updateRestTimeCounter.value++;
  }, 5000);
});

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value);
});

const updateTimeString = computed(() => {
  if (!updateTime.value) return "更新失败";
  return dayjs(updateTime.value).fromNow();
});

const updateTime = computed(() => {
  let updateTime: Date | undefined = undefined;
  try {
    updateTime =
      serviceStore.zf.lessonsTableInfo[systemStore.generalInfo.termYear][
        systemStore.generalInfo.term
        ]?.updateTime;
    if (updateTime) return updateTime;
    else return undefined;
  } catch (e) {
    return undefined;
  }
});

function nav2Lesson() {
  Taro.navigateTo({ url: "/pages/lessonstable/index" });
}

function sectionsTimeString(sections: string) {
  const arr = sections.split("-");
  return `${getLessonTimeInstance(parseInt(arr[0])).format("HH:mm")}-${getLessonTimeInstance(parseInt(arr[1]), 45).format("HH:mm")}`;
}

function getLessonTimeInstance(jc: number, offset = 0) {
  return useTimeInstance(
    dayScheduleStartTime[jc - 1].hour,
    dayScheduleStartTime[jc - 1].min + offset
  );
}

function getRestTimeString(sections: string) {
  const begin = parseInt(sections.split("-")[0]);
  const time = dayScheduleStartTime[begin - 1];
  const minutesCount = time.hour * 60 + time.min;
  const currentMinutes = new Date().getHours() * 60 + new Date().getMinutes();

  const hour = Math.floor((minutesCount - currentMinutes) / 60);
  const min = minutesCount - currentMinutes - hour * 60;
  return `${hour ? hour + "小时" : ""}${min ? min + "分钟" : ""}`;
}

function lessonState(sections: string): "before" | "taking" | "after" {
  const arr = sections.split("-");
  const detAfter =
    getLessonTimeInstance(Number(arr[0])).valueOf() - dayjs().valueOf();
  const detBefore =
    getLessonTimeInstance(Number(arr[1]), 45).valueOf() - dayjs().valueOf();
  if (detAfter > 0) return "before";
  if (detAfter < 0 && detBefore > 0) return "taking";
  return "after";
}

function handleTapHelp() {
  emit("showHelp", "lessons-table");
}
</script>

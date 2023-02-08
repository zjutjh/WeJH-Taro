<template>
  <quick-view @tap="nav2Lesson" title="课程表" icon-name="lessonstable" class="lessons-table-quick-view" help
    @handle-tap-help="handleTapHelp">
    <text class="sub-text">今日课表 ({{ updateTimeString }})</text>
    <card v-for="(item, index) in todayLessonTable" :key="item.lessonName" :style="{
      backgroundColor: index % 2
        ? 'var(--wjh-color-yellow-light)'
        : 'var(--wjh-color-orange-light)'
    } as CSSProperties
    ">
      <view class="lesson-item" :key="updateRestTimeCounter + index">
        <view class="important-line">
          <text class="lesson-place">{{ item.lessonPlace }}</text>
          <text v-if="lessonState(item.sections) === 'before'"  class="before-lesson">
            还有 {{ getRestTimeString(item.sections) }} 上课
          </text>
          <text v-if="lessonState(item.sections) === 'taking'" class="taking-lesson">
            上课中
          </text>
          {{ updateRestTimeCounter }}
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
    <view class="default-content" v-if="todayLessonTable?.length === 0">
      今天居然没有课😄
    </view>
    <view class="default-content" v-if="!todayLessonTable">
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

const emit = defineEmits(["showHelp"]);
let timer: Ref<ReturnType<typeof setInterval> | null> = ref(null);

const todayLessonTable = computed(() => {
  const year = systemStore.generalInfo.termYear;
  const term = systemStore.generalInfo.term;
  let tmp: Lesson[] | undefined;
  try {
    tmp = ZFService.getTodayLessonTable();
    serviceStore.zf.lessonsTableInfo[year][term].data.lessonsTable;
  } catch (error) {
    tmp = undefined;
  }
  return tmp;
});

const updateRestTimeCounter = ref(0);
// TODO: 计时器控制渲染

onMounted(() => {
  ZFService.getTodayLessonTable();
  timer.value = setInterval(() => {
    updateRestTimeCounter.value++;
  }, 5000);
});

// FIXME: 等有课了来观察

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
  let arr = sections.split("-");
  return `${getLessonTimeInstance(parseInt(arr[0])).format(
    "HH:mm"
  )}-${getLessonTimeInstance(parseInt(arr[1]), 45).format("HH:mm")}`;
}

function getLessonTimeInstance(jc: number, offset = 0) {
  return useTimeInstance(
    dayScheduleStartTime[jc - 1].hour,
    dayScheduleStartTime[jc - 1].min + offset
  );
}

/**
 * 从节次字符串提取这节课的开始时间
 *
 * @param sections 节次字符串: "10-12"
 * @return 距离这节课开始的剩余时间
 */
function getRestTimeString(sections: string) {
  // FIXME: 使用 timeUitls
  const begin = parseInt(sections.split("-")[0]);
  const time = dayScheduleStartTime[begin - 1];
  const minutesCount = time.hour * 60 + time.min;
  const currentMinutes = new Date().getHours() * 60 + new Date().getMinutes();

  const hour = Math.floor((minutesCount - currentMinutes) / 60);
  const min = minutesCount - currentMinutes - hour * 60;
  return `${hour ? hour + "小时" : ""}${min ? min + "分钟" : ""}`;
}

function lessonState(sections: string): "before" | "taking" | "after" {
  let arr = sections.split("-");
  let detAfter =
    getLessonTimeInstance(Number(arr[0])).valueOf() - dayjs().valueOf();
  let detBefore =
    getLessonTimeInstance(Number(arr[1]), 45).valueOf() - dayjs().valueOf();
  if (detAfter > 0) return "before";
  if (detAfter < 0 && detBefore > 0) return "taking";
  return "after";
}

function handleTapHelp() {
  emit("showHelp", "lessons-table");
}
</script>

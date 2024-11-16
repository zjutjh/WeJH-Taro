<template>
  <quick-view
    title="课程表"
    icon-name="lessonstable"
    class="lessons-table-quick-view"
    help
    @tap="nav2Lesson"
    @handle-tap-help="handleTapHelp"
  >
    <text v-if="!showTomorrow" class="sub-text">
      今日课表 ({{ updateTimeString }})
    </text>
    <text v-else class="sub-text">
      明日课表 ({{ updateTimeString }})
    </text>

    <card
      v-for="(item, index) in lessonsOfDay"
      :key="item.lessonName"
      :style="{
        '--bg-color': index % 2 ? 'var(--wjh-color-primary)' : 'var(--wjh-color-primary-dark)'
      } as CSSProperties"
    >
      <view
        :key="updateRestTimeCounter + index"
        class="lesson-item"
      >
        <view class="important-line">
          <text class="lesson-place">
            {{ item.lessonPlace }}
          </text>
          <text
            v-if="lessonState(item.sections) === 'before'"
            class="before-lesson"
          >
            还有 {{ getRestTimeString(item.sections) }} 上课
          </text>
          <text
            v-else-if="lessonState(item.sections) === 'taking'"
            class="taking-lesson"
          >
            上课中
          </text>
        </view>
        <view class="teacher">
          <text class="iconfont icon-teacher" />
          <text class="teacher-name">
            {{ ` ${item.teacherName}` }}
          </text>
          <text class="duration">
            ({{ sectionsTimeString(item.sections) }})
          </text>
        </view>
        <text class="lesson-name">
          {{ item.lessonName }}
        </text>
      </view>
    </card>

    <view
      v-if="lessonsOfDay.length === 0 && !showTomorrow"
      class="default-content"
    >
      今天居然没有课😄
    </view>
    <view
      v-if="lessonsOfDay.length === 0 && showTomorrow"
      class="default-content"
    >
      明天居然没有课😄
    </view>
    <view v-if="!lessonsOfDay" class="default-content">
      点击获取你的课表 ～
    </view>
  </quick-view>
</template>

<script setup lang="ts">
import Card from "../Card/index.vue";
import QuickView from "../QuickView/index.vue";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { CSSProperties, computed, onMounted, onUnmounted, ref } from "vue";
import "./index.scss";
import { dayScheduleStartTime } from "@/constants/dayScheduleStartTime";
import { useTimeInstance } from "@/hooks";
import useLessonTableStore from "@/store/service/lessonTable";
import useGeneralInfo from "@/store/system/generalInfo";

const classStartTimer = ref<ReturnType<typeof setTimeout>>();
const tomorrowTableTimer = ref<ReturnType<typeof setTimeout>>();

const emit = defineEmits(["showHelp"]);
const lessonTableStore = useLessonTableStore();
const generalInfo = useGeneralInfo();
const showTomorrow = ref(false); // 每晚 10 点过后展示第二天课表

/** 当前学期的课程集合信息 */
const termCollection = computed(() => {
  return lessonTableStore.collections
    .find(c => c.term === generalInfo.value.term
      && generalInfo.value.termYear === c.year);
});

const lessonsOfDay = computed(() => {
  const list = termCollection.value?.lessons || [];
  return list.filter((item) => {
    const currentDay = !showTomorrow.value ? (new Date().getDay() || 7) : (new Date().getDay() + 1 || 7);
    if (currentDay !== parseInt(item.weekday)) return false;
    const currentWeek = generalInfo.value.week;

    for (const time of item.week.split(",")) {
      if (time.includes("-")) {
        const start = parseInt(time.split("-")[0]);
        const end = parseInt(time.split("-")[1]);
        if (currentWeek <= end && currentWeek >= start)
          if (!time.includes("单") && !time.includes("双")) return true;
          else if (time.includes("单") && currentWeek % 2 === 1) return true;
          else if (time.includes("双") && currentWeek % 2 === 0) return true;
      } else if (currentWeek === parseInt(time)) return true;
    }
    return false;
  });
});

const updateRestTimeCounter = ref(0);

onMounted(() => {
  classStartTimer.value = setInterval(() => {
    updateRestTimeCounter.value++;
  }, 5 * 1000);

  tomorrowTableTimer.value = setInterval(() => {
    const tenPM = dayjs().set("hour", 22).set("minute", 0).set("second", 0);
    showTomorrow.value = dayjs().isAfter(tenPM);
  }, 30 * 1000);
});

onUnmounted(() => {
  if (classStartTimer.value) clearInterval(classStartTimer.value);
  if (tomorrowTableTimer.value) clearInterval(tomorrowTableTimer.value);
});

const updateTimeString = computed(() => {
  if (!termCollection.value?.updateTime) return "更新失败";
  return dayjs(termCollection.value.updateTime).fromNow();
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

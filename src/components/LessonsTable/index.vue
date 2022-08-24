<template>
  <view class="lessons-table-wrapper">
    <view class="jc-index-panel index-panel">
      <view v-for="i in 12" :key="i">
        <view class="num-index">
          {{ i }}
        </view>
      </view>
    </view>
    <view class="lessons-table">
      <view class="col"></view>
      <view class="col">
        <view
          v-show="isThisWeek"
          class="now-week-index"
          :style="nowWeekStyle"
        />
        <view class="weekday-index-panel index-panel">
          <view v-for="i in weekdayEnum" :key="i">
            <view class="num-index">
              {{ i }}
            </view>
          </view>
        </view>
        <view
          class="table table-box"
          v-if="lessonsTable && lessonsTable.length !== 0"
        >
          <view
            class="class"
            v-for="cl in lessonsTable"
            :key="cl.id + cl.week + cl.weekday"
            :style="getPosition(cl)"
          >
            <view
              class="class-card"
              :style="getDynamicColor(cl.classID)"
              :class="{ conflict: cl.mark }"
              @tap="classCardClick(cl)"
            >
              <view class="title">{{
                splitNameAndRoom(cl.lessonPlace)[0]
              }}</view>
              <view class="title">{{
                splitNameAndRoom(cl.lessonPlace)[1]
              }}</view>
              <text class="item-content" :style="'-webkit-line-clamp: 2'">{{
                cl.lessonName
              }}</text>
            </view>
          </view>
        </view>
      </view>
      <view v-show="isThisWeek" class="now-index" :style="nowStyle" />
    </view>
  </view>
</template>

<script setup lang="ts">
  import { dayScheduleStartTime } from '@/constants/index';
  import { Lesson } from '@/types/Lesson';
  import { computed, toRefs } from 'vue';
  import './index.scss';

  const props = defineProps<{ lessons: Lesson[]; isThisWeek: boolean }>();
  const { lessons } = toRefs(props);
  const emit = defineEmits(['classClick']);

  const weekdayEnum = computed(() => {
    return ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  });
  const lessonsTable = computed(() => {
    return markConflictLesson(lessons?.value);
  });
  const nowWeekStyle = computed(() => {
    const now = new Date();
    const weekday = now.getDay() ? now.getDay() : 7;
    const left = `calc(100% / 7 * ${weekday - 1})`;
    return { left };
  });
  const nowStyle = computed(() => {
    const now = new Date();
    const hour = now.getHours();
    const min = now.getMinutes();
    let duration = 0;
    const nowTime = hour * 60 + min;

    // 这节课的开始时间
    let thisLesson = dayScheduleStartTime.find((item) => {
      if (
        nowTime >= item.hour * 60 + item.min &&
        nowTime <= item.hour * 60 + item.min + 45
      )
        return true;
    });

    if (!thisLesson) {
      thisLesson = dayScheduleStartTime.find((item) => {
        if (nowTime < item.hour * 60 + item.min) return true;
      }) || { hour: 21, min: 10 };
    } else duration = hour * 60 + min - (thisLesson.hour * 60 + thisLesson.min);

    let jc = 0; // 第 ${jc + 1} 节课
    jc = dayScheduleStartTime.indexOf(thisLesson);

    // TODO:
    // const weekday = now.getDay() ? now.getDay() : 7;
    // const left = 'calc(' + ((weekday - 1) * 126) / 7 + '% + 2rem)';

    return {
      top: `calc((100% - 2rem) / 12 * ${jc + duration / 45} + 2rem)`
    };
  });

  function markConflictLesson(lessons: Lesson[]) {
    if (lessons && lessons.length !== 0)
      for (let i = 0; i < lessons.length; i++) {
        for (let j = i + 1; j < lessons.length; j++) {
          const item = lessons[i],
            item2 = lessons[j];
          if (item.weekday !== item2.weekday) continue;
          const from1 = parseInt(item.sections.split('-')[0]);
          const to1 = parseInt(item.sections.split('-')[1]);
          const from2 = parseInt(item2.sections.split('-')[0]);
          const to2 = parseInt(item2.sections.split('-')[1]);

          if (!(to1 < from2 || to2 < from1)) {
            lessons[i]['mark'] = true;
            lessons[j]['mark'] = true;
          }
        }
      }
    return lessons;
  }
  function splitNameAndRoom(str: string) {
    let index = 0;
    for (; index < str.length; index++) {
      if (str.charCodeAt(index) <= 255) break;
    }
    return [str.slice(0, index), str.slice(index)];
  }
  function classCardClick(theClass: Lesson) {
    emit('classClick', theClass);
  }
  function getDynamicColor(classID = '1') {
    const index = parseInt(classID.slice(4, 8) + classID.slice(12, 16), 16);
    const colorSet = ['green', 'cyan', 'blue', 'yellow', 'orange'];
    return {
      backgroundColor: `var(--wjh-color-${colorSet[index % colorSet.length]})`
    };
  }
  function getPosition(theClass) {
    const begin = parseInt(theClass.sections.split('-')[0]);
    const end = parseInt(theClass.sections.split('-')[1]);
    const weekday = parseInt(theClass.weekday);
    const fontSize = Math.min(12, (end - begin + 2) * 4) + 'px';
    const height = `calc(100% / 12 * ${end - begin + 1})`;
    const top = `calc(100% / 12 * ${begin - 1})`;
    const left = `calc(100% / 7 * ${weekday - 1})`;
    return { top, left, height, fontSize };
  }
</script>

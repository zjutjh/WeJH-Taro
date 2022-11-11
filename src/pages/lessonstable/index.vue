<template>
  <view class="background">
    <title-bar title="课程表"></title-bar>
    <scroll-view :scrollY="true">
      <lessons-table
        :lessons="!showWeekPicker ? lessonsTable : lessonsTableWeek"
        :is-this-week="isThisWeek"
        @classClick="classClick"
      />
    </scroll-view>

    <!-- <scroll-view :scrollY="true" v-if="!showLessonType">
      <view class="practice-lessons-list" @longpress="switchLessonType">
        <view class="prectice-title">实践课程</view>
        <view v-for="item in practiceLessons" :key="item.lessonName">
          <card>
            <view class="lesson-title">
              {{ item.lessonName }}
            </view>
            <view> <b>教师：</b>{{ item.teacherName }} </view>
            <view> <b>时间：</b>{{ item.className }} </view>
          </card>
        </view>
      </view>
    </scroll-view> -->

    <bottom-panel class="lessons-table-bottom-panel">
      <view class="col">
        <reflesh-button
          v-if="showWeekPicker && isThisWeek"
          @reflesh="reflesh"
          :is-refleshing="isRefleshing"
        ></reflesh-button>
        <w-button
          v-else-if="showWeekPicker"
          class="back-button"
          @tap="backToOriginWeek"
          size="large"
          shape="circle"
        >
          <view class="iconfont icon-back"> </view>
        </w-button>
      </view>
      <view class="col" v-if="showWeekPicker">
        <week-picker v-model:week="selectWeek"></week-picker>
      </view>
      <view class="col" v-else>
        <term-picker
          class="picker"
          @changed="termChanged"
          :term="selectTerm"
        ></term-picker>
      </view>
      <view class="col">
        <view @tap="pickerModeSwitch" class="switch-button">
          <image
            v-if="!showWeekPicker"
            src="@/assets/icons/term-week-swicher/term.svg"
          ></image>
          <image v-else src="@/assets/icons/term-week-swicher/week.svg"></image>
        </view>
      </view>
    </bottom-panel>
  </view>
  <pop-view v-model:show="showPop">
    <view v-if="selection" class="lesson-detail">
      <view class="lesson-title">
        {{ selection.lessonName }}
      </view>
      <view>地点：{{ selection.campus }}-{{ selection.lessonPlace }} </view>
      <view>班级：{{ selection.className }} </view>
      <view>教师：{{ selection.teacherName }} </view>
      <view>
        时间：{{ selection.week }}丨{{ detailWeekDay(selection.weekday) }} ({{
          selection.sections
        }})丨{{ detailTimeInterval }}
      </view>
      <view>学分：{{ selection.credits }} </view>
    </view>
  </pop-view>
</template>

<script lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { serviceStore, systemStore } from '@/store';
  import BottomPanel from '@/components/BottomPanel/index.vue';
  import { Lesson } from '@/types/Lesson';
  import { WButton } from '@/components/button';
  import LessonsTable from '@/components/LessonsTable/index.vue';
  import PopView from '@/components/PopView/index.vue';
  import RefleshButton from '@/components/RefleshButton/index.vue';
  import TermPicker from '@/components/TermPicker/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import WeekPicker from '@/components/WeekPicker/index.vue';
  import { ZFService } from '@/services';
  import { isNewIPhone } from '@/utils/effects';
  import './index.scss';
  import { dayScheduleStartTime } from '@/constants/dayScheduleStartTime';
  import { useTimeInstance } from '@/utils/hooks';

  export default {
    components: {
      LessonsTable,
      TermPicker,
      TitleBar,
      BottomPanel,
      RefleshButton,
      PopView,
      WeekPicker,
      WButton
    },
    setup() {
      const showPop = ref(false);
      const selection = ref<Lesson>();

      //本学期
      const originTerm = {
        year: systemStore.generalInfo.termYear,
        term: systemStore.generalInfo.term
      };
      const selectTerm = ref(originTerm);

      // 本周
      const originWeek = Math.max(systemStore.generalInfo.week, 0);
      const selectWeek = ref(originWeek);

      const lessonsTable = computed(() => {
        return ZFService.getLessonTable(selectTerm.value) || [];
      });

      const practiceLessons = computed(() => {
        return ZFService.getPracticeLessonsTable(selectTerm.value);
      });

      const lessonsTableWeek = computed(() => {
        return lessonsTable.value.filter((item) => {
          for (const time of item.week.split(',')) {
            if (time.includes('-')) {
              const start = parseInt(time.split('-')[0]);
              const end = parseInt(time.split('-')[1]);
              if (selectWeek.value <= end && selectWeek.value >= start)
                if (!time.includes('单') && !time.includes('双')) return true;
                else if (time.includes('单') && selectWeek.value % 2 === 1)
                  return true;
                else if (time.includes('双') && selectWeek.value % 2 === 0)
                  return true;
            } else if (selectWeek.value === parseInt(time)) return true;
          }
          return false;
        });
      });
      const isThisWeek = computed(() => {
        return (
          selectWeek.value === originWeek &&
          JSON.stringify(originTerm) === JSON.stringify(selectTerm.value)
        );
      });
      const isRefleshing = ref(false);
      async function reflesh() {
        if (isRefleshing.value) return;
        isRefleshing.value = true;
        await ZFService.updateLessonTable(selectTerm.value);
        isRefleshing.value = false;
      }
      const detailTimeInterval = computed(() => {
        const startIndex = parseInt(selection?.value!.sections.split('-')[0]);
        const endIndex = parseInt(selection?.value!.sections.split('-')[1]);
        const startTime = useTimeInstance(
          dayScheduleStartTime[startIndex - 1].hour,
          dayScheduleStartTime[startIndex - 1].min
        ).format('HH:mm');
        const endTime = useTimeInstance(
          dayScheduleStartTime[endIndex - 1].hour,
          dayScheduleStartTime[endIndex - 1].min + 45
        ).format('HH:mm');

        return `${startTime}-${endTime}`;
      });

      async function termChanged(e) {
        isRefleshing.value = true;
        selectTerm.value = e;
        await ZFService.updateLessonTable(e);
        isRefleshing.value = false;
      }

      onMounted(async () => {
        if (serviceStore.user.isBindZF) {
          await reflesh();
        }
      });

      const showWeekPicker = ref(true);
      function pickerModeSwitch() {
        selectWeek.value = 1;
        showWeekPicker.value = !showWeekPicker.value;
      }

      function classClick(theClass: Lesson) {
        showPop.value = true;
        selection.value = theClass;
      }
      function backToOriginWeek() {
        selectTerm.value = originTerm;
        selectWeek.value = originWeek;
      }

      function detailWeekDay(weekDay: string) {
        const charEnum = ['一', '二', '三', '四', '五', '六', '日'];
        return `周${charEnum[parseInt(weekDay) - 1]}`;
      }

      return {
        showPop,
        selection,
        practiceLessons,
        showWeekPicker,
        selectWeek,
        originWeek,
        pickerModeSwitch,
        isNewIPhone,
        isThisWeek,
        lessonsTable,
        selectTerm,
        originTerm,
        termChanged,
        reflesh,
        isRefleshing,
        lessonsTableWeek,
        classClick,
        backToOriginWeek,
        detailWeekDay,
        detailTimeInterval
      };
    }
  };
</script>
<style>
  @keyframes rote {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .reflesh-running {
    animation: rote 1s alternate infinite;
  }
</style>

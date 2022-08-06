<template>
  <view class="background">
    <title-bar title="课程表"></title-bar>
    <scroll-view :scrollY="true">
      <lessons-table
        class="index"
        :class="{ 'index-ios': isNewIPhone }"
        :lessons="!showWeekPicker ? lessonsTable : lessonsTableWeek"
        :current-week="selectWeek"
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

    <bottom-panel>
      <reflesh-button
        @reflesh="reflesh"
        :is-refleshing="isRefleshing"
      ></reflesh-button>
      <week-picker
        v-if="showWeekPicker"
        class="picker"
        :week="selectWeek"
        @changed="weekChanged"
      />
      <term-picker v-else class="picker" @changed="termChanged"></term-picker>
      <w-button shape="circle" @tap="pickerModeSwitch">
        <view class="iconfont icon-switch"></view>
      </w-button>
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
        时间：{{ selection.week }} - {{ selection.weekday }} （{{
          selection.sections
        }}）
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
      const selectTerm = ref({
        year: systemStore.generalInfo.termYear,
        term: systemStore.generalInfo.term
      });

      const lessonsTable = computed(() => {
        return ZFService.getLessonTable(selectTerm.value);
      });

      const practiceLessons = computed(() => {
        return ZFService.getPracticeLessonsTable(selectTerm.value);
      });
      const selectWeek = ref(systemStore.generalInfo.week);
      const lessonsTableWeek = computed(() => {
        return lessonsTable.value.filter((item) => {
          let v = item.week.slice(0, item.week.length - 1).split('-');
          let st = parseInt(v[0]);
          let ed = parseInt(v[1]);
          let isOddWeek = item.week.includes('单');
          let isEvenWeek = item.week.includes('双');

          if (isOddWeek && selectWeek.value % 2 === 0) return false;
          if (isEvenWeek && selectWeek.value % 2 === 1) return false;

          return selectWeek.value <= ed && selectWeek.value >= st;
        });
      });

      const isRefleshing = ref(false);
      async function reflesh() {
        isRefleshing.value = true;
        await ZFService.updateLessonTable(selectTerm.value);
        isRefleshing.value = false;
      }

      async function termChanged(e) {
        isRefleshing.value = true;
        selectTerm.value = e;
        await ZFService.updateLessonTable(e);
        isRefleshing.value = false;
      }

      async function weekChanged({ week }) {
        console.log(week);
        selectWeek.value = week;
      }

      onMounted(async () => {
        if (serviceStore.user.isBindZF) {
          await reflesh();
        }
      });

      const showWeekPicker = ref(true);
      function pickerModeSwitch() {
        showWeekPicker.value = !showWeekPicker.value;
      }

      function classClick(theClass: Lesson) {
        showPop.value = true;
        selection.value = theClass;
      }

      return {
        showPop,
        selection,
        practiceLessons,
        showWeekPicker,
        selectWeek,
        pickerModeSwitch,
        weekChanged,
        isNewIPhone,
        lessonsTable,
        selectTerm,
        termChanged,
        reflesh,
        isRefleshing,
        lessonsTableWeek,
        classClick
      };
    },
    methods: {}
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

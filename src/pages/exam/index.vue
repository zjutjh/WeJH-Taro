<template>
  <header-tab-view
    title="考试信息"
    :img="require('@/assets/exam/exam.png')"
    :show-tab="false"
  >
    <template v-slot:content>
      <view v-if="!exam" style="text-align: center">
        <view> 无记录</view>
      </view>
      <card class="item" v-for="item in exam" :key="item.id" @tap="pop(item)">
        <view class="item-text" v-if="item">
          <view> {{ item.lessonName }}-{{ item.id }}</view>
          <view v-for="name in item.teacherName?.split(';')" :key="name"
            ><view
              ><text class="iconfont icon-teacher"></text>{{ name }}</view
            ></view
          >
          <view> {{ item.examTime }}</view>
          <view>{{ calcDayLeft(item.examTime) }}</view>
        </view>
        <view class="ext">{{ item.examPlace }}</view>
      </card>
    </template>
  </header-tab-view>
  <bottom-panel>
    <reflesh-button
      @reflesh="reflesh"
      :is-refleshing="isRefleshing"
    ></reflesh-button>
    <term-picker class="picker" @changed="termChanged"></term-picker>
    <reflesh-button
      @reflesh="reflesh"
      :is-refleshing="isRefleshing"
    ></reflesh-button>
  </bottom-panel>
  <pop-view v-model:show="showPop">
    <card v-if="selectedItem" class="pop-card">
      <view class="title">{{ selectedItem.lessonName }}</view>
      <view v-for="name in selectedItem.teacherName.split(';')" :key="name"
        ><view
          ><text class="iconfont icon-teacher"></text>{{ name }}</view
        ></view
      >
      <view><b>上课地点：</b>{{ selectedItem.lessonPlace }}</view>
      <view><b>教学班：</b>{{ selectedItem.className }}</view>
      <view><b>学分：</b>{{ selectedItem.credits }}</view>
      <view
        ><b>考试地点：</b>{{ selectedItem.campus }}-{{
          selectedItem.examPlace
        }}</view
      >
      <view><b>考试时间：</b>{{ selectedItem.examTime }}</view>
      <button
        class="active"
        v-if="isWechat"
        @tap="selectedItem && addToCalendar(selectedItem)"
      >
        添加到日历
      </button>
    </card>
  </pop-view>
</template>

<script lang="ts">
  import { Ref, computed, defineComponent, onMounted, ref } from 'vue';
  import { serviceStore, systemStore } from '@/store';
  import BottomPanel from '@/components/BottomPanel/index.vue';
  import Card from '@/components/Card/index.vue';
  import { Exam } from '@/types/Exam';
  import HeaderTabView from '@/components/HeaderTabView/index.vue';
  import PopView from '@/components/PopView/index.vue';
  import RefleshButton from '@/components/RefleshButton/index.vue';
  import TermPicker from '@/components/TermPicker/index.vue';
  import { ZFService } from '@/services';
  import dayjs from 'dayjs';
  import './index.scss';
  export default defineComponent({
    components: {
      HeaderTabView,
      PopView,
      Card,
      TermPicker,
      BottomPanel,
      RefleshButton
    },
    computed: {
      isWechat() {
        return process.env.TARO_ENV === 'weapp';
      }
    },
    setup() {
      let selectTerm = ref({
        year: systemStore.generalInfo.termYear,
        term: systemStore.generalInfo.term
      });
      const isRefleshing = ref(false);
      const selectedItem: Ref<null | Exam> = ref(null);
      const exam = computed(() => {
        return ZFService.getExamInfo(selectTerm.value)?.data;
      });

      async function termChanged(e) {
        isRefleshing.value = true;
        selectTerm.value = e;
        await ZFService.updateExamInfo(e);
        isRefleshing.value = false;
      }
      async function reflesh() {
        isRefleshing.value = true;
        await ZFService.updateExamInfo(selectTerm.value);
        isRefleshing.value = false;
      }

      function calcDayLeft(dayString: string) {
        return dayjs(dayString, 'YYYY-MM-DD(HH:mm)').fromNow();
      }
      function pop(item) {
        selectedItem.value = item;
        this.showPop = true;
      }
      function addToCalendar(item: Exam) {
        if (process.env.TARO_ENV === 'weapp')
          wx.addPhoneCalendar({
            title: item.lessonName + '考试',
            startTime: dayjs(item.examTime, 'YYYY-MM-DD(HH:mm)').unix(),
            endTime: dayjs(item.examTime, 'YYYY-MM-DD(HH:mm-HH:mm)').unix(),
            location: item.examPlace,
            alarmOffset: 3600
          });
      }

      onMounted(async () => {
        if (serviceStore.user.isBindZF) {
          await reflesh();
        }
      });
      return {
        exam,
        termChanged,
        reflesh,
        isRefleshing,
        selectedItem,
        calcDayLeft,
        pop,
        addToCalendar
      };
    },
    data() {
      return {
        showPop: false
      };
    },
    methods: {}
  });
</script>

<template>
  <view class="background">
    <title-bar title="考试安排"></title-bar>
    <scroll-view :scrollY="true">
      <view class="flex-column">
        <card v-if="!exam" style="text-align: center">
          <view>无记录</view>
        </card>
        <card
          v-for="item in exam"
          :key="item.id"
          size="small"
          class="exam-card"
        >
          <w-collapse>
            <w-collapse-panel max-height="200px">
              <template #header>
                <view class="lesson-name">{{ item.lessonName }}</view>
                <view style="font-size: 14px; color: var(--wjh-color-week)">
                  <view class="exam-time">{{ item.examTime }}</view>
                  <view class="exam-place">{{ item.examPlace }}</view>
                </view>
              </template>
              <w-descriptions class="exam-detail-list" size="small">
                <w-descriptions-item label="日期" :label-span="6">
                  {{ item.examTime }}
                </w-descriptions-item>
                <w-descriptions-item label="考试地点" :label-span="6">
                  {{ item.examPlace }}
                </w-descriptions-item>
                <w-descriptions-item label="考试全称" :label-span="6">
                  {{ item.className }}
                </w-descriptions-item>
                <w-descriptions-item label="教师列表" :label-span="6">
                  {{ item.teacherName }}
                </w-descriptions-item>
              </w-descriptions>
            </w-collapse-panel>
          </w-collapse>
        </card>
      </view>
    </scroll-view>
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
  </view>
</template>

<script lang="ts">
  import { Ref, computed, defineComponent, onMounted, ref } from 'vue';
  import { serviceStore, systemStore } from '@/store';
  import BottomPanel from '@/components/BottomPanel/index.vue';
  import Card from '@/components/Card/index.vue';
  import { Exam } from '@/types/Exam';
  import RefleshButton from '@/components/RefleshButton/index.vue';
  import TermPicker from '@/components/TermPicker/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import { WCollapse, WCollapsePanel } from '@/components/collapse';
  import { WList, WListItem } from '@/components/list';
  import { WDescriptions, WDescriptionsItem } from '@/components/descriptions';
  import { ZFService } from '@/services';
  import dayjs from 'dayjs';
  import './index.scss';
  export default defineComponent({
    components: {
      TitleBar,
      Card,
      TermPicker,
      BottomPanel,
      RefleshButton,
      WCollapse,
      WCollapsePanel,
      WList,
      WListItem,
      WDescriptions,
      WDescriptionsItem
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

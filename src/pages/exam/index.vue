<template>
  <view class="background">
    <title-bar title="考试安排"></title-bar>
    <scroll-view :scrollY="true">
      <view class="header-view">
        <image src="@/assets/photos/exam.svg"></image>
        <view class="extra" @tap="showHelp">
          <view class="icon-wrapper">
            <view class="extra-icon iconfont icon-announcement"></view>
          </view>
          <view class="label">公告</view>
        </view>
      </view>
      <view class="flex-column">
        <card v-if="!exam || exam.length === 0" style="text-align: center">
          <view>无记录</view>
        </card>
        <card
          v-for="item in exam"
          :key="item.id"
          size="small"
          class="exam-card"
        >
          <w-collapse class="exam-collapse-item">
            <w-collapse-panel>
              <template #header>
                <view class="lesson-name">{{ item.lessonName }}</view>
                <view style="font-size: 14px; color: var(--wjh-color-week)">
                  <view
                    v-if="
                      timeInterval(item.examTime) < 0 ||
                      timeInterval(item.examTime) > 14
                    "
                    class="exam-time"
                    >{{ item.examTime }}
                  </view>
                  <view
                    v-else
                    :style="
                      timeInterval(item.examTime) === 0
                        ? 'color: var(--wjh-color-orange)'
                        : undefined
                    "
                    >距离考试还有 {{ timeInterval(item.examTime) }} 天</view
                  >
                  <view class="exam-place">{{
                    `${item.examPlace} - 座位号：${item.seatNum}`
                  }}</view>
                </view>
              </template>
              <w-descriptions class="exam-detail-list" size="small">
                <w-descriptions-item label="日期" :label-span="6">
                  {{ getDetailedTime(item.examTime) }}
                </w-descriptions-item>
                <w-descriptions-item label="考试地点" :label-span="6">
                  {{ `${item.examPlace} - 座位号：${item.seatNum}` }}
                </w-descriptions-item>
                <w-descriptions-item label="考试全称" :label-span="6">
                  {{ item.className }}
                </w-descriptions-item>
                <w-descriptions-item label="教师列表" :label-span="6">
                  {{
                    item.teacherName
                      .split(';')
                      .map((item) => item.split('/')[1])
                      .join('；')
                  }}
                </w-descriptions-item>
              </w-descriptions>
            </w-collapse-panel>
          </w-collapse>
        </card>
      </view>
    </scroll-view>
    <bottom-panel class="exam-bottom-panel">
      <view class="col"> </view>
      <view class="col">
        <term-picker
          class="picker"
          :term="selectTerm"
          @changed="termChanged"
        ></term-picker>
      </view>
      <view class="col">
        <reflesh-button
          @reflesh="reflesh"
          :is-refleshing="isRefleshing"
        ></reflesh-button>
      </view>
    </bottom-panel>
  </view>
  <w-modal
    title="公告"
    v-model:show="showModal"
    :content="helpContent"
  ></w-modal>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue';
  import { serviceStore, systemStore } from '@/store';
  import BottomPanel from '@/components/BottomPanel/index.vue';
  import Card from '@/components/Card/index.vue';
  import RefleshButton from '@/components/RefleshButton/index.vue';
  import TermPicker from '@/components/TermPicker/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import { WModal } from '@/components/modal';
  import { WCollapse, WCollapsePanel } from '@/components/collapse';
  import { WDescriptions, WDescriptionsItem } from '@/components/descriptions';
  import { ZFService } from '@/services';
  import dayjs, { ConfigType } from 'dayjs';
  import { helpText } from '@/constants/copywriting';
  import Taro from '@tarojs/taro';
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
      WDescriptions,
      WDescriptionsItem,
      WModal
    },
    setup() {
      const selectTerm = ref({
        year: systemStore.generalInfo.termYear,
        term: systemStore.generalInfo.term
      });
      const isRefleshing = ref(false);
      const exam = computed(() => {
        return ZFService.getExamInfo(selectTerm.value)?.data;
      });
      const showModal = ref(false);
      const helpContent = helpText.exam;

      async function termChanged(e) {
        isRefleshing.value = true;
        selectTerm.value = e;
        await ZFService.updateExamInfo(e);
        isRefleshing.value = false;
      }
      async function reflesh() {
        if (isRefleshing.value) return;
        isRefleshing.value = true;
        await ZFService.updateExamInfo(selectTerm.value);
        isRefleshing.value = false;
      }

      function calcDayLeft(dayString: string) {
        return dayjs(dayString, 'YYYY-MM-DD(HH:mm)').fromNow();
      }
      /*       function addToCalendar(item: Exam) {
        Taro.addPhoneCalendar({
          title: item.lessonName + '考试',
          startTime: dayjs(item.examTime, 'YYYY-MM-DD(HH:mm)').unix(),
          endTime: dayjs(item.examTime, 'YYYY-MM-DD(HH:mm-HH:mm)').unix(),
          location: item.examPlace,
          alarmOffset: 3600
        });
      } */
      function getDetailedTime(timeString: string) {
        const tmp: ConfigType = timeString.split('(')[0];
        const dayChars = ['日', '一', '二', '三', '四', '五', '六'];
        return `${tmp} - 周${dayChars[dayjs(tmp).day()]}`;
      }
      function timeInterval(timeString: string) {
        const tmp: ConfigType = timeString.split('(')[0];
        return dayjs(tmp).diff(dayjs(), 'day');
      }
      function showHelp() {
        showModal.value = true;
      }

      onMounted(async () => {
        if (serviceStore.user.isBindZF) {
          await reflesh();
        }
      });
      return {
        exam,
        isRefleshing,
        showModal,
        helpContent,
        selectTerm,
        termChanged,
        reflesh,
        calcDayLeft,
        getDetailedTime,
        timeInterval,
        showHelp
      };
    }
  });
</script>

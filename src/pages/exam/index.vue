<template>
  <theme-config>
    <title-bar title="考试安排" back-button />
    <scroll-view :scroll-y="true">
      <view class="header-view">
        <taro-image :src="ExamCoverImage" />
        <view class="extra" @tap="showHelp">
          <view class="icon-wrapper">
            <view class="extra-icon iconfont icon-announcement" />
          </view>
          <view class="label">
            公告
          </view>
        </view>
      </view>
      <view class="flex-column">
        <card v-if="!examsInfo || examsInfo.list.length === 0" style="text-align: center">
          <view>无记录</view>
        </card>
        <card
          v-for="item in examsInfo?.list"
          :key="item.id"
          size="small"
          class="exam-card"
        >
          <w-collapse class="exam-collapse-item">
            <w-collapse-panel arrow>
              <template #header>
                <view
                  class="lesson-name"
                  :style="
                    timeInterval(item.examTime) === 0
                      ? 'color: var(--wjh-color-primary-dark)'
                      : undefined
                  "
                >
                  {{ item.lessonName }}
                </view>
                <view
                  style="
                    font-size: 14px;
                    color: var(--wjh-color-text-secondary);
                  "
                >
                  <view
                    v-if="timeInterval(item.examTime) >= 0 && timeInterval(item.examTime) <= 14"
                    :style="
                      timeInterval(item.examTime) === 0
                        ? 'color: var(--wjh-color-primary-dark)'
                        : undefined
                    "
                  >
                    距离考试还有 {{ timeInterval(item.examTime) }} 天
                  </view>
                  <view
                    class="exam-time"
                    :style="
                      timeInterval(item.examTime) === 0
                        ? 'color: var(--wjh-color-primary-dark)'
                        : undefined
                    "
                  >
                    {{ item.examTime }}
                  </view>
                  <view
                    class="exam-place"
                    :style="
                      timeInterval(item.examTime) === 0
                        ? 'color: var(--wjh-color-primary-dark)'
                        : undefined
                    "
                  >
                    {{ `${item.examPlace} - 座位号：${item.seatNum}` }}
                  </view>
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
      <view class="col" />
      <view class="col">
        <term-picker
          class="picker"
          :year="queryOptions.year"
          :term="queryOptions.term"
          :selectflag="0"
          @changed="termChanged"
        />
      </view>
      <view class="col">
        <refresh-button :is-refreshing="isFetching" @refresh="refetch" />
      </view>
    </bottom-panel>
    <w-modal v-model:show="showModal" title="公告" :content="helpContent" />
  </theme-config>
</template>

<script setup lang="ts">
import { ref, toRef, watchEffect } from "vue";
import {
  BottomPanel,
  Card,
  RefreshButton,
  TermPicker,
  ThemeConfig,
  TitleBar,
  WCollapse,
  WCollapsePanel,
  WDescriptions,
  WDescriptionsItem,
  WModal
} from "@/components";
import dayjs, { ConfigType } from "dayjs";
import { helpText } from "@/constants/copywriting";
import { Image as TaroImage } from "@tarojs/components";
import ExamCoverImage from "@/assets/photos/exam.svg";
import "./index.scss";
import useExamQueryOptionsStore from "@/hooks/exam/queryOptions";
import Taro from "@tarojs/taro";
import useExamQuery from "@/hooks/exam/useExamQuery";

const queryOptions = useExamQueryOptionsStore();
const showModal = ref(false);
const helpContent = helpText.exam;

const { data: examsInfo, refetch, isFetching, error } = useExamQuery({
  year: toRef(queryOptions, "year"),
  term: toRef(queryOptions, "term")
});

watchEffect(() => {
  if (error.value instanceof Error) {
    Taro.showToast({ title: `查询考试失败: ${error.value.message}`, icon: "none" });
  }
});

async function termChanged(e) {
  queryOptions.setOption(e);
}

function getDetailedTime(timeString: string) {
  const tmp: ConfigType = timeString.split("(")[0];
  const dayChars = ["日", "一", "二", "三", "四", "五", "六"];
  return `${tmp} - 周${dayChars[dayjs(tmp).day()]}`;
}

function timeInterval(timeString: string) {
  const tmp: ConfigType = timeString.split("(")[0];
  return dayjs(tmp).diff(dayjs(dayjs().format("YYYY-MM-DD")), "day");
}

function showHelp() {
  showModal.value = true;
}

</script>

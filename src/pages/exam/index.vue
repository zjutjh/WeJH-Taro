<template>
  <theme-config>
    <title-bar title="考试安排" back-button />
    <scroll-view :scroll-y="true">
      <view class="header-view">
        <taro-image :src="ExamCoverImage" />
        <view class="extra" @tap="handleShowHelp">
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
                    v-if="item.examTime !== '未放开不可查'"
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
                  <text>{{ item.examPlace }}</text>
                  <text v-if="item.seatNum !== '未放开不可查'">
                    {{ ` - 座位号：${item.seatNum}` }}
                  </text>
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
          v-model="fieldTerm"
          class="picker"
          :term-year="+generalInfo.termYear"
        />
      </view>
      <view class="col">
        <refresh-button :is-refreshing="isFetching" @refresh="refetch" />
      </view>
    </bottom-panel>
    <w-modal v-model:show="showModal" title="公告" :content="helpText.exam" />
  </theme-config>
</template>

<script setup lang="ts">
import { ref, toRef, watch, watchEffect } from "vue";
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
import { helpText } from "@/constants/copywriting";
import { Image as TaroImage } from "@tarojs/components";
import ExamCoverImage from "@/assets/photos/exam.svg";
import useExamQueryOptionsStore from "@/hooks/exam/queryOptions";
import Taro from "@tarojs/taro";
import useExamQuery from "@/hooks/exam/useExamQuery";
import useGeneralInfo from "@/store/system/generalInfo";
import { ExamTermOption } from "@/types/Exam";
import { timeInterval, getDetailedTime } from "./utils";
import "./index.scss";

const showModal = ref(false);
const queryOptions = useExamQueryOptionsStore();
const generalInfo = useGeneralInfo();

const fieldTerm = ref<ExamTermOption>({
  year: queryOptions.year,
  term: queryOptions.term
});

const { data: examsInfo, refetch, isFetching, error } = useExamQuery({
  year: toRef(() => fieldTerm.value.year),
  term: toRef(() => fieldTerm.value.term)
});

watchEffect(() => {
  if (error.value !== null) {
    Taro.showToast({ title: `查询考试失败: ${error.value.message}`, icon: "none" });
  }
});

watch(fieldTerm, (newValue) => {
  queryOptions.setOption(newValue);
});

function handleShowHelp() {
  showModal.value = true;
}
</script>

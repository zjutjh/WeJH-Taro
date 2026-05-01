<template>
  <theme-config>
    <title-bar title="考试安排" :back-button="true" />
    <scroll-view :scroll-y="true">
      <view class="header-view">
        <image src="@/assets/photos/exam.svg" />
        <view class="extra" @tap="showModal = true">
          <view class="icon-wrapper">
            <view class="extra-icon iconfont icon-announcement" />
          </view>
          <view class="label"> 公告 </view>
        </view>
      </view>
      <view class="flex-column">
        <card v-if="!data || data.length === 0" style="text-align: center">
          <view>无记录</view>
        </card>
        <card v-for="item in data" :key="item.id" size="small" class="exam-card">
          <w-collapse class="exam-collapse-item">
            <w-collapse-panel :arrow="true">
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
                <view style="font-size: 14px; color: var(--wjh-color-text-secondary)">
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
                  <text>{{ item.examPlace }}</text
                  ><text v-if="item.seatNum !== '未放开不可查'">
                    {{ ` - 座位号：${item.seatNum}` }}
                  </text>
                </w-descriptions-item>
                <w-descriptions-item label="考试全称" :label-span="6">
                  {{ item.className }}
                </w-descriptions-item>
                <w-descriptions-item label="教师列表" :label-span="6">
                  {{
                    item.teacherName
                      .split(";")
                      .map(item => item.split("/")[1])
                      .join("；")
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
          v-model="selectTerm"
          class="picker"
          :term-year="Number(systemStore.generalInfo.termYear)"
        />
      </view>
      <view class="col">
        <refresh-button :is-refreshing="isPending" @refresh="refetch" />
      </view>
    </bottom-panel>
    <w-modal v-model:show="showModal" title="公告" :content="helpContent" />
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";

import { useQuery } from "@tanstack/vue-query";
import dayjs, { ConfigType } from "dayjs";
import { ref, toRef } from "vue";

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
import { zfServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { systemStore } from "@/store";
import { getDetailedTime } from "@/utils/time";

const selectTerm = ref({
  year: systemStore.generalInfo.termYear,
  term: systemStore.generalInfo.term
});

const { data, isPending, refetch } = useQuery({
  queryKey: [
    QUERY_KEY.ZF_EXAM,
    toRef(() => selectTerm.value.year),
    toRef(() => selectTerm.value.term)
  ] as const,
  queryFn: ({ queryKey }) => zfServiceNext.QueryExam({ year: queryKey[1], term: queryKey[2] })
});

const showModal = ref(false);
const helpContent = helpText.exam;

function timeInterval(timeString: string) {
  const tmp: ConfigType = timeString.split("(")[0];
  return dayjs(tmp).diff(dayjs(dayjs().format("YYYY-MM-DD")), "day");
}
</script>

<template>
  <theme-config>
    <title-bar title="考试安排" back-button />
    <scroll-view :scroll-y="true">
      <view class="header-view">
        <image src="@/assets/photos/exam.svg" />
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
                  <text>{{ item.examPlace }}</text><text v-if="item.seatNum !== '未放开不可查'"> {{ ` - 座位号：${item.seatNum}` }}</text>
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
          :year="selectTerm.year"
          :term="selectTerm.term"
          :selectflag="0"
          @changed="termChanged"
        />
      </view>
      <view class="col">
        <refresh-button :is-refreshing="isRefreshing" @refresh="refresh" />
      </view>
    </bottom-panel>
    <w-modal v-model:show="showModal" title="公告" :content="helpContent" />
  </theme-config>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { serviceStore, systemStore } from "@/store";
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
import { ZFService } from "@/services";
import dayjs, { ConfigType } from "dayjs";
import { helpText } from "@/constants/copywriting";
import "./index.scss";

const selectTerm = ref({
  year: systemStore.generalInfo.termYear,
  term: systemStore.generalInfo.term
});
const isRefreshing = ref(false);
const exam = computed(() => {
  return ZFService.getExamInfo(selectTerm.value)?.data;
});
const showModal = ref(false);
const helpContent = helpText.exam;

async function termChanged(e) {
  isRefreshing.value = true;
  selectTerm.value = e;
  await ZFService.updateExamInfo(e);
  isRefreshing.value = false;
}

async function refresh() {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  await ZFService.updateExamInfo(selectTerm.value);
  isRefreshing.value = false;
}

function getDetailedTime(timeString: string) {
  const tmp: ConfigType = timeString.split("(")[0];
  const dayChars = ["日", "一", "二", "三", "四", "五", "六"];
  if (dayChars[dayjs(tmp).day()]) {
    return `${tmp} - 周${dayChars[dayjs(tmp).day()]}`;
  } else {
    return `${tmp}`;
  }

}

function timeInterval(timeString: string) {
  const tmp: ConfigType = timeString.split("(")[0];
  return dayjs(tmp).diff(dayjs(dayjs().format("YYYY-MM-DD")), "day");
}

function showHelp() {
  showModal.value = true;
}

onMounted(async () => {
  if (serviceStore.user.isBindZF) {
    await refresh();
  }
});

</script>

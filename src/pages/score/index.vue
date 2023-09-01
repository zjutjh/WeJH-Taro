<template>
  <theme-config>
    <title-bar title="成绩查询" back-button />
    <scroll-view :scrollY="true">
      <view class="flex-column">
        <card v-if="!scoreList || scoreList.length === 0" style="text-align: center">
          <view>无当前阶段成绩信息</view>
        </card>

        <card v-else class="score-card">
          <template #header>
            <view class="row">
              <view class="score-icon-wrapper">
                <view class="score-icon iconfont icon-score" />
              </view>
              <view class="col">
                <view class="term-info">{{ termInfo }}</view>
                <view class="relative-term-info">{{ relativeTermInfo }}</view>
              </view>
            </view>

            <view class="col" style="align-items: flex-end">
              <view class="gpa-text">
                {{ selectTerm.period === "期中" ? "期中" : "GPA" }}
              </view>
              <view v-if="scoreList && scoreList.length !== 0 && selectTerm.period === '期末'" class="credit-text">
                {{ averageScorePoint }}
              </view>
            </view>
          </template>

          <w-collapse class="score-list-collapse">
            <w-collapse-panel v-for="item in scoreList" :key="item.lessonID" arrow>
              <template #header>
                <view class="score-list-collapse-item-title">
                  {{ item.lessonName }}
                </view>
                <view class="score-list-collapse-item-extra">
                  {{ item.score }}
                </view>
              </template>

              <w-descriptions class="score-detail-list" size="small">
                <w-descriptions-item label="课程名称">
                  {{ item.lessonName }}
                </w-descriptions-item>
                <w-descriptions-item v-if="item.lessonType" label="课程性质">
                  {{ item.lessonType }}
                </w-descriptions-item>
                <w-descriptions-item label="课程学分">
                  {{ item.credits }}
                </w-descriptions-item>
              </w-descriptions>
            </w-collapse-panel>
          </w-collapse>
        </card>
        <card v-if="scoreList?.length !== 0">
          <view class="score-help">{{ helpContent }}</view>
        </card>
      </view>
    </scroll-view>
    <bottom-panel class="score-bottom-panel">
      <view class="col">
        <refresh-button @refresh="refresh" :is-refreshing="isRefreshing">
        </refresh-button>
      </view>
      <view class="col">
        <term-picker class="picker" :term="selectTerm.term" :year="selectTerm.year" :period="selectTerm.period"
          :selectflag=1 @changed="termChanged">
        </term-picker>
      </view>
      <view class="col">
        <w-button shape="circle" size="large" class="sort-button">
          <view class="iconfont icon-paixu" @tap="handleSort"></view>
        </w-button>
      </view>
    </bottom-panel>
  </theme-config>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  Card,
  BottomPanel,
  RefreshButton,
  TitleBar,
  WCollapsePanel,
  WCollapse,
  WDescriptions,
  WDescriptionsItem,
  WButton,
  TermPicker,
  ThemeConfig
} from "@/components";
import { Score } from "@/types/Score";
import { ZFService } from "@/services";
import { helpText } from "@/constants/copywriting";
import store, { serviceStore, systemStore } from "@/store";
import "./index.scss";

const showSorted = ref(false);
const selectTerm = ref({
  year: systemStore.generalInfo.scoreYear,
  term: systemStore.generalInfo.scoreTerm,
  period: serviceStore.score.scorePeriod
});

const scoreList = computed(() =>
  showSorted.value
    ? [...ZFService.getScoreInfo(selectTerm.value).data].sort((a, b) => {
      const scoreA = a.scorePoint,
        scoreB = b.scorePoint;
      return parseFloat(scoreB) - parseFloat(scoreA);
    })
    : ZFService.getScoreInfo(selectTerm.value).data
);

const isRefreshing = ref(false);

const helpContent = computed(() => {
  return helpText.score;
});

async function termChanged(e) {
  store.commit("changeScorePeriod", e.period);
  isRefreshing.value = true;
  selectTerm.value = e;
  await ZFService.updateScoreInfo(e);
  isRefreshing.value = false;
}

async function refresh() {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  await ZFService.updateScoreInfo(selectTerm.value);
  isRefreshing.value = false;
}

function handleSort() {
  showSorted.value = !showSorted.value;
}

onMounted(async () => {
  if (serviceStore.user.isBindZF) await refresh();
});

const averageScorePoint = computed(() => {
  const validCourse = scoreList.value.filter((item) => {
    if (item.score === "缓考" || item.score === "免修") return false;
    if (item.examType === "重修" || item.examType === "补考")
      return false;
    return true;
  });
  let totalCredits = 0;
  let totalScorePoint = 0;
  validCourse.forEach((item: Score) => {
    const scorePoint = parseFloat(item.scorePoint);
    const credits = parseFloat(item.credits);
    totalScorePoint += scorePoint * credits;
    totalCredits += credits;
  });
  const ans = Math.floor((totalScorePoint / totalCredits) * 1000) / 1000;
  if (ans !== ans) return "";
  else return ans;
});

const termInfo = computed(() => {
  return `
    ${selectTerm.value?.year}/${parseInt(selectTerm.value?.year) + 1}
    （${selectTerm.value?.term}）
  `;
});

const relativeTermInfo = computed(() => {
  const charEnum = ["一", "二", "三", "四", "五", "六", "日"];
  let char = charEnum[0];
  if (serviceStore.user.info?.studentID) {
    char = charEnum[
      parseInt(selectTerm.value?.year) -
      parseInt(serviceStore.user.info.studentID.slice(0, 4))
    ];
  }
  return `大${char}${selectTerm.value?.term}学期`;
});

</script>

<template>
  <theme-config>
    <title-bar title="成绩查询" back-button />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card
          v-if="!scoreList || scoreList.length === 0"
          style="text-align: center"
        >
          <view>无当前阶段成绩信息</view>
        </card>

        <card v-else class="score-card">
          <template #header>
            <view class="row">
              <view class="score-icon-wrapper">
                <view class="score-icon iconfont icon-score" />
              </view>
              <view class="col">
                <view class="term-info">
                  {{ termInfo }}
                </view>
                <view class="relative-term-info">
                  {{ relativeTermInfo }}
                </view>
              </view>
            </view>

            <view class="col" style="align-items: flex-end">
              <view class="gpa-text">
                {{ queryOption.period === "期中" ? "期中" : "GPA" }}
              </view>
              <view
                v-if="scoreList && scoreList.length !== 0 && queryOption.period === '期末'"
                class="credit-text"
              >
                {{ averageScorePoint }}
              </view>
            </view>
          </template>

          <w-collapse class="score-list-collapse">
            <w-collapse-panel
              v-for="item in (scoreList as Array<FinalTermScore & MidTermScore>)"
              :key="item.lessonID"
              arrow
            >
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
          <view class="score-help">
            {{ helpContent }}
          </view>
        </card>
      </view>
    </scroll-view>
    <bottom-panel class="score-bottom-panel">
      <view class="col">
        <refresh-button :is-refreshing="scoreStore.loading" @refresh="refresh" />
      </view>
      <view class="col">
        <term-picker
          class="picker"
          :term="queryOption.term"
          :year="queryOption.year"
          :period="queryOption.period"
          :selectflag="1"
          @changed="termChanged"
        />
      </view>
      <view class="col">
        <w-button shape="circle" size="large" class="sort-button">
          <view class="iconfont icon-paixu" @tap="handleSort" />
        </w-button>
      </view>
    </bottom-panel>
  </theme-config>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  BottomPanel,
  Card,
  RefreshButton,
  TermPicker,
  ThemeConfig,
  TitleBar,
  WButton,
  WCollapse,
  WCollapsePanel,
  WDescriptions,
  WDescriptionsItem
} from "@/components";
import { helpText } from "@/constants/copywriting";
import "./index.scss";
import useScoreStore from "@/store/service/score";
import useScoreQueryOptionStore from "@/store/service/electricity/score/query";
import { FinalTermScore, MidTermScore } from "@/types/Score";
import useUserStore from "@/store/service/user";
import { storeToRefs } from "pinia";

const scoreStore = useScoreStore();
const { info: userInfo } = storeToRefs(useUserStore());
const queryOption = useScoreQueryOptionStore();
const showSorted = ref(false);

const scoreList = computed(() => {
  const { year, term, period } = queryOption;
  const collection = scoreStore.collections.find(
    _ => _.year === year && _.term === term
  );
  const list = (period === "期末" ? collection?.finalTerm : collection?.midTerm) ?? [];

  return showSorted.value
    ? [...list].sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
    : list;
});

const helpContent = computed(() => {
  return helpText.score;
});

async function termChanged(e) {
  queryOption.setOption(e);
  scoreStore.fetchScore(e);
}

async function refresh() {
  if (scoreStore.loading) return;
  scoreStore.fetchScore(queryOption);
}

function handleSort() {
  showSorted.value = !showSorted.value;
}

const averageScorePoint = computed(() => {
  const list = scoreList.value as FinalTermScore[];
  const validCourse = list.filter((item) => {
    if (item.score === "缓考" || item.score === "免修") return false;
    if (item.examType === "重修" || item.examType === "补考")
      return false;
    return true;
  });
  let totalCredits = 0;
  let totalScorePoint = 0;
  validCourse.forEach(item => {
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
    ${queryOption.year}/${parseInt(queryOption.year) + 1}
    （${queryOption.term}）
  `;
});

const relativeTermInfo = computed(() => {
  const charEnum = ["一", "二", "三", "四", "五", "六", "日"];
  let char = charEnum[0];
  if (userInfo.value?.studentID) {
    const id = userInfo.value.studentID;
    if (id.slice(0, 2) === "30") {
      // 适配 2023 年以后的学生 id 是 302023 开头
      char = charEnum[parseInt(queryOption.year) - parseInt(id.slice(2, 6))];
    } else {
      char = charEnum[parseInt(queryOption.year) - parseInt(id.slice(0, 4))];
    }
  }
  return `大${char}${queryOption.term}学期`;
});

</script>

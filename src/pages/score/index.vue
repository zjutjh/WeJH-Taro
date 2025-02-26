<template>
  <theme-config>
    <title-bar title="成绩查询" back-button />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card
          v-if="scoreList.length === 0"
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
            <panel-toggle v-model="isShowPreview" />
          </template>
          <preview-panel v-if="isShowPreview" :score-list="scoreList" />
          <calculator-panel v-else :score-list="scoreList as FinalTermScore[]" />
        </card>
        <card v-if="scoreList?.length !== 0">
          <view class="score-help">
            {{ helpText.score }}
          </view>
        </card>
      </view>
    </scroll-view>
    <bottom-panel class="score-bottom-panel">
      <view class="col">
        <refresh-button :is-refreshing="loading" @refresh="handleRefresh" />
      </view>
      <view class="col">
        <term-picker
          v-model="fieldTerm"
          class="picker"
          :term-year="+generalInfo.scoreYear"
          show-period
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
import { computed, ref, toRef, watch } from "vue";
import {
  BottomPanel,
  Card,
  RefreshButton,
  TermPicker,
  ThemeConfig,
  TitleBar,
  WButton
} from "@/components";
import { helpText } from "@/constants/copywriting";
import "./index.scss";
import useScoreQuery from "@/hooks/score/query";
import useScoreQueryOptionStore from "@/hooks/score/queryOptions";
import { FinalTermScore, ScoreTermOption } from "@/types/Score";
import PanelToggle from "./components/panel-toggle/index.vue";
import PreviewPanel from "./components/preview-panel/index.vue";
import CalculatorPanel from "./components/calculator-panel/index.vue";
import useUser from "@/hooks/user/info";
import useGeneralInfo from "@/store/system/generalInfo";

const isShowPreview = ref(true);

const generalInfo = useGeneralInfo();
const queryOption = useScoreQueryOptionStore();
const fieldTerm = ref<ScoreTermOption>({
  year: queryOption.year,
  term: queryOption.term,
  period: queryOption.period
});
const { list, refetch: refetchScore, loading } = useScoreQuery({
  year: toRef(fieldTerm.value.year),
  term: toRef(fieldTerm.value.term),
  period: toRef(fieldTerm.value.period)
});

const { info: userInfo } = useUser();
const showSorted = ref(false);

const scoreList = computed(() => {
  if (!list.value) return [];

  return showSorted.value
    ? [...list.value].sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
    : list.value;
});

async function handleRefresh() {
  if (loading.value) return;
  refetchScore();
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

watch(fieldTerm, newValue => {
  queryOption.setOption(newValue);
});

</script>

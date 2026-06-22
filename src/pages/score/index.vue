<template>
  <theme-config>
    <title-bar title="成绩绩点" :back-button="true" />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card v-if="scoreList.length === 0" style="text-align: center">
          <view>无当前阶段成绩信息</view>
        </card>

        <card v-else class="score-card">
          <template #header>
            <view class="row">
              <view class="score-icon-wrapper">
                <view class="score-icon iconfont icon-score" />
              </view>
              <view class="col">
                <view class="term-info">{{ headerTitle }}</view>
                <view class="relative-term-info">{{ headerSubtitle }}</view>
              </view>
            </view>

            <view class="col">
              <view class="gpa-text">
                {{ selectTerm.period === "期中" ? "期中" : "GPA" }}
              </view>
              <view v-if="selectTerm.period === '期末'" class="credit-text">
                {{ averageScorePoint }}
              </view>
            </view>

            <view
              v-if="selectTerm.period !== '期中'"
              class="col button-container"
              style="align-items: flex-end"
              @tap="handleSwitch"
            >
              <view
                class="iconfont switch-btn"
                :class="isEdit ? 'icon-save-unfilled' : 'icon-calculator'"
              />
              <view class="button-info">{{ isEdit ? "保存" : "计算" }}</view>
            </view>
          </template>

          <w-collapse v-if="!isEdit" class="score-list-collapse">
            <w-collapse-panel
              v-for="item in displayList"
              :key="item.key"
              :arrow="true"
              :selected="!item.selected"
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

          <template v-else>
            <template v-for="group in lessonGroups" :key="group.key">
              <template v-if="group.items.length > 0">
                <w-button class="lesson-group-btn" @tap="toggleGroup(group)">
                  {{ group.label }}
                </w-button>
                <w-collapse class="score-list-collapse">
                  <w-panel v-for="item in group.items" :key="item.key">
                    <template #header>
                      <checkbox-group @change="toggleItem(item)">
                        <checkbox class="checkbox" :checked="item.selected" />
                      </checkbox-group>
                      <view
                        class="score-list-collapse-item-title"
                        :class="{ 'is-selected': item.selected }"
                        @tap="toggleItem(item)"
                      >
                        {{ item.lessonName }}
                      </view>
                      <view
                        class="score-list-collapse-item-extra"
                        :class="{ 'is-selected': item.selected }"
                        @tap="toggleItem(item)"
                      >
                        {{ item.score }}
                      </view>
                    </template>
                  </w-panel>
                </w-collapse>
              </template>
            </template>
          </template>
        </card>

        <card v-if="scoreList.length !== 0">
          <view class="score-help">
            {{ selectTerm.period === "期末" ? helpText.score : helpText.mediaScore }}
          </view>
        </card>
      </view>
    </scroll-view>
    <bottom-panel class="score-bottom-panel">
      <view />
      <view class="col">
        <refresh-button :is-refreshing="isRefreshing" @refresh="refresh" />
      </view>
      <view class="col-picker">
        <score-term-picker
          class="picker"
          :term="selectTerm.term"
          :year="selectTerm.year"
          :period="selectTerm.period"
          :selectflag="1"
          @changed="termChanged"
        />
      </view>
      <view class="col">
        <w-button shape="circle" size="large" class="sort-button">
          <view class="iconfont icon-paixu" @tap="handleSort" />
        </w-button>
      </view>
      <view />
    </bottom-panel>
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";

import { computed, onMounted, ref, watch } from "vue";

import {
  BottomPanel,
  Card,
  RefreshButton,
  ScoreTermPicker,
  ThemeConfig,
  TitleBar,
  WButton,
  WCollapse,
  WCollapsePanel,
  WDescriptions,
  WDescriptionsItem,
  WPanel
} from "@/components";
import { helpText } from "@/constants/copywriting";
import { ZFService } from "@/services";
import store, { serviceStore, systemStore } from "@/store";
import { Score } from "@/types/Score";

const KNOWN_LESSON_TYPES = new Set(["必修课", "必选课", "限选课", "任选课", "选修课", "体育课"]);

type GroupKey = "required" | "limited" | "elective" | "optional" | "sports" | "others";
type GroupConfig = { key: GroupKey; label: string; match: (type: string) => boolean };

const GROUP_CONFIG: readonly GroupConfig[] = [
  { key: "required", label: "必修课", match: (t) => t === "必修课" || t === "必选课" },
  { key: "limited", label: "限选课", match: (t) => t === "限选课" },
  { key: "elective", label: "任选课", match: (t) => t === "任选课" },
  { key: "optional", label: "选修课", match: (t) => t === "选修课" },
  { key: "sports", label: "体育课", match: (t) => t === "体育课" },
  { key: "others", label: "其他课程", match: (t) => !KNOWN_LESSON_TYPES.has(t) }
];

const isEdit = ref(false);
const showSorted = ref(false);
const isRefreshing = ref(false);
const selectTerm = ref({
  year: systemStore.generalInfo.scoreYear,
  term: systemStore.generalInfo.term,
  period: serviceStore.score.scorePeriod
});

const scoreList = computed<Score[]>(() => {
  const data = ZFService.getScoreInfo(selectTerm.value).data;
  if (!showSorted.value) return data;
  return [...data].sort((a, b) => {
    if (a.scorePoint !== b.scorePoint) {
      return parseFloat(b.scorePoint) - parseFloat(a.scorePoint);
    }
    return parseFloat(b.credits) - parseFloat(a.credits);
  });
});

// 根据持久化的 unCalScore 给每门课盖章 selected。数据源变化（切学期/刷新/排序）后重跑。
watch(
  scoreList,
  (list) => {
    const excluded = serviceStore.score.unCalScore;
    list.forEach((item) => {
      item.selected = !excluded.some((e) => e.key === item.key);
    });
  },
  { immediate: true }
);

const displayList = computed(() => [
  ...scoreList.value.filter((i) => i.selected),
  ...scoreList.value.filter((i) => !i.selected)
]);

const lessonGroups = computed(() =>
  GROUP_CONFIG.map((cfg) => ({
    ...cfg,
    items: scoreList.value.filter((item) => cfg.match(item.lessonType))
  }))
);

type LessonGroup = (typeof lessonGroups.value)[number];

function toggleItem(item: Score) {
  item.selected = !item.selected;
  store.commit(item.selected ? "delUnCalc" : "setUnCalc", item);
}

function toggleGroup(group: LessonGroup) {
  const allSelected = group.items.every((i) => i.selected);
  group.items.forEach((item) => {
    item.selected = !allSelected;
    store.commit(allSelected ? "setUnCalc" : "delUnCalc", item);
  });
}

function handleSort() {
  showSorted.value = !showSorted.value;
}

function handleSwitch() {
  isEdit.value = !isEdit.value;
}

async function refresh() {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  await ZFService.updateScoreInfo(selectTerm.value);
  isRefreshing.value = false;
}

async function termChanged(e: typeof selectTerm.value) {
  isEdit.value = false;
  store.commit("changeScorePeriod", e.period);
  isRefreshing.value = true;
  selectTerm.value = e;
  await ZFService.updateScoreInfo(e);
  isRefreshing.value = false;
}

onMounted(refresh);

const averageScorePoint = computed(() => {
  const valid = scoreList.value.filter((item) => {
    if (!item.selected) return false;
    if (item.score === "缓考" || item.score === "免修") return false;
    if (item.examType === "重修" || item.examType === "补考") return false;
    return true;
  });
  // 以 "1/1000 分" 为单位计算绩点，避免浮点数加法导致的精度问题
  let totalCredits = 0;
  let totalScorePoint = 0;
  valid.forEach((item) => {
    const credits = parseFloat(item.credits);
    totalScorePoint += parseFloat(item.scorePoint) * credits * 1000;
    totalCredits += credits;
  });
  return totalCredits === 0 ? "-" : (totalScorePoint / totalCredits / 1000).toFixed(3);
});

const headerTitle = computed(() => {
  if (selectTerm.value.year === "全") {
    return selectTerm.value.period === "期中" ? "期中成绩" : "总计绩点";
  }
  return `${selectTerm.value.year}/${parseInt(selectTerm.value.year) + 1}（${selectTerm.value.term}）`;
});

const headerSubtitle = computed(() => {
  if (selectTerm.value.year === "全") {
    return selectTerm.value.period === "期中" ? "入学后所有期中成绩" : "入学后所有课程均绩";
  }
  const charEnum = ["一", "二", "三", "四", "五", "六", "日"];
  const studentID = serviceStore.user.info?.studentID;
  let char = charEnum[0];
  if (studentID) {
    // 2023 年及以后的学号以 "30" 开头，真实入学年份从第 3 位开始
    const enrollYear =
      studentID.slice(0, 2) === "30"
        ? parseInt(studentID.slice(2, 6))
        : parseInt(studentID.slice(0, 4));
    char = charEnum[parseInt(selectTerm.value.year) - enrollYear] ?? charEnum[0];
  }
  return `大${char}${selectTerm.value.term}学期`;
});
</script>

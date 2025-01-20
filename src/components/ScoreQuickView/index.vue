<template>
  <quick-view
    title="成绩绩点"
    icon-name="score"
    class="score-quick-view"
    help
    @tap="nav2Score"
    @handle-tap-help="handleTapHelp"
  >
    <text class="sub-text">
      最新成绩 ({{ scoreUpdateTimeString }})
    </text>
    <view
      v-if="!todayScoreList || todayScoreList.length === 0"
      class="default-content"
    >
      今日没有出新成绩哦～
    </view>
    <view v-else>
      <template v-for="item in todayScoreList">
        <view
          v-if="!item.checkRead"
          :key="item.lessonID"
          class="score-card"
          style="--bg-color: var(--wjh-color-primary)"
        >
          <view class="score-title">
            <text>{{ item.lessonName }}</text>
          </view>
          <view class="score-res">
            <text v-if="item.scorePeriod">
              {{ item.scorePeriod }}
            </text>
            <text v-else>
              {{ item.scorePeriod }}
            </text>
          </view>
        </view>
      </template>
    </view>
  </quick-view>
</template>

<script setup lang="ts">
import QuickView from "../QuickView/index.vue";
import Taro from "@tarojs/taro";
import { ZFService } from "@/services";
import dayjs from "dayjs";
import { computed, onMounted, ref } from "vue";
import store, { serviceStore, systemStore } from "@/store";
import "./index.scss";
import "../../style/theme.scss";
import { Score } from "@/types/Score";

// 将帮助提示信息传到Home，点击帮助按钮显示该信息
const emit = defineEmits(["showHelp"]);
function handleTapHelp() {
  emit("showHelp", "score-card");
}

// 展示成绩列表
const showSorted = ref(false);
const selectTerm = ref({
  year: systemStore.generalInfo.termYear,
  term: systemStore.generalInfo.score || systemStore.generalInfo.term
});

onMounted(async () => {
  ZFService.updateScoreInfo({ ...selectTerm.value, period: "期中" });
  ZFService.updateScoreInfo({ ...selectTerm.value, period: "期末" });
});

/**
 * 当前学期的未读成绩
 * 可选是否按成绩排序
 */
const todayScoreList = computed(() => {
  const unreadScores = getUnreadScores(selectTerm.value);

  return showSorted.value
    ? [...unreadScores].sort((a, b) => {
      const scoreA = a.scorePoint,
        scoreB = b.scorePoint;
      return parseFloat(scoreB) - parseFloat(scoreA);
    })
    : unreadScores;
});

/**
 * 获取指定学期的未读成绩
 * @param props 学期信息
 */
function getUnreadScores(props: { year: string; term: string }) {
  const { data: midTermScores } = ZFService.getScoreInfo({ ...props, period: "期中" });
  const { data: finalTermScores } = ZFService.getScoreInfo({ ...props, period: "期末" });
  const unreadScores: Score[] = [];
  [...midTermScores, ...finalTermScores].forEach(storeItem => {
    const existingScore = serviceStore.score.readScoreMarks.find(
      markItem => (storeItem.lessonID === markItem.name &&
          storeItem.scorePoint === markItem.scorePoint)
    );
    if (!existingScore) unreadScores.push(storeItem);
  });
  // 若有新成绩，则更新时间
  if (unreadScores.length !== 0) store.commit("findNewScore");

  return unreadScores;
}

// 最新成绩的更新时间（几天前）
const scoreUpdateTimeString = computed(() => {
  if (!updateTime.value) return "更新失败";
  return dayjs(updateTime.value).fromNow();
});

const updateTime = computed(() => {
  try {
    return serviceStore.score.findNewScoresTime;
  } catch {
    return undefined;
  }
});

// @tap="nav2Score" 点击卡片，跳转到成绩查询详细页面
function nav2Score() {
  todayScoreList.value.forEach(item => {
    store.commit("insertReadScore", item);
  });
  Taro.navigateTo({ url: "/pages/score/index" });
}

</script>

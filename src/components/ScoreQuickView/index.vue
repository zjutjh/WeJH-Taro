<template>
  <quick-view
    title="成绩查询"
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
      v-if="unreadScoreStore.list.length === 0"
      class="default-content"
    >
      今日没有出新成绩哦～
    </view>
    <view v-else>
      <view
        v-for="item in unreadScoreStore.list"
        :key="item.lessonID"
        class="score-card"
        style="--bg-color: var(--wjh-color-primary)"
      >
        <view class="score-title">
          <text>{{ item.lessonName }}</text>
        </view>
        <view class="score-res">
          <text>{{ item.period }}</text>
        </view>
      </view>
    </view>
  </quick-view>
</template>

<script setup lang="ts">
import QuickView from "../QuickView/index.vue";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { computed } from "vue";
import "./index.scss";
import useUnreadScore from "@/hooks/score/unread";

// 将帮助提示信息传到Home，点击帮助按钮显示该信息
const emit = defineEmits(["showHelp"]);
function handleTapHelp() {
  emit("showHelp", "score-card");
}
const unreadScoreStore = useUnreadScore();

// 最新成绩的更新时间（几天前）
const scoreUpdateTimeString = computed(() => {
  if (!unreadScoreStore.lastScoreUpdateTime) return "更新失败";
  return dayjs(unreadScoreStore.lastScoreUpdateTime).fromNow();
});

// @tap="nav2Score" 点击卡片，跳转到成绩查询详细页面
function nav2Score() {
  unreadScoreStore.readAll();
  Taro.navigateTo({ url: "/pages/score/index" });
}

</script>

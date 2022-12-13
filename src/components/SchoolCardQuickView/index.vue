<template>
  <quick-view
    title="校园卡"
    icon-name="schoolcard"
    help
    @tap="nav2Card"
    @handle-tap-help="handleTapHelp"
  >
    <text class="sub-text">
      当前余额 ({{ balanceUpdateTimeString }})
    </text>
    <view class="quickcard-balance">
      <text> ¥ {{ balance || 0 }} </text>
    </view>
  </quick-view>
</template>

<script setup lang="ts">
import QuickView from "../QuickView/index.vue";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { computed } from "vue";
import { serviceStore } from "@/store";
import "./index.scss";

const emit = defineEmits(["showHelp"]);

const balanceUpdateTimeString = computed(() => {
  const updateTime = serviceStore.card.updateTime;
  if (updateTime?.balance) return dayjs(updateTime.balance).fromNow();
  else return "更新失败";
});

const balance = computed(() => {
  return serviceStore.card.balance;
});

function nav2Card() {
  Taro.navigateTo({ url: "/pages/schoolcard/index" });
}

function handleTapHelp() {
  emit("showHelp", "school-card");
}
</script>

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
      <text> ¥ {{ cardBalanceStore.balance }} </text>
    </view>
  </quick-view>
</template>

<script setup lang="ts">
import QuickView from "../QuickView/index.vue";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { computed } from "vue";
import "./index.scss";
import useCardBalanceStore from "@/store/service/cardBalance";

const cardBalanceStore = useCardBalanceStore();

const emit = defineEmits(["showHelp"]);

const balanceUpdateTimeString = computed(() => {
  return !cardBalanceStore.error ? dayjs(cardBalanceStore.updateTime).fromNow() : "更新失败";
});

function nav2Card() {
  Taro.navigateTo({ url: "/pages/schoolcard/index" });
}

function handleTapHelp() {
  emit("showHelp", "school-card");
}
</script>

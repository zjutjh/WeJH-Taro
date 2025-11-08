<template>
  <quick-view-container
    title="校园卡"
    icon-name="schoolcard"
    :help="true"
    @tap="nav2Card"
    @handle-tap-help="handleTapHelp"
  >
    <text class="sub-text"> 当前余额 ({{ balanceUpdateTimeString }}) </text>
    <view class="quickcard-balance">
      <text> ¥ {{ balance || 0 }} </text>
    </view>
  </quick-view-container>
</template>

<script setup lang="ts">
import "./index.scss";

import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { computed } from "vue";

import { useRequest } from "@/hooks";
import { YxyService } from "@/services";
import store, { serviceStore } from "@/store";

import QuickViewContainer from "../quick-view-container/index.vue";

const { error, loading } = useRequest(YxyService.querySchoolCardBalance, {
  onSuccess: (res) => {
    if (res.data.code === 1) {
      if (Number.isFinite(parseFloat(res.data.data))) store.commit("setCardBalance", res.data.data);
      else throw new Error("无效余额值");
    } else {
      throw new Error(res.data.msg);
    }
  },
  onError: (e) => {
    if (!(e instanceof Error)) return `查询校园卡余额\r\n${e.errMsg}`;
    return `查询校园卡余额\r\n${e.message}`;
  }
});

const emit = defineEmits(["showHelp"]);

const balanceUpdateTimeString = computed(() => {
  if (loading.value) {
    return "正在查询";
  }
  const time = serviceStore.card.updateTime;
  return !error.value ? dayjs(time.balance).fromNow() : "更新失败";
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

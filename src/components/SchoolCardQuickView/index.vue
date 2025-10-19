<template>
  <quick-view
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
  </quick-view>
</template>

<script setup lang="ts">
import "./index.scss";

import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { computed } from "vue";

import { useRequest } from "@/hooks";
import { YxyService } from "@/services";
import store, { serviceStore } from "@/store";

import QuickView from "../QuickView/index.vue";

const { error } = useRequest(YxyService.querySchoolCardBalance, {
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

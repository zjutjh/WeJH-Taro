<template>
  <quick-view title="电量查询" icon-name="electricity" @tap="nav2electricity">
    <view class="text-view">
      <text class="sub-text-left"> 当前电量({{ updateTimeString }}) </text>
      <text v-if="isUrgent" class="sub-text-right"> 温馨提示: 电量较低 </text>
    </view>
    <card class="electricity-card">
      <view v-if="!loading" class="text-wrapper">
        <text>寝室剩余电量</text>
        <text :class="isUrgent ? 'dangerous' : 'normal'">
          {{ balanceData?.data.soc || 0 }}
        </text>
        <text>度</text>
      </view>
      <text v-else> 正在查询... </text>
    </card>
  </quick-view>
</template>

<script lang="ts" setup>
import "./index.scss";

import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { computed, watch } from "vue";

import { QuickView } from "@/components";
import { useRequest } from "@/hooks";
import { YxyService } from "@/services";
import store, { serviceStore } from "@/store";

import Card from "../Card/index.vue";

function nav2electricity() {
  Taro.navigateTo({ url: "/pages/electricity/index" });
}
const campus = computed(() => serviceStore.electricity.electricityCampus);

const {
  data: balanceData,
  loading,
  error,
  run
} = useRequest(YxyService.queryBalance, {
  manual: true,
  onSuccess: (res) => {
    if (res.data.data.soc) {
      serviceStore.electricity.lastCampus = campus.value;
      store.commit("setBalance", res.data.data.soc);
    } else {
      throw new Error(res.data.msg);
    }
  }
});

watch(
  campus,
  (newCampus) => {
    run({ campus: newCampus });
  },
  { immediate: true }
);

const isUrgent = computed(() => {
  if (balanceData.value) return balanceData.value.data.soc < 20;
  return false;
});

const updateTimeString = computed(() => {
  const time = serviceStore.electricity.updateTime.balance;
  return !error.value ? dayjs(time).fromNow() : "更新失败";
});
</script>

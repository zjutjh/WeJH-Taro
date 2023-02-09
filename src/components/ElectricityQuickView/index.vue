<template>
  <quick-view title="电费查询" icon-name="electricity" @tap="nav2electricity">
    <view class="text-view">
      <text class="sub-text-left">当前电费({{ updateTimeString }})</text>
      <text v-if="isUrgent" class="sub-text-right">温馨提示: 电量较低</text>
    </view>
    <card class="electricity-card">
      <view class="text-wrapper" v-if="!loading">
        <text> 寝室剩余电费 </text>
        <text :class="isUrgent ? 'dangerous' : 'normal'">
          {{ balanceData?.data.soc || 0 }}
        </text>
        <text> 度 </text>
      </view>
      <text v-else>正在查询...</text>
    </card>
  </quick-view>
</template>

<script lang="ts" setup>
import { QuickView } from "@/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import { computed } from "vue";
import { YxyService } from "@/services";
import store, { serviceStore } from "@/store";
import Card from "../Card/index.vue";
import dayjs from "dayjs";
import { useRequest } from "@/hooks";

function nav2electricity() {
  Taro.navigateTo({ url: "/pages/electricity/index" });
}

const { data: balanceData, loading, error } = useRequest(
  YxyService.queryBalance, {
    onSuccess: (res) => {
      if (res.data.data?.soc) {
        store.commit("setBalance",res.data.data.soc);
      } else throw new Error();
    }
  }
);

const isUrgent = computed(() => {
  if (balanceData.value)
    return balanceData.value.data.soc < 20;
  else
    return false;
});

const updateTimeString = computed(() => {
  const time = serviceStore.electricity.updateTime.balance;
  return time && !error.value ? dayjs(time).fromNow() : "更新失败";
});

</script>

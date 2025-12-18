<template>
  <quick-view-container title="电量查询" icon-name="electricity" @tap="nav2electricity">
    <view class="text-view">
      <text class="sub-text-left"> 当前电量({{ updateTimeString }}) </text>
      <text v-if="isUrgent" class="sub-text-right"> 温馨提示: 电量较低 </text>
    </view>
    <card class="electricity-card">
      <view v-if="status !== 'pending'" class="text-wrapper">
        <text>寝室剩余电量</text>
        <text :class="isUrgent ? 'dangerous' : 'normal'"> {{ data?.soc || 0 }} </text>
        <text>度</text>
      </view>
      <text v-else> 正在查询... </text>
    </card>
  </quick-view-container>
</template>

<script lang="ts" setup>
import "./index.scss";

import { useQuery } from "@tanstack/vue-query";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { computed } from "vue";

import { Card } from "@/components";
import { electricityServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { useElectricityStore } from "@/store/service/electricity";

import QuickViewContainer from "../quick-view-container/index.vue";

const nav2electricity = () => Taro.navigateTo({ url: "/pages/electricity/index" });

const { campus } = storeToRefs(useElectricityStore());
const { data, status, dataUpdatedAt } = useQuery({
  queryKey: [QUERY_KEY.ELECTRICITY_BALANCE, campus] as const,
  queryFn: ({ queryKey }) => electricityServiceNext.QueryBalance({ campus: queryKey[1] })
});

const isUrgent = computed(() => (data.value ? data.value.soc < 20 : false));

const updateTimeString = computed(() => {
  if (status.value === "pending") return "请稍候";
  return status.value !== "error" ? dayjs(dataUpdatedAt.value).fromNow() : "更新失败";
});
</script>

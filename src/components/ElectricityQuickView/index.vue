<template>
  <quick-view title="电费查询" icon-name="electricity" @tap="nav2electricity">
    <view class="text-view">
      <text class="sub-text-left">
        当前电费({{ updateTimeString }})
      </text>
      <text v-if="isUrgent" class="sub-text-right">
        温馨提示: 电量较低
      </text>
    </view>
    <card class="electricity-card">
      <view v-if="!loading" class="text-wrapper">
        <text>寝室剩余电费</text>
        <text :class="isUrgent ? 'dangerous' : 'normal'">
          {{ balance }}
        </text>
        <text>度</text>
      </view>
      <text v-else>
        正在查询...
      </text>
    </card>
  </quick-view>
</template>

<script lang="ts" setup>
import { QuickView } from "@/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import { computed } from "vue";
import Card from "../Card/index.vue";
import dayjs from "dayjs";
import useElectricityBalanceStore from "@/store/service/balance";
import { storeToRefs } from "pinia";

const { loading, balance, error, updateTime } = storeToRefs(useElectricityBalanceStore());

function nav2electricity() {
  Taro.navigateTo({ url: "/pages/electricity/index" });
}

const isUrgent = computed(() => {
  return balance.value < 20;
});

const updateTimeString = computed(() => {
  return updateTime.value && !error.value ? dayjs(updateTime.value).fromNow() : "更新失败";
});

</script>

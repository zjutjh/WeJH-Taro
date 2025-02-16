<template>
  <quick-view title="电费查询" icon-name="electricity" @tap="nav2electricity">
    <view class="text-view">
      <text class="sub-text-left">
        当前电费({{ status }})
      </text>
      <text v-if="isUrgent" class="sub-text-right">
        温馨提示: 电量较低
      </text>
    </view>
    <card class="electricity-card">
      <view v-if="!isFetching" class="text-wrapper">
        <text>寝室剩余电费</text>
        <text :class="isUrgent ? 'dangerous' : 'normal'">
          {{ data?.balance ?? "-" }}
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
import { computed, toRef } from "vue";
import Card from "../Card/index.vue";
import dayjs from "dayjs";
import useElectricityBalanceQuery from "@/store/service/balance";
import useElectricityQueryOption from "@/hooks/electricity/useElectricityQueryOption";
import { RequestError } from "@/utils";

const queryOptions = useElectricityQueryOption();
const { isFetching, data, error } = useElectricityBalanceQuery({
  campus: toRef(() => queryOptions.campus)
});

function nav2electricity() {
  Taro.navigateTo({ url: "/pages/electricity/index" });
}

const isUrgent = computed(() => {
  if (!data.value) return false;
  return data.value.balance < 20;
});

const status = computed(() => {
  if (error.value instanceof RequestError && error.value.code === 200525) {
    return "更新失败：请进入电费页更换校区";
  } else if (!data.value?._upTime || error.value) {
    return "更新失败";
  }
  return dayjs(data.value._upTime).fromNow();
});
</script>

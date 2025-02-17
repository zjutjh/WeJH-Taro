<template>
  <theme-config>
    <title-bar title="寝室电量查询" back-button />
    <scroll-view :scroll-y="true">
      <view class="header-view">
        <taro-image :src="ElectricityCoverImage" />
      </view>
      <view class="flex-column">
        <card class="info-card">
          <view class="dormitory-info">
            <view class="icon-wrapper">
              <view class="iconfont icon-electricity" />
            </view>
            <view class="text-wrapper">
              <text>{{ balanceInfo?.room ?? "-" }}</text>
            </view>
          </view>
        </card>

        <w-list>
          <w-list-item class="electricity-list-item">
            <view class="text-wrapper">
              <text> 剩余总电量 </text>
              <text :class="[isUrgent ? 'dangerous' : 'normal', 'rest-number']">
                {{ balanceInfo?.balance.toFixed(2) ?? '-' }}
              </text>
              <text> 度 </text>
            </view>
          </w-list-item>
        </w-list>
        <text
          v-if="isUrgent"
          class="dangerous"
          style="font-size: .8rem"
        >
          温馨提示: 电量已不足20度，请及时充电
        </text>

        <w-list @tap="nav2Consumption">
          <w-list-item arrow="right" class="electricity-list-item">
            <view class="text-wrapper" style="justify-content: space-between;">
              <text> 每日用电记录 </text>
              <text v-if="isFetching" class="today">
                正在加载...
              </text>
              <text v-else-if="consumption" class="today">
                昨日已用: {{ consumption }}
              </text>
            </view>
          </w-list-item>
        </w-list>

        <w-list @tap="nav2Record">
          <w-list-item arrow="right" class="electricity-list-item">
            <view class="text-wrapper">
              <text> 缴费记录 </text>
            </view>
          </w-list-item>
        </w-list>

        <w-list @tap="nav2Subscribe">
          <w-list-item arrow="right" class="electricity-list-item">
            <view class="text-wrapper">
              <text> 低电提醒消息订阅 </text>
            </view>
          </w-list-item>
        </w-list>
      </view>
    </scroll-view>
    <bottom-panel>
      <campus-picker v-model="fieldCampus" />
    </bottom-panel>
  </theme-config>
</template>

<script setup lang="ts">
import {
  BottomPanel,
  Card,
  ThemeConfig,
  TitleBar,
  WList,
  WListItem
} from "@/components";
import { computed, ref, watch, watchEffect } from "vue";
import Taro from "@tarojs/taro";
import { YxyService } from "@/services";
import ElectricityCoverImage from "@/assets/photos/electricity.svg";
import { Image as TaroImage } from "@tarojs/components";
import useElectricityBalanceQuery from "@/store/service/balance";
import { useQuery } from "@tanstack/vue-query";
import CampusPicker from "./components/campus-picker.vue";
import useElectricityQueryOption from "../../hooks/electricity/useElectricityQueryOption";
import { RequestError } from "@/utils";
import "./index.scss";

const queryOptions = useElectricityQueryOption();
const fieldCampus = ref(queryOptions.campus);
const { data: balanceInfo, error: balanceError, status } = useElectricityBalanceQuery({
  campus: fieldCampus
});
const { data: consumption, isFetching } = useQuery({
  queryKey: ["electricity/consumption", fieldCampus] as const,
  queryFn: ({ queryKey }) => YxyService.queryConsumption({ campus: queryKey[1] }),
  select: raw => raw.at(0)?.used
});

const isUrgent = computed(() => {
  if (balanceInfo.value) {
    return balanceInfo.value?.balance < 20;
  }
  return false;
});

function nav2Record() {
  Taro.navigateTo({
    url: "/pages/electricity/record/index"
  });
}

function nav2Consumption() {
  Taro.navigateTo({
    url: "/pages/electricity/consumption/index"
  });
}

function nav2Subscribe() {
  Taro.navigateTo({
    url: "/pages/electricity/subscribe/index"
  });
}

watchEffect(() => {
  const error = balanceError.value;
  if (error instanceof RequestError && error.code === 200525) {
    Taro.showModal({
      content: "未绑定该校区，请尝试选择其他校区"
    });
  } else if (error instanceof Error) {
    Taro.showToast({ title: error.message, icon: "none" });
  }
});

watchEffect(() => {
  if (status.value === "pending") {
    Taro.showLoading({ mask: true, title: "正在查询..." });
  } else {
    Taro.hideLoading();
  }
});

watch(fieldCampus, newValue => {
  queryOptions.campus = newValue;
});
</script>

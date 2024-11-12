<template>
  <theme-config>
    <title-bar title="寝室电费查询" back-button />
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
              <text>{{ room.name }}</text>
              <text class="week">
                房间号 {{ room.code }}
              </text>
            </view>
          </view>
        </card>

        <w-list>
          <w-list-item class="electricity-list-item">
            <view class="text-wrapper">
              <text> 剩余总电量 </text>
              <text :class="[isUrgent ? 'dangerous' : 'normal', 'rest-number']">
                {{ balance.toFixed(2) }}
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
              <text v-if="consumptionLoading" class="today">
                正在加载...
              </text>
              <text v-else-if="todayConsumption" class="today">
                今日已用: {{ todayConsumption }} kwh
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
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";
import {
  Card,
  ThemeConfig,
  TitleBar,
  WList,
  WListItem
} from "@/components";
import { computed } from "vue";
import Taro from "@tarojs/taro";
import useElectricityBalanceStore from "@/store/service/balance";
import { storeToRefs } from "pinia";
import { useRequestNext } from "@/hooks";
import { YxyService } from "@/services";
import ElectricityCoverImage from "@/assets/photos/electricity.svg";
import { Image as TaroImage } from "@tarojs/components";

const { room, balance } = storeToRefs(useElectricityBalanceStore());
const { loading: consumptionLoading, data: consumption } = useRequestNext(
  YxyService.queryConsumption, {
    initialData: []
  }
);
const todayConsumption = computed(() => consumption.value[0]?.used);
const isUrgent = computed(() => balance.value < 20);

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

</script>

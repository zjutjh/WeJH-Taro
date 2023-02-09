<template>
  <view class="background">
    <title-bar title="寝室电费查询" back-button></title-bar>
    <scroll-view :scrollY="true">
      <view class="header-view">
        <image src="@/assets/photos/electricity.svg"></image>
      </view>
      <view class="flex-column">
        <card class="info-card">
          <view class="dormitory-info">
            <view class="icon-wrapper">
              <view class="iconfont icon-electricity" />
            </view>
            <view class="text-wrapper">
              <text color="black">{{ roomInfo.roomName }}</text>
              <text class="week">房间号 {{ roomInfo.roomCode }}</text>
            </view>
          </view>
        </card>

        <w-list>
          <w-list-item class="electricity-list-item">
            <view class="text-wrapper">
              <text> 剩余总电量 </text>
              <text :class="[isUrgent ? 'dangerous' : 'normal', 'rest-number']">
                {{ balance }}
              </text>
              <text> 度 </text>
            </view>
          </w-list-item>
        </w-list>
        <text v-if="isUrgent" class="dangerous" style="font-size: .8rem">
          温馨提示: 电量已不足20度，请及时充电
        </text>

        <w-list @tap="nav2Consumption">
          <w-list-item arrow="right" class="electricity-list-item">
            <view class="text-wrapper" style="justify-content: space-between;">
              <text> 每日用电记录 </text>
              <text v-if="consumptionLoading" class="today">正在加载...</text>
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
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import "./index.scss";
import {
  Card,
  TitleBar,
  WList,
  WListItem
} from "@/components";
import { useRequest } from "@/hooks";
import { YxyService } from "@/services";
import { computed } from "vue";
import store, { serviceStore } from "@/store";
import Taro from "@tarojs/taro";

const roomInfo = computed(() => ({
  roomName: serviceStore.electricity.roomName,
  roomCode: serviceStore.electricity.roomCode
}));

const balance = computed(() => serviceStore.electricity.balance);

const todayConsumption = computed(() => (serviceStore.electricity.todayConsumption));

useRequest(YxyService.queryBalance, {
  onBefore: () => {
    Taro.showLoading({ title: "正在加载" });
  },
  onSuccess: (response) => {
    if (response.data.code === 1) {
      store.commit("setElectricityStore", {
        roomName: response.data.data.display_room_name,
        roomCode: response.data.data.room_code,
        balance: response.data.data.soc
      });
    } else {
      throw new Error(response.data.msg || response.errMsg);
    }
    Taro.hideLoading();
  },
  onError: (error) => {
    if (error instanceof Error)
      return error.message;
    else return `查询电费余额失败\r\n${error.errMsg}`;
  }
});

const {
  loading: consumptionLoading,
} = useRequest(YxyService.queryConsumption, {
  onSuccess: (response) => {
    if (response.data.code === 1) {
      store.commit("setConsumption", response.data.data[0].used);
    } else {
      throw new Error(response.data.msg);
    }
  },
  onError: (error) => {
    if (error instanceof Error)
      return error.message;
  }
});

const isUrgent = computed(() => {
  if (balance) return balance.value < 20;
  else false;
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

</script>

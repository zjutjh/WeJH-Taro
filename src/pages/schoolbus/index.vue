<template>
  <theme-config>
    <title-bar title="校车" :back-button="true" />
    <view :class="styles['schoolbus-title-bar']">
      <view :class="styles['row-1']">
        <view :class="styles['search-input-container']">
          <view class="iconfont icon-search" :class="styles['search-icon']" />
          <input type="text" :class="styles['search-input']" placeholder="请输入关键词" disabled />
        </view>
        <view :class="styles['icon-wrapper']" @tap="showLineModal = true">
          <view :class="[styles['icon']]" class="iconfont icon-route" />
          <view :class="styles['description']">路线</view>
        </view>
        <view :class="styles['icon-wrapper']">
          <view :class="[styles['icon']]" class="iconfont icon-alarm" />
          <view :class="styles['description']">通知</view>
        </view>
        <view :class="styles['icon-wrapper']" @tap="showTipModal = true">
          <view :class="[styles['icon']]" class="iconfont icon-help" />
          <view :class="styles['description']">提示</view>
        </view>
      </view>
      <view :class="styles['row-2']">
        <picker
          :class="styles['route-selector']"
          mode="selector"
          :range="allPoint"
          @change="onChangeStart"
        >
          <button :class="styles['picker-button']">
            {{ selectedStart ? allPointMap[selectedStart] : "" }}
          </button>
        </picker>
        <view
          class="iconfont icon-a-Switchroute"
          :class="styles['routeSwapper']"
          @tap="swapCampus"
        />
        <picker
          :class="styles['route-selector']"
          mode="selector"
          :range="allPoint"
          @change="onChangeEnd"
        >
          <button :class="styles['picker-button']">
            {{ selectedEnd ? allPointMap[selectedEnd] : "" }}
          </button>
        </picker>
      </view>
      <view :class="styles['row-3']"> </view>
    </view>
    <scroll-view
      v-if="selectedStart && selectedEnd"
      :class="styles['schoolbus-container']"
      :scroll-y="true"
    >
      <bus-time-card
        v-for="(item, index) in filteredBusTimeList"
        :key="`${item.start}-${item.end}-${item.departureTime}-${index}`"
        v-bind="item"
      />
    </scroll-view>
    <view v-else :class="styles['schoolbus-container']">
      <bus-time-empty />
    </view>
    <bus-line-modal
      v-model:show="showLineModal"
      :line-list="busLineList"
      @select="handleLineSelect"
    />
    <bus-tip-modal v-model:show="showTipModal" />
  </theme-config>
</template>

<script setup lang="ts">
import { Picker, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { computed, ref } from "vue";

import {
  BusLineModal,
  BusTimeCard,
  BusTimeEmpty,
  BusTipModal,
  ThemeConfig,
  TitleBar
} from "@/components";
import { useBusInfo } from "@/hooks/use-bus-info";

import styles from "./index.module.scss";

const showLineModal = ref(false);
const showTipModal = ref(false);

const { busTimeList, busLineList } = useBusInfo();
const filteredBusTimeList = computed(() => {
  return busTimeList.value.filter((item) => {
    const matchStart = item.start === selectedStart.value;
    const matchEnd = item.end === selectedEnd.value;
    return matchStart && matchEnd;
  });
});

const selectedStart = ref();
const selectedEnd = ref();

const allPoint = ["朝晖", "屏峰", "莫干山", "人才公寓"];
const allPointMap = {
  朝晖: "朝晖校区",
  屏峰: "屏峰校区",
  莫干山: "莫干山校区",
  人才公寓: "人才公寓"
};

const onChangeStart = (e) => {
  const index = e.detail.value;
  selectedStart.value = Object.values(allPoint)[index];
};
const onChangeEnd = (e) => {
  const index = e.detail.value;
  selectedEnd.value = Object.values(allPoint)[index];
};

const swapCampus = () => {
  const temp = selectedStart.value;
  selectedStart.value = selectedEnd.value;
  selectedEnd.value = temp;
};

const handleLineSelect = (line: string) => {
  let start = "";
  let end = "";

  for (const [groupName, lines] of Object.entries(busLineList.value)) {
    if (lines.includes(line)) {
      [start, end] = groupName.split("-");
      break;
    }
  }

  if (start && end) {
    Taro.navigateTo({
      url: `/pages/schoolbus/bus-detail/index?routeName=${line}&start=${start}&end=${end}`
    });
  }
};
</script>

<template>
  <theme-config>
    <title-bar title="校车" :back-button="true" />
    <view :class="styles['schoolbus-title-bar']">
      <view :class="styles['left-area']">
        <view :class="styles['left-top-block']">
          <!-- 先空着 看UI打算修改为什么展示模式 -->
          <picker :class="styles['line-type-selector']" mode="selector">
            <button :class="styles['picker-button']">{{}}</button>
          </picker>
        </view>
        <view :class="styles['left-bottom-block']">
          <picker
            :class="styles['route-selector']"
            mode="selector"
            :range="allCampus"
            @change="onChangeStart"
          >
            <button :class="styles['picker-button']">
              {{ selectedStart ? `${selectedStart}校区` : "" }}
            </button>
          </picker>
        </view>
      </view>
      <view :class="styles['center-area']">
        <view :class="styles['station-swapper']" @tap="swapCampus">
          <view :class="styles['station-swapper-icon']" class="iconfont icon-station-change" />
        </view>
      </view>
      <view :class="styles['right-area']">
        <view :class="styles['right-top-block']">
          <view :class="styles['icon-wrapper']">
            <view :class="[styles['icon']]" class="iconfont icon-route" />
            <view :class="styles['description']">路线</view>
          </view>
          <view :class="styles['icon-wrapper']">
            <view :class="[styles['icon']]" class="iconfont icon-alarm" />
            <view :class="styles['description']">通知</view>
          </view>
          <view :class="styles['icon-wrapper']">
            <view :class="[styles['icon']]" class="iconfont icon-help" />
            <view :class="styles['description']">提示</view>
          </view>
        </view>
        <view :class="styles['right-bottom-block']">
          <picker
            :class="styles['route-selector']"
            mode="selector"
            :range="allCampus"
            @change="onChangeEnd"
          >
            <button :class="styles['picker-button']">
              {{ selectedEnd ? `${selectedEnd}校区` : "" }}
            </button>
          </picker>
        </view>
      </view>
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
  </theme-config>
</template>

<script setup lang="ts">
import { Picker, ScrollView } from "@tarojs/components";
import { computed, ref } from "vue";

import { BusTimeCard, BusTimeEmpty, ThemeConfig, TitleBar } from "@/components";
import { useBusInfo } from "@/hooks/use-bus-info";

import styles from "./index.module.scss";

const { busTimeList } = useBusInfo();
const filteredBusTimeList = computed(() => {
  return busTimeList.value.filter((item) => {
    const matchStart = item.start === selectedStart.value;
    const matchEnd = item.end === selectedEnd.value;
    return matchStart && matchEnd;
  });
});

const selectedStart = ref();
const selectedEnd = ref();
const allCampus = ["朝晖", "屏峰", "莫干山"];
const onChangeStart = (e) => {
  const index = e.detail.value;
  selectedStart.value = Object.values(allCampus)[index];
};
const onChangeEnd = (e) => {
  const index = e.detail.value;
  selectedEnd.value = Object.values(allCampus)[index];
};

const swapCampus = () => {
  const temp = selectedStart.value;
  selectedStart.value = selectedEnd.value;
  selectedEnd.value = temp;
};
</script>

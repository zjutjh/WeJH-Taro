<template>
  <theme-config>
    <title-bar title="校车" :back-button="true" />
    <view :class="styles['schoolbus-title-bar']">
      <view :class="styles['row-1']">
        <view :class="styles['search-input-container']">
          <view class="iconfont icon-search" :class="styles['search-icon']" />
          <input
            v-model="search"
            type="text"
            :class="styles['search-input']"
            placeholder="请输入关键词"
          />
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
      <view :class="styles['row-3']">
        <view
          :class="[styles['filter-item'], isDirectOnly ? styles['active'] : '']"
          @tap="isDirectOnly = !isDirectOnly"
        >
          直达线
        </view>
        <view :class="styles['divider']">|</view>
        <view
          :class="[styles['filter-item'], timeFilter.includes('morning') ? styles['active'] : '']"
          @tap="toggleTimeFilter('morning')"
        >
          早上
        </view>
        <view
          :class="[styles['filter-item'], timeFilter.includes('afternoon') ? styles['active'] : '']"
          @tap="toggleTimeFilter('afternoon')"
        >
          下午
        </view>
        <view
          :class="[styles['filter-item'], timeFilter.includes('evening') ? styles['active'] : '']"
          @tap="toggleTimeFilter('evening')"
        >
          晚上
        </view>
      </view>
    </view>
    <scroll-view
      v-if="selectedStart && selectedEnd && filteredBusTimeList.length > 0"
      :class="styles['schoolbus-container']"
      :scroll-y="true"
    >
      <bus-time-card
        v-for="(item, index) in filteredBusTimeList"
        :key="`${item.start}-${item.end}-${item.departureTime}-${index}`"
        v-bind="item"
      />
    </scroll-view>
    <view v-else-if="!selectedStart || !selectedEnd" :class="styles['schoolbus-container']">
      <bus-time-unselected />
    </view>
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
  BusTimeUnselected,
  BusTipModal,
  ThemeConfig,
  TitleBar
} from "@/components";
import diyData from "@/hooks/diy-data.json";
import { useBusLineList, useBusTimeList } from "@/hooks/use-bus-info";

import styles from "./index.module.scss";

const showLineModal = ref(false);
const showTipModal = ref(false);

/** 是否直达 */
const isDirectOnly = ref(false);
/** 时间段筛选 */
const timeFilter = ref<string[]>([]);

const toggleTimeFilter = (type: "morning" | "afternoon" | "evening") => {
  if (timeFilter.value.includes(type)) {
    timeFilter.value = timeFilter.value.filter((t) => t !== type);
  } else {
    timeFilter.value.push(type);
  }
};

const search = ref("");

const { busTimeList } = useBusTimeList({ search });
const { busLineList } = useBusLineList();

const filteredBusTimeList = computed(() => {
  /** 根据浙工大官方网站 翰墨香林 金月巷 也认为是 "屏峰" */
  const isPF = (point: string) => {
    return point === "屏峰" || point === "翰墨香林" || point === "金月巷";
  };

  return busTimeList.value.filter((item) => {
    // 1. 校区筛选
    let matchEnd: boolean = true;
    let matchStart: boolean = true;
    if (selectedStart.value === "屏峰") matchStart = isPF(item.start);
    else matchStart = item.start === selectedStart.value;

    if (selectedEnd.value === "屏峰") matchEnd = isPF(item.end);
    else matchEnd = item.end === selectedEnd.value;

    if (!matchStart || !matchEnd) return false;

    // 2. 是否直达线
    if (isDirectOnly.value) {
      if (!item.routeName.includes("直达")) return false;
    }

    // 3. 时间段筛选(早上 下午 晚上)
    if (timeFilter.value.length > 0) {
      const timeStr = item.departureTime.split(" ")[1];
      const [hour, minute] = timeStr.split(":").map(Number);
      const totalMinutes = hour * 60 + minute;

      const isMorning = totalMinutes >= 0 && totalMinutes < 12 * 60;
      const isAfternoon = totalMinutes >= 12 * 60 && totalMinutes < 18 * 60;
      const isEvening = totalMinutes >= 18 * 60 && totalMinutes < 24 * 60;

      let matchTime = false;
      if (timeFilter.value.includes("morning") && isMorning) matchTime = true;
      if (timeFilter.value.includes("afternoon") && isAfternoon) matchTime = true;
      if (timeFilter.value.includes("evening") && isEvening) matchTime = true;

      if (!matchTime) return false;
    }

    return true;
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

  diyData.forEach((item) => {
    if (item.name.startsWith(line)) {
      start = item.name.split("（")[1].split("-")[0];
      end = item.name.split("（")[1].split("-")[1].split("）")[0];
    }
  });

  if (start && end) {
    Taro.navigateTo({
      url: `/pages/schoolbus/bus-detail/index?routeName=${line}&start=${start}&end=${end}`
    });
  }
};
</script>

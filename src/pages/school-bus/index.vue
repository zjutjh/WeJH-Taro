<template>
  <theme-config>
    <title-bar title="校车" :back-button="true" />
    <view :class="styles['school-bus-title-bar']">
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
        <view :class="styles['icon-wrapper']" @tap="navigate2Announce()">
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
          <button
            :class="styles['picker-button']"
            :style="
              selectedStart === '不限'
                ? { color: 'var(--wjh-color-text-secondary)', opacity: 0.6 }
                : ''
            "
          >
            {{ selectedStart === "不限" ? "请选择起点" : selectedStart }}
          </button>
        </picker>
        <view
          class="iconfont icon-switch-route"
          :class="styles['routeSwapper']"
          @tap="swapCampus"
        />
        <picker
          :class="styles['route-selector']"
          mode="selector"
          :range="allPoint"
          @change="onChangeEnd"
        >
          <button
            :class="styles['picker-button']"
            :style="
              selectedEnd === '不限'
                ? { color: 'var(--wjh-color-text-secondary)', opacity: 0.6 }
                : ''
            "
          >
            {{ selectedEnd === "不限" ? "请选择终点" : selectedEnd }}
          </button>
        </picker>
      </view>
      <view :class="styles['row-3']">
        <span
          :class="[styles['filter-item'], isDirectOnly ? styles['active'] : '']"
          @tap="isDirectOnly = !isDirectOnly"
        >
          直达线
        </span>
        <span :class="styles['divider']">|</span>
        <span
          :class="[styles['filter-item'], timeFilter.includes('morning') ? styles['active'] : '']"
          @tap="toggleTimeFilter('morning')"
        >
          06:00~12:00
          <!-- 此处三个时间段在代码里被命名为早上下午晚上, 实际是也就是这个意思, 此处仅为了严谨易懂(今早明早都是早上)使用了具体时间的写法 -->
        </span>
        <span :class="styles['divider']">|</span>
        <span
          :class="[styles['filter-item'], timeFilter.includes('afternoon') ? styles['active'] : '']"
          @tap="toggleTimeFilter('afternoon')"
        >
          12:01~18:00
        </span>
        <span :class="styles['divider']">|</span>
        <span
          :class="[styles['filter-item'], timeFilter.includes('evening') ? styles['active'] : '']"
          @tap="toggleTimeFilter('evening')"
        >
          18:01~23:00
        </span>
      </view>
    </view>
    <scroll-view
      v-if="filteredBusTimeList.length > 0"
      :class="styles['school-bus-container']"
      :scroll-y="true"
    >
      <bus-time-card
        v-for="(item, index) in filteredBusTimeList"
        :key="`${item.start}-${item.end}-${item.departureTime}-${index}`"
        v-bind="item"
      />
    </scroll-view>
    <view v-else :class="styles['school-bus-container']">
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
import { useBusConfig, useBusLineList, useBusTimeList } from "@/hooks/use-bus-info";
import { isPFCampus } from "@/utils/school-bus";

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

const { busConfig } = useBusConfig();

const filteredBusTimeList = computed(() => {
  return busTimeList.value.filter((item) => {
    // 1. 校区筛选
    let matchEnd: boolean;
    let matchStart: boolean;
    if (selectedStart.value === "不限") matchStart = true;
    else if (selectedStart.value === "屏峰") matchStart = isPFCampus(item.start);
    else matchStart = item.start === selectedStart.value;

    if (selectedEnd.value === "不限") matchEnd = true;
    else if (selectedEnd.value === "屏峰") matchEnd = isPFCampus(item.end);
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

const selectedStart = ref("不限");
const selectedEnd = ref("不限");

const allPoint = computed(() => {
  const fixedPoints = ["不限", "朝晖", "屏峰", "莫干山"];
  const dynamicPoints = new Set<string>();

  busTimeList.value.forEach((item) => {
    if (item.start && !fixedPoints.includes(item.start)) {
      dynamicPoints.add(item.start);
    }
    if (item.end && !fixedPoints.includes(item.end)) {
      dynamicPoints.add(item.end);
    }
  });

  return [...fixedPoints, ...Array.from(dynamicPoints).sort()];
});

const onChangeStart = (e) => {
  const index = e.detail.value;
  selectedStart.value = allPoint.value[index];
};
const onChangeEnd = (e) => {
  const index = e.detail.value;
  selectedEnd.value = allPoint.value[index];
};

const swapCampus = () => {
  const temp = selectedStart.value;
  selectedStart.value = selectedEnd.value;
  selectedEnd.value = temp;
};

const handleLineSelect = (line: string) => {
  let start = "";
  let end = "";
  const config = busConfig.value || [];

  config.forEach((item) => {
    if (item.name.startsWith(line)) {
      start = item.name.split("（")[1].split("-")[0];
      end = item.name.split("（")[1].split("-")[1].split("）")[0];
    }
  });

  if (start && end) {
    Taro.navigateTo({
      url: `/pages/school-bus/bus-detail/index?routeName=${line}&start=${start}&end=${end}`
    });
  }
};

const navigate2Announce = () => {
  Taro.navigateTo({
    url: "/pages/school-bus/announce/index"
  });
};
</script>

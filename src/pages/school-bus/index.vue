<template>
  <theme-config>
    <title-bar title="校车" :back-button="true" />
    <view :class="styles['filter-section']">
      <!-- 关键词筛选 -->
      <filter-keyword-field
        v-model="keywords"
        @click-line="showBusNameGroupModal = true"
        @click-announce="handleTapAnnounce"
        @click-tip="showTipModal = true"
      />
      <!-- 起点终点筛选 -->
      <filter-start-end-field
        v-model:start="selectedStart"
        v-model:end="selectedEnd"
        :options="allPoint"
      />
      <!-- 快捷筛选项 -->
      <filter-quick-field
        v-model="activeQuickFilter"
        :list="baseFilteredList"
        :class="styles['filter-quick-field']"
      />
    </view>
    <scroll-view v-if="!isEmpty(filteredScheduleList)" :scroll-y="true">
      <view :class="styles.list">
        <bus-schedule-card
          v-for="item in filteredScheduleList"
          :key="item.id"
          :schedule="item"
          :class="styles.item"
        />
      </view>
    </scroll-view>
    <view v-else :class="styles['empty-container']">
      <bus-time-empty />
    </view>
    <bus-name-group-modal v-model:show="showBusNameGroupModal" @select="handleSelectBusName" />
    <bus-tip-modal v-model:show="showTipModal" />
  </theme-config>
</template>

<script setup lang="ts">
import { ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { isEmpty } from "lodash-es";
import urlcat from "urlcat";
import { computed, ref } from "vue";

import { ThemeConfig, TitleBar } from "@/components";

import BusNameGroupModal from "./_components/bus-name-group-modal/index.vue";
import BusScheduleCard from "./_components/bus-schedule-card/index.vue";
import BusTimeEmpty from "./_components/bus-time-empty/index.vue";
import BusTipModal from "./_components/bus-tip-modal/index.vue";
import FilterKeywordField from "./_components/filter-keyword-field/index.vue";
import { QuickFilterItem } from "./_components/filter-quick-field/constants";
import FilterQuickField from "./_components/filter-quick-field/index.vue";
import FilterStartEndField from "./_components/filter-start-end-field/index.vue";
import { useBusScheduleList } from "./_hooks/use-bus-schedule-list";
import { useBusStaticConfig } from "./_hooks/use-bus-static-config";
import { parseRouteName } from "./_utils";
import styles from "./index.module.scss";

const showBusNameGroupModal = ref(false);
const showTipModal = ref(false);
/** 快捷筛选 */
const activeQuickFilter = ref<QuickFilterItem[]>([]);
const keywords = ref("");

const { parsedScheduleList } = useBusScheduleList({ search: keywords });

const { busConfig } = useBusStaticConfig();

const baseFilteredList = computed(() => {
  return parsedScheduleList.value.filter((item) => {
    // 1. 校区筛选
    let matchEnd: boolean;
    let matchStart: boolean;
    if (selectedStart.value === "不限") matchStart = true;
    else matchStart = item.start === selectedStart.value;

    if (selectedEnd.value === "不限") matchEnd = true;
    else matchEnd = item.end === selectedEnd.value;

    return matchStart && matchEnd;
  });
});

const filteredScheduleList = computed(() => {
  let list = baseFilteredList.value;

  if (activeQuickFilter.value.length > 0) {
    const intersectionFilters = activeQuickFilter.value.filter((f) => f.type === "intersection");
    const unionFilters = activeQuickFilter.value.filter((f) => f.type === "union");

    // "Intersection" filters: AND logic
    intersectionFilters.forEach((f) => {
      list = f.filter(list);
    });

    // "Union" filters: OR logic
    if (unionFilters.length > 0) {
      const unionFilteredResults = new Set<string>();
      unionFilters.forEach((f) => {
        const matches = f.filter(list);
        matches.forEach((m) => unionFilteredResults.add(m.id));
      });

      list = list.filter((item) => unionFilteredResults.has(item.id));
    }
  }

  return list;
});

const selectedStart = ref("不限");
const selectedEnd = ref("不限");

const allPoint = computed(() => {
  const fixedPoints = ["不限", "朝晖", "屏峰", "莫干山"];
  const dynamicPoints = new Set<string>();

  parsedScheduleList.value.forEach((item) => {
    if (item.start && !fixedPoints.includes(item.start)) {
      dynamicPoints.add(item.start);
    }
    if (item.end && !fixedPoints.includes(item.end)) {
      dynamicPoints.add(item.end);
    }
  });

  return [...fixedPoints, ...Array.from(dynamicPoints).sort()];
});

const handleSelectBusName = (busName: string) => {
  const config = busConfig.value || [];

  const targetRoute = config.find((item) => {
    const parsed = parseRouteName(item.name);
    return parsed.busName === busName;
  });

  if (!targetRoute) {
    return;
  }

  const { start, end } = parseRouteName(targetRoute.name);

  const url = urlcat(`/pages/school-bus/bus-detail/index`, {
    busName,
    start,
    end
  });

  Taro.navigateTo({ url });
};

const handleTapAnnounce = () => {
  Taro.navigateTo({
    url: "/pages/school-bus/announce/index"
  });
};
</script>

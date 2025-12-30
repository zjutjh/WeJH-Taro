<template>
  <theme-config>
    <title-bar title="校车信息" :back-button="true" />
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
        :options="directionOptionsList"
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
import { isEmpty, uniq } from "lodash-es";
import { storeToRefs } from "pinia";
import urlcat from "urlcat";
import { computed, ref, watchEffect } from "vue";

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
import { useSchoolBusFeatureFirstOpen } from "./_hooks/use-feature-initial";
import { parseRouteName } from "./_utils";
import styles from "./index.module.scss";

const showBusNameGroupModal = ref(false);
const showTipModal = ref(false);
import { Option } from "@/constants";

import { PINNED_DIRECTION_OPTION_LABELS, SCHEDULE_DIRECTION_UNLIMITED_OPTION } from "./_constants";

/** 快捷筛选 */
const activeQuickFilter = ref<QuickFilterItem[]>([]);
const keywords = ref("");
const selectedStart = ref<Option>(SCHEDULE_DIRECTION_UNLIMITED_OPTION);
const selectedEnd = ref<Option>(SCHEDULE_DIRECTION_UNLIMITED_OPTION);

const { parsedScheduleList } = useBusScheduleList({ search: keywords });
const { busConfig } = useBusStaticConfig();
const { isFirstOpen } = storeToRefs(useSchoolBusFeatureFirstOpen());

const baseFilteredList = computed(() => {
  return parsedScheduleList.value.filter((item) => {
    // 1. 校区筛选
    let matchEnd: boolean;
    let matchStart: boolean;
    if (selectedStart.value.value === SCHEDULE_DIRECTION_UNLIMITED_OPTION.value) matchStart = true;
    else matchStart = item.start === selectedStart.value.value;

    if (selectedEnd.value.value === SCHEDULE_DIRECTION_UNLIMITED_OPTION.value) matchEnd = true;
    else matchEnd = item.end === selectedEnd.value.value;

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

const directionOptionsList = computed<Option[]>(() => {
  // 取起始位置和终止位置集合，去重后作为筛选项取值来源
  const allDirectionName = uniq(
    parsedScheduleList.value.map((item) => [item.start, item.end]).flat()
  );

  const sortedDirection = allDirectionName.sort((a, b) => {
    const aIndex = PINNED_DIRECTION_OPTION_LABELS.findIndex((item) => item === a);
    const bIndex = PINNED_DIRECTION_OPTION_LABELS.findIndex((item) => item === b);

    if (aIndex >= 0 && bIndex >= 0) {
      // 如果两者都在特定顺序列表中，就按列表顺序排
      return aIndex - bIndex;
    } else if (aIndex >= 0 || bIndex >= 0) {
      // 如果只有一个在特定顺序列表中，倒着排（不在列表内的排在后面）
      return bIndex - aIndex;
    }

    // 两者都不在列表内，按照一定顺序排
    return a.localeCompare(b);
  });

  return [
    SCHEDULE_DIRECTION_UNLIMITED_OPTION,
    ...sortedDirection.map((p) => ({ label: p, value: p }))
  ];
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

watchEffect(() => {
  if (isFirstOpen.value) {
    isFirstOpen.value = false;
    setTimeout(() => {
      showTipModal.value = true;
    }, 1000);
  }
});
</script>

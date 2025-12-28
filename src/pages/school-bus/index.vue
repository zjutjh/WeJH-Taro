<template>
  <theme-config>
    <title-bar title="校车" :back-button="true" />
    <view :class="styles['school-bus-title-bar']">
      <filter-keyword-field
        v-model="keywords"
        @click-line="showLineModal = true"
        @click-announce="handleTapAnnounce"
        @click-tip="showTipModal = true"
      />

      <filter-start-end-field
        v-model:start="selectedStart"
        v-model:end="selectedEnd"
        :options="allPoint"
      />

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
    <bus-time-empty v-else />
    <bus-line-modal
      v-model:show="showLineModal"
      :line-list="busLineList"
      @select="handleSelectBusName"
    />
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
import { useBusConfig, useBusLineList } from "@/pages/school-bus/_hooks/use-bus-info";
import { isPFCampus } from "@/utils/school-bus";

import BusLineModal from "./_components/bus-line-modal/index.vue";
import BusScheduleCard from "./_components/bus-schedule-card/index.vue";
import BusTimeEmpty from "./_components/bus-time-empty/index.vue";
import BusTipModal from "./_components/bus-tip-modal/index.vue";
import FilterKeywordField from "./_components/filter-keyword-field/index.vue";
import FilterStartEndField from "./_components/filter-start-end-field/index.vue";
import { useBusScheduleList } from "./_hooks/use-bus-schedule-list";
import { parseRouteName } from "./_utils";
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

const keywords = ref("");

const { parsedScheduleList: busTimeList } = useBusScheduleList({ search: keywords });
const { busLineList } = useBusLineList();

const { busConfig } = useBusConfig();

// TODO: 动态筛选项
const filteredScheduleList = computed(() => {
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
      if (!item.busName.includes("直达")) return false;
    }

    // 3. 时间段筛选(早上 下午 晚上)
    if (timeFilter.value.length > 0) {
      const hour = item.departureTime.hour();
      const minute = item.departureTime.minute();
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

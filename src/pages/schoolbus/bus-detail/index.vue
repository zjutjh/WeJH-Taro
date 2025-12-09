<template>
  <theme-config>
    <title-bar title="班车详情" :back-button="true" />
    <scroll-view :scroll-y="true" :class="styles['scroll-view']">
      <view
        v-if="selectedFilter === BusDetailPickerEnum.BusDetail"
        :class="styles['bus-detail-content']"
      >
        <bus-detail-card :class="styles['bus-detail-card']" :list="mergedStart2EndDetail" />
        <bus-detail-card :class="styles['bus-detail-card']" :list="mergedEnd2StartDetail" />
      </view>
      <view v-else :class="styles['route-line-content']">
        <route-line-card :class="styles['route-line-card']" :route-line="start2EndRouteLine" />
        <route-line-card :class="styles['route-line-card']" :route-line="end2StartRouteLine" />
      </view>
    </scroll-view>

    <bus-detail-bottom-panel v-model:selected-filter="selectedFilter" v-model:is-today="isToday" />
  </theme-config>
</template>

<script setup lang="ts">
import { ScrollView } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import dayjs from "dayjs";
import { computed, ref } from "vue";

import {
  BusDetailBottomPanel,
  BusDetailCard,
  RouteLineCard,
  ThemeConfig,
  TitleBar
} from "@/components";
import diyData from "@/hooks/diy-data.json";
import { useBusDetail, useBusRoute } from "@/hooks/use-bus-info";
import { BusDetailPickerEnum, FEBusTime, OpenTypeEnum } from "@/types/schoolbus";

import styles from "./index.module.scss";

const router = useRouter();

const selectedFilter = ref<BusDetailPickerEnum>(BusDetailPickerEnum.BusDetail);

/** true是今天 false是明天 */
const isToday = ref(true);

const { busDetail: start2EndDetail } = useBusDetail({
  routeName: router.params.routeName as string,
  start: router.params.start as string,
  end: router.params.end as string
});

const { busDetail: end2StartDetail } = useBusDetail({
  routeName: router.params.routeName as string,
  start: router.params.end as string,
  end: router.params.start as string
});

const mergeBusData = (
  routeName: string,
  startCampus: string,
  endCampus: string,
  dynamicList: FEBusTime[],
  isTodayStatue: boolean
): FEBusTime[] => {
  const staticName = `${routeName}（${startCampus}-${endCampus}）`;
  const staticRoute = diyData.find((item) => item.name === staticName);

  if (!staticRoute) return [];

  const targetDate = isTodayStatue ? dayjs() : dayjs().add(1, "day");
  const dateStr = targetDate.format("MM.DD");

  return staticRoute.bus_time.map((staticTime) => {
    const fullDepartureTime = `${dateStr} ${staticTime.departure_time}`;

    const dynamicItem = dynamicList.find((item) => item.departureTime === fullDepartureTime);
    // 如果后端拉取到的表里有这个班次, 那么就是正常使用
    if (dynamicItem) {
      return ((dynamicItem.openType = staticTime.open_type as OpenTypeEnum), dynamicItem);
    }
    // 如果表里没有, 那么就仅做默认静态数据展示
    // (表里没有也得展示静态数据, 是为了让用户感受到'工作日''节假日'的区别)
    return {
      departureTime: fullDepartureTime,
      orderedSeats: 0,
      remainSeats: -1,
      openType: staticTime.open_type as OpenTypeEnum,
      routeName: routeName,
      start: startCampus,
      end: endCampus,
      price: staticRoute.price / 100
    };
  });
};

const mergedStart2EndDetail = computed(() =>
  mergeBusData(
    router.params.routeName as string,
    router.params.start as string,
    router.params.end as string,
    start2EndDetail.value,
    isToday.value
  )
);

const mergedEnd2StartDetail = computed(() =>
  mergeBusData(
    router.params.routeName as string,
    router.params.end as string,
    router.params.start as string,
    end2StartDetail.value,
    isToday.value
  )
);

const { route: start2EndRouteLine } = useBusRoute({
  routeName: router.params.routeName as string,
  start: router.params.start as string,
  end: router.params.end as string
});

const { route: end2StartRouteLine } = useBusRoute({
  routeName: router.params.routeName as string,
  start: router.params.end as string,
  end: router.params.start as string
});
</script>

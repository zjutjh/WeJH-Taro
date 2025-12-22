<template>
  <theme-config>
    <title-bar title="班车详情" :back-button="true" />
    <scroll-view :scroll-y="true" :class="styles['scroll-view']">
      <view :class="styles['content-container']">
        <bus-detail-card
          :class="styles['bus-detail-card']"
          :list="mergedStart2EndDetail"
          :route="start2EndRouteLine"
        />
        <bus-detail-card
          :class="styles['bus-detail-card']"
          :list="mergedEnd2StartDetail"
          :route="end2StartRouteLine"
        />
        <route-line-card :class="styles['route-line-card']" :route-line="start2EndRouteLine" />
        <route-line-card :class="styles['route-line-card']" :route-line="end2StartRouteLine" />
      </view>
    </scroll-view>
    <w-button
      shape="circle"
      size="large"
      :class="styles['today-tomorrow-switcher']"
      @tap="isToday = !isToday"
    >
      <image
        v-if="isToday"
        src="@/assets/icons/today-tomorrow-switcher/today.svg"
        :class="styles['bottom-icon']"
      />
      <image
        v-else
        src="@/assets/icons/today-tomorrow-switcher/tomorrow.svg"
        :class="styles['bottom-icon']"
      />
    </w-button>
  </theme-config>
</template>

<script setup lang="ts">
import { ScrollView } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import dayjs from "dayjs";
import { computed, ref } from "vue";

import { BusDetailCard, RouteLineCard, ThemeConfig, TitleBar, WButton } from "@/components";
import { useBusConfig, useBusDetail, useBusRoute } from "@/hooks/use-bus-info";
import { FEBusTime, OpenTypeEnum } from "@/types/school-bus";

import styles from "./index.module.scss";

const router = useRouter();

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

const { busConfig } = useBusConfig();

const mergeBusData = (
  routeName: string,
  startCampus: string,
  endCampus: string,
  dynamicList: FEBusTime[],
  isTodayStatue: boolean
): FEBusTime[] => {
  const staticName = `${routeName}（${startCampus}-${endCampus}）`;
  const config = busConfig.value || [];
  const staticRoute = config.find((item) => item.name === staticName);

  if (!staticRoute) return [];

  const targetDate = isTodayStatue ? dayjs() : dayjs().add(1, "day");
  const dateStr = targetDate.format("MM.DD");

  // 判断目标日期是工作日还是周末 (0是周日, 6是周六)
  const isWeekend = [0, 6].includes(targetDate.day());
  const validOpenTypes = ["all", isWeekend ? "weekend" : "weekday"];

  return staticRoute.bus_time
    .filter((staticTime) => validOpenTypes.includes(staticTime.open_type))
    .map((staticTime) => {
      const fullDepartureTime = `${dateStr} ${staticTime.departure_time}`;

      const dynamicItem = dynamicList.find((item) => item.departureTime === fullDepartureTime);

      const openType =
        staticTime.open_type === "weekend" ? OpenTypeEnum.Weekend : OpenTypeEnum.Weekday;

      // 如果后端拉取到的表里有这个班次, 那么就是正常使用
      if (dynamicItem) {
        return {
          ...dynamicItem,
          openType
        };
      }
      // 如果表里没有, 那么就仅做默认静态数据展示
      // (表里没有也得展示静态数据, 是为了让用户感受到'工作日''节假日'的区别)
      return {
        departureTime: fullDepartureTime,
        orderedSeats: 0,
        remainSeats: -1,
        openType,
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

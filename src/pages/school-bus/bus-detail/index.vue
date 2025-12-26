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
  </theme-config>
</template>

<script setup lang="ts">
import { ScrollView } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import dayjs from "dayjs";
import { computed, ref } from "vue";

import { ThemeConfig, TitleBar } from "@/components";
import { useBusConfig, useBusDetail, useBusRoute } from "@/pages/school-bus/_hooks/use-bus-info";

import { OpenTypeEnum, ParsedBusSchedule } from "../_types";
import BusDetailCard from "./_components/bus-detail-card/index.vue";
import RouteLineCard from "./_components/route-line-card/index.vue";
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

/**
 * 合并后端数据和配置维护的班车详情数据
 */
const mergeBusData = (
  routeName: string,
  startCampus: string,
  endCampus: string,
  dynamicList: ParsedBusSchedule[],
  isTodayStatue: boolean
): ParsedBusSchedule[] => {
  const staticName = `${routeName}（${startCampus}-${endCampus}）`;
  const routeConfig = busConfig.value?.find((item) => item.name === staticName);

  if (!routeConfig) return [];

  const targetDate = isTodayStatue ? dayjs() : dayjs().add(1, "day");

  // 判断目标日期是工作日还是周末 (0是周日, 6是周六)
  const isWeekend = [0, 6].includes(targetDate.day());
  const validOpenTypes = ["all", isWeekend ? "weekend" : "weekday"];

  return routeConfig.bus_time
    .filter((config) => validOpenTypes.includes(config.open_type))
    .map((config) => {
      // TODO: 这里可能有问题
      const [configHour, configMinute] = config.departure_time.split(":").map(Number);

      const dynamicItem = dynamicList.find(
        (item) =>
          item.departureTime.hour() === configHour && item.departureTime.minute() === configMinute
      );

      const openType = config.open_type === "weekend" ? OpenTypeEnum.Weekend : OpenTypeEnum.Weekday;

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
        // TODO: 这里有问题，不需要消费日期，消费时间就行了
        departureTime: dayjs().hour(configHour).minute(configMinute),
        orderedSeats: 0,
        remainSeats: -1,
        openType,
        routeName: routeName,
        start: startCampus,
        end: endCampus,
        // TODO: 单位转化可能有问题
        price: routeConfig.price / 100
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

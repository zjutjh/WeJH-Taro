<template>
  <theme-config>
    <title-bar title="班车详情" :back-button="true" />
    <scroll-view :scroll-y="true" :class="styles['scroll-view']">
      <view
        v-if="selectedFilter === BusDetailPickerEnum.BusDetail"
        :class="styles['bus-detail-content']"
      >
        <bus-detail-card :class="styles['bus-detail-card']" :list="start2EndDetail" />
        <bus-detail-card :class="styles['bus-detail-card']" :list="end2StartDetail" />
      </view>
      <view v-else :class="styles['route-line-content']">
        <route-line-card :class="styles['route-line-card']" :route-line="start2EndRouteLine" />
        <route-line-card :class="styles['route-line-card']" :route-line="end2StartRouteLine" />
      </view>
    </scroll-view>

    <bus-detail-bottom-panel v-model="selectedFilter" />
  </theme-config>
</template>

<script setup lang="ts">
import { ScrollView } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import { ref } from "vue";

import {
  BusDetailBottomPanel,
  BusDetailCard,
  RouteLineCard,
  ThemeConfig,
  TitleBar
} from "@/components";
import { useBusDetail, useBusRoute } from "@/hooks/use-bus-info";
import { BusDetailPickerEnum } from "@/types/schoolbus";

import styles from "./index.module.scss";

const router = useRouter();

const selectedFilter = ref<BusDetailPickerEnum>(BusDetailPickerEnum.BusDetail);

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

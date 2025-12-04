<template>
  <theme-config>
    <title-bar title="班车详情" :back-button="true" />
    <scroll-view :scroll-y="true" :class="styles['bus-detail-container']">
      <bus-detail-card :class="styles['bus-detail-card']" :list="start2EndDetail" />
      <bus-detail-card :class="styles['bus-detail-card']" :list="end2StartDetail" />
    </scroll-view>

    <bus-detail-bottom-panel />
  </theme-config>
</template>

<script setup lang="ts">
import { ScrollView } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";

import { BusDetailCard, ThemeConfig, TitleBar } from "@/components";
import BusDetailBottomPanel from "@/components/schoolbus/bus-detail-card/bus-detail-bottom-panel/index.vue";
import { useBusDetail } from "@/hooks/use-bus-info";

import styles from "./index.module.scss";

const router = useRouter();

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
</script>

<template>
  <theme-config>
    <title-bar :title="`${busRouteParams.busName}详情`" :back-button="true" />
    <scroll-view :scroll-y="true">
      <view :class="styles.container">
        <!-- 同时展示正反方向的线路 -->
        <route-detail-card v-if="start2EndRouteConfig" :route-in-config="start2EndRouteConfig" />
        <route-detail-card v-if="end2StartRouteConfig" :route-in-config="end2StartRouteConfig" />
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import { ScrollView } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import { computed } from "vue";

import { ThemeConfig, TitleBar } from "@/components";
import { useBusStaticConfig } from "@/pages/school-bus/_hooks/use-bus-static-config";

import { parseRouteName } from "../_utils";
import RouteDetailCard from "./_components/route-detail-card/index.vue";
import styles from "./index.module.scss";

const pageRouter = useRouter();

const busRouteParams = computed(() => {
  /** 这几个参数就能定位一条线路 */
  return {
    busName: decodeURIComponent(pageRouter.params.busName || ""),
    startDirection: decodeURIComponent(pageRouter.params.startDirection || ""),
    endDirection: decodeURIComponent(pageRouter.params.endDirection || "")
  };
});

const { busConfig } = useBusStaticConfig();

const start2EndRouteConfig = computed(() => {
  const config = busConfig.value || [];
  return config.find((item) => {
    const { busName, startDirection, endDirection } = parseRouteName(item.name);
    return (
      busName === busRouteParams.value.busName &&
      startDirection === busRouteParams.value.startDirection &&
      endDirection === busRouteParams.value.endDirection
    );
  });
});

const end2StartRouteConfig = computed(() => {
  const config = busConfig.value || [];
  return config.find((item) => {
    const { busName, startDirection, endDirection } = parseRouteName(item.name);
    return (
      busName === busRouteParams.value.busName &&
      startDirection === busRouteParams.value.endDirection &&
      endDirection === busRouteParams.value.startDirection
    );
  });
});
</script>

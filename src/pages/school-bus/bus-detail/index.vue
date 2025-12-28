<template>
  <theme-config>
    <title-bar :title="`${busRouteParams.busName}详情`" :back-button="true" />
    <scroll-view :scroll-y="true">
      <view :class="styles.list">
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
    start: decodeURIComponent(pageRouter.params.start || ""),
    end: decodeURIComponent(pageRouter.params.end || "")
  };
});

const { busConfig } = useBusStaticConfig();

const start2EndRouteConfig = computed(() => {
  const config = busConfig.value || [];
  return config.find((item) => {
    const { busName, start, end } = parseRouteName(item.name);
    return (
      busName === busRouteParams.value.busName &&
      start === busRouteParams.value.start &&
      end === busRouteParams.value.end
    );
  });
});

const end2StartRouteConfig = computed(() => {
  const config = busConfig.value || [];
  return config.find((item) => {
    const { busName, start, end } = parseRouteName(item.name);
    return (
      busName === busRouteParams.value.busName &&
      start === busRouteParams.value.end &&
      end === busRouteParams.value.start
    );
  });
});
</script>

<template>
  <card v-if="props.routeLine" :class="styles['route-line-container']">
    <view :class="styles['route-title']">
      {{ props.routeLine.routeName }}
    </view>
    <view :class="styles['route-direction']">
      <span :class="styles['text']">{{ props.routeLine.start }}</span>
      <span :class="styles['triple-arrow']" class="iconfont icon-triple-arrow" />
      <span :class="styles['text']">{{ props.routeLine.end }}</span>
    </view>
    <view :class="styles['station-list']">
      <view
        v-for="(station, index) in props.routeLine.stations"
        :key="station.stationName"
        :class="styles['station-item']"
        :style="
          index % 2 === 0 && index !== 0
            ? { backgroundColor: 'var(--wjh-color-primary-light)' }
            : {}
        "
      >
        {{ station.stationName }}
      </view>
    </view>
  </card>
</template>

<script setup lang="ts">
import { Card } from "@/components";
import { BusRouteDetail } from "@/types/school-bus";

import styles from "./index.module.scss";

const props = defineProps<{ routeLine: BusRouteDetail | undefined }>();
</script>

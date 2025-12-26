<template>
  <card v-if="props.routeLine" :class="styles['route-line-container']">
    <w-collapse :class="styles['route-line-collapse']">
      <w-collapse-panel :arrow="true">
        <template #header>
          <view :class="styles['route-title']">
            {{ props.routeLine.routeName + "路线" }}
          </view>
          <view :class="styles['route-direction']">
            <span :class="styles['text']">{{ props.routeLine.start }}</span>
            <span :class="styles['triple-arrow']" class="iconfont icon-triple-arrow" />
            <span :class="styles['text']">{{ props.routeLine.end }}</span>
          </view>
        </template>

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
      </w-collapse-panel>
    </w-collapse>
  </card>
</template>

<script setup lang="ts">
import { Card, WCollapse, WCollapsePanel } from "@/components";
import { BusRouteDetail } from "@/pages/school-bus/_types";

import styles from "./index.module.scss";

const props = defineProps<{ routeLine: BusRouteDetail | undefined }>();
</script>

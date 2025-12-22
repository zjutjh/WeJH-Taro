<template>
  <!-- 班车详情卡片 -->
  <card v-if="props.list && props.list.length > 0" :class="styles['bus-detail-container']">
    <w-collapse :class="styles['bus-detail-collapse']">
      <w-collapse-panel :arrow="true">
        <template #header>
          <view :class="styles['bus-detail-title']">
            {{ props.list[0]?.routeName + "详情" }}
          </view>
          <view :class="styles['bus-detail-route']">
            <view :class="styles['dot']" />
            <view :class="styles['route-point']">
              <view :class="styles['campus-row']">
                <span>{{ props.list[0]?.start }}</span>
              </view>
            </view>
            <view :class="styles['triple-arrow-container']">
              <span :class="styles['triple-arrow']" class="iconfont icon-triple-arrow" />
            </view>

            <view :class="styles['route-point']">
              <view :class="styles['campus-row']">
                <span>{{ props.list[0]?.end }}</span>
              </view>
            </view>
          </view>
        </template>

        <view :class="styles['schedule-table']">
          <view :class="[styles['table-row'], styles['table-header'], styles['has-divider']]">
            <span :class="[styles['col']]">发车时间</span>
            <span :class="styles['divider']">|</span>
            <span :class="[styles['col']]" style="flex-grow: 1.3">发车情况</span>
          </view>

          <view
            v-for="(item, index) in props.list"
            :key="`${item.start}-${item.end}-${item.departureTime}`"
            :class="[styles['table-row'], index % 2 === 1 ? styles['has-divider'] : '']"
            :style="index % 2 === 1 ? { backgroundColor: 'var(--wjh-color-primary-light)' } : {}"
          >
            <span :class="[styles['col']]">{{ item.departureTime.split(" ")[1] }}</span>
            <span :class="styles['divider']">|</span>
            <span :class="[styles['col']]" style="flex-grow: 1.3">{{
              openTypeMap[item.openType || ""]
            }}</span>
          </view>
        </view>
      </w-collapse-panel>
    </w-collapse>
  </card>
</template>
<script setup lang="ts">
import { Card, WCollapse, WCollapsePanel } from "@/components";
import { BusRouteDetail, FEBusTime, OpenTypeEnum } from "@/types/school-bus";

import styles from "./index.module.scss";

const props = defineProps<{
  list: FEBusTime[];
  route?: BusRouteDetail;
}>();

const openTypeMap = {
  [OpenTypeEnum.All]: "正常发车",
  [OpenTypeEnum.Weekday]: "仅工作日",
  [OpenTypeEnum.Weekend]: "仅节假日"
};
</script>

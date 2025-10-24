<template>
  <theme-config>
    <title-bar title="空教室" back-button />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card v-if="!buildingList" title="无记录" style="text-align: center" />
        <card
          v-for="(item, index) in buildingList"
          :key="index"
          class="building-card"
          :title="item.buildName"
        >
          <view class="building-card-body">
            <view v-for="room in item.roomList" :key="room.roomName" class="room-card">
              <view class="room-name">
                {{ room.roomName }}
              </view>
              <view class="room-seats">
                {{ room.roomSeats }}
              </view>
            </view>
          </view>
        </card>
      </view>
    </scroll-view>
    <bottom-panel>
      <room-picker class="picker" :week="selectWeek" @changed="handleRoomChange" />
    </bottom-panel>
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";

import { first, groupBy } from "lodash-es";
import { computed, ref } from "vue";

import { BottomPanel, Card, RoomPicker, ThemeConfig, TitleBar } from "@/components";
import { FREE_ROOM_RECORD } from "@/constants/freeroomMap";
import { ZFService } from "@/services";
import { serviceStore, systemStore } from "@/store";

interface FreeRoomQueryType {
  campus: string;
  /** 可扩展区间选择 */
  sections: string;
  term: string;
  week: string;
  weekday: string;
  year: string;
}

function handleRoomChange(e: FreeRoomQueryType) {
  ZFService.getFreeRoomInfo(e);
}

const buildingList = computed(() => {
  /** 教学楼名称 -> 空教室列表的映射 */
  const buildNameRoomListRecord = groupBy(serviceStore.zf.roomInfo?.data, (item) => {
    const buildNameFirstLetter = first(item.buildName);
    // TODO: 上报教学楼第一个字符和字典无法匹配
    return FREE_ROOM_RECORD[buildNameFirstLetter ?? ""] ?? "未知教学楼";
  });

  // 转数组，并对教室列表排序
  return Object.keys(buildNameRoomListRecord).map((buildName) => ({
    buildName,
    roomList: buildNameRoomListRecord[buildName].sort((a, b) => {
      return a.roomName > b.roomName ? 1 : -1;
    })
  }));
});

const selectWeek = ref(systemStore.generalInfo.week);
</script>

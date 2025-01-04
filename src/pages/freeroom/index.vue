<template>
  <theme-config>
    <title-bar title="空教室" back-button />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card v-if="!building" title="无记录" style="text-align: center" />
        <card
          v-for="(item, index) in building"
          :key="index"
          class="building-card"
          :title="item.buildName"
        >
          <view class="building-card-body">
            <view
              v-for="room in item.roomList"
              :key="room.roomName"
              class="room-card"
            >
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
      <room-picker class="picker" :week="selectWeek" @changed="roomChanged" />
    </bottom-panel>
  </theme-config>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { serviceStore, systemStore } from "@/store";
import { BottomPanel, Card, RoomPicker, ThemeConfig, TitleBar } from "@/components";
import { ZFService } from "@/services";
import { freeroomMap } from "@/constants/freeroomMap";
import { Room } from "@/types/Room";
import "./index.scss";

type freeRoomQueryType = {
  campus: string;
  sections: string; // 可扩展区间选择
  term: string;
  week: string;
  weekday: string;
  year: string;
};

function roomChanged(e: freeRoomQueryType) {
  ZFService.getFreeRoomInfo(e);
}

const building = computed(() => {
  // comment: 数组，每个元素存放一幢教学楼的空教室
  const buildingList: Array<{ buildName: string; roomList: Room[]; }> = [];
  const tmp: Record<string, Room[]> = {};

  serviceStore.zf.roomInfo.data?.forEach((item: Room) => {
    // TODO:  上报无教学楼匹配
    const fullBuildName = freeroomMap[item.buildName[0]] || "未知教室";
    if (!tmp[fullBuildName]) tmp[fullBuildName] = [];
    tmp[fullBuildName].push(item);
  });
  Object.keys(tmp).forEach((key) => {
    buildingList.push({
      buildName: key,
      roomList: tmp[key].sort((a, b) => {
        return a.roomName > b.roomName ? 1 : -1;
      })
    });
  });
  return buildingList;
});

const selectWeek = ref(systemStore.generalInfo.week);

</script>

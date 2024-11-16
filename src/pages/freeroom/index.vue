<template>
  <theme-config>
    <title-bar title="空教室" back-button />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card v-if="!building || freeRoomStore.error" title="无记录" style="text-align: center" />
        <card
          v-for="(item, index) in building"
          v-else
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
      <room-picker class="picker" :week="generalInfo.week" @changed="handleSelectRoom" />
    </bottom-panel>
  </theme-config>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { BottomPanel, Card, RoomPicker, ThemeConfig, TitleBar } from "@/components";
import { freeroomMap } from "@/constants/freeroomMap";
import useGeneralInfo from "@/store/system/generalInfo";
import { Room } from "@/types/Room";
import "./index.scss";
import useFreeRoomStore from "@/store/service/freeRoom";

const generalInfo = useGeneralInfo();
const freeRoomStore = useFreeRoomStore();

function handleSelectRoom(params: {
  campus: string, week: number, weekday: number, sections: number
}) {
  freeRoomStore.fetchFreeRoom({
    year: generalInfo.value.termYear,
    term: generalInfo.value.term,
    ...params
  });
}

const building = computed(() => {
  const buildingList: Array<{ buildName: string; roomList: Room[]; }> = [];
  const tmp: Record<string, Room[]> = {};

  freeRoomStore.list.forEach(item => {
    if (!tmp[freeroomMap[item.buildName[0]]])
      tmp[freeroomMap[item.buildName[0]]] = [];
    tmp[freeroomMap[item.buildName[0]]].push(item);
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

</script>

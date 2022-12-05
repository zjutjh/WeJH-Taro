<template>
  <view class="background">
    <title-bar title="空教室"></title-bar>
    <scroll-view :scrollY="true">
      <view class="flex-column">
        <card v-if="!room" title="无记录" style="text-align: center"></card>
        <card
          v-for="(item, index) in room"
          class="building-card"
          :key="index"
          :title="item.buildName"
        >
          <view class="building-card-body">
            <view
              class="room-card"
              v-for="(i, index) in item.roomList"
              :key="index"
            >
              <view class="room-name">{{ i.roomName }}</view>
              <view class="room-seats">{{ i.roomSeats }}</view>
            </view>
          </view>
        </card>
      </view>
    </scroll-view>
    <bottom-panel>
      <room-picker
        class="picker"
        @changed="roomChanged"
        :week="selectWeek"
      ></room-picker>
    </bottom-panel>
  </view>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { serviceStore, systemStore } from '@/store';
  import BottomPanel from '@/components/BottomPanel/index.vue';
  import Card from '@/components/Card/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import RoomPicker from '@/components/RoomPicker/index.vue';
  import { ZFService } from '@/services';
  import { freeroomMap } from '@/constants/freeroomMap';
  import { Room } from '@/types/Room';
  import './index.scss';

  type freeRoomQueryType = {
    campus: string;
    sections: string; // 可扩展区间选择
    term: string;
    week: string;
    weekday: string;
    year: string;
  }

  function roomChanged(e: freeRoomQueryType) {
    console.log(e);
    ZFService.getFreeRoomInfo(e);
  }

  const room = computed(() => {
    // comment: 数组，每个元素存放一幢教学楼的空教室
    const buildingList: {
      buildName: string;
      roomList: Room[];
    }[] = [];
    const tmp: {
      [key: string]: Room[];
    } = {};

    serviceStore.zf.roomInfo.data?.forEach((item: Room) => {
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
  const selectWeek = ref(systemStore.generalInfo.week);
</script>

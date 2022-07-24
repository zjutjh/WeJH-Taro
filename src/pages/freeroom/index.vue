<template>
  <title-bar title="空教室"></title-bar>
  <view class="background"></view>
  <scroll-view :scrollY="true" style="height: calc(100vh - 56px - 64px)">
    <card v-if="!room" title="无记录" style="text-align: center"></card>
    <card
      v-for="item in room"
      class="building-card"
      :key="item.id"
      :title="item[0].buildName"
    >
      <view class="building-card-body">
        <view class="room-card" v-for="i in item" :key="i.roomName">
          <view class="room-name">{{ i.roomName }}</view>
          <view class="room-seats">{{ i.roomSeats }}</view>
        </view>
      </view>
    </card>
  </scroll-view>
  <bottom-panel>
    <room-picker
      class="picker"
      @changed="roomChanged"
      :week="selectWeek"
    ></room-picker>
  </bottom-panel>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { serviceStore, systemStore } from '@/store';
  import BottomPanel from '@/components/BottomPanel/index.vue';
  import Card from '@/components/Card/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import RoomPicker from '@/components/RoomPicker/index.vue';
  import { ZFService } from '@/services';
  import { groupBy } from '@/utils/tools';

  import './index.scss';
  export default defineComponent({
    components: { TitleBar, Card, RoomPicker, BottomPanel },
    setup() {
      function roomChanged(e) {
        ZFService.getFreeRoomInfo(e);
      }
      const room = computed(() => {
        // comment: 数组，每个元素存放一幢教学楼的空教室
        let res = groupBy(serviceStore.zf.room, (item) => [item.buildName]);
        return res;
      });
      const selectWeek = ref(systemStore.generalInfo.week);
      return {
        room,
        roomChanged,
        selectWeek
      };
    },
    data() {
      return {
        selectedItem: null
      };
    }
  });
</script>

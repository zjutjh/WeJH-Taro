<template>
  <theme-config>
    <title-bar title="空教室" back-button />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card v-if="!building" title="无记录" style="text-align: center" />
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
      <room-picker v-model="selectValue" class="picker" />
    </bottom-panel>
  </theme-config>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { BottomPanel, Card, RoomPicker, ThemeConfig, TitleBar } from "@/components";
import { freeRoomMap } from "@/constants/freeRoomMap";
import useGeneralInfo from "@/store/system/generalInfo";
import { Room } from "@/types/Room";
import { dayScheduleStartTime } from "@/constants/dayScheduleStartTime";
import { useQuery } from "@tanstack/vue-query";
import { ZFService } from "@/services";
import Taro from "@tarojs/taro";
import { RequestError } from "@/utils";
import "./index.scss";

const generalInfo = useGeneralInfo();

const getCurrentSection = () => {
  const date = new Date();
  const tmp = date.getHours() * 60 + date.getMinutes();
  let currentSection = 12;
  dayScheduleStartTime.find((item, index) => {
    if (tmp < item.hour * 60 + item.min) {
      currentSection = index + 1;
      return true;
    }
  });
  return currentSection;
};

const selectValue = ref<[
  campus: number,
  week: number,
  weekday: number,
  sections: number
]>([
  0,
  generalInfo.value.week <= 20 && generalInfo.value.week > 0 ? generalInfo.value.week - 1 : 0,
  (new Date().getDay() + 6) % 7, // 周一 ~ 周日，对应的值为 1 ~ 7
  getCurrentSection() - 1
]);

const CAMPUS = ["朝晖", "屏峰", "莫干山"];
const queryParams = computed(() => {
  return {
    year: generalInfo.value.termYear,
    term: generalInfo.value.term,
    campus: CAMPUS[selectValue.value[0]],
    week: Math.pow(2, selectValue.value[1]).toString(),
    weekday: String(selectValue.value[2] + 1),
    sections: Math.pow(2, selectValue.value[3]).toString()
  };
});

const { data: list, error, isFetching } = useQuery({
  queryKey: ["freeRoom", queryParams] as const,
  queryFn: ({ queryKey }) => ZFService.getFreeRoomInfo({ ...queryKey[1] })
});

watchEffect(() => {
  if (isFetching.value) {
    Taro.showLoading({ title: "加载中" });
  } else {
    Taro.hideLoading();
  }
});

watchEffect(() => {
  if (error.value instanceof RequestError)
    Taro.showToast({ title: `查询空教室失败: ${error.value.message}`, icon: "none" });
});

const building = computed(() => {
  if (!list.value) return;

  const buildingList: Array<{ buildName: string; roomList: Room[]; }> = [];
  const tmp: Record<string, Room[]> = {};

  list.value.forEach(item => {
    if (!tmp[freeRoomMap[item.buildName[0]]])
      tmp[freeRoomMap[item.buildName[0]]] = [];
    tmp[freeRoomMap[item.buildName[0]]].push(item);
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

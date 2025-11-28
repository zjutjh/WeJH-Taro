<template>
  <bottom-panel :class="styles['bus-detail-bottom-panel']">
    <view :class="styles['col']">
      <w-button shape="circle" size="large" :class="styles['button']">
        <Image
          v-if="1"
          :class="styles['bottom-icon']"
          src="https://cube.phlin.cn/api/file?bucket=wjh&object_key=schoolbus%2Fswitch-time-today.webp"
        />
        <Image
          v-else
          :class="styles['bottom-icon']"
          src="https://cube.phlin.cn/api/file?bucket=wjh&object_key=schoolbus%2Fswitch-time-tomorrow.webp"
        />
      </w-button>
    </view>
    <view :class="styles['col']">
      <picker
        mode="selector"
        :range="[PickerSelectionEnum.BusDetail, PickerSelectionEnum.RouteTable]"
        @change="onChange"
      >
        <w-button :class="styles['picker']">
          {{ selectedFilter }}
        </w-button>
      </picker>
    </view>
    <view :class="styles['col']">
      <w-button shape="circle" size="large" :class="styles['button']">
        <Image v-if="1" :class="styles['bottom-icon']" />
        <Image v-else :class="styles['bottom-icon']" />
      </w-button>
    </view>
    <view />
  </bottom-panel>
</template>

<script setup lang="ts">
import { Picker } from "@tarojs/components";
import { ref } from "vue";

import { BottomPanel, WButton } from "@/components";

import styles from "./index.module.scss";

enum PickerSelectionEnum {
  BusDetail = "班车详情",
  RouteTable = "线路详情"
}

const selectedFilter = ref(PickerSelectionEnum.BusDetail);

const onChange = (e) => {
  const index = e.detail.value;
  selectedFilter.value = Object.values(PickerSelectionEnum)[index];
};
</script>

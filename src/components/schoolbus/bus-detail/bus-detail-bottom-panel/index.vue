<template>
  <bottom-panel :class="styles['bus-detail-bottom-panel']">
    <view :class="styles['col']">
      <!-- <refresh-button /> -->
    </view>
    <view :class="styles['col']">
      <picker
        mode="selector"
        :range="[BusDetailPickerEnum.BusDetail, BusDetailPickerEnum.RouteTable]"
        @change="onChange"
      >
        <w-button :class="styles['picker']">
          {{ selectedFilter }}
        </w-button>
      </picker>
    </view>
    <view :class="styles['col']">
      <w-button shape="circle" size="large" :class="styles['button']" @tab="isToday = !isToday">
        <image
          v-if="isToday"
          src="@/assets/icons/today-tomorrow-switcher/today.svg"
          :class="styles['bottom-icon']"
        />
        <image
          v-else
          src="@/assets/icons/today-tomorrow-switcher/tomorrow.svg"
          :class="styles['bottom-icon']"
        />
      </w-button>
    </view>
    <view />
  </bottom-panel>
</template>

<script setup lang="ts">
import { Picker } from "@tarojs/components";
import { ref } from "vue";

import { BottomPanel, WButton } from "@/components";
import { BusDetailPickerEnum } from "@/types/schoolbus";

import styles from "./index.module.scss";

const selectedFilter = defineModel<BusDetailPickerEnum>();

const onChange = (e) => {
  const index = e.detail.value;
  selectedFilter.value = Object.values(BusDetailPickerEnum)[index];
};

const isToday = ref(true);
</script>

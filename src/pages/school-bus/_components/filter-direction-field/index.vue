<template>
  <view :class="styles.container">
    <picker
      :class="styles.picker"
      mode="selector"
      :range="options"
      range-key="label"
      :value="startIndex"
      @change="handleChangeStart"
    >
      <button
        :class="{
          [styles['picker-button']]: true,
          [styles.unlimited]: startDirection?.value === SCHEDULE_DIRECTION_UNLIMITED_OPTION.value
        }"
      >
        {{ startDirection?.label }}
      </button>
    </picker>

    <view
      :class="[styles['direction-swapper'], 'iconfont', 'icon-switch-route']"
      @tap="handleSwap"
    />

    <picker
      :class="styles.picker"
      mode="selector"
      :range="options"
      range-key="label"
      :value="endIndex"
      @change="handleChangeEnd"
    >
      <button
        :class="{
          [styles['picker-button']]: true,
          [styles.unlimited]: endDirection?.value === SCHEDULE_DIRECTION_UNLIMITED_OPTION.value
        }"
      >
        {{ endDirection?.label }}
      </button>
    </picker>
  </view>
</template>

<script setup lang="ts">
import { Picker, PickerSelectorProps } from "@tarojs/components";
import { computed } from "vue";

import { Option } from "@/constants";

import { SCHEDULE_DIRECTION_UNLIMITED_OPTION } from "../../_constants";
import styles from "./index.module.scss";

interface RouteSelectorProps {
  options: Option[];
}

const props = defineProps<RouteSelectorProps>();

const startDirection = defineModel<Option>("startDirection", {
  default: SCHEDULE_DIRECTION_UNLIMITED_OPTION
});
const endDirection = defineModel<Option>("endDirection", {
  default: SCHEDULE_DIRECTION_UNLIMITED_OPTION
});

const startIndex = computed(() => {
  const idx = props.options.findIndex((o) => o.value === startDirection.value.value);
  return idx >= 0 ? idx : 0;
});

const endIndex = computed(() => {
  const idx = props.options.findIndex((o) => o.value === endDirection.value.value);
  return idx >= 0 ? idx : 0;
});

const handleChangeStart: PickerSelectorProps["onChange"] = (e) => {
  const index = Number(e.detail.value);
  startDirection.value = props.options.at(index) || SCHEDULE_DIRECTION_UNLIMITED_OPTION;
};

const handleChangeEnd: PickerSelectorProps["onChange"] = (e) => {
  const index = Number(e.detail.value);
  endDirection.value = props.options.at(index) || SCHEDULE_DIRECTION_UNLIMITED_OPTION;
};

const handleSwap = () => {
  const temp = startDirection.value;
  startDirection.value = endDirection.value;
  endDirection.value = temp;
};
</script>

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
          [styles.unlimited]: start?.value === SCHEDULE_DIRECTION_UNLIMITED_OPTION.value
        }"
      >
        {{
          start?.value === SCHEDULE_DIRECTION_UNLIMITED_OPTION.value ? "请选择起点" : start?.label
        }}
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
          [styles.unlimited]: end?.value === SCHEDULE_DIRECTION_UNLIMITED_OPTION.value
        }"
      >
        {{ end?.value === SCHEDULE_DIRECTION_UNLIMITED_OPTION.value ? "请选择终点" : end?.label }}
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

const start = defineModel<Option>("start", {
  default: SCHEDULE_DIRECTION_UNLIMITED_OPTION
});
const end = defineModel<Option>("end", {
  default: SCHEDULE_DIRECTION_UNLIMITED_OPTION
});

const startIndex = computed(() => {
  const idx = props.options.findIndex((o) => o.value === start.value.value);
  return idx >= 0 ? idx : 0;
});

const endIndex = computed(() => {
  const idx = props.options.findIndex((o) => o.value === end.value.value);
  return idx >= 0 ? idx : 0;
});

const handleChangeStart: PickerSelectorProps["onChange"] = (e) => {
  const index = Number(e.detail.value);
  console.log("index", props.options);

  start.value = props.options.at(index) || SCHEDULE_DIRECTION_UNLIMITED_OPTION;
};

const handleChangeEnd: PickerSelectorProps["onChange"] = (e) => {
  const index = Number(e.detail.value);
  end.value = props.options.at(index) || SCHEDULE_DIRECTION_UNLIMITED_OPTION;
};

const handleSwap = () => {
  const temp = start.value;
  start.value = end.value;
  end.value = temp;
};
</script>

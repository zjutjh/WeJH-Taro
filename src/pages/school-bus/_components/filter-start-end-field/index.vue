<template>
  <view :class="styles.container">
    <picker
      :class="styles['filter-start-end-field']"
      mode="selector"
      :range="options"
      :value="startIndex"
      @change="handleChangeStart"
    >
      <button
        :class="styles['picker-button']"
        :style="start === '不限' ? { color: 'var(--wjh-color-text-secondary)', opacity: 0.6 } : ''"
      >
        {{ start === "不限" ? "请选择起点" : start }}
      </button>
    </picker>

    <view class="iconfont icon-switch-route" :class="styles['route-swapper']" @tap="handleSwap" />

    <picker
      :class="styles['filter-start-end-field']"
      mode="selector"
      :range="options"
      :value="endIndex"
      @change="handleChangeEnd"
    >
      <button
        :class="styles['picker-button']"
        :style="end === '不限' ? { color: 'var(--wjh-color-text-secondary)', opacity: 0.6 } : ''"
      >
        {{ end === "不限" ? "请选择终点" : end }}
      </button>
    </picker>
  </view>
</template>

<script setup lang="ts">
import { Picker } from "@tarojs/components";
import { computed } from "vue";

import styles from "./index.module.scss";

interface RouteSelectorProps {
  options: string[];
}

const props = defineProps<RouteSelectorProps>();

const start = defineModel<string>("start", { default: "不限" });
const end = defineModel<string>("end", { default: "不限" });

// Compute index for picker to show correct initial selection
const startIndex = computed(() => {
  const idx = props.options.indexOf(start.value);
  return idx >= 0 ? idx : 0;
});

const endIndex = computed(() => {
  const idx = props.options.indexOf(end.value);
  return idx >= 0 ? idx : 0;
});

const handleChangeStart = (e: { detail: { value: number } }) => {
  const index = e.detail.value;
  if (props.options[index]) {
    start.value = props.options[index];
  }
};

const handleChangeEnd = (e: { detail: { value: number } }) => {
  const index = e.detail.value;
  if (props.options[index]) {
    end.value = props.options[index];
  }
};

const handleSwap = () => {
  const temp = start.value;
  start.value = end.value;
  end.value = temp;
};
</script>

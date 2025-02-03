<template>
  <picker
    mode="multiSelector"
    :range="SELECT_OPTIONS"
    :value="fieldValue"
    @change="onChange"
  >
    <w-button>{{ renderText }}</w-button>
  </picker>
</template>

<script setup lang="ts">
import WButton from "../Button/index.vue";
import { computed } from "vue";

const SELECT_OPTIONS = [
  ["朝晖", "屏峰", "莫干山"],
  Array(20).fill(0).map((_, i) => `第 ${i + 1} 周`),
  ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  Array(12).fill(0).map((_, i) => `第 ${i + 1} 节`)
] as const;

const fieldValue = defineModel<[
  campus: number,
  week: number,
  weekday: number,
  sections: number
]>({
  default: [0, 0, 0, 0]
});

const renderText = computed(() => {
  const _campus = SELECT_OPTIONS[0][fieldValue.value[0]];
  const _week = SELECT_OPTIONS[1][fieldValue.value[1]];
  const _weekDay = SELECT_OPTIONS[2][fieldValue.value[2]];
  const _section = `第${fieldValue.value[3] + 1}节`;

  return `${_campus} ${_week} ${_weekDay} ${_section}`;
});

const onChange = (e) => {
  fieldValue.value = e.detail.value;
};

</script>

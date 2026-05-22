<template>
  <picker
    mode="multiSelector"
    :range="showPeriod ? SELECT_OPTIONS_WITH_PERIOD : SELECT_OPTIONS"
    :value="innerField"
    class="picker-wrapper"
    @change="onChange"
  >
    <w-button class="term-selector">
      <view class="picker">{{ renderText }}</view>
    </w-button>
  </picker>
</template>

<script setup lang="ts">
import { computed } from "vue";

import WButton from "../Button/index.vue";

interface PickerTermOption {
  year: string;
  term: "上" | "下" | "短";
  period?: "期中" | "期末";
}

const field = defineModel<PickerTermOption>({
  default: {
    year: new Date().getFullYear().toString(),
    term: "上"
  }
});

const props = defineProps<{
  /** 是否显示期中 / 期末选项 */
  showPeriod?: boolean;
  /** 当前学年 */
  termYear: number;
}>();

const SELECT_OPTIONS = [
  // 支持选择最早三学年之前，最晚下一学年。形如 2021/2022
  Array.from({ length: 5 }, (_, i) => `${props.termYear - i + 1}/${props.termYear - i + 2}`),
  ["上", "下", "短"]
] as const;

const SELECT_OPTIONS_WITH_PERIOD = [...SELECT_OPTIONS, ["期中", "期末"]] as const;

/** Picker 依赖, 索引数组 */
const innerField = computed(() => {
  const indexOfYear = SELECT_OPTIONS[0].indexOf(
    `${field.value.year}/${Number(field.value.year) + 1}`
  );
  const indexOfTerm = SELECT_OPTIONS[1].indexOf(field.value.term);

  if (props.showPeriod) {
    const periodText = field.value.period;
    const indexOfPeriod = SELECT_OPTIONS_WITH_PERIOD[2].indexOf(periodText ?? "期中");
    return [indexOfYear, indexOfTerm, indexOfPeriod];
  }
  return [indexOfYear, indexOfTerm];
});

const renderText = computed(() => {
  const yearText = field.value.year;
  const termText = field.value.term;
  const periodText = field.value.period;

  return props.showPeriod
    ? `${yearText}/${Number(yearText) + 1} (${termText}) ${periodText}`
    : `${yearText}/${Number(yearText) + 1} (${termText})`;
});

function onChange(e) {
  const [indexOfYear, indexOfTerm, indexOfPeriod] = e.detail.value;

  field.value = {
    year: SELECT_OPTIONS[0][indexOfYear].split("/")[0],
    term: SELECT_OPTIONS[1][indexOfTerm],
    period: props.showPeriod ? SELECT_OPTIONS_WITH_PERIOD[2][indexOfPeriod] : undefined
  };
}
</script>

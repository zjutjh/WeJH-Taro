<template>
  <picker
    mode="multiSelector"
    :range="showPeriod ? SELECT_OPTIONS_WITH_PERIOD : SELECT_OPTIONS"
    :value="innerField"
    class="picker-wrapper"
    @change="onChange"
  >
    <w-button class="term-selector">
      <view class="picker">
        {{ renderText }}
      </view>
    </w-button>
  </picker>
</template>

<script setup lang="ts" generic="ShowPeriod extends boolean = false">
import { TaroEvent } from "@tarojs/components";
import { computed } from "vue";
import { PickerTermOption, PickerWithPeriodTermOption } from "./types";

import WButton from "../Button/index.vue";

type PropsType<P extends boolean> = {
  /** 是否展示期中期末选择 */
  showPeriod?: P;
  /** 当前的学年，picker 学年选择范围为 `termYear - 3` ~ `termYear + 1` */
  termYear: number;
};

const props = defineProps<PropsType<ShowPeriod>>();

const SELECT_OPTIONS = [
  // 支持选择最早三学年之前，最晚下一学年。形如 2021/2022
  Array(5).fill(0).map((_, i) => `${props.termYear - i + 1}/${props.termYear - i + 2}`),
  ["上", "下", "短"]
] as const;

const SELECT_OPTIONS_WITH_PERIOD = [
  ...SELECT_OPTIONS,
  ["期中", "期末"]
] as const;

const field = defineModel<PickerTermOption<ShowPeriod>>({
  default: { year: new Date().getFullYear(), term: "上" }
});

/** Picker 依赖, 索引数组 */
const innerField = computed<[number, number, number?]>(() => {
  const indexOfYear = SELECT_OPTIONS[0].indexOf(
    `${field.value.year}/${+field.value.year + 1}`
  );
  const indexOfTerm = SELECT_OPTIONS[1].indexOf(field.value.term);

  if (props.showPeriod && (field.value as PickerWithPeriodTermOption).period) {
    const periodText = (field.value as PickerWithPeriodTermOption).period;
    const indexOfPeriod = SELECT_OPTIONS_WITH_PERIOD[2].indexOf(periodText);
    return [indexOfYear, indexOfTerm, indexOfPeriod];
  }
  return [indexOfYear, indexOfTerm];
});

const renderText = computed(() => {
  const yearText = field.value.year;
  const termText = field.value.term;
  const periodText = (field.value as PickerWithPeriodTermOption).period ?? "";

  return `${ yearText }/${ +yearText + 1} (${ termText }) ${ periodText }`;
});

function onChange(e: TaroEvent<any, { value: [number, number, number ] }>) {
  const [
    indexOfYear,
    indexOfTerm,
    indexOfPeriod
  ] = e.detail.value;

  if (props.showPeriod) {
    field.value = {
      year: SELECT_OPTIONS[0][indexOfYear].split("/")[0],
      term: SELECT_OPTIONS[1][indexOfTerm],
      period: SELECT_OPTIONS_WITH_PERIOD[2][indexOfPeriod]
    } as PickerTermOption<ShowPeriod>;
  } else {
    field.value = {
      year: SELECT_OPTIONS[0][indexOfYear].split("/")[0],
      term: SELECT_OPTIONS[1][indexOfTerm]
    } as PickerTermOption<ShowPeriod>;
  }
}
</script>

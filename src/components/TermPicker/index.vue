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

<script setup lang="ts">
import WButton from "../Button/index.vue";
import { computed } from "vue";
import useGeneralInfo from "@/store/system/generalInfo";

const props = withDefaults(defineProps<{
  showPeriod?: boolean
}>(), {
  showPeriod: false
});

const generalInfo = useGeneralInfo();
const termYear = +generalInfo.value.termYear;

const SELECT_OPTIONS = [
  // 支持选择最早三学年之前，最晚下一学年。形如 2021/2022
  Array(5).fill(0).map((_, i) => `${termYear - i + 1}/${termYear - i + 2}`),
  ["上", "下", "短"]
] as const;

const SELECT_OPTIONS_WITH_PERIOD = [
  ...SELECT_OPTIONS,
  ["期中", "期末"]
] as const;

const field = defineModel<{
  year: string; // 例如 2021
  term: string,
  period?: string
}>({
  default: { year: new Date().getFullYear(), term: "上" }
});

/** Picker 依赖, 索引数组 */
const innerField = computed<[number, number, number?]>(() => {
  const indexOfYear = SELECT_OPTIONS[0].indexOf(
    `${field.value.year}/${+field.value.year + 1}`
  );
  const indexOfTerm = SELECT_OPTIONS[1].indexOf(field.value.term as "上" | "下" | "短");
  if (props.showPeriod && field.value.period) {
    const indexOfPeriod = SELECT_OPTIONS_WITH_PERIOD[2].indexOf(field.value.period as "期中" | "期末");
    return [indexOfYear, indexOfTerm, indexOfPeriod];
  }
  return [indexOfYear, indexOfTerm];
});

const renderText = computed(() => {
  const yearText = field.value.year;
  const termText = field.value.term;
  const periodText = field.value.period ?? "";

  return `${ yearText }/${ +yearText + 1} (${ termText }) ${ periodText }`;
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

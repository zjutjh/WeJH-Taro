<template>
  <picker
    mode="multiSelector"
    :range="selector"
    @change="onChange"
    :value="selectorValue"
    class="picker-wrapper"
  >
    <w-button class="term-selector">
      <view class="picker" :v-if="props.selectflag === 1">
        {{ selectorChecked[0] }}/{{ parseInt(selectorChecked[0]) + 1 }}
        ({{ selectorChecked[1]}}) {{ selectorChecked[2] }}
      </view>
    </w-button>
  </picker>
</template>

<script setup lang="ts">
import WButton from "../Button/index.vue";
import { computed, reactive, ref } from "vue";
import { systemStore } from "@/store";

interface PropsType {
  year: string;
  term: "上" | "下" | "短";
  period?: "期中" | "期末";
  selectflag: number; //flag为0表示学年、学期 ； 为1表示学年、学期、期中期末
}
const props = defineProps<PropsType>();

const emit = defineEmits(["changed"]);

let year = systemStore?.generalInfo?.termYear
  ? parseInt(systemStore?.generalInfo?.termYear)
  : new Date().getFullYear();

const selectorArr = [
  [["上", "下", "短"]],
  [["上", "下", "短"], ["期中", "期末"]]
];
const selector = reactive(selectorArr[props.selectflag]);

/** e.g. 2022 上 期中 */
const selectorChecked = ref<string[]>([]);
selectorChecked.value[0] = props.year;
if (props.selectflag >= 0)
  selectorChecked.value[1] = props.term;
if (props.selectflag >= 1)
  selectorChecked.value[2] = props.period!;

let years: string[] = [];

for (let i = -1; i < 4; i++) years.push(`${year - i}/${year - i + 1}`);
selector.unshift(years);

/** Picker 依赖, 索引数组 */
const selectorValue = computed(() => {
  const indexOfYear = selector[0].indexOf(
    `${selectorChecked.value[0]}/${parseInt(selectorChecked.value[0]) + 1}`
  );
  const indexOfTerm = selector[1].indexOf(selectorChecked.value[1]);

  let indexOfPeriod = -1;
  if (props.selectflag === 1) {
    indexOfPeriod = selector[2].indexOf(selectorChecked.value[2]);
    return [indexOfYear, indexOfTerm, indexOfPeriod];
  } else {
    return [indexOfYear, indexOfTerm, indexOfPeriod];
  }
});

function onChange(e) {
  selectorChecked.value = selector.map(
    (column, index) => column[e.detail.value[index]]
  );
  selectorChecked.value[0] = selectorChecked.value[0].split("/")[0];
  if (props.selectflag === 0) {
    // 精确到 上/下学期
    emit("changed", {
      year: selectorChecked.value[0],
      term: selectorChecked.value[1]
    });
  } else if (props.selectflag === 1) {
    // 精确到 期中/期末
    emit("changed", {
      year: selectorChecked.value[0],
      term: selectorChecked.value[1],
      period: selectorChecked.value[2]
    });
  }
}

</script>

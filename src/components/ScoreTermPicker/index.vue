<template>
  <picker
    mode="multiSelector"
    :range="selector"
    :value="selectorValue"
    class="picker-wrapper"
    @change="onChange"
  >
    <w-button class="term-selector">
      <view
        v-if="props.year!='全'"
        class="picker"
        :v-if="props.selectflag === 1"
      >
        {{ selectorChecked[0] }}/{{ parseInt(selectorChecked[0]) + 1 }}
        ({{ selectorChecked[1] }}) {{ selectorChecked[2] }}
      </view>
      <view
        v-if="props.year=='全'"
        class="picker"
        :v-if="props.selectflag === 1"
      >
        全
        ({{ selectorChecked[1] }}) {{ selectorChecked[2] }}
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
  term: "全" | "上" | "下" | "短" ;
  period?: "期中" | "期末";
  selectflag: number; // flag为0表示学年、学期 ； 为1表示学年、学期、期中期末
}
const props = defineProps<PropsType>();

const emit = defineEmits(["changed"]);

const termYear = systemStore?.generalInfo?.termYear
  ? parseInt(systemStore?.generalInfo?.termYear)
  : new Date().getFullYear();

const selectorArr = [
  [["上", "下", "短", "全"]],
  [["全", "上", "下", "短" ], ["期中", "期末"]]
];
const selector = reactive(selectorArr[props.selectflag]);

/** e.g. 2022 上 期中 */
const selectorChecked = ref<string[]>([]);
selectorChecked.value[0] = props.year;
if (props.selectflag >= 0) selectorChecked.value[1] = props.term;
if (props.selectflag >= 1) selectorChecked.value[2] = props.period!;

const years: string[] = [];
years.push("全");
for (let i = -1; i < 4; i++) years.push(`${termYear - i}/${termYear - i + 1}`);
selector.unshift(years);

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
  // Update the selected values based on picker indexes
  selectorChecked.value = selector.map(
    (column, index) => column[e.detail.value[index]]
  );
  if (selectorChecked.value[0] != "全") {
    selectorChecked.value[0] = selectorChecked.value[0].split("/")[0];
  } else {
    selectorChecked.value[0] = "全";
  }

  if (props.selectflag === 1) {
    // 精确到 期中/期末
    emit("changed", {
      year: selectorChecked.value[0],
      term: selectorChecked.value[1],
      period: selectorChecked.value[2]
    });

  }
}
</script>

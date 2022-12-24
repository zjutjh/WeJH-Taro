<template>
  <picker
    mode="multiSelector"
    :range="selector"
    @change="onChange"
    :value="selectorValue"
    class="picker-wrapper"
  >
    <w-button class="term-selector">
      <view class="picker"
        >{{ selectorChecked[0] }}/{{ parseInt(selectorChecked[0]) + 1 }}({{
          selectorChecked[1]
        }})</view
      >
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
}
const props = defineProps<PropsType>();

const emit = defineEmits(["changed"]);

let year = systemStore?.generalInfo?.termYear
  ? parseInt(systemStore?.generalInfo?.termYear)
  : new Date().getFullYear();

const selector = reactive([["上", "下", "短"]]);

const selectorChecked = ref([props.year, props.term]);

let years: string[] = [];

for (let i = 0; i < 4; i++) years.push(`${year - i}/${year - i + 1}`);
selector.unshift(years);

const selectorValue = computed(() => [
  selector[0].indexOf(
    `${selectorChecked.value[0]}/${
      parseInt(selectorChecked.value[0]) + 1
    }`
  ),
  selector[1].indexOf(selectorChecked.value[1])
]);

function onChange(e) {
  selectorChecked.value = selector.map(
    (ex, index) => ex[e.detail.value[index]]
  );
  selectorChecked.value[0] = selectorChecked.value[0].split("/")[0];
  emit("changed", {
    year: selectorChecked.value[0],
    term: selectorChecked.value[1]
  });
}

</script>

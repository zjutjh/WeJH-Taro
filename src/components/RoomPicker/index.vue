<template>
  <picker mode="multiSelector" :range="selector" :value="selectorValue" @change="onChange">
    <w-button>
      {{
        `${selectorChecked[0]} ${selectorChecked[1]} ${selectorChecked[2]} ${selectorChecked[3]}`
      }}
    </w-button>
  </picker>
</template>

<script setup lang="ts">
import { cloneDeep, times } from "lodash-es";
import { onMounted, ref } from "vue";

import { DAY_SCHEDULE_START_TIME } from "@/constants/day-schedule-start-time";
import { systemStore } from "@/store";

import WButton from "../Button/index.vue";

const props = defineProps<{ week: number }>();
const emit = defineEmits(["changed"]);

const campus = ["朝晖", "屏峰", "莫干山"];
const selectorData: [string[], string[], string[], string[]] = [
  campus,
  times(20, (index) => `第${index + 1}周`),
  ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  times(12, (index) => `第${index + 1}节`)
];

const selector = cloneDeep(selectorData);

const defaultCampus = campus[0];
const defaultWeek = selectorData[1].at(props.week > 0 && props.week < 20 ? props.week - 1 : 0);
const defaultDay = selectorData[2].at(new Date().getDay() - 1);
const defaultSection = `第${getCurrentSection()}节`;

const selectorChecked = ref([defaultCampus, defaultWeek, defaultDay, defaultSection]);

const selectorValue = ref([
  0,
  props.week < 20 && props.week > 0 ? props.week - 1 : 0,
  new Date().getDay() - 1,
  getCurrentSection() - 1
]);

const onChange = (e) => {
  selectorChecked.value = selector.map((item, index) => item.at(e.detail.value.at(index)) ?? "");
  selectorValue.value = e.detail.value;

  emit("changed", {
    year: systemStore.generalInfo.termYear,
    term: systemStore.generalInfo.term,
    campus: campus[e.detail.value[0]],
    week: Math.pow(2, e.detail.value[1]).toString(),
    weekday: (selectorValue.value[2] + 1).toString(),
    sections: Math.pow(2, e.detail.value[3]).toString()
  });
};

onMounted(() => {
  emit("changed", {
    year: systemStore.generalInfo.termYear,
    term: systemStore.generalInfo.term,
    campus: campus[selectorValue.value[0]],
    week: Math.pow(2, selectorValue.value[1]).toString(),
    weekday: (selectorValue.value[2] + 1).toString(),
    sections: Math.pow(2, getCurrentSection()).toString()
  });
});

function getCurrentSection() {
  const date = new Date();
  const tmp = date.getHours() * 60 + date.getMinutes();
  let currentSection = 12;
  DAY_SCHEDULE_START_TIME.find((item, index) => {
    if (tmp < item.hour * 60 + item.min) {
      currentSection = index + 1;
      return true;
    }
  });
  return currentSection;
}
</script>

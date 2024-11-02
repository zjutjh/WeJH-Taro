<template>
  <picker
    mode="multiSelector"
    :range="selector"
    :value="selectorValue"
    @change="onChange"
  >
    <w-button>
      {{ selectorChecked[0] }} {{ selectorChecked[1] }}
      {{ selectorChecked[2] }} {{ selectorChecked[3] }}
    </w-button>
  </picker>
</template>

<script setup lang="ts">
import WButton from "../Button/index.vue";
import { onMounted, reactive, ref } from "vue";
import { dayScheduleStartTime } from "@/constants/dayScheduleStartTime";

const props = defineProps<{ week: number }>();
const emit = defineEmits<{
  changed: [args: {
    campus: string,
    week: number,
    weekday: number,
    sections: number
  }]
}>();

const campus = ["朝晖", "屏峰", "莫干山"];

const selectorData = [
  campus,
  Array(20).fill(0).map((_, i) => `第${i + 1}周`),
  ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  Array(12).fill(0).map((_, i) => `第${i + 1}节`)
];

const getCurrentSection = () => {
  const date = new Date();
  const tmp = date.getHours() * 60 + date.getMinutes();
  let currentSection = 12;
  dayScheduleStartTime.find((item, index) => {
    if (tmp < item.hour * 60 + item.min) {
      currentSection = index + 1;
      return true;
    }
  });
  return currentSection;
};

const selector = reactive(selectorData);
const selectorChecked = ref([
  campus[0],
  selectorData[1][props.week < 20 ? props.week - 1 : 0],
  selectorData[2][new Date().getDay() - 1],
  `第${getCurrentSection()}节`
]);
const selectorValue = ref([
  0,
  props.week < 20 && props.week > 0 ? props.week - 1 : 0,
  new Date().getDay() - 1,
  getCurrentSection() - 1
] as const);

const onChange = (e) => {
  selectorChecked.value = selector.map(
    (item, index) => item[e.detail.value[index]]
  );
  selectorValue.value = e.detail.value;

  emit("changed", {
    campus: campus[e.detail.value[0]],
    week: e.detail.value[1],
    weekday: e.detail.value[2] + 1,
    sections: e.detail.value[3]
  });
};

onMounted(() => {
  emit("changed", {
    campus: campus[selectorValue.value[0]],
    week: selectorValue.value[1],
    weekday: selectorValue.value[2] + 1,
    sections: selectorValue.value[3]
  });
});

</script>

<template>
  <w-button
    class="arrow-button"
    shape="circle"
    size="large"
    :class="{ disable: week <= 1 }"
    @tap="backwardWeek"
  >
    <view class="iconfont icon-arrow-left" />
  </w-button>
  <picker
    mode="selector"
    :range="selector"
    :value="selectorValue"
    class="picker-wrapper"
    @change="onChange"
  >
    <w-button class="week-selector">
      <text v-if="week > 18 || week < 1">
        放假中
      </text>
      <view v-else class="picker">
        第 {{ props.week }} 周
      </view>
    </w-button>
  </picker>
  <w-button
    shape="circle"
    class="arrow-button"
    size="large"
    :class="{ disable: week >= 19 }"
    @tap="forwardWeek"
  >
    <view class="iconfont icon-arrow-right" />
  </w-button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import WButton from "../Button/index.vue";
import "./index.scss";

const emit = defineEmits(["update:week"]);
const props = defineProps<{ week: number }>();

const selectorValue = ref(props.week - 1 < 0 ? 0 : props.week - 1);
const selector: string[] = [];

for (let i = 1; i <= 20; i++) selector.push(`第 ${i} 周`);

function onChange(e) {
  selectorValue.value = parseInt(e.detail.value);
  emit("update:week", parseInt(e.detail.value) + 1);
}

function backwardWeek() {
  if (selectorValue.value > 0) {
    selectorValue.value = props.week - 1 - 1;
    if (selectorValue.value < 0) selectorValue.value = 0;
    emit("update:week", props.week - 1);
  }
}
function forwardWeek() {
  if (selectorValue.value < 18) {
    selectorValue.value = props.week + 1 - 1;
    if (selectorValue.value < 0) selectorValue.value = 0;
    emit("update:week", props.week + 1);
  }
}
</script>

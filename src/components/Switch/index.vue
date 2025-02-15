<template>
  <view
    class="switch-container"
    :class="isActive"
  >
    <view
      class="switch-slider"
      :class="isActive"
      :style="{
        '--wjh-switch-position': position
      }"
    />
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import "./index.scss";

/** 后续有需要props里加上颜色属性 改颜色 */
const props = defineProps<{
  bindValue: string
  activeValue: string
  inActiveValue: string
}>();

const isActive = computed(() => {
  return props.bindValue === props.activeValue ? "active" : null;
});

const position = computed(() => {
  return isActive.value === "active" ? "8%" : "92%";
});
</script>

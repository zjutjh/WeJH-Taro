<template>
  <view
    class="switch-container"
    :class="isActive"
  >
    <view
      class="switch-slider"
      :class="isActive"
    />
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import "./index.scss";

/** 后续有需要props里加上颜色属性 改颜色 */
const props = defineProps<{
  active: boolean
}>();

const isActive = computed(() => {
  return props.active ? "active" : null;
});

</script>

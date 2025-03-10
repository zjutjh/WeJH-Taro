<template>
  <view
    class="switch-container"
    :class="activeClass"
    @tap="toggleActive()"
  >
    <view
      class="switch-slider"
      :class="activeClass"
    />
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import "./index.scss";

/** 后续有需要props里加上颜色属性 改颜色 */
const isActive = defineModel<boolean>();

function toggleActive() {
  isActive.value = !isActive.value;
}

const activeClass = computed(() => {
  return isActive.value ? "active" : null;
});
</script>

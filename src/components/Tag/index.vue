<template>
  <view :class="['wjh-tag', active ? 'wjh-tag__active' : '']" @tap="emit('click')">
    {{ label }}
  </view>
</template>

<script setup lang="ts">
import "./index.scss";

defineProps<{
  label: string;
  active?: boolean;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>

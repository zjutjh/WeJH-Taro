<template>
  <view :class="{  [themeMode]: true }">
   <slot></slot>
  </view>
</template>

<script setup lang="ts">
import "./index.scss";
import { ref,watch } from "vue";
import { serviceStore } from "@/store";

const themeMode = ref(serviceStore.theme.themeMode);

watch(() => serviceStore.theme.themeMode, (newValue) => {
  themeMode.value = newValue;
});

</script>

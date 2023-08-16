<template>
  <view :class="[themeMode]" class="background-config theme">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import "./index.scss";
import { computed } from "vue";
import { serviceStore } from "@/store";

const themeMode = computed(() => serviceStore.theme.themeMode);

</script>

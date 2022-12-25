<template>
  <view
    class="bottom-panel"
    :class="{ 'bottom-bar-ios': isNewIPhone() }"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
import { isNewIPhone } from "@/utils";
import "./index.scss";

</script>

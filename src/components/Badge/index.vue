<template>
  <view
   :class="[styles.badge, styles[size]]"
   :style="`--badge-color: ${color}` as any"
  >
    <view :class="styles.virtual"> <slot /> </view>
    <view :class="styles.text"> <slot /> </view>
  </view>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";

type PropsType = {
  size?: "large" | "middle" | "small"
  color?: string;
}

withDefaults(defineProps<PropsType>(), {
  size: "middle",
  color: "var(--wjh-color-red-600)"
});
</script>

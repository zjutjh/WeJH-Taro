<template>
  <view :class="[styles.badge, styles[size]]">
    <text> {{ content }} </text>
  </view>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";

type PropsType = {
  content?: string;
  size?: "middle" | "small"
}

withDefaults(defineProps<PropsType>(), {
  size: "middle"
});

</script>

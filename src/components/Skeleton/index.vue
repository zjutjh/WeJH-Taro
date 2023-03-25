<script setup lang="ts">
import { CSSProperties } from "vue";
import styles from "./index.module.scss";

const props = defineProps<{
  row?: number;
  style?: CSSProperties;
}>();

</script>

<template>
  <view :class="styles.container" :style="props.style">
    <view
      v-for="(_, index) in row || 5"
      :key="index"
      :class="styles.line"
    />
  </view>
</template>

<template>
  <view :class="styles.switcher" @tap="handleToggle">
    <text v-if="field">
      预览
    </text>
    <text v-else>
      计算器
    </text>
  </view>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";

/** 预览态 true, 计算器态 false */
const field = defineModel<boolean>();

function handleToggle() {
  field.value = !field.value;
}
</script>

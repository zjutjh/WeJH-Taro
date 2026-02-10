<template>
  <card :class="styles['bus-information-container']">
    <template #header>
      <view>当前暂无符合条件的可用班次</view>
    </template>
    <view :class="styles['content']">
      <view :class="styles['text']">请调整筛选项来查找班次</view>
      <view :class="styles['text']">距发车 16 分钟不到的班次不会展示</view>
    </view>
  </card>
</template>

<script setup lang="ts">
import { Card } from "@/components";

import styles from "./index.module.scss";
</script>

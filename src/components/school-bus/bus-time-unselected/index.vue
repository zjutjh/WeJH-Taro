<template>
  <!-- 班车信息列表空状态用的卡片 -->
  <card :class="styles['bus-information-container']">
    <view :class="styles['title']">请先选择起点和终点</view>
    <view :class="styles['content']">
      <view :class="styles['text']">预约截至时间为发车前16分钟!</view>
      <view :class="styles['text']">预约校车请到工大钉或容大后勤的班车预约</view>
    </view>
  </card>
</template>

<script setup lang="ts">
import { Card } from "@/components";

import styles from "./index.module.scss";
</script>

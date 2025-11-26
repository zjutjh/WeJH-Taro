<template>
  <theme-config>
    <title-bar title="校车" :back-button="true" />
    <view :class="styles['schoolbus-container']">
      <view :class="styles['schoolbus-title-bar']">
        <view :class="styles['left-area']">
          <view :class="styles['left-top-block']">
            <view :class="styles['line-type-selector']"></view>
          </view>
          <view :class="styles['left-bottom-block']">
            <view :class="styles['route-selector']"></view>
          </view>
        </view>
        <view :class="styles['center-area']">
          <view :class="styles['station-changer']">
            <view :class="styles['station-changer-icon']" />
          </view>
        </view>
        <view :class="styles['right-area']">
          <view :class="styles['right-top-block']">
            <view :class="styles['icon-wrapper']">
              <view :class="[styles['icon'], styles['route']]" />
              <view :class="styles['description']">路线</view>
            </view>
            <view :class="styles['icon-wrapper']">
              <view :class="[styles['icon'], styles['announcement']]" />
              <view :class="styles['description']">通知</view>
            </view>
            <view :class="styles['icon-wrapper']">
              <view :class="[styles['icon'], styles['hint']]" />
              <view :class="styles['description']">提示</view>
            </view>
          </view>
          <view :class="styles['right-bottom-block']">
            <view :class="styles['route-selector']"></view>
          </view>
        </view>
      </view>
      <bus-time-card></bus-time-card>
    </view>
  </theme-config>
</template>

<script setup lang="ts">
import { BusTimeCard, ThemeConfig, TitleBar } from "@/components";

import styles from "./index.module.scss";
</script>

<template>
  <theme-config>
    <title-bar title="校车" :back-button="true" />
    <view :class="styles['schoolbus-container']">
      <view :class="styles['schoolbus-title-bar']">
        <view :class="[styles['bus-btn'], styles['bus-info']]">
          <view class="iconfont icon-schoolbus" />
          <view :class="styles['description']"> 班车信息 </view>
        </view>
        <view :class="[styles['bus-btn'], styles['bus-ticket']]">
          <view class="iconfont icon-chepiao" />
          <view :class="styles['description']"> 已约车票 </view>
        </view>
        <view :class="[styles['bus-btn'], styles['bus-record']]">
          <view class="iconfont icon-a-lishijilubiaodanjishi" />
          <view :class="styles['description']"> 乘车记录 </view>
        </view>
      </view>
      <view :class="styles['function-block']">
        <view :class="styles['function-block-item']"> </view>
        <view :class="styles['function-block-item']"> </view>
      </view>
      <bus-information> </bus-information>
    </view>
  </theme-config>
</template>

<script setup lang="ts">
import { BusInformation, ThemeConfig, TitleBar } from "@/components";

import styles from "./index.module.scss";
</script>

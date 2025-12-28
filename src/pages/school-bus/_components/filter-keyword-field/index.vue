<template>
  <view :class="styles['filter-keyword-field']">
    <view
      :class="styles['search-input-container']"
      :style="isEmpty(modelValue) ? { opacity: 0.6 } : {}"
    >
      <view class="iconfont icon-search" :class="styles['search-icon']" />
      <input
        v-model="modelValue"
        type="text"
        :class="styles['search-input']"
        placeholder="请输入关键词"
      />
    </view>
    <view :class="styles['icon-wrapper']" @tap="emit('click-line')">
      <view :class="[styles['icon']]" class="iconfont icon-route" />
      <view :class="styles['description']">路线</view>
    </view>
    <view :class="styles['icon-wrapper']" @tap="emit('click-announce')">
      <view :class="[styles['icon']]" class="iconfont icon-alarm" />
      <view :class="styles['description']">通知</view>
    </view>
    <view :class="styles['icon-wrapper']" @tap="emit('click-tip')">
      <view :class="[styles['icon']]" class="iconfont icon-help" />
      <view :class="styles['description']">提示</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { isEmpty } from "lodash-es";

import styles from "./index.module.scss";

const modelValue = defineModel<string>({ default: "" });

const emit = defineEmits<{
  (e: "click-line" | "click-announce" | "click-tip"): void;
}>();
</script>

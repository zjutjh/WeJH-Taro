<template>
  <w-button
    class="arrow-button"
    shape="circle"
    size="large"
    :disable="field <= 0"
    @tap="handleTapPrevious"
  >
    <view class="iconfont icon-arrow-left" />
  </w-button>
  <picker
    mode="selector"
    :range="SELECT_OPTIONS"
    :value="field"
    class="picker-wrapper"
    @change="onChange"
  >
    <w-button class="week-selector">
      <text v-if="field >= 18">
        放假中
      </text>
      <view v-else class="picker">
        第 {{ field + 1 }} 周
      </view>
    </w-button>
  </picker>
  <w-button
    shape="circle"
    class="arrow-button"
    size="large"
    :disable="field >= 20"
    @tap="handleTapNext"
  >
    <view class="iconfont icon-arrow-right" />
  </w-button>
</template>

<script setup lang="ts">
import { WButton } from "@/components";
import "./index.scss";

// 第一周 -> 0
const field = defineModel<number>({ default: 0 });

const SELECT_OPTIONS = Array(20).fill(0).map((_, i) => `第 ${i + 1} 周`);

function onChange(e) {
  field.value = parseInt(e.detail.value);
}

function handleTapPrevious() {
  field.value--;
}

function handleTapNext() {
  field.value++;
}
</script>

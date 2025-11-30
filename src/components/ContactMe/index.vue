<script setup lang="ts">
import Taro from "@tarojs/taro";

import styles from "./index.module.scss";

const emit = defineEmits(["showHelp"]);
const props = defineProps<{
  data: ReadonlyArray<{ content: string; extra?: string }>;
  message: string;
}>();

const handleClick = () =>
  Taro.showActionSheet({
    itemList: props.data.map((item) => item.content),
    success: (res) => {
      if (props.data[res.tapIndex].extra)
        Taro.showModal({ title: "详情", content: props.data[res.tapIndex].extra });
    }
  });

const handleTapHelp = () => emit("showHelp");
</script>

<template>
  <view :class="styles.container">
    <view :class="styles.arrow" @tap="handleClick" />
    <text @tap="handleClick"> {{ props.message }} </text>
    <view :class="[styles.helpicon]" class="iconfont icon-help" @tap="handleTapHelp" />
  </view>
</template>

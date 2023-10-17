<template>
    <web-view :src="url" />
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { WebView } from "@tarojs/components";
import { ref } from "vue";

const url = ref("https://mp.weixin.qq.com/s/ZO6klqMuwFsRPRYmlnn9XA");

if (!url.value) {
  Taro.showModal({
    title: "未找到页面",
  });
  throw new Error("invalid access");
}

</script>

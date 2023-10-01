<template>
    <web-view :src="url" />
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { WebView } from "@tarojs/components";
import { ref } from "vue";

const url = ref("https://mp.weixin.qq.com/mp/homepage?search_click_id=2273806300052426093-1696178178103-4938610590&__biz=MzA3ODU1ODQ5Nw==&hid=1&sn=f48d2c04301a74bb777bc4428b59a023&scene=18");

if (!url.value) {
  Taro.showModal({
    title: "未找到页面",
  });
  throw new Error("invalid access");
}

</script>

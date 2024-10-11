<template>
  <web-view :src="url" />
</template>

<script setup lang="ts">
import store, { serviceStore } from "@/store";
import Taro from "@tarojs/taro";

const url = serviceStore.webview.tempUrl;
store.commit("clearTemp");

if (!url) {
  Taro.showModal({
    title: "未找到页面"
  });
  throw new Error("invalid access");
}

</script>

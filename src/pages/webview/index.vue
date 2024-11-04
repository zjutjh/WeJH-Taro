<template>
  <web-view :src="target" />
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";

const router = Taro.getCurrentInstance().router;
const target = decodeURIComponent(router?.params["target"] ?? "");

if (!target) {
  Taro.showModal({ title: "未找到页面" });
}

</script>

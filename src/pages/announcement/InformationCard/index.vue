<script setup lang="ts">
import Taro from "@tarojs/taro";
import { Information } from "@/types/Information";
import styles from "./index.module.scss";
import { Card } from "@/components";
import store from "@/store";

const props = defineProps<{
  source: Information;
}>();

const handleClickLink = () => {
  store.commit("setTempUrl", { url: props.source.link });
  Taro.navigateTo({
    url: "/pages/webview/index"
  });

};

</script>

<template>
  <card :class="styles.container">
    <view :class="styles.header">
      <view :class="styles.title">{{ props.source.content }}</view>
    </view>
    <view :class="styles.publisher">By: {{ props.source.publisher }}</view>
    <view :class="styles.link" @tap="handleClickLink">点击跳转相关规定</view>
    <template #footer>
      <view :class="styles['publish-time']">发布时间: {{ props.source.publish_time }}</view>
    </template>
  </card>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { Information } from "@/types/Information";
import styles from "./index.module.scss";
import { Card } from "@/components";
import store from "@/store";
import dayjs from "dayjs";

const props = defineProps<{
  source: Information;
}>();

const handleClickLink = () => {
  store.commit("setTempUrl", { url: props.source.link });
  Taro.navigateTo({
    url: "/pages/webview/index"
  });
};

const handleClick = () => {
  Taro.navigateTo({
    url: "/pages/information/index?informationId=" + props.source.id
  });
};

const timeFormat = (time: string) => {
  return dayjs(time).format("YYYY年MM月DD日");
};
</script>

<template>
  <card :class="styles.container" @tap="handleClick">
    <view :class="styles.header">
      <view :class="styles.title">{{ props.source.title }}</view>
    </view>
    <view :class="styles.content">{{ props.source.content.replace(/\\n/g, '\n') }}</view>
    <view :class="styles.link" @tap="handleClickLink" v-if="props.source.link">点击跳转相关规定</view>
    <template #footer>
      <view :class="styles.logo_container">
        <image src="../../../assets/icons/foryou/foryouicon.webp" alt="logo_fy" :class="styles.logo_fy" mode="aspectFit"></image>
        <view :class="styles.x">X</view>
        <image src="../../../assets/icons/foryou/jhwlicon.webp" alt="logo_jh" :class="styles.logo_jh" mode="aspectFit"></image>
      </view>
      <view :class="styles.publisher">信息来源: {{ props.source.publisher }}</view>
      <view :class="styles['publish-time']">发布时间: {{ timeFormat(props.source.publish_time) }}</view>
    </template>
  </card>
</template>

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

const Author = "\"For You\"工程";

</script>

<template>
  <card :class="{ [styles.container]: props.source.publisher === Author }">
    <view :class="styles.header">
      <view :class="styles.title">{{ props.source.title }}</view>
    </view>
    <view :class="styles.content">{{ props.source.content.replace(/\\n/g, '\n') }}</view>
    <view :class="styles.img_container" v-if="props.source.image_1 !== null">
      <image :src="props.source.image_1" alt="Card Image" :class="styles.image" mode="aspectFit"></image>
    </view>
    <view :class="styles.img_container" v-if="props.source.image_2 !== null">
      <image :src="props.source.image_2" alt="Card Image" :class="styles.image" mode="aspectFit"></image>
    </view>
    <view :class="styles.img_container" v-if="props.source.image_3 !== null">
      <image :src="props.source.image_3" alt="Card Image" :class="styles.image" mode="aspectFit"></image>
    </view>
    <view :class="styles.link" @tap="handleClickLink" v-if="props.source.link !==null">点击跳转相关规定</view>
    <template #footer>
      <view :class="styles.logo_container">
      <image src="@/assets/fy-logo.png" alt="logo_fy" :class="styles.logo_fy" mode="aspectFit"></image>
      <image
      :src="require('@/assets/x.svg')"
      style="margin: 4px 0; width: 100% ;height: 100%;"
      />
      <image src="@/assets/jh-logo-1.png" alt="logo_jh" :class="styles.logo_jh" mode="aspectFit"></image>
      </view>
      <view :class="styles.publisher">信息来源: {{ props.source.publisher }}</view>
      <view :class="styles['publish-time']">发布时间: {{ props.source.publish_time }}</view>
    </template>
  </card>
</template>

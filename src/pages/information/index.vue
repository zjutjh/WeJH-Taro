<template>
  <theme-config>
    <title-bar title="资讯" back-button />
    <scroll-view :scrollY="true">
      <card class="container">
        <view class="header">
          <view class="title">{{ information.title }}</view>
        </view>
        <view class="content">{{ information.content.replace(/\\n/g, '\n') }}</view>
        <view class="img_container" v-if="information.img1">
          <image
            :src="information.img1"
            alt="Card Image"
            class="image"
            mode="aspectFit"
            @tap="() => handlePreviewImages(information.img1)"
            :onLoad="handleLoadFinish"
          />
        </view>
        <view class="img_container" v-if="information.img2">
          <image
            :src="information.img2"
            alt="Card Image"
            class="image"
            mode="aspectFit"
            @tap="() => handlePreviewImages(information.img2)"
            :onLoad="handleLoadFinish"
          />
        </view>
        <view class="img_container" v-if="information.img3">
          <image
            :src="information.img3"
            alt="Card Image"
            class="image"
            mode="aspectFit"
            @tap="() => handlePreviewImages(information.img3)"
            :onLoad="handleLoadFinish"
          />
        </view>
        <view class="link" v-if="information.link">点击跳转相关规定</view>
        <template #footer>
          <view class="logo_container">
            <image src="https://img.cnpatrickstar.com/5eb88a00-1d66-49af-8c75-ff651a077503.png" alt="logo_fy" class="logo_fy" mode="aspectFit"></image>
            <view class="x">X</view>
            <image src="https://img.cnpatrickstar.com/2633992f-415a-4b6b-b54e-f24adaca7d42.png" alt="logo_jh" class="logo_jh" mode="aspectFit"></image>
          </view>
          <view class="publisher">信息来源: {{ information.publisher }}</view>
          <view class="publish-time">发布时间: {{ timeFormat(information.publish_time) }}</view>
        </template>
      </card>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import { Card, ThemeConfig, TitleBar } from "@/components";
import { serviceStore } from "@/store";
import { computed, ref } from "vue";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import "./index.scss";

const instance = Taro.getCurrentInstance();

const needFixWidth = ref(false);

const { informationId } = instance.router?.params as { informationId?: number };

const information = computed(() => {
  return serviceStore.information.informationList.find((information) => information.id == informationId);
});

const imageList = computed(() => [
  information.value?.img1 || null,
  information.value?.img2 || null,
  information.value?.img3 || null
].filter(item => !!item) as string[]);

const timeFormat = (time: string) => {
  return dayjs(time).format("YYYY年MM月DD日");
};

const handleLoadFinish = ({ detail: { height, width } }) => {
  if (height > width) needFixWidth.value = false;
  else needFixWidth.value = true;
};

const handlePreviewImages = (url: string) => {
  // FIXME: control enter onShow
  Taro.previewImage({
    current: url,
    urls: imageList.value
  });
};
</script>

<template>
  <view class="background">
    <title-bar title="资讯" back-button />
    <scroll-view :scrollY="true">
      <card class="container">
        <view class="header">
          <view class="title">{{ information.title }}</view>
        </view>
        <view class="content">{{ information.content.replace(/\\n/g, '\n') }}</view>
        <view class="img_container" v-if="information.img1">
          <image :src="information.img1" alt="Card Image" class="image" mode="aspectFit"></image>
        </view>
        <view class="img_container" v-if="information.img2">
          <image :src="information.img2" alt="Card Image" class="image" mode="aspectFit"></image>
        </view>
        <view class="img_container" v-if="information.img3">
          <image :src="information.img3" alt="Card Image" class="image" mode="aspectFit"></image>
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
  </view>
</template>

<script setup lang="ts">
import { Card, TitleBar } from "@/components";
import { serviceStore } from "@/store";
import { computed } from "vue";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import "./index.scss";

const instance = Taro.getCurrentInstance();

const informationList = computed(() => {
  return [...serviceStore.information.informationList].reverse();
});

const { informationId } = instance.router?.params as { informationId?: number };

const information = informationList.value.find((information) => information.id == informationId);

const timeFormat = (time: string) => {
  return dayjs(time).format("YYYY年MM月DD日");
};

</script>


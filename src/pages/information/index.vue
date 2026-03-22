<template>
  <theme-config>
    <title-bar title="资讯" :back-button="true" />
    <scroll-view v-if="information" :scroll-y="true">
      <card class="container">
        <view class="header">
          <view class="title">
            {{ information.title }}
          </view>
        </view>
        <view class="content">
          {{ information.content.replace(/\\n/g, "\n") }}
        </view>
        <view v-for="url in imageList" :key="url" class="img_container">
          <image
            :src="url"
            alt="Card Image"
            class="image"
            mode="aspectFit"
            @load="handleLoadFinish"
            @tap="() => handlePreviewImages(url)"
          />
        </view>
        <view v-if="information.link" class="link"> 点击跳转相关规定 </view>
        <template #footer>
          <view class="logo_container">
            <image
              src="https://api.cnpatrickstar.com/img/92a63e97-cd3e-411b-b4aa-8e6fad5fbd00.jpg"
              alt="logo_fy"
              class="logo_fy"
              mode="aspectFit"
            />
            <view class="x"> X </view>
            <image
              src="https://api.cnpatrickstar.com/img/15c05a4c-7c2d-4561-9536-80614b7b65b8.jpg"
              alt="logo_jh"
              class="logo_jh"
              mode="aspectFit"
            />
          </view>
          <view class="publisher"> 信息来源: {{ information.publisher }} </view>
          <view class="publish-time"> 发布时间: {{ publishTime }} </view>
        </template>
      </card>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";

import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { compact, get, uniq } from "lodash-es";
import { computed, ref } from "vue";

import { Card, ThemeConfig, TitleBar } from "@/components";
import { serviceStore } from "@/store";

const instance = Taro.getCurrentInstance();
const needFixWidth = ref(false);

const information = computed(() => {
  const informationId = Number(get(instance, ["router", "params", "informationId"], ""));
  return serviceStore.information.informationList.find((info) => info.id == informationId);
});

const imageList = computed(() =>
  uniq(compact([information.value?.img1, information.value?.img2, information.value?.img3]))
);

const publishTime = computed(() => {
  return dayjs(information.value?.publish_time).format("YYYY年MM月DD日");
});

const handleLoadFinish = (e: unknown) => {
  const height = Number(get(e, ["detail", "height"])) || 0;
  const width = Number(get(e, ["detail", "width"])) || 0;
  needFixWidth.value = height > width;
};

const handlePreviewImages = (url: string) => {
  Taro.previewImage({
    current: url,
    urls: imageList.value
  });
};
</script>

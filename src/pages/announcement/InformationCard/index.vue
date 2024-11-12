<script setup lang="ts">
import Taro from "@tarojs/taro";
import { Information } from "@/types/Information";
import styles from "./index.module.scss";
import { Card } from "@/components";
import dayjs from "dayjs";
import useWebview from "@/hooks/useWebview";
import { Image as TaroImage } from "@tarojs/components";

const { open } = useWebview();
const props = defineProps<{
  source: Information;
}>();

const handleClickLink = () => {
  open(props.source.link);
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
      <view :class="styles.title">
        {{ props.source.title }}
      </view>
    </view>
    <view :class="styles.content">
      {{ props.source.content.replace(/\\n/g, '\n') }}
    </view>
    <view
      v-if="props.source.link"
      :class="styles.link"
      @tap="handleClickLink"
    >
      点击跳转相关规定
    </view>
    <template #footer>
      <view :class="styles.logo_container">
        <taro-image
          src="https://api.cnpatrickstar.com/img/92a63e97-cd3e-411b-b4aa-8e6fad5fbd00.jpg"
          alt="logo_fy"
          :class="styles.logo_fy"
          mode="aspectFit"
        />
        <view :class="styles.x">
          X
        </view>
        <taro-image
          src="https://api.cnpatrickstar.com/img/15c05a4c-7c2d-4561-9536-80614b7b65b8.jpg"
          alt="logo_jh"
          :class="styles.logo_jh"
          mode="aspectFit"
        />
      </view>
      <view :class="styles.publisher">
        信息来源: {{ props.source.publisher }}
      </view>
      <view :class="styles['publish-time']">
        发布时间: {{ timeFormat(props.source.publish_time) }}
      </view>
    </template>
  </card>
</template>

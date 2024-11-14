<template>
  <theme-config>
    <title-bar title="借用须知" back-button />
    <scroll-view :scroll-y="true">
      <view :class="style.header">
        <taro-image :src="SuitFAQCoverImage" />
      </view>

      <view class="flex-column">
        <card
          v-for="faq in faqList"
          :key="faq.id"
          style="font-weight: bold; font-size: 22px;"
        >
          <view :class="style.title">
            {{ faq.title }}
          </view>
          <view :class="style.text">
            <text>{{ faq.content }}</text>
          </view>
          <view :class="style.footer">
            <text>{{ faq.publisher }} · {{ timeFormat(faq.publish_time) }}</text>
          </view>
        </card>
        <card v-if="!faqList.length">
          <text>当前暂无借用须知，敬请期待</text>
        </card>
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import style from "./index.module.scss";
import {
  Card,
  ThemeConfig,
  TitleBar
} from "@/components";
import { useRequestNext } from "@/hooks";
import { SuitService } from "@/services";
import dayjs from "dayjs";
import { Image as TaroImage } from "@tarojs/components";
import SuitFAQCoverImage from "@/assets/photos/faq.svg";
import { RequestError } from "@/utils";
import Taro from "@tarojs/taro";

const { data: faqList } = useRequestNext(
  SuitService.getFaq, {
    defaultParams: {
      publisher: "学生事务大厅"
    },
    initialData: [],
    onError: (e) => {
      if (e instanceof RequestError)
        Taro.showToast({ title: `获取信息失败：${e.message}`, icon: "none" });
    }
  }
);

const timeFormat = (time: string) => {
  return dayjs(time).format("YYYY年MM月DD日");
};
</script>

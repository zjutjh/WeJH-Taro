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
            <text>
              {{ faq.publisher }}
              ·
              {{ dayjs(faq.publish_time).format("YYYY年MM月DD日") }}
            </text>
          </view>
        </card>
        <card v-if="!faqList?.length">
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
import { SuitService } from "@/services";
import dayjs from "dayjs";
import { Image as TaroImage } from "@tarojs/components";
import SuitFAQCoverImage from "@/assets/photos/faq.svg";
import Taro from "@tarojs/taro";
import { useQuery } from "@tanstack/vue-query";
import { watchEffect } from "vue";

const { data: faqList, error } = useQuery({
  queryKey: ["suit/faq", "学生事务大厅"],
  queryFn: ({ queryKey }) => SuitService.getFaq({
    publisher: queryKey[1]
  }),
  meta: {
    persist: false
  }
});

watchEffect(() => {
  if (error.value instanceof Error) {
    Taro.showToast({ title: `获取信息失败：${error.value.message}`, icon: "none" });
  }
});
</script>

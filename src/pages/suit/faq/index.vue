<template>
  <theme-config>
    <title-bar title="借用须知" back-button />
    <scroll-view :scrollY="true">
      <view :class="style.header">
        <image src="@/assets/photos/faq.svg"></image>
      </view>

      <view class="flex-column">
          <Card
            v-for="faq in faqList"
            :key="faq.id"
            :title="faq.title"
            style="font-weight: bold;
                 font-size: 22px;"
          >
            <view :class="style.text">
              <text>{{faq.content}}</text>
            </view>
            <view :class="style.footer">
              <text>{{ faq.publisher }} · {{ timeFormat(faq.publish_time) }}</text>
            </view>
          </Card>
        <card v-if="isEmpty">
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
  TitleBar,
  ThemeConfig
} from "@/components";
import {ref} from "vue";
import {useRequest} from "@/hooks";
import {SuitService} from "@/services";
import {SuitFaq} from "@/types/Suit";
import dayjs from "dayjs";

const faqList = ref<SuitFaq[]>([]);
const isEmpty = ref(true);

const {run} = useRequest(SuitService.getFaq, {
  defaultParams: {
    publisher: "学生事务大厅"
  },
  loadingDelay: 300,
  onSuccess: (res) => {
    if(res.data.code === 1) {
      faqList.value = res.data.data;
      isEmpty.value = false;
      console.log(faqList.value);
    }  else throw new Error(res.data.msg);
  },
  onError: (e: Error) => {
    return `获取个人信息失败\r\n${e.message || "网络错误"}`;
  },
});

const timeFormat= (time: string) => {
  return dayjs(time).format("YYYY年MM月DD日");
};
</script>

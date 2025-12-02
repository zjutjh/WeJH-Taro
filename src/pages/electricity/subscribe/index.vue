<template>
  <theme-config>
    <title-bar title="寝室电量查询" :back-button="true" />
    <view class="flex-column">
      <card title="订阅消息说明">
        <text>
          我们订阅低电提醒消息后， 当您所选的房间剩余电量低于20度时，
          我们将第一时间通过微信服务通知向你提醒。
          由于微信系统限制，您的订阅数量将与你收到的通知数量相同，
          每次收到通知都将减少一条订阅条数， 请多次点击订阅按钮以获得更多通知。(莫干山校区暂不支持)
        </text>
        <template #footer>
          <text :class="styles['card-footer']">
            如无法订阅，请检查小程序设置 - 订阅消息 - 接收订阅消息
          </text>
        </template>
      </card>

      <view :class="styles.action" @tap="handleSubscribe">
        <w-button size="large" shape="rounded"> 点击订阅 </w-button>
      </view>
    </view>
  </theme-config>
</template>

<script lang="ts" setup>
import { useMutation } from "@tanstack/vue-query";
import Taro from "@tarojs/taro";

import { Card, ThemeConfig, TitleBar, WButton } from "@/components";
import { electricityServiceNext } from "@/services";
import { requestMpSubscribe } from "@/utils/subscribe";

import styles from "./index.module.scss";

const { mutateAsync } = useMutation({
  mutationFn: () => electricityServiceNext.CreateSubscription(),
  onSuccess: () => Taro.showToast({ title: "订阅成功", icon: "none" }),
  onError: (e) => Taro.showToast({ title: e.message || "订阅失败", icon: "none" })
});

const handleSubscribe = async () => {
  Taro.showLoading({ title: "订阅中", mask: true });
  try {
    await requestMpSubscribe(import.meta.env.VITE_ELECTRICITY_SUBSCRIBE_TEMPLATE_ID);
  } catch {
    Taro.hideLoading();
    return;
  }

  try {
    await mutateAsync();
  } finally {
    Taro.hideLoading();
  }
};
</script>

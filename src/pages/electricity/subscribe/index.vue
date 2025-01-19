<template>
  <theme-config>
    <title-bar title="寝室电量查询" back-button />
    <view class="flex-column">
      <card title="订阅消息说明">
        <text>
          我们订阅低电提醒消息后，
          当您所选的房间剩余电量低于20度时，
          我们将第一时间通过微信服务通知向你提醒。
          由于微信系统限制，您的订阅数量将与你收到的通知数量相同，
          每次收到通知都将减少一条订阅条数，
          请多次点击订阅按钮以获得更多通知。(莫干山校区暂不支持)
        </text>
        <template #footer>
          <text :class="styles['card-footer']">
            如无法订阅，请检查小程序设置 - 订阅消息 - 接收订阅消息
          </text>
        </template>
      </card>

      <view :class="styles.action" @tap="subscribe">
        <w-button size="large" shape="rounded">
          点击订阅
        </w-button>
      </view>
    </view>
  </theme-config>
</template>

<script lang="ts" setup>
import { Card, ThemeConfig, TitleBar, WButton } from "@/components";
import { YxyService } from "@/services";
import Taro from "@tarojs/taro";
import styles from "./index.module.scss";

/**
  * 订阅
  * 包含两步
  * 1. 向微信请求订阅
  * 2. 给服务器发请求
  */
const subscribe = async () => {
  const tmpId = import.meta.env.VITE_ELECTRICITY_SUBSCRIBE_TEMPLATE_ID;

  Taro.requestSubscribeMessage({
    tmplIds: [tmpId], // 微信小程序的模板 id
    entityIds: [], // 支付宝小程序的模板 id，这里为了类型正确，声明一个空数组，实际消费不到
    success: async res => {
      if (res[tmpId] === "accept") {
        try {
          const res = await YxyService.queryElectricitySubscription();
          if (res.data.code === 1) {
            Taro.showToast({
              title: "订阅成功",
              icon: "none"
            });
          } else {
            throw new Error(res.data.msg);
          }
        } catch (e) {
          Taro.showToast({
            title: e?.message || "订阅失败",
            icon: "none"
          });
        }
      }
    }
  });
};

</script>

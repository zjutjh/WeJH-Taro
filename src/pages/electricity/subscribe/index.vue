<template>
  <theme-config>
    <title-bar title="寝室电费查询" back-button />
    <view class="flex-column">
      <card title="订阅消息说明">
        <text>
          我们订阅低电提醒消息后，
          当您所选的房间剩余电量低于20度时，
          我们将第一时间通过微信服务通知向你提醒。
          由于微信系统限制，您的订阅数量将与你收到的通知数量相同，
          每次收到通知都将减少一条订阅条数，
          请多次点击订阅按钮以获得更多通知。
        </text>
        <template #footer>
          <text :class="styles['card-footer']">
            如无法订阅，请检查小程序设置 - 订阅消息 - 接收订阅消息
          </text>
        </template>
      </card>

      <view :class="styles.action" @tap="subscribe">
        <w-button :disable="isPending" size="large" shape="rounded">
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
import { useMutation } from "@tanstack/vue-query";

/**
  * 订阅包含两步
  * 1. 向微信请求订阅
  * 2. 给服务器发请求
  */
async function subscribeImpl() {
  const tmplId = import.meta.env.VITE_ELECTRICITY_SUBSCRIBE_TEMPLATE_ID;

  // @ts-expect-error 少了个 entityIds，这是支付宝小程序的模板 id，实际消费不到
  const wxResponse = await Taro.requestSubscribeMessage({ tmplIds: [tmplId] });
  if (wxResponse[tmplId] === "accept") {
    return YxyService.queryElectricitySubscription();
  }
  throw new Error("订阅失败");
};

const { isPending, mutate: subscribe } = useMutation({
  mutationFn: subscribeImpl,
  onSuccess: () => {
    Taro.showToast({ title: "订阅成功", icon: "success" });
  },
  onError: (e) => {
    // TODO: 上报失败原因
    if ("errMsg" in e) {
      throw new Error(e.errMsg);
    } else if (e instanceof Error) {
      Taro.showToast({ title: e.message, icon: "none" });
    }
  }
});

</script>

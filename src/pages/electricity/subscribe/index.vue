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

      <view :class="styles.action" @tap="handleTapSubscribe">
        <w-button :disable="loading" size="large" shape="rounded">
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
import { RequestError } from "@/utils";
import { useRequestNext } from "@/hooks";

/**
  * 订阅包含两步
  * 1. 向微信请求订阅
  * 2. 给服务器发请求
  */
async function subscribeImpl() {
  const tmplId = import.meta.env.VITE_ELECTRICITY_SUBSCRIBE_TEMPLATE_ID;

  try {
    // @ts-expect-error 少了个 entityIds，这是支付宝小程序的模板 id，实际消费不到
    const wxResponse = await Taro.requestSubscribeMessage({ tmplIds: [tmplId] });
    if (wxResponse[tmplId] === "accept") {
      await YxyService.queryElectricitySubscription();
      Taro.showToast({ title: "订阅成功", icon: "none" });
    }
  } catch (e) {
    console.error(e);
    if (e instanceof RequestError) throw e;
    if (e.errMsg) throw new Error(e.errMsg);
  }
};

const { loading, run: subscribe } = useRequestNext(subscribeImpl, {
  manual: true,
  initialData: undefined,
  onError: (e) => {
    if (e instanceof RequestError) {
      Taro.showToast({ title: `订阅异常: ${e.message}`, icon: "none" });
    } else if (e instanceof Error) {
      Taro.showToast({ title: `客户端异常: ${e.message}`, icon: "none" });
    }
  }
});

function handleTapSubscribe() {
  if (loading.value) return;
  subscribe();
}

</script>

<template>
  <view class="background">
    <title-bar title="寝室电费查询" back-button></title-bar>
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

      <view :class="styles.action" @tap="handleClickSubscribe">
        <w-button size="large" shape="rounded">点击订阅</w-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { TitleBar, Card, WButton } from "@/components";
import { YxyService } from "@/services";
import Taro from "@tarojs/taro";
import styles from "./index.module.scss";


const handleClickSubscribe = () => {
  const tmpId = process.env.ELECTRICITY_SUBSCRIBE_TEMPLID;

  Taro.requestSubscribeMessage({
    tmplIds: [tmpId],
    success: res => {
      if (res[tmpId] === "accept") {
        YxyService.queryElectricitySubscription();
      }
    }
  });

};

</script>>


<template>
  <theme-config>
    <title-bar title="校车" back-button />
    <view class="schoolbus-title-bar">
      <view class="bus-btn bus-info">
        <view class="iconfont icon-schoolbus"/>
        <view class="description">
          班车信息
        </view>
      </view>
      <view class="bus-btn bus-ticket">
        <view class="iconfont icon-chepiao"/>
        <view class="description">
          已约车票
        </view>
      </view>
      <view class="bus-btn bus-record">
        <view class="iconfont icon-a-lishijilubiaodanjishi"/>
        <view class="description">
          乘车记录
        </view>
      </view>
    </view>
  </theme-config>
</template>

<script setup lang="ts">
import { ThemeConfig, TitleBar } from "@/components";
import "./index.scss";
// import Taro from "@tarojs/taro";

// const busInfo = () => {
//   Taro.navigateTo({
//     url: "/pages/schoolbus/info/index"
//   });
// };

// const busTicket = () => {
//   Taro.navigateTo({
//     url: "/pages/schoolbus/ticket/index"
//   });
// };

// const busRecord = () => {
//   Taro.navigateTo({
//     url: "/pages/schoolbus/record/index"
//   });
// };
</script>
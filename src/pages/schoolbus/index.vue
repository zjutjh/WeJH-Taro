<template>
  <theme-config>
    <title-bar title="校车" back-button />
    <scroll-view :scroll-y="true">
      <view class="header-view">
        <image src="@/assets/photos/suit.svg" />
        <view class="extra" @tap="showHelp">
          <view class="icon-wrapper">
            <view class="extra-icon iconfont icon-announcement" />
          </view>
          <view class="label">
            公告
          </view>
        </view>
      </view>

      <view class="flex-column">
        <w-list @tap="busInfo">
          <w-list-item arrow="right" class="suit-list-item">
            <view class="text-wrapper">
              <text>班车信息</text>
            </view>
          </w-list-item>
        </w-list>
        <w-list @tap="busTicket">
          <w-list-item arrow="right" class="suit-list-item">
            <view class="text-wrapper">
              <text>已约车票</text>
            </view>
          </w-list-item>
        </w-list>
        <w-list @tap="busRecord">
          <w-list-item arrow="right" class="suit-list-item">
            <view class="text-wrapper">
              <text>乘车记录</text>
            </view>
          </w-list-item>
        </w-list>
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import { ThemeConfig, TitleBar, WList, WListItem } from "@/components";
import "./index.scss";

const busInfo = () => {
  Taro.navigateTo({
    url: "/pages/schoolbus/info/index"
  });
};

const busTicket = () => {
  Taro.navigateTo({
    url: "/pages/schoolbus/ticket/index"
  });
};

const busRecord = () => {
  Taro.navigateTo({
    url: "/pages/schoolbus/record/index"
  });
};
</script>
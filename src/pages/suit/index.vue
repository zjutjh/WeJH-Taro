<template>
  <theme-config>
    <title-bar title="正装借用" back-button />
    <scroll-view :scrollY="true">
      <view class="header-view">
        <image src="@/assets/photos/suit.svg"></image>
      </view>

      <view class="flex-column">
        <w-list @tap="nav2faq">
          <w-list-item arrow="right" class="suit-list-item">
            <view class="text-wrapper">
              <text>借用须知</text>
            </view>
          </w-list-item>
        </w-list>

        <w-list @tap="nav2apply">
          <w-list-item arrow="right" class="suit-list-item">
            <view class="text-wrapper">
              <text>查看正装/借用正装</text>
            </view>
          </w-list-item>
        </w-list>

        <w-list @tap="nav2myapply">
          <w-list-item arrow="right" class="suit-list-item">
            <view class="text-wrapper">
              <text>我的申请</text>
            </view>
          </w-list-item>
        </w-list>

        <w-list @tap="nav2information">
          <w-list-item arrow="right" class="suit-list-item">
            <view class="text-wrapper">
              <text>我的信息</text>
            </view>
          </w-list-item>
        </w-list>
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";
import {
  TitleBar,
  WList,
  WListItem,
  ThemeConfig
} from "@/components";
import Taro from "@tarojs/taro";

function nav2faq() {
  Taro.navigateTo({
    url: "/pages/suit/faq/index"
  });
}

function nav2apply() {
  Taro.navigateTo({
    url: "/pages/suit/apply/index"
  });
}

function nav2myapply() {
  Taro.navigateTo({
    url: "/pages/suit/myapply/index"
  });
}

function nav2information() {
  Taro.navigateTo({
    url: "/pages/suit/information/index"
  });
}
</script>

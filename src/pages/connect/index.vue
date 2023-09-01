<template>
  <theme-config class="connect-view">
    <title-bar title="反馈" back-button />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card>
          <template #header>
            <view>反馈和帮助</view>
          </template>
          <w-list inner>
            <w-list-item>
              <image
                :src="require('@/assets/photos/feedback.svg')"
                style="margin: 8px 0; width: 100%"
              />
            </w-list-item>
            <w-list-item @tap="nav2FAQ">
              常见问题
            </w-list-item>
            <w-list-item @tap="showGroups">
              加群反馈
            </w-list-item>
          </w-list>
        </card>
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { WList, WListItem, Card, TitleBar, ThemeConfig } from "@/components";
import "./index.scss";

const groupInfo = [
  { name: "三群", id: "721519763" }
];

function nav2FAQ() {
  Taro.navigateTo({
    url: "/pages/connect/faq/index"
  });
}

function showGroups() {
  Taro.showActionSheet({
    itemList: groupInfo.map((item) => `${item.name}(${item.id})`),
    success: ({ tapIndex }) => {
      Taro.setClipboardData({
        data: groupInfo[tapIndex].id
      });
    }
  });
}
</script>

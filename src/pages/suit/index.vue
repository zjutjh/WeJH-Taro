<template>
  <theme-config>
    <title-bar title="正装借用" back-button />
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
    <w-modal v-model:show="showModal" title="公告" :content="`&emsp;&emsp;${showContent}`" />

    <contact-me @show-help="setHelp" />
    <w-modal v-model:show="isShowHelp" :content="`&emsp;&emsp;${helpContent}`" />
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";
import {
  ThemeConfig,
  TitleBar,
  WList,
  WListItem, WModal
} from "@/components";
import Taro from "@tarojs/taro";
import { ref } from "vue";
import { helpText } from "@/constants/copywriting";
import ContactMe from "./ContactMe/index.vue";

const showModal = ref(false);
const showContent = helpText.suit.main;

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
    url: "/pages/suit/myapplication/index"
  });
}

function nav2information() {
  Taro.navigateTo({
    url: "/pages/suit/information/index"
  });
}

function showHelp() {
  showModal.value = true;
}

const isShowHelp = ref(false);
const helpContent = helpText.suit.help;

const setHelp = () => {
  isShowHelp.value = true;
};
</script>

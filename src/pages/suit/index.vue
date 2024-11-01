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

    <contact-me :data="contactMsg.data" :message="contactMsg.message" @show-help="setHelp" />
    <w-modal v-model:show="isShowHelp" :content="`&emsp;&emsp;${helpContent}`" />
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";
import {
  ContactMe,
  ThemeConfig,
  TitleBar,
  WList,
  WListItem, WModal
} from "@/components";
import Taro from "@tarojs/taro";
import { ref } from "vue";
import { helpText } from "@/constants/copywriting";

const showModal = ref(false);
const showContent = helpText.suit.main;

const contactMsg = {
  data: [
    {
      content: "学生事务大厅-朝晖: 综合楼一楼河畔旁",
      extra: "学生事务大厅-朝晖\r\n电话: 88320868"
    },
    {
      content: "学生事务大厅-屏峰: 西4和东15楼下",
      extra: "学生事务大厅-屏峰\r\n东15电话: 85290858\r\n西4电话:85290880"
    },
    {
      content: "学生事务大厅-莫干山: 德8德9连廊",
      extra: "学生事务大厅-莫干山\r\n电话: (0571) 8881 3551"
    }
  ],
  message: "点击查看学生事务大厅的联系方式"
};

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

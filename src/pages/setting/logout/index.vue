<template>
  <theme-config>
    <title-bar title="注销" back-button />
    <scroll-view :scroll-y="true">
      <view :class="styles.container">
        <card title="注销" :class="styles['input-card']">
          <text>身份证号码</text>
          <view>
            <input v-model="iid" placeholder="请输入身份证号码" />
          </view>
          <text>学号</text>
          <view>
            <input v-model="stuid" password placeholder="请输入学号" />
          </view>
          <template #footer>
            <w-button block @tap="isShowConfirm = true"> 确认注销 </w-button>
          </template>
        </card>
        <card title="温馨提示">
          <text :class="styles.warn">
            {{ DELETE_USER_CARD_CONTENT }}
          </text>
        </card>
      </view>
      <w-modal
        v-model:show="isShowConfirm"
        title="警告"
        :content="DELETE_USER_CONFIRM_CONTENT"
        :actions="{
          cancel: {
            label: '取消',
            callback: onCancel
          },
          confirm: {
            label: '确定',
            callback: handleTapLogout
          }
        }"
      />
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { ref } from "vue";

import { Card, ThemeConfig, TitleBar, WButton, WModal } from "@/components";
import { userServiceNext } from "@/services";
import RequestError from "@/utils/request-error";

import { DELETE_USER_CARD_CONTENT, DELETE_USER_CONFIRM_CONTENT } from "./constants";
import styles from "./index.module.scss";

const iid = ref("");
const stuid = ref("");
const isShowConfirm = ref(false);

const handleTapLogout = async () => {
  isShowConfirm.value = false;
  Taro.showLoading({ title: "正在注销", mask: true });

  try {
    await userServiceNext.DeleteUser({
      iid: iid.value,
      stuid: stuid.value
    });

    Taro.showToast({ title: "注销成功" });
    Taro.clearStorageSync();
    setTimeout(() => {
      // @see https://developers.weixin.qq.com/miniprogram/dev/api/navigate/wx.restartMiniProgram.html
      // @ts-expect-error Taro 下面没有定义 restartMiniProgram
      wx.restartMiniProgram({ path: "/pages/index/index" });
    }, 1000);
  } catch (e: unknown) {
    if (!(e instanceof RequestError)) {
      Taro.showToast({ icon: "none", title: "网络错误" });
      return;
    }
    Taro.showToast({ icon: "none", title: e.message });
  }
};

const onCancel = () => {
  isShowConfirm.value = false;
};
</script>

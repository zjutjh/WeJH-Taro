<template>
  <theme-config>
    <title-bar title="注销" back-button />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card title="注销" class="input-card">
          <text>身份证号码</text>
          <view>
            <input v-model="iid" password placeholder="请输入您的身份证号码">
          </view>
          <text>学号</text>
          <view>
            <input v-model="stuid" password placeholder="请输入您的学号">
          </view>
          <template #footer>
            <w-button block @tap="isShowConfirm = true">
              确认注销
            </w-button>
          </template>
        </card>
        <card title="温馨提示">
          <view class="warn">
            {{ helpText.logout.main }}
          </view>
        </card>
      </view>
      <w-modal
        v-model:show="isShowConfirm"
        title="警告"
        :content="`&emsp;&emsp;${helpText.logout.check}`"
        :actions="{
          cancel: {
            label: '取消',
            callback: onCancel
          },
          confirm: {
            label: '确定',
            callback: logoutClick
          }
        }"
      />
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Card, ThemeConfig, TitleBar, WButton, WModal } from "@/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import { UserService } from "@/services";
import { useRequest } from "@/hooks";
import { helpText } from "@/constants/copywriting";
import store from "@/store";

const iid = ref("");
const stuid = ref("");
const isShowConfirm = ref(false);

const logoutClick = () => {
  isShowConfirm.value = false;
  Taro.showLoading({
    title: "正在注销中",
    mask: true
  });
  run({
    iid: iid.value,
    stuid: stuid.value
  });
};

const { run } = useRequest(
  UserService.logout, {
    loadingDelay: 600,
    onSuccess: (res) => {
      if (res.data.code === 1 && res.data.msg === "OK") {
        Taro.showToast({
          icon: "success",
          title: "注销成功"
        });
        store.commit("clearSession");
        store.commit("clearUserInfo");
        setTimeout(nav2Home, 2000);
      } else if (res.data.code === 200511) {
        Taro.showToast({
          icon: "none",
          title: "密码长度必须在6~20位之间!"
        });
      } else if (res.data.code === 200510) {
        Taro.showToast({
          icon: "none",
          title: "该学号或身份证不存在或者不匹配，请重新输入!"
        });
      } else if (res.data.code === 200513) {
        Taro.showToast({
          icon: "none",
          title: "学号格式不正确，请重新输入!"
        });
      }
    },
    onError: (e: Error) => {
      return `失败\r\n${e.message || "网络错误"}`;
    }
  }
);

const onCancel = () => {
  isShowConfirm.value = false;
};

const nav2Home = () => {
  Taro.navigateTo({
    url: "/pages/index/index"
  });
};
</script>

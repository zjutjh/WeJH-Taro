<template>
  <theme-config>
    <title-bar title="修改密码" back-button />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card title="修改密码" class="input-card">
          <text>身份证号码</text>
          <view>
            <input v-model="iid" placeholder="请输入您的身份证号码">
          </view>
          <text>学号</text>
          <view>
            <input v-model="stuid" placeholder="请输入您的学号">
          </view>
          <text>新密码</text>
          <view>
            <input
              v-model="password"
              type="password"
              placeholder="请输入您的新密码"
              @blur="formCheck"
            >
          </view>
          <text>确认新密码</text>
          <view>
            <input
              v-model="passwordAgain"
              type="password"
              placeholder="请重复输入您的新密码"
              @blur="formCheck"
            >
          </view>
          <text v-if="showWarning" class="red-text">
            {{ warnText }}
          </text>
          <template #footer>
            <w-button block @tap="handleConfirm">
              确认修改
            </w-button>
          </template>
        </card>
      </view>
      <w-modal
        v-model:show="isShowConfirm"
        title="警告"
        :content="`&emsp;&emsp;${helpText.changePassword}`"
        :actions="{
          cancel: {
            label: '取消',
            callback: onCancel
          },
          confirm: {
            label: '确定',
            callback: changePasswordClick
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

const iid = ref("");
const stuid = ref("");
const password = ref("");
const passwordAgain = ref("");
const isShowConfirm = ref(false);
const showWarning = ref(false);
const warnText = ref("");

const formCheck = () => {
  if (password.value === "" || passwordAgain.value === "") return;
  if (password.value.length < 6 || password.value.length > 20) {
    warnText.value = "密码长度必须在6~20位之间";
    showWarning.value = true;
    return;
  }
  if (password.value !== passwordAgain.value) {
    warnText.value = "两次密码输入不一致";
    showWarning.value = true;
    return;
  }
  showWarning.value = false;
};

const handleConfirm = () => {
  formCheck();
  isShowConfirm.value = true;
};
const changePasswordClick = () => {
  isShowConfirm.value = false;
  Taro.showLoading({
    title: "正在修改中",
    mask: true
  });
  run({
    iid: iid.value,
    stuid: stuid.value,
    password: password.value
  });
};

const { run } = useRequest(
  UserService.changePassword, {
    loadingDelay: 600,
    manual: true,
    onSuccess: (res) => {
      if (res.data.code === 1 && res.data.msg === "OK") {
        Taro.showToast({
          icon: "success",
          title: "修改密码成功"
        });
      } else {
        Taro.showToast({
          icon: "none",
          title: res.data.msg
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
</script>

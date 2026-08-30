<template>
  <theme-config>
    <title-bar title="修改密码" :back-button="true" />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card title="修改密码" :class="styles['input-card']">
          <text>身份证号后六位</text>
          <view>
            <input v-model="iid" placeholder="请输入身份证号后六位" />
          </view>
          <text>学号</text>
          <view>
            <input v-model="stuid" placeholder="请输入您的学号" />
          </view>
          <text>新密码</text>
          <view>
            <input
              v-model="password"
              type="password"
              placeholder="请输入您的新密码"
              @blur="formCheck"
            />
          </view>
          <text>确认新密码</text>
          <view>
            <input
              v-model="passwordAgain"
              type="password"
              placeholder="请重复输入您的新密码"
              @blur="formCheck"
            />
          </view>
          <text v-if="showWarning" :class="styles['red-text']">
            {{ warnText }}
          </text>
          <template #footer>
            <w-button :block="true" @tap="handleConfirm">确认修改</w-button>
          </template>
        </card>
      </view>
    </scroll-view>
    <w-modal
      v-model:show="isShowConfirm"
      title="警告"
      :content="`&emsp;&emsp;${helpText.changePassword}`"
      :actions="{
        cancel: { label: '取消', callback: onCancel },
        confirm: { label: '确定', callback: changePasswordClick }
      }"
    />
  </theme-config>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { ref } from "vue";

import { Card, ThemeConfig, TitleBar, WButton, WModal } from "@/components";
import { helpText } from "@/constants/copywriting";
import { useRequest } from "@/hooks";
import { UserService } from "@/services";
import { ServiceErrorCode } from "@/utils/request-error";

import styles from "./index.module.scss";

const iid = ref("");
const stuid = ref("");
const password = ref("");
const passwordAgain = ref("");
const isShowConfirm = ref(false);
const showWarning = ref(false);
const warnText = ref("");

const { run } = useRequest(UserService.changePassword, {
  manual: true,
  onBefore: () => {
    Taro.showLoading({ title: "正在修改中", mask: true });
  },
  onSuccess: (res) => {
    if (res.data.code === ServiceErrorCode.OK) {
      Taro.showToast({ icon: "success", title: "修改密码成功" });
    } else {
      Taro.showToast({ icon: "none", title: res.data.msg });
    }
  },
  onError: (e: Error) => `失败\r\n${e.message || "网络错误"}`,
  onFinally: () => {
    Taro.hideLoading();
  }
});

function formCheck() {
  if (password.value === "" || passwordAgain.value === "") {
    return true;
  }

  if (password.value.length < 6 || password.value.length > 20) {
    warnText.value = "密码长度必须在6~20位之间";
  } else if (password.value !== passwordAgain.value) {
    warnText.value = "两次密码输入不一致";
  }

  showWarning.value = Boolean(warnText.value);
  return !showWarning.value;
}

function handleConfirm() {
  if (!formCheck()) {
    return;
  }
  Taro.hideKeyboard({ complete: () => (isShowConfirm.value = true) });
}

function changePasswordClick() {
  isShowConfirm.value = false;
  run({ iid: iid.value, stuid: stuid.value, password: password.value });
}

function onCancel() {
  isShowConfirm.value = false;
}
</script>

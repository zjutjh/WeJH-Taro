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
              @blur="handleValidateForm"
            >
          </view>
          <text>确认新密码</text>
          <view>
            <input
              v-model="passwordAgain"
              type="password"
              placeholder="请重复输入您的新密码"
              @blur="handleValidateForm"
            >
          </view>
          <text v-if="warningText" class="warning-text">
            {{ warningText }}
          </text>
          <template #footer>
            <w-button block @tap="isShowConfirm = true">
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
            callback: handleSubmit
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
import { helpText } from "@/constants/copywriting";
import { RequestError } from "@/utils";

const iid = ref("");
const stuid = ref("");
const password = ref("");
const passwordAgain = ref("");
const isShowConfirm = ref(false);
const warningText = ref("");

function handleValidateForm() {
  const hasUnfilled = [iid, stuid, password, passwordAgain].some(field => !field.value);
  // 未完成表单情况下，不在 blur 事件中展示 warningText
  if (hasUnfilled) return "请完成表单";

  let reason = "";
  if (password.value.length < 6 || password.value.length > 20) {
    reason = "密码长度必须在 6~20 位之间!";
  } else if (password.value !== passwordAgain.value) {
    reason = "两次密码不一致!";
  }
  warningText.value = reason;
  return reason;
};

async function handleSubmit() {
  const failedReason = handleValidateForm();
  if (failedReason) {
    warningText.value = failedReason;
    return;
  }

  isShowConfirm.value = false;
  Taro.showLoading({ title: "正在修改中", mask: true });

  try {
    await UserService.changePassword({
      iid: iid.value,
      stuid: stuid.value,
      password: password.value
    });
    Taro.showToast({ icon: "success", title: "修改密码成功" });
  } catch (e) {
    if (e instanceof RequestError)
      Taro.showToast({ icon: "none", title: `修改密码失败: ${e.message}` });
  }
}

const onCancel = () => {
  isShowConfirm.value = false;
};
</script>

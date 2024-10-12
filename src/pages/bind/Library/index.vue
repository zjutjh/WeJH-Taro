<script setup lang="ts">
import { Card, WButton, WModal } from "@/components";
import { helpText } from "@/constants/copywriting";
import { UserService } from "@/services";
import Taro from "@tarojs/taro";
import { ref } from "vue";

const libpass = ref("");
const helpContent = helpText.bind.library;
const isShowHelp = ref(false);

async function bindLibClick() {
  const regex = /^[a-zA-Z0-9!@#$%^&*()_+-=,.<>?;:'"{}[\]\\|`~]*$/;
  if (!regex.test(libpass.value)) {
    Taro.showToast({
      title: "输入存在中文字符或其他非法字符,请重新输入！",
      icon: "none"
    });
    return;
  }
  Taro.showLoading({
    title: "正在绑定",
    mask: true
  });
  const res = await UserService.bindLibrary({ password: libpass.value });
  if (res.code === 1) {
    await Taro.showToast({
      icon: "success",
      title: "绑定成功"
    });
  }
}

</script>

<template>
  <card class="bind-card">
    <template #header>
      <text>绑定账号</text>
      <view class="form-help-wrapper">
        <view class="form-help" @tap="() => isShowHelp = !isShowHelp">
          <view class="iconfont icon-help" />
        </view>
      </view>
    </template>
    <text>图书馆账户密码</text>
    <view>
      <input v-model="libpass" password placeholder="默认密码为学号">
    </view>
    <template #footer>
      <w-button block @tap="bindLibClick">
        确认绑定
      </w-button>
    </template>
  </card>
  <w-modal v-model:show="isShowHelp" :content="helpContent" />
</template>

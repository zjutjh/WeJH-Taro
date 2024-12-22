<script setup lang="ts">
import { Card, WButton, WModal } from "@/components";
import { helpText } from "@/constants/copywriting";
import { UserService } from "@/services";
import useHomeCardStore from "@/store/service/homecard";
import { RequestError } from "@/utils";
import Taro from "@tarojs/taro";
import { ref } from "vue";
import useBinding from "@/hooks/useBinding";

const oauthpass = ref("");
const homeCardStore = useHomeCardStore();
const { updateBindState, bindState } = useBinding();
const helpContent = helpText.bind.oauth;
const isShowHelp = ref(false);

async function handleBind() {
  const regex = /^[a-zA-Z0-9!@#$%^&*()_+-=,.<>?;:'"{}[\]\\|`~]*$/;
  if (!regex.test(oauthpass.value)) {
    Taro.showToast({
      title: "输入存在中文字符或其他非法字符,请重新输入！",
      icon: "none"
    });
    return;
  }
  Taro.showLoading({ title: "正在绑定", mask: true });
  try {
    await UserService.bindOauth({ password: oauthpass.value });
    Taro.showToast({ icon: "success", title: "绑定成功" });
    homeCardStore.add("lessons-table-quick-view");
    updateBindState();
  } catch (e) {
    if (e instanceof RequestError) {
      Taro.showToast({ title: e.message, icon: "none" });
    }
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
    <text>统一验证系统</text>
    <view>
      <input
        v-model="oauthpass"
        password
        :placeholder="!bindState.oauth ? '请输入密码' : '*******'"
      >
    </view>
    <template #footer>
      <w-button block @tap="handleBind">
        确认绑定
      </w-button>
    </template>
  </card>
  <w-modal v-model:show="isShowHelp" :content="helpContent" />
</template>

<style scoped>

</style>

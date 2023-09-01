<script setup lang="ts">
import { Card, WButton, WModal } from "@/components";
import { helpText } from "@/constants/copywriting";
import { UserService } from "@/services";
import { serviceStore } from "@/store";
import Taro from "@tarojs/taro";
import { ref, computed } from "vue";

const oauthpass = ref("");
const user = computed(() => serviceStore.user);
const helpContent = helpText.bind.oauth;
const isShowHelp = ref(false);

async function bindOauthClick() {
  Taro.showLoading({
    title: "正在绑定",
    mask: true
  });
  let res = await UserService.bindOauth(
    { password: oauthpass.value }
  );
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
          <view class="iconfont icon-help"></view>
        </view>
      </view>
    </template>
    <text>统一验证系统</text>
    <view>
      <input v-if="!user.isBindOauth" password placeholder="默认密码为zjut+身份证后六位" v-model="oauthpass" />
      <input v-else password placeholder="*******" v-model="oauthpass" />
    </view>
    <template #footer>
      <w-button block @tap="bindOauthClick"> 确认绑定 </w-button>
    </template>
  </card>
  <w-modal :content="helpContent" v-model:show="isShowHelp" />
</template>

<style scoped>

</style>

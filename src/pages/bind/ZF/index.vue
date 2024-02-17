<script setup lang="ts">
import { Card, WButton, WModal } from "@/components";
import { helpText } from "@/constants/copywriting";
import { UserService } from "@/services";
import { serviceStore } from "@/store";
import Taro from "@tarojs/taro";
import { ref, computed } from "vue";

const zfpass = ref("");
const user = computed(() => serviceStore.user);
const helpContent = helpText.suit;
const isShowHelp = ref(false);

async function bindZFClick() {
  Taro.showLoading({
    title: "正在绑定",
    mask: true
  });
  const res = await UserService.bindZF(
    { password: zfpass.value }
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
    <text>正方教务系统</text>
    <view>
      <input v-if="!user.isBindZF" password placeholder="默认密码为zjut+身份证后六位" v-model="zfpass" />
      <input v-else password placeholder="*******" v-model="zfpass" />
    </view>
    <template #footer>
      <w-button block @tap="bindZFClick"> 确认绑定 </w-button>
    </template>
  </card>
  <w-modal :content="helpContent" v-model:show="isShowHelp" />
</template>

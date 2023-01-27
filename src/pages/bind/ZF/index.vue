<script setup lang="ts">
import { Card, WButton, WModal } from "@/components";
import { helpText } from "@/constants/copywriting";
import { UserService } from "@/services";
import { serviceStore } from "@/store";
import Taro from "@tarojs/taro";
import { ref, computed } from "vue";

const zfpass = ref("");
const user = computed(() => serviceStore.user);
const helpContent = helpText.bind.zf;
const isShowHelp = ref(false);

async function bindZFClick() {
  Taro.showLoading({
    title: "正在绑定",
    mask: true
  });
  let res = await UserService.bindZF(
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
  <card title="绑定账号">
    <text>正方教务系统</text>
    <view>
      <input v-if="!user.isBindZF" type="password" placeholder="默认密码为zjut+身份证后六位" v-model="zfpass" />
      <input v-else type="password" placeholder="*******" v-model="zfpass" />
    </view>
    <template #footer>
      <view class="form-help-wrapper">
        <view class="form-help" @tap="() => isShowHelp = !isShowHelp">
          <view class="iconfont icon-help"></view>
          <view>帮助</view>
        </view>
      </view>
      <w-button block @tap="bindZFClick"> 确认绑定 </w-button>
    </template>
  </card>
  <w-modal :content="helpContent" v-model:show="isShowHelp" />
</template>

<style scoped>

</style>

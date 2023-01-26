<script setup lang="ts">
import { Card, WButton } from "@/components";
import { UserService } from "@/services";
import Taro from "@tarojs/taro";
import { ref } from "vue";

const cardpass = ref("");

async function bindCardClick() {
  Taro.showLoading({
    title: "正在绑定",
    mask: true
  });
  let res = await UserService.bindSchoolCard(
    { password: cardpass.value }
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
    <text>校园卡密码</text>
    <view>
      <input type="password" placeholder="默认密码为学号后6位" v-model="cardpass" />
    </view>
    <template #footer>
      <w-button block @tap="bindCardClick"> 确认绑定 </w-button>
    </template>
  </card>
</template>

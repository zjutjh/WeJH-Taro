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
  Taro.showLoading({
    title: "正在绑定",
    mask: true
  });
  let res = await UserService.bindLibrary({ password: libpass.value });
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
    <text>图书馆账户密码</text>
    <view>
      <input type="password" placeholder="默认密码为学号" v-model="libpass" />
    </view>
    <template #footer>
      <view class="form-help-wrapper">
        <view class="form-help" @tap="() => isShowHelp = !isShowHelp">
          <view class="iconfont icon-help"></view>
          <view>帮助</view>
        </view>
      </view>
      <w-button block @tap="bindLibClick"> 确认绑定 </w-button>
    </template>
  </card>
  <w-modal :content="helpContent" v-model:show="isShowHelp" />
</template>

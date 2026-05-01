<script setup lang="ts">
import Taro from "@tarojs/taro";
import { ref } from "vue";

import { Card, WButton, WModal } from "@/components";
import { helpText } from "@/constants/copywriting";
import { useRequest } from "@/hooks";
import { YxyService } from "@/services";
import store, { serviceStore } from "@/store";

const phoneNumber = ref("");
const phoneCode = ref("");

const helpContent = helpText.bind.yxy;
const isShowHelp = ref(false);
const timeCounter = ref(0);

const { run: loginYxyAPI } = useRequest(YxyService.loginYxy, {
  manual: true,
  onBefore: () => {
    Taro.showLoading({
      title: "正在绑定",
      mask: true
    });
  },
  onSuccess: (res) => {
    Taro.hideLoading();
    if (res.data.code !== 1) {
      Taro.showToast({ icon: "none", title: res.data.msg });
    } else {
      Taro.showToast({ icon: "success", title: "绑定成功" });
      if (!serviceStore.homecard.selected.includes("school-card-quick-view")) {
        store.commit("addHomeCardItem", "school-card-quick-view");
      }
      store.commit("setBindYXY", true);
    }
  },
  onError: () => {
    Taro.hideLoading();
  }
});

const { loading: isPhoneCodeLoading, run: sendPhoneCode } = useRequest(
  YxyService.getPhoneCode, {
    manual: true,
    onSuccess: (res) => {
      if (res.data.code === 1) {
        Taro.showToast({ icon: "success", title: "发送成功" });
        timeCounter.value = 60;
        const timer = setInterval(() => {
          timeCounter.value--;
          if (timeCounter.value <= 0) {
            clearInterval(timer);
          }
        }, 1000);
      } else {
        Taro.showToast({ icon: "none", title: res.data.msg });
      }
    },
    onError: (e: unknown) => {
      console.error(e);
      if (e instanceof Error) {
        Taro.showToast({ icon: "none", title: e.message });
      }
    }
  }
);

function handleSendPhoneCode() {
  if (isPhoneCodeLoading.value || timeCounter.value > 0) {
    return;
  }
  sendPhoneCode({
    phoneNum: phoneNumber.value
  });
}

const handleLoginYXY = () => {
  if (phoneCode.value.length && phoneNumber.value.length) {
    loginYxyAPI({
      phoneNum: phoneNumber.value,
      code: phoneCode.value
    });
  } else {
    Taro.showToast({ icon: "none", title: "请输入手机号和手机验证码" });
  }
};

const handleClickTutorial = () => {
  store.commit("setTempUrl", {
    url: "https://mp.weixin.qq.com/s/uFdF37XSznzPMOe_IfjrEQ"
  });
  Taro.navigateTo({
    url: "/pages/webview/index"
  });
};

</script>

<template>
  <card class="bind-card">
    <template #header>
      <text>绑定一卡通账号</text>
      <view class="form-help-wrapper">
        <view class="form-help" @tap="() => isShowHelp = !isShowHelp">
          <view class="iconfont icon-help" />
        </view>
      </view>
    </template>
    <view>
      <view>手机号</view>
      <view style="display: flex; align-items: center; justify-content: space-between;">
        <input v-model="phoneNumber" placeholder="请输入手机号" style="flex:1;margin-right: 15px">
        <w-button
          :disable="isPhoneCodeLoading || timeCounter > 0"
          @tap="handleSendPhoneCode"
        >
          <text v-if="timeCounter === 0">
            获取验证码
          </text>
          <text v-else>
            重新发送({{ timeCounter }})
          </text>
        </w-button>
      </view>
    </view>
    <view>
      <text>手机验证码</text>
      <input v-model="phoneCode" placeholder="请输入手机验证码">
    </view>

    <template #footer>
      <view style="display: flex; flex-direction: column; gap: 8px">
        <text style="color: var(--wjh-color-red-600); font-size: .9rem;">
          请先下载易校园app，注册并绑定浙工大校园卡，之后在此界面用同一手机号接收验证码即可完成绑定
        </text>
        <text
          style="color: var(--wjh-color-blue-600); font-size: .9rem;"
          @tap="handleClickTutorial"
        >
          🔗 如何绑定
        </text>
        <w-button block @tap="handleLoginYXY">
          确认绑定
        </w-button>
      </view>
    </template>
  </card>
  <w-modal v-model:show="isShowHelp" :content="helpContent" />
</template>

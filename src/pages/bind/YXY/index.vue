<script setup lang="ts">
import { Card, WButton, WModal } from "@/components";
import { helpText } from "@/constants/copywriting";
import { YxyService } from "@/services";
import Taro from "@tarojs/taro";
import { onMounted, ref } from "vue";
import { useRequest } from "@/hooks";
import store from "@/store";

const phoneNumber = ref("");
const graphCode = ref("");
const phoneCode = ref("");

const helpContent = helpText.bind.yxy;
const isShowHelp = ref(false);
const timeCounter = ref(0);

//  获取图形验证码
const {
  run: getGraphAPI,
  data: imageResponse,
  loading: imageLoading,
  error: imageError
} = useRequest(YxyService.getGraph, {
  manual: true,
});

const {
  run: sendGraphAuthCodeAPI
} = useRequest(YxyService.sendGraphAuthCode, {
  manual: true,
  onSuccess: (res) => {
    if (res.data.code !== 1) {
      Taro.showToast({ title: res.data.msg, icon: "none" });
      getGraphAPI();
    } else {
      Taro.showToast({ title: "已发送验证码", icon: "success" });
      getGraphAPI();
      graphCode.value = "";
      timeCounter.value = 60;
      const timer = setInterval(() => {
        timeCounter.value--;
        if (timeCounter.value === 0)
          clearInterval(timer);
      }, 1000);
    }
  }
});

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
      store.commit("setBindYXY", true);
    }
  },
  onError: () => {
    Taro.hideLoading();
  }
});

/**
 * 验证图形验证码，同时获取手机验证码
 */
const handleSendGraphCode = () => {
  if (timeCounter.value > 0) return;
  if (graphCode.value.length && phoneNumber.value.length)
    sendGraphAuthCodeAPI({
      captcha: graphCode.value,
      phoneNum: phoneNumber.value
    });
  else {
    Taro.showToast({ icon: "none", title: "请输入手机号和图形验证码" });
  }
};

const handleLoginYXY = () => {
  if (phoneCode.value.length && phoneNumber.value.length) {
    loginYxyAPI({
      phoneNum: phoneNumber.value,
      code: phoneCode.value
    });
  }
  else {
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

onMounted(() => {
  getGraphAPI();
});

</script>

<template>
  <card class="bind-card">
    <template #header>
      <text>绑定一卡通账号</text>
      <view class="form-help-wrapper">
        <view class="form-help" @tap="() => isShowHelp = !isShowHelp">
          <view class="iconfont icon-help"></view>
        </view>
      </view>
    </template>
    <view>
      <text>手机号</text>
      <input placeholder="请输入手机号" v-model="phoneNumber" />
    </view>
    <view>
      <text>图片验证码</text>
      <input placeholder="请输入图片验证码" v-model="graphCode" />
    </view>
    <view style="display: flex; justify-content: space-between">
      <view v-if="imageLoading" style="width: 160rpx; height: 60rpx; border: 2rpx solid gray">
        加载中...
      </view>
      <view v-else-if="imageError || imageResponse?.data === ''"
        style="width: 160rpx; height: 60rpx; border: 2rpx solid gray" @tap="getGraphAPI">
        点击重试
      </view>
      <image v-else-if="imageResponse?.data" :src="imageResponse.data.replace(/[\r\n]/g, '')"
        style="width: 160rpx; height: 60rpx" @tap="getGraphAPI" />
      <WButton @tap="handleSendGraphCode" :disable="timeCounter > 0">
        <text v-if="timeCounter === 0"> 获取手机验证码 </text>
        <text v-else> 重新发送({{ timeCounter }})</text>
      </WButton>
    </view>
    <view>
      <text>手机验证码</text>
      <input placeholder="请输入手机验证码" v-model="phoneCode" />
    </view>

    <template #footer>
      <view style="display: flex; flex-direction: column; gap: 8Px">
        <text style="color: var(--wjh-color-red-600); font-size: .9rem;">
          请先下载易校园app，注册并绑定浙工大校园卡，之后在此界面用同一手机号接收验证码即可完成注册
        </text>
        <text style="color: var(--wjh-color-red-600); font-size: .9rem;">
          tips:验证码获取存在一定的不稳定性，如果无法获取成功，请再不同时间段进行尝试
        </text>
        <text style="color: var(--wjh-color-blue-600); font-size: .9rem;" @tap="handleClickTutorial">
          🔗 如何绑定
        </text>
        <w-button block @tap="handleLoginYXY">确认绑定</w-button>
      </view>
    </template>
  </card>
  <w-modal :content="helpContent" v-model:show="isShowHelp" />
</template>

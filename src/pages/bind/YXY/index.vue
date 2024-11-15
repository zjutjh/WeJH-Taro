<script setup lang="ts">
import { Card, WButton, WModal } from "@/components";
import { helpText } from "@/constants/copywriting";
import { YxyService } from "@/services";
import Taro from "@tarojs/taro";
import { ref } from "vue";
import { useRequestNext } from "@/hooks";
import { RequestError } from "@/utils";
import useUserStore from "@/store/service/user";
import useHomeCardStore from "@/store/service/homecard";
import useWebview from "@/hooks/useWebview";
import { Image as TaroImage } from "@tarojs/components";
import useCountdown from "@/hooks/useCountdown";

const { updateBindState } = useUserStore();
const homeCardStore = useHomeCardStore();
const { open } = useWebview();

const phoneNumber = ref("");
const graphCode = ref("");
const phoneCode = ref("");

const helpContent = helpText.bind.yxy;
const isShowHelp = ref(false);
const { countdown: captchaCD, start: refreshCaptchaCD } = useCountdown(10);

const {
  run: fetchCaptcha,
  data: captchaBase64,
  loading: captchaLoading,
  error: captchaError
} = useRequestNext(YxyService.getGraph, {
  initialData: ""
});

/**
 * 验证图形验证码，同时获取手机验证码
 */
const handleValidateCaptcha = async () => {
  if (graphCode.value.length && phoneNumber.value.length) {
    try {
      await YxyService.sendGraphAuthCode({
        captcha: graphCode.value,
        phoneNum: phoneNumber.value
      });
      Taro.showToast({ title: "已发送验证码", icon: "success" });
      fetchCaptcha();
      graphCode.value = "";
      refreshCaptchaCD();
    } catch (e) {
      if (e instanceof RequestError) {
        Taro.showToast({ title: e.message, icon: "none" });
        fetchCaptcha(); // 验证失败，刷新验证码图片
      }
    }
  } else {
    Taro.showToast({ icon: "none", title: "请输入手机号和图形验证码" });
  }
};

const handleBind = async () => {
  if (!phoneCode.value.length || !phoneNumber.value.length) {
    Taro.showToast({ icon: "none", title: "请输入手机号和手机验证码" });
    return;
  }
  Taro.showLoading({ title: "正在绑定", mask: true });
  try {
    await YxyService.loginYxy({ phoneNum: phoneNumber.value, code: phoneCode.value });
    Taro.showToast({ icon: "success", title: "绑定成功" });
    homeCardStore.add("school-card-quick-view");
    updateBindState("yxy", true);
  } catch (e) {
    if (e instanceof RequestError) {
      Taro.showToast({ icon: "none", title: e.message });
    }
  }
};

const handleClickTutorial = () => {
  open("https://mp.weixin.qq.com/s/uFdF37XSznzPMOe_IfjrEQ");
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
      <text>手机号</text>
      <input v-model="phoneNumber" placeholder="请输入手机号">
    </view>
    <view>
      <text>图片验证码</text>
      <input v-model="graphCode" placeholder="请输入图片验证码">
    </view>
    <view style="display: flex; justify-content: space-between">
      <view
        v-if="captchaLoading"
        style="width: 160rpx; height: 60rpx; border: 2rpx solid gray"
      >
        加载中...
      </view>
      <view
        v-else-if="captchaError || captchaBase64 === ''"
        style="width: 160rpx; height: 60rpx; border: 2rpx solid gray"
        @tap="fetchCaptcha"
      >
        点击重试
      </view>
      <taro-image
        v-else-if="captchaBase64"
        :src="captchaBase64.replace(/[\r\n]/g, '')"
        style="width: 160rpx; height: 60rpx"
        @tap="fetchCaptcha"
      />
      <w-button :disable="captchaCD > 0" @tap="handleValidateCaptcha">
        <text v-if="captchaCD === 0">
          获取手机验证码
        </text>
        <text v-else>
          重新发送({{ captchaCD }})
        </text>
      </w-button>
    </view>
    <view>
      <text>手机验证码</text>
      <input v-model="phoneCode" placeholder="请输入手机验证码">
    </view>

    <template #footer>
      <view style="display: flex; flex-direction: column; gap: 8Px">
        <text style="color: var(--wjh-color-red-600); font-size: .9rem;">
          请先下载易校园app，注册并绑定浙工大校园卡，之后在此界面用同一手机号接收验证码即可完成注册
        </text>
        <text style="color: var(--wjh-color-red-600); font-size: .9rem;">
          tips:验证码获取存在一定的不稳定性，如果无法获取成功，请再不同时间段进行尝试
        </text>
        <text
          style="color: var(--wjh-color-blue-600); font-size: .9rem;"
          @tap="handleClickTutorial"
        >
          🔗 如何绑定
        </text>
        <w-button block @tap="handleBind">
          确认绑定
        </w-button>
      </view>
    </template>
  </card>
  <w-modal v-model:show="isShowHelp" :content="helpContent" />
</template>

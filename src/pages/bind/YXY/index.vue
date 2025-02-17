<script setup lang="ts">
import { Card, WButton, WModal } from "@/components";
import { helpText } from "@/constants/copywriting";
import { YxyService } from "@/services";
import Taro from "@tarojs/taro";
import { ref } from "vue";
import { RequestError } from "@/utils";
import useHomeCardStore from "@/store/service/homecard";
import useWebview from "@/hooks/useWebview";
import useCountdown from "@/hooks/useCountdown";
import useBinding from "@/hooks/useBinding";

const { updateBindState } = useBinding();
const homeCardStore = useHomeCardStore();
const { open } = useWebview();

const phoneNumber = ref("");
const phoneCode = ref("");

const helpContent = helpText.bind.yxy;
const isShowHelp = ref(false);
const { countdown, start: refreshCountdown } = useCountdown(60);

/**
 * 获取手机验证码
 */
const handleSendPhoneCode = async () => {
  if (countdown.value > 0 || !phoneNumber.value.length) return;

  if (!phoneNumber.value.length) {
    Taro.showToast({ icon: "none", title: "请输入手机号" });
  }

  try {
    await YxyService.getPhoneCode({
      phoneNum: phoneNumber.value
    });
    refreshCountdown();
    Taro.showToast({ title: "已发送验证码", icon: "success" });
  } catch (e: unknown) {
    if (e instanceof RequestError) {
      Taro.showToast({ title: e.message, icon: "none" });
    }
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
    updateBindState();
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
      <view style="display: flex; align-items: center; gap: 12Px">
        <input v-model="phoneNumber" placeholder="请输入手机号" style="flex: 1">
        <w-button :disable="countdown > 0" @tap="handleSendPhoneCode">
          <text v-if="countdown === 0">
            获取验证码
          </text>
          <text v-else>
            重新发送({{ countdown }})
          </text>
        </w-button>
      </view>
    </view>
    <view>
      <text>手机验证码</text>
      <input v-model="phoneCode" placeholder="请输入手机验证码">
    </view>

    <template #footer>
      <view style="display: flex; flex-direction: column; gap: 8Px">
        <text style="color: var(--wjh-color-red-600); font-size: .9rem;">
          请先下载易校园app，注册并绑定浙工大校园卡，之后在此界面用同一手机号接收验证码即可完成绑定
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

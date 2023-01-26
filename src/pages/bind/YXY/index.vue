<script setup lang="ts">
import { Card, WButton, WModal } from "@/components";
import { helpText } from "@/constants/copywriting";
import { YxyService } from "@/services";
import Taro from "@tarojs/taro";
import { onMounted, ref } from "vue";
import { useRequest } from "@/hooks";

const phoneNumber = ref("");
const graphCode = ref("");
const phoneCode = ref("");

const helpContent = helpText.bind.yxy;
const isShowHelp = ref(false);

//  获取图形验证码
const {
  run: getGraphAPI,
  data: imageResponse,
  loading: imageLoading
} = useRequest(YxyService.getGraph, {
  manual: true,
});

const {
  run: sendGraphAuthCodeAPI
} = useRequest(YxyService.sendGraphAuthCode, {
  manual: true,
  onSuccess: (res) => {
    if (res.data.code !== 1) {
      Taro.showToast({title: res.data.msg, icon: "none"});
      getGraphAPI();
    } else {
      Taro.showToast({title: "已发送验证码", icon: "success"});
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
    if (res.data.code !== 1) {
      Taro.showToast({icon: "none", title: res.data.msg});
    } else {
      Taro.showToast({icon: "success", title: "绑定成功"});
    }
  },
  onFinally: () => {
    Taro.hideLoading();
  }
});

/**
 * 验证图形验证码，同时获取手机验证码
 */
const handleSendGraphCode = () => {
  if(graphCode.value.length && phoneNumber.value.length)
    sendGraphAuthCodeAPI({
      captcha: graphCode.value,
      phoneNum: phoneNumber.value
    });
  else {
    Taro.showToast({icon: "none", title: "请输入手机号和图形验证码"});
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
    Taro.showToast({icon: "none", title: "请输入手机号和手机验证码"});
  }
};

onMounted(() => {
  getGraphAPI();
});

</script>

<template>
  <card title="绑定一卡通账号">
    <view>
      <text>手机号</text>
      <input placeholder="请输入手机号" v-model="phoneNumber" />
    </view>
    <view>
      <text>图片验证码</text>
      <input placeholder="请输入图片验证码" v-model="graphCode" />
    </view>
    <view style="display: flex; justify-content: space-between">
      <view
        v-if="imageLoading"
        style="width: 160rpx; height: 60rpx; border: 2rpx solid gray"
      >
        加载中...
      </view>
      <image
        v-else-if="imageResponse?.data !== ''"
        :src="imageResponse?.data.replace(/[\r\n]/g, '')"
        style="width: 160rpx; height: 60rpx"
        @tap="getGraphAPI"
      />
      <view
        v-else-if="imageResponse?.data === ''"
        style="width: 160rpx; height: 60rpx; border: 2rpx solid gray"
        @tap="getGraphAPI"
      >
        点击重试
      </view>
      <WButton @tap="handleSendGraphCode">获取手机验证码</WButton>
    </view>
    <view>
      <text>手机验证码</text>
      <input placeholder="请输入手机验证码" v-model="phoneCode" />
    </view>

    <template #footer>
      <view class="form-help-wrapper">
        <view class="form-help" @tap="() => isShowHelp = !isShowHelp">
          <view class="iconfont icon-help"></view>
          <view>帮助</view>
        </view>
      </view>
      <w-button block @tap="handleLoginYXY">确认绑定</w-button>
    </template>
  </card>
  <w-modal :content="helpContent" v-model:show="isShowHelp" />
</template>

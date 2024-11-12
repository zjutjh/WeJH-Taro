<template>
  <theme-config>
    <title-bar title="我的信息" back-button />
    <scroll-view :scroll-y="true">
      <view :class="style.header">
        <taro-image :src="SuitInformationCoverImage" />
      </view>

      <view class="flex-column">
        <card>
          <template #header>
            <text style="color: var(--wjh-color-primary); font-size: larger">
              | 我的信息
            </text>
            <view>
              <view @tap="() => (isShowHelp = !isShowHelp)">
                <view class="iconfont icon-help" />
              </view>
            </view>
          </template>
          <text>学号</text>
          <view>
            <input
              v-model="nowData.student_id"
              disabled
              :class="style.input"
            >
          </view>

          <view :class="style.line">
            <view :class="style.name">
              <text>姓名</text>
              <view>
                <input
                  v-model="inputData.name"
                  :disabled="!change"
                  :class="style.input"
                >
              </view>
            </view>

            <view :class="style.sex">
              <text>性别</text>
              <view>
                <input
                  v-model="inputData.gender"
                  :disabled="!change"
                  :class="style.input"
                  placeholder="男 / 女"
                >
              </view>
            </view>
          </view>
          <text>学院</text>
          <view>
            <input
              v-model="inputData.college"
              :disabled="!change"
              :class="style.input"
              placeholder="如：计算机学院"
            >
          </view>
          <text>寝室</text>
          <view>
            <input
              v-model="inputData.dormitory"
              :disabled="!change"
              :class="style.input"
              placeholder="如：家和东苑1幢101室"
            >
          </view>
          <text>手机号码</text>
          <view>
            <input
              v-model="inputData.contact"
              :disabled="!change"
              :class="style.input"
            >
          </view>
          <template #footer>
            <view v-if="change" :class="style.button">
              <w-button :class="style.button_cancle" @tap="cancel">
                取消
              </w-button>
              <view>&ensp;</view>
              <w-button :class="style.button_save" @tap="save">
                保存
              </w-button>
            </view>
            <w-button v-else-if="!change" block @tap="editor">
              编辑
            </w-button>
          </template>
        </card>
        <w-modal v-model:show="isShowHelp" :content="helpContent" />
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import style from "./index.module.scss";
import { ref } from "vue";
import { Card, ThemeConfig, TitleBar, WButton, WModal } from "@/components";
import { useRequest } from "@/hooks";
import { SuitService } from "@/services";
import Taro from "@tarojs/taro";
import { helpText } from "@/constants/copywriting";
import { Image as TaroImage } from "@tarojs/components";
import SuitInformationCoverImage from "@/assets/photos/suitapply-suitInformation.svg";

const helpContent = helpText.suit.information;
const isShowHelp = ref(false);

const change = ref(true);
const inputData = ref({
  student_id: "",
  name: "",
  gender: "",
  college: "",
  dormitory: "",
  contact: ""
});

const editor = () => {
  change.value = true;
};

useRequest(SuitService.getInformation, {
  onBefore: () => {
    Taro.showLoading({ title: "正在获取个人信息" });
  },
  loadingDelay: 300,
  onSuccess: (res) => {
    if (res.data.code === 1 && res.data.msg === "OK") {
      const responseData = res.data.data;
      Object.assign(nowData.value, responseData);
      Object.assign(inputData.value, nowData.value);
      Taro.showToast({ title: "获取成功" });
      Taro.hideLoading();
      change.value = responseData.id === 0;
    } else throw new Error(res.data.msg);
  },
  onError: (e: Error) => {
    return `获取个人信息失败\r\n${e.message || "网络错误"}`;
  }
});

const nowData = ref({
  student_id: "",
  name: "",
  gender: "",
  college: "",
  dormitory: "",
  contact: ""
});

const save = () => {
  const phoneRegex = /^1\d{10}$/;
  if (!phoneRegex.test(inputData.value.contact)) {
    Taro.showToast({ title: "请输入有效的手机号", icon: "none" });
    return;
  }
  const genderRegex = /^(男|女)$/;
  if (!genderRegex.test(inputData.value.gender)) {
    Taro.showToast({ title: "请输入有效的性别（男/女）", icon: "none" });
    return;
  }
  const hasEmptyString = Object.values(inputData.value).some(
    (value) => typeof value === "string" && value.trim() === ""
  );
  if (hasEmptyString) {
    Taro.showToast({ title: "请填写所有信息", icon: "none" });
    return;
  }
  const { run } = useRequest(SuitService.changeInformation, {
    loadingDelay: 300,
    onSuccess: (res) => {
      if (res.data.code === 1 && res.data.msg === "OK") {
        Taro.showToast({ title: "保存成功" });
      } else throw new Error(res.data.msg);
      Taro.hideLoading();
    },
    onError: (e: Error) => {
      return `编辑个人信息失败\r\n${e.message || "网络错误"}`;
    }
  });
  run(inputData.value);
  change.value = false;
  Object.assign(nowData.value, inputData.value);
};

const cancel = () => {
  change.value = false;
  Object.assign(inputData.value, nowData.value);
};
</script>

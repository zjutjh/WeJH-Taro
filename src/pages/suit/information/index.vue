<template>
  <theme-config>
    <title-bar title="我的信息" :back-button="true" />
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
              v-model="initialData.student_id"
              :disabled="true"
              :class="style.input"
            >
          </view>

          <view :class="style.line">
            <view :class="style.name">
              <text>姓名</text>
              <view>
                <input
                  v-model="inputData.name"
                  :disabled="!isEditing"
                  :class="style.input"
                >
              </view>
            </view>

            <view :class="style.sex">
              <text>性别</text>
              <view>
                <input
                  v-model="inputData.gender"
                  :disabled="!isEditing"
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
              :disabled="!isEditing"
              :class="style.input"
              placeholder="如：计算机学院"
            >
          </view>
          <text>寝室</text>
          <view>
            <input
              v-model="inputData.dormitory"
              :disabled="!isEditing"
              :class="style.input"
              placeholder="如：家和东苑1幢101室"
            >
          </view>
          <text>手机号码</text>
          <view>
            <input
              v-model="inputData.contact"
              :disabled="!isEditing"
              :class="style.input"
            >
          </view>
          <template #footer>
            <view v-if="isEditing" :class="style.button">
              <w-button :class="style.button_cancle" @tap="handleCancel">
                取消
              </w-button>
              <view>&ensp;</view>
              <w-button :class="style.button_save" @tap="handleSubmit">
                保存
              </w-button>
            </view>
            <w-button
              v-else-if="!isEditing"
              :block="true"
              :disable="loading || !!error"
              @tap="handleStartEdit"
            >
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
import { SuitService } from "@/services";
import Taro from "@tarojs/taro";
import { helpText } from "@/constants/copywriting";
import { Image as TaroImage } from "@tarojs/components";
import SuitInformationCoverImage from "@/assets/photos/suitapply-suitInformation.svg";
import { useRequestNext } from "@/hooks";
import { RequestError } from "@/utils";
import { withTaroLoading } from "@/utils/promise";

const helpContent = helpText.suit.information;
const isShowHelp = ref(false);
const isEditing = ref(false);
const inputData = ref({
  student_id: "",
  name: "",
  gender: "",
  college: "",
  dormitory: "",
  contact: ""
});

const handleStartEdit = () => {
  isEditing.value = true;
};

const { error, data: initialData, loading } = useRequestNext(
  withTaroLoading(SuitService.getInformation, { title: "正在获取个人信息", mask: true }),
  {
    initialData: { id: 0, name: "", gender: "", student_id: "", college: "", dormitory: "", contact: "" },
    onSuccess: (data) => {
      inputData.value = { ...data };
      isEditing.value = data.id === 0;
    },
    onError: (e: Error) => {
      if (e instanceof RequestError)
        Taro.showToast({ title: `获取信息失败: ${e.message}`, icon: "none" });
    }
  }
);

async function handleSubmit() {
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

  try {
    Taro.showLoading({ title: "正在保存", mask: true });
    await SuitService.changeInformation(inputData.value);
    Taro.showToast({ title: "保存成功" });
  } catch (e) {
    Taro.showToast({ title: `编辑失败: ${e.message}`, icon: "none" });
  }

  isEditing.value = false;
  Object.assign(initialData.value, inputData.value);
};

const handleCancel = () => {
  isEditing.value = false;
  Object.assign(inputData.value, initialData.value);
};
</script>

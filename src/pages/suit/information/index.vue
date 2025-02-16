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
              v-model="formModel.studentId"
              :disabled="true"
              :class="style.input"
            >
          </view>

          <view :class="style.line">
            <view :class="style.name">
              <text>姓名</text>
              <view>
                <input
                  v-model="formModel.name"
                  :disabled="!isEditing"
                  :class="style.input"
                >
              </view>
            </view>

            <view :class="style.sex">
              <text>性别</text>
              <view>
                <input
                  v-model="formModel.gender"
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
              v-model="formModel.college"
              :disabled="!isEditing"
              :class="style.input"
              placeholder="如：计算机学院"
            >
          </view>
          <text>寝室</text>
          <view>
            <input
              v-model="formModel.dormitory"
              :disabled="!isEditing"
              :class="style.input"
              placeholder="如：家和东苑1幢101室"
            >
          </view>
          <text>手机号码</text>
          <view>
            <input
              v-model="formModel.contact"
              :disabled="!isEditing"
              :class="style.input"
            >
          </view>
          <template #footer>
            <view v-if="isEditing" :class="style.button">
              <w-button :class="style.button_cancel" @tap="handleCancelEdit">
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
              :disable="isFetching || !!error"
              @tap="handleStartEdit"
            >
              编辑
            </w-button>
          </template>
        </card>
        <w-modal v-model:show="isShowHelp" :content="helpText.suit.information" />
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import style from "./index.module.scss";
import { ref, watch, watchEffect } from "vue";
import { Card, ThemeConfig, TitleBar, WButton, WModal } from "@/components";
import { SuitService } from "@/services";
import Taro from "@tarojs/taro";
import { helpText } from "@/constants/copywriting";
import { Image as TaroImage } from "@tarojs/components";
import SuitInformationCoverImage from "@/assets/photos/suitapply-suitInformation.svg";
import { useQuery, useQueryClient } from "@tanstack/vue-query";

interface IFormModel {
  studentId: string;
  name: string;
  gender: string;
  college: string;
  dormitory: string;
  contact: string;
};
const isShowHelp = ref(false);
const isEditing = ref(false);
const queryClient = useQueryClient();

const { data: initialData, isFetching, error } = useQuery({
  queryKey: ["suit/information"],
  queryFn: SuitService.getInformation,
  select: raw => ({
    studentId: raw.student_id,
    name: raw.name,
    gender: raw.gender,
    college: raw.college,
    dormitory: raw.dormitory,
    contact: raw.contact
  }),
  meta: {
    persist: false
  }
});

const formModel = ref<IFormModel>(
  initialData.value ?
    { ...initialData.value }
    : {
      studentId: "",
      name: "",
      gender: "",
      college: "",
      dormitory: "",
      contact: ""
    }
);

const handleStartEdit = () => {
  isEditing.value = true;
};

async function handleSubmit() {
  const phoneRegex = /^1\d{10}$/;
  if (!phoneRegex.test(formModel.value.contact)) {
    Taro.showToast({ title: "请输入有效的手机号", icon: "none" });
    return;
  }
  const genderRegex = /^(男|女)$/;
  if (!genderRegex.test(formModel.value.gender)) {
    Taro.showToast({ title: "请输入有效的性别（男/女）", icon: "none" });
    return;
  }
  const hasEmptyString = Object.values(formModel.value).some(
    (value) => typeof value === "string" && value.trim() === ""
  );
  if (hasEmptyString) {
    Taro.showToast({ title: "请填写所有信息", icon: "none" });
    return;
  }

  try {
    Taro.showLoading({ title: "正在保存", mask: true });
    await SuitService.changeInformation(formModel.value);
    await queryClient.invalidateQueries({
      queryKey: ["suit/information"]
    });
    Taro.showToast({ title: "保存成功" });
  } catch (e) {
    Taro.showToast({ title: `编辑失败: ${e.message}`, icon: "none" });
    if (initialData.value) {
      formModel.value = { ...initialData.value };
    }
  }
  isEditing.value = false;
};

const handleCancelEdit = () => {
  isEditing.value = false;
  if (initialData.value) {
    formModel.value = { ...initialData.value };
  }
};

watch(initialData, newValue => {
  if (newValue) {
    formModel.value = { ...newValue };
  }
});

watchEffect(() => {
  if (error.value instanceof Error) {
    Taro.showToast({ title: `获取信息失败: ${error.value.message}`, icon: "none" });
  }
});
</script>

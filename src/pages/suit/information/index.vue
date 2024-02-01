<template>
  <theme-config>
    <title-bar title="我的信息" back-button />
    <scroll-view :scrollY="true">
      <view :class="style.header">
        <image src="@/assets/photos/suitapply-suitInformation.svg"></image>
      </view>
      <view :class="style.flexColumn">
        <Card title="| 我的信息" style="color: var(--wjh-color-primary)">
          <view :class="style.text1"> 学号 </view>
          <view :class="style.text4">{{ nowData.student_id }}</view>
          <view
            :class="style.text1"
            v-for="(item, index) in information1"
            :key="index"
          >
            {{ item }}
            <input
              v-model="inputData[fieldMapping[item]]"
              :class="style.rounded"
              v-if="change"
            />
            <text v-else style="margin-left: 0.5rem">{{
              nowData[fieldMapping[item]]
            }}</text>
          </view>
          <text v-if="!change" :class="style.conntact_text">{{
            nowData["contact"]
          }}</text>
          <view
            :class="
              change
                ? style.conntact_text1_change
                : style.conntact_text1_nochange
            "
          >
            联系
          </view>
          <view
            :class="
              change
                ? style.conntact_text2_change
                : style.conntact_text2_nochange
            "
          >
            方式
          </view>

          <input
            v-model="inputData['contact']"
            :class="style.rounded2"
            v-if="change"
          />
          <w-button :class="style.button_cancle" @tap="cancel" v-if="change"
            >取消</w-button
          >
          <w-button @tap="save" :class="style.button_safe" v-if="change"
            >保存</w-button
          >
          <w-button @tap="editor" :class="style.button_editor" v-else
            >编辑</w-button
          >
        </Card>
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import style from "./index.module.scss";
import { ref } from "vue";
import { WButton, Card, ThemeConfig, TitleBar } from "@/components";
import { useRequest } from "@/hooks";
import { suitService } from "@/services";
import Taro from "@tarojs/taro";

const information1 = ["姓名", "性别", "学院", "寝室"];
const change = ref(true);
const inputData = ref({
  name: "",
  gender: "",
  college: "",
  dormitory: "",
  contact: "",
});

const editor = () => {
  change.value = true;
};

useRequest(suitService.getInformation, {
  onBefore: () => {
    Taro.showLoading({ title: "正在获取个人信息" });
  },
  loadingDelay: 300,
  onSuccess: (res) => {
    if (res.data.code === 1 && res.data.msg === "OK") {
      const responseData = res.data.data;
      Object.assign(nowData.value, responseData);
      Object.assign(inputData.value, nowData.value);
      if (res.data.data.code !== 0) {
        change.value = false;
      }
      Taro.showToast({ title: "获取成功" });
      Taro.hideLoading();
    } else throw new Error(res.data.msg);
  },
  onError: (e: Error) => {
    return `获取个人信息失败\r\n${e.message || "网络错误"}`;
  },
});

const nowData = ref({
  student_id: "",
  name: "",
  gender: "",
  college: "",
  dormitory: "",
  contact: "",
});

// 点击保存按钮的处理函数
const save = () => {
  const hasEmptyString = Object.values(inputData.value).some(
    (value) => typeof value === "string" && value.trim() === ""
  );
  if (hasEmptyString) {
    Taro.showToast({ title: "请填写所有信息", icon: "none" });
    return; // 如果任何字符串字段为空，则不进行保存
  }
  const { run } = useRequest(suitService.changeInformation, {
    loadingDelay: 300,
    onSuccess: (res) => {
      if (res.data.code === 1 && res.data.msg === "OK") {
        Taro.showToast({ title: "保存成功" });
      } else throw new Error(res.data.msg);
      Taro.hideLoading();
    },
    onError: (e: Error) => {
      return `编辑个人信息失败\r\n${e.message || "网络错误"}`;
    },
  });
  run(inputData.value);
  change.value = false;
  Object.assign(nowData.value, inputData.value);
};

const cancel = () => {
  change.value = false;
  Object.assign(inputData.value, nowData.value);
};

const fieldMapping = {
  姓名: "name",
  性别: "gender",
  学院: "college",
  寝室: "dormitory",
};
</script>

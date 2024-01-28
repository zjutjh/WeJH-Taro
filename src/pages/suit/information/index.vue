<template>
  <theme-config>
    <title-bar title="我的信息" back-button />
    <scroll-view :scrollY="true">
      <view :class="style.header">
        <image src="@/assets/photos/suitapply-suitInformation.svg"></image>
      </view>
      <view :class="style.flexColumn">
        <Card title="| 我的信息" style="color: var(--wjh-color-primary);">
          <view :class="style.text1" >
            学号
          </view>
          <view :class="style.text1" v-for="(item, index) in information1" :key="index">
            {{ item }}
            <input v-model="inputData[item]" :class="style.rounded" />
          </view>
          <view :class="style.text2" style="margin-top: 4%;">
            联系
          </view>
          <view :class="style.text2" style="margin-bottom: 8%;">
            方式
          </view>
          <input v-model="inputData[4]" :class="style.rounded2"/>
    <w-button :class="style.button_cancle" @click="cancel">取消</w-button>
    <w-button @click="save" :class="style.button_safe">保存</w-button>

        </Card>
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import style from "./index.module.scss";
import { ref } from "vue";
import { WButton, Card, ThemeConfig,TitleBar} from "@/components";

const information1 = [ "姓名", "性别", "学院", "寝室"];
// 数据对象，用于存储输入框的值
const inputData = ref({
  姓名: "",
  性别: "",
  学院: "",
  寝室: "",
  联系方式:""
});

const oldData = {
  姓名: "",
  性别: "",
  学院: "",
  寝室: "",
  联系方式:""
};

// 点击保存按钮的处理函数
const save = () => {
  // 在这里保存数据，例如将其发送到服务器或进行其他处理
  console.log("保存的数据:", inputData.value);
};

// 点击取消按钮的处理函数
const cancel = () => {
  // 清空数据
  for (const key in inputData.value) {
    inputData.value[key] = "";
  }
};
</script>

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
          <view :class="style.text1" v-for="(item, index) in information1" :key="index" >
            {{ item }}
            <input v-model="inputData[item]" :class="style.rounded" v-if="change"/>
            <text v-else style="margin-left: 0.5rem;">{{ oldData[item] }}</text>
          </view>
          <text v-if="!change" :class="style.conntact_text">{{ oldData['联系方式'] }}</text>
          <view :class="change ? style.conntact_text1_change : style.conntact_text1_nochange">
  联系
</view>
<view :class="change ? style.conntact_text2_change : style.conntact_text2_nochange">
  方式
</view>

          <input v-model="inputData['联系方式']" :class="style.rounded2" v-if="change"/>
    <w-button :class="style.button_cancle" @tap="cancel" v-if=change>取消</w-button>
    <w-button @tap="save" :class="style.button_safe" v-if=change>保存</w-button>
    <w-button @tap="editor" :class="style.button_editor" v-else>编辑</w-button>

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
const change =ref(true);
const inputData = ref({
  姓名: "",
  性别: "",
  学院: "",
  寝室: "",
  联系方式:""
});

const editor = () => {
  change.value = true;
};

const oldData = {
  姓名: "wew",
  性别: "w",
  学院: "sss",
  寝室: "sdf",
  联系方式:"qqqqqqqqq"
};

// 点击保存按钮的处理函数
const save = () => {
  change.value = false;
  console.log("保存的数据:", inputData.value);
};


const cancel = () => {
  change.value = false;
  inputData.value.姓名 = oldData.姓名;
  inputData.value.性别 = oldData.性别;
  inputData.value.学院 = oldData.学院;
  inputData.value.寝室 = oldData.寝室;
  inputData.value.联系方式 = oldData.联系方式;
};
</script>

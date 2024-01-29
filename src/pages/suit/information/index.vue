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
          </view>
          <view :class="style.text2" style="margin-top: 4%;">
            联系
          </view>
          <view :class="style.text2" style="margin-bottom: 8%;">
            方式
          </view>
          <input v-model="inputData[4]" :class="style.rounded2" v-if="change"/>
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
  name: "",
  gender: "",
  college: "",
  dormitory: "",
  conntact:""
});

const editor = () => {
  change.value = true;
};

const oldData = {
  name: "",
  gender: "",
  college: "",
  dormitory: "",
  conntact:""
};

// 点击保存按钮的处理函数
const save = () => {
  change.value = false;
  console.log("保存的数据:", inputData.value);
};


const cancel = () => {
  change.value = false;
  inputData.value.name = oldData.name;
  inputData.value.gender = oldData.gender;
  inputData.value.college = oldData.college;
  inputData.value.gender = oldData.gender;
  inputData.value.conntact = oldData.conntact;
};
</script>

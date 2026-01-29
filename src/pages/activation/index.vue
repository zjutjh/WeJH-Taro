<template>
  <theme-config>
    <title-bar title="通行证激活" :back-button="step === 1 ? true : false" />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card v-if="step === 1" title="账号注册" class="activation-card">
          <view class="activation-form">
            <view>
              <text>学号</text>
              <input v-model="studentId" type="text" placeholder="输入学号" />
              <view v-show="studentId?.length === 0" class="prompt"> 请输入学号 </view>
            </view>
            <view>
              <text>设置密码</text>
              <input v-model="password" type="password" placeholder="请输入密码" />
              <view v-show="password?.length === 0" class="prompt"> 请输入密码 </view>
              <view v-show="password?.length && invalidPassword" class="prompt">
                密码长度应在6～20位之间
              </view>
            </view>
            <view>
              <text>确认密码</text>
              <input v-model="confirmPassword" type="password" placeholder="请再次输入密码" />
              <view
                v-show="confirmPassword !== undefined && confirmPassword != password"
                class="prompt"
              >
                两次密码不匹配
              </view>
            </view>
            <view>
              <text>身份证号</text>
              <input v-model="idCard" type="text" placeholder="仅做验证学生身份用" />
              <view v-show="idCard?.length === 0" class="prompt"> 请输入本人身份证号 </view>
            </view>
            <view>
              <text>邮箱</text>
              <input v-model="email" type="email" placeholder="请输入邮箱地址" />
              <view v-show="email?.length === 0" class="prompt"> 请输入邮箱地址 </view>
            </view>
          </view>
          <template #footer>
            <w-button :block="true" class="active" @tap="activeClick"> 绑定通行证 </w-button>
            <w-steps :total="2" :current="step" />
          </template>
        </card>
        <card v-if="step === 2" title="完成" class="success-card">
          <view class="success">
            <view class="success-content">
              <view class="iconfont icon-success" />
              <view>恭喜你已成功完成注册！</view>
            </view>
          </view>
          <template #footer>
            <w-button :block="true" @tap="nav2bind"> 去绑定校园账号 </w-button>
            <w-steps :total="2" :current="step" />
          </template>
        </card>
        <card v-if="step === 1">
          <text class="activation-help" :user-select="true">
            {{ helpContent }}
          </text>
        </card>
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";

import Taro from "@tarojs/taro";
import { computed, ref } from "vue";

import { Card, ThemeConfig, TitleBar, WButton, WSteps } from "@/components";
import { helpText } from "@/constants/copywriting";
import { UserService } from "@/services";
import store from "@/store";

const studentId = ref<string>("");
const password = ref<string>("");
const confirmPassword = ref<string>("");
const idCard = ref<string>("");
const email = ref<string>("");

const step = ref(1);
const invalidPassword = ref(false);

const helpContent = computed(() => {
  return helpText.accountActivation;
});

async function activeClick() {
  if (!checkForm()) return;
  Taro.showLoading({ title: "正在绑定通行证", mask: true });

  const res = await UserService.createUserApp({
    username: studentId.value.toUpperCase(),
    studentID: studentId.value.toUpperCase(),
    password: password.value,
    idCardNumber: idCard.value.toUpperCase(),
    email: email.value
  });

  if (res) {
    Taro.hideLoading();
    step.value++;
  }
  resetForm();
}

async function nav2bind() {
  Taro.showLoading({
    title: "加载中"
  });
  await Taro.getUserProfile({
    desc: "用于获取头像和昵称",
    success: (res) => {
      const { avatarUrl, nickName } = res.userInfo;
      store.commit("setUserWXProfile", { avatarUrl, nickName });
    }
  });
  Taro.hideLoading();
  await Taro.redirectTo({
    url: "/pages/bind/index"
  });
  await Taro.showToast({
    icon: "none",
    title: "自动导航至绑定页面"
  });
}

function checkPassword() {
  if (!password.value) return false;
  return password.value.length >= 6;
}

function resetForm() {
  if (password.value) {
    invalidPassword.value = !checkPassword();
  } else {
    invalidPassword.value = false;
  }
}

function checkForm() {
  if (
    studentId.value &&
    password.value &&
    confirmPassword.value === password.value &&
    idCard.value &&
    email.value &&
    checkPassword()
  )
    return true;
  resetForm();
  return false;
}
</script>

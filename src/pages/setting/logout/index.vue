<template>
  <theme-config>
    <title-bar title="注销" back-button />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card title="注销" class="input-card">
          <text>身份证号码</text>
          <view>
            <input v-model="iid" type="password" placeholder="请输入您的身份证号码">
          </view>
          <text>学号</text>
          <view>
            <input v-model="stuid" type="password" placeholder="请输入您的学号">
          </view>
          <template #footer>
            <w-button block @tap="isShowConfirm = true">
              确认注销
            </w-button>
          </template>
        </card>
        <card title="温馨提示">
          <view class="warn">
            {{ helpText.logout.main }}
          </view>
        </card>
      </view>
      <w-modal
        v-model:show="isShowConfirm"
        title="警告"
        :content="`&emsp;&emsp;${helpText.logout.check}`"
        :actions="{
          cancel: {
            label: '取消',
            callback: onCancel
          },
          confirm: {
            label: '确定',
            callback: handleLogout
          }
        }"
      />
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Card, ThemeConfig, TitleBar, WButton, WModal } from "@/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import { helpText } from "@/constants/copywriting";
import { CookieUtils, RequestError } from "@/utils";
import useUser from "@/hooks/user/info";
import { UserService } from "@/services";

const { logout } = useUser();
const iid = ref("");
const stuid = ref("");
const isShowConfirm = ref(false);

async function handleLogout() {
  isShowConfirm.value = false;
  Taro.showLoading({ title: "正在注销中", mask: true });

  try {
    await UserService.logout({ iid: iid.value, stuid: stuid.value });
    Taro.showToast({ icon: "success", title: "注销成功" });
    CookieUtils.clear();
    // TODO: 测试注销
    logout();
    setTimeout(nav2Home, 2000);
  } catch (e) {
    if (e instanceof RequestError)
      Taro.showToast({ icon: "none", title: e.message });
  }
}

const onCancel = () => {
  isShowConfirm.value = false;
};

const nav2Home = () => {
  Taro.navigateTo({
    url: "/pages/index/index"
  });
};
</script>

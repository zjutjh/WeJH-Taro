<template>
  <theme-config>
    <home v-if="pageName === 'home'" />
    <my v-if="pageName === 'my'" />
    <nav-bar :page-name="pageName" @on-change="setPageName" />
    <w-modal
      v-model:show="appVersionStorage.isUpdatedStart"
      :title="updateInfo.title"
      :content="updateInfo.content"
      :actions="updateInfo.actions"
    />
  </theme-config>
</template>

<script setup lang="ts">
import { Home, My, NavBar, ThemeConfig, WModal } from "@/components";
import Taro from "@tarojs/taro";
import { ref } from "vue";
import { updateInfo } from "@/constants/index";
import "./index.scss";
import useAppVersionStore from "@/store/system/appVersion";

// TODO: 用 custcom-bar 拆分逻辑
const pageName = ref("home");
const updateManager = Taro.getUpdateManager();
const appVersionStorage = useAppVersionStore();

updateManager.onUpdateReady(function() {
  Taro.showModal({
    title: "微精弘更新提示",
    content: "新版本已经准备好，是否重启应用？",
    success: function(res) {
      if (res.confirm) {
        updateManager.applyUpdate();
      }
    }
  });
});

const setPageName = (key: string) => {
  pageName.value = key;
};

</script>

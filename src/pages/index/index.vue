<template>
  <theme-config>
    <home v-if="pageName === 'home'" />
    <text>{{ appList }}</text>
    <my v-if="pageName === 'my'" />
    <nav-bar :page-name="pageName" @on-change="setPageName" />
    <w-modal
      v-model:show="showUpdateInfo"
      :title="updateInfo.title"
      :content="updateInfo.content"
      :actions="updateInfo.actions"
    />
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";

import { useQuery } from "@tanstack/vue-query";
import Taro from "@tarojs/taro";
import { ref } from "vue";

import { Home, My, NavBar, ThemeConfig, WModal } from "@/components";
import { updateInfo } from "@/constants/index";
import { SystemService } from "@/services";
import store, { systemStore } from "@/store";

const pageName = ref("home");

const showUpdateInfo = ref(false);

const updateManager = Taro.getUpdateManager();

updateManager.onUpdateReady(function () {
  Taro.showModal({
    title: "微精弘更新提示",
    content: "新版本已经准备好，是否重启应用？",
    success: function (res) {
      if (res.confirm) {
        updateManager.applyUpdate();
      }
    }
  });
});

const setPageName = (key: string) => {
  pageName.value = key;
};

const newVersion = updateInfo.version;
if (newVersion && systemStore.version !== newVersion) {
  store.commit("setVersion", newVersion);
  showUpdateInfo.value = true;
}

const { data: appList } = useQuery({
  queryKey: ["appList"],
  queryFn: SystemService.getAppList,
  select: (data) => JSON.stringify(data)
});
</script>

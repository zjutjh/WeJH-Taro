<template>
  <view class="background">
    <home v-if="pageName === 'home'" />
    <my v-if="pageName === 'my'" />
    <nav-bar @onChange="setPageName" :pageName="pageName" />
  </view>
  <w-modal v-model:show="showUpdateInfo" :title="updateInfo.title" :content="updateInfo.content" />
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar/index.vue";
import Home from "@/components/Home/index.vue";
import My from "@/components/My/index.vue";
import Taro from "@tarojs/taro";
import { WModal } from "@/components/modal";
import { ref } from "vue";
import store, { systemStore } from "@/store";
import { updateInfo } from "@/constants/index";
import "./index.scss";

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

</script>

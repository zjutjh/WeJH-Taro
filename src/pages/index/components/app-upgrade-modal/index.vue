<template>
  <w-modal
    v-model:show="showModal"
    :title="APP_UPGRADE_CONTENT.title"
    :content="APP_UPGRADE_CONTENT.content"
    :actions="APP_UPGRADE_CONTENT.actions"
  />
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { ref } from "vue";

import { WModal } from "@/components";
import store, { systemStore } from "@/store";

import { APP_UPGRADE_CONTENT } from "../../constants";

const showModal = ref(false);

const updateManager = Taro.getUpdateManager();

updateManager.onUpdateReady(function () {
  Taro.showModal({
    title: "微精弘更新提示",
    content: APP_UPGRADE_CONTENT.content,
    success: function (res) {
      if (res.confirm) {
        updateManager.applyUpdate();
      }
    }
  });
});

const nextVersion = APP_UPGRADE_CONTENT.version;
if (nextVersion && systemStore.version !== nextVersion) {
  store.commit("setVersion", nextVersion);
  showModal.value = true;
}
</script>

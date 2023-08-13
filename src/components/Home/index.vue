<template>
  <title-bar title="微精弘" :back-button="false">
    <alarm v-if="isActive" @tap="nav2announcement" :counter="announcementsCounter"></alarm>
  </title-bar>
  <scroll-view :scrollY="true">
    <view class="flex-column" v-if="isActive">
      <questionnaire v-if="isQuestionnaireAccess() && isNeverShowQuestionnaire" />

      <fixed-quick-view />

      <!-- 这里是可选卡片列表 -->
      <cards />

      <card v-if="!(isBindZf || isBindYXY || isBindLibrary)" title="提示">
        还没有绑定任何服务，请到我的页面绑定
      </card>
      <view @tap="showEditPanel" :class="styles[`edit-button`]">
        <view class="iconfont icon-edit" />
      </view>
    </view>
    <view v-else class="flex-column">
      <card title="未激活">
        <w-button block class="active" @tap="nav2activation"> 激活 </w-button>
      </card>
    </view>
  </scroll-view>
  <edit-panel v-model:show="isShowEditPanel" />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import store, { serviceStore, systemStore } from "@/store";
import Alarm from "../Alarm/index.vue";
import WButton from "../Button/index.vue";
import Card from "../Card/index.vue";
import Questionnaire from "../Questionnaire/index.vue";
import TitleBar from "../TitleBar/index.vue";
import Taro from "@tarojs/taro";
import { SystemService } from "@/services";
import { questionnaireInfo } from "@/constants/updateInfo";
import cards from "./cards.vue";
import FixedQuickView from "../FixedQuickView/index.vue";
import EditPanel from "./edit-panel/index.vue";
import styles from "./index.module.scss";
import { onMounted } from "vue";

const questionnairePath = questionnaireInfo.path; // 获取最新的问卷地址

const isShowEditPanel = ref(false);

const showEditPanel = () => {
  isShowEditPanel.value = true;
};

// 检查问卷可访问状态
const isQuestionnaireAccess = () => {
  return questionnaireInfo.isAccess;
};

// 问卷路径有更新，更新状态，并打开问卷入口
if (questionnairePath != systemStore.questionnaire.path) {
  store.commit("setQuestionnaire", {
    path: questionnairePath,
    state: "open",
  });
}

onMounted(async() => {
  SystemService.getAnnouncement();
  SystemService.getInformation();
});

const isActive = computed(() => {
  return serviceStore.user.isActive;
});

const isNeverShowQuestionnaire = computed(() => {
  if (systemStore.questionnaire.state === "close") {
    return false;
  } else return true;
});
const isBindZf = computed(() => {
  return serviceStore.user.isBindZF;
});
const isBindLibrary = computed(() => {
  return serviceStore.user.isBindLibrary;
});
const isBindYXY = computed(() => {
  return serviceStore.user.isBindYXY;
});
const announcementsCounter = computed(() => {
  return serviceStore.announcement.updateCounter + serviceStore.information.updateCounter;
});

function nav2activation() {
  Taro.navigateTo({
    url: "/pages/activation/index",
  });
}

function nav2announcement() {
  store.commit("clearAnnouncementsUpdateCounter");
  Taro.navigateTo({
    url: "/pages/announcement/index",
  });
}
</script>

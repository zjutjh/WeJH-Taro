<template>
  <title-bar title="微精弘" :back-button="false">
    <alarm
      v-if="isActive"
      @tap="nav2announcement"
      :counter="announcementsCounter"
    ></alarm>
  </title-bar>
  <scroll-view :scrollY="true">
    <view class="flex-column" v-if="isActive">
      <questionnaire
        v-if="isQuestionnaireAccess() && isNeverShowQuestionnaire"
      />
      <lessons-table-quick-view
        v-if="isBindZf"
        @show-help="showHelp"
      ></lessons-table-quick-view>
      <school-card-quick-view
        v-if="isBindCard"
        @show-help="showHelp"
      ></school-card-quick-view>
      <library-quick-view v-if="isBindLibrary"></library-quick-view>
      <card v-if="!(isBindZf || isBindCard || isBindLibrary)" title="提示">
        还没有绑定任何服务，请到我的页面绑定
      </card>
    </view>
    <view v-else class="flex-column">
      <card title="未激活">
        <w-button block class="active" @tap="nav2activation"> 激活 </w-button>
      </card>
    </view>
  </scroll-view>
  <w-modal
    v-model:show="isShowHelp"
    :content="`&emsp;&emsp;${helpContent}`"
  ></w-modal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import store, { serviceStore, systemStore } from "@/store";
import Alarm from "../Alarm/index.vue";
import WButton from "../Button/index.vue";
import Card from "../Card/index.vue";
import LibraryQuickView from "../LibraryQuickView/index.vue";
import LessonsTableQuickView from "../LessonsTableQuickView/index.vue";
import Questionnaire from "../Questionnaire/index.vue";
import WModal from "../Modal/index.vue";
import SchoolCardQuickView from "../SchoolCardQuickView/index.vue";
import TitleBar from "../TitleBar/index.vue";
import { helpText } from "@/constants/copywriting";
import Taro from "@tarojs/taro";
import { SystemService } from "@/services";
import { questionnaireInfo } from "@/constants/updateInfo";

const isShowHelp = ref(false);
const helpContent = ref<string | undefined>(undefined);
const questionnairePath = questionnaireInfo.path; // 获取最新的问卷地址

// 检查问卷可访问状态
const isQuestionnaireAccess = () => {
  return questionnaireInfo.isAccess;
};

// 问卷路径有更新，更新状态，并打开问卷入口
if (questionnairePath != systemStore.questionnaire.path) {
  store.commit("setQuestionnaire", {
    path: questionnairePath,
    state: "open"
  });
}

SystemService.getAnnouncement();
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
const isBindCard = computed(() => {
  return serviceStore.user.isBindCard;
});
const isBindLibrary = computed(() => {
  return serviceStore.user.isBindLibrary;
});
const announcementsCounter = computed(() => {
  return serviceStore.announcement.updateCounter;
});

function nav2activation() {
  Taro.navigateTo({
    url: "/pages/activation/index"
  });
}
function nav2announcement() {
  store.commit("clearAnnouncementsUpdateCounter");
  Taro.navigateTo({
    url: "/pages/announcement/index"
  });
}
function showHelp(prop: "lessons-table" | "school-card") {
  isShowHelp.value = true;
  if (prop === "lessons-table") helpContent.value = helpText.lessonsTable;
  else if (prop === "school-card") helpContent.value = helpText.schoolCard;
}
</script>

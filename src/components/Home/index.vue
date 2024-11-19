<template>
  <title-bar
    title="微精弘"
    :back-button="false"
  >
    <alarm
      v-if="isActive"
      :counter="counter"
      @tap="nav2announcement"
    />
  </title-bar>
  <scroll-view :scroll-y="true">
    <view
      v-if="isActive"
      class="flex-column"
    >
      <questionnaire v-if="isQuestionnaireAccess() && isNeverShowQuestionnaire" />

      <fixed-quick-view />

      <!-- 这里是可选卡片列表 -->
      <cards />

      <card
        v-if="!(isBindZf || isBindYXY || isBindLibrary || isBindOauth)"
        title="提示"
      >
        还没有绑定任何服务，请到我的页面绑定
      </card>

      <view
        :class="styles[`edit-button`]"
        @tap="showEditPanel"
      >
        <view
          class="iconfont icon-add"
          style="font-size: 1.15rem; font-weight: normal"
        />
      </view>
    </view>
    <view
      v-else
      class="flex-column"
    >
      <card title="未激活">
        <w-button
          block
          class="active"
          @tap="nav2activation"
        >
          激活
        </w-button>
      </card>
      <card
        v-show="registerTips"
        title="新生提醒"
      >
        <text style="font-size:14.5px">
          {{ registerTips }}
        </text>
      </card>
    </view>
  </scroll-view>
  <edit-panel v-model:show="isShowEditPanel" />
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
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

const questionnairePath = questionnaireInfo.path; // 获取最新的问卷地址

const isShowEditPanel = ref(false);

const registerTips = ref<string>("");

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
    state: "open"
  });
}
onMounted(() => {
  SystemService.getAnnouncement();
  SystemService.getGeneralInfo().then(res => {
    registerTips.value = res.data.registerTips;
  });
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
const isBindOauth = computed(() => {
  return serviceStore.user.isBindOauth;
});
const counter = computed(() => {
  return serviceStore.announcement.updateCounter + serviceStore.information.updateCounter;
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
</script>

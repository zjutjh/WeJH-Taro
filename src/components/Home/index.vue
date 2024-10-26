<template>
  <title-bar
    title="微精弘"
    :back-button="false"
  >
    <alarm
      v-if="userStore.isActive"
      :counter="notificationStore.unreadCount"
      @tap="nav2announcement"
    />
  </title-bar>
  <scroll-view :scroll-y="true">
    <view v-if="userStore.isActive" class="flex-column">
      <questionnaire
        v-if="questionnaireStore.isAccess && questionnaireStore.status !== 'close'"
      />

      <fixed-quick-view />

      <!-- 这里是可选卡片列表 -->
      <cards />

      <card
        v-if="bindZeroServices"
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
          style="font-size: 1.3rem; font-weight: bolder"
        />
      </view>
    </view>
    <view v-else class="flex-column">
      <card title="未激活">
        <w-button block class="active" @tap="nav2activation">
          激活
        </w-button>
      </card>
      <card v-show="registerTips" title="新生提醒">
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
import Alarm from "../Alarm/index.vue";
import WButton from "../Button/index.vue";
import Card from "../Card/index.vue";
import Questionnaire from "../Questionnaire/index.vue";
import TitleBar from "../TitleBar/index.vue";
import Taro from "@tarojs/taro";
import { SystemService } from "@/services";
import cards from "./cards.vue";
import FixedQuickView from "../FixedQuickView/index.vue";
import EditPanel from "./edit-panel/index.vue";
import styles from "./index.module.scss";
import { useNotificationStore, useQuestionnaireStore, useUserStore } from "@/store";

const userStore = useUserStore();
const questionnaireStore = useQuestionnaireStore();
const notificationStore = useNotificationStore();
const isShowEditPanel = ref(false);
const registerTips = ref<string>("");

userStore.getUserData();

const bindZeroServices = computed(() => {
  const bindStateArray = Object.values(userStore.bindState);

  return bindStateArray.every(Boolean);
});

const showEditPanel = () => {
  isShowEditPanel.value = true;
};

onMounted(() => {
  SystemService.getGeneralInfo().then(res => {
    registerTips.value = res.registerTips;
  });
});

function nav2activation() {
  Taro.navigateTo({
    url: "/pages/activation/index"
  });
}

function nav2announcement() {
  notificationStore.unreadCount = 0;
  Taro.navigateTo({
    url: "/pages/announcement/index"
  });
}
</script>

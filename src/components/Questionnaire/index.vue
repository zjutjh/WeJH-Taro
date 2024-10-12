<template>
  <view
    v-if="showQuestionnaire"
    class="questionnaire"
    icon-name="questionnaire"
  >
    <view class="questionnaire-header">
      <view class="questionnaire-title" @tap="openQuestionnaire">
        <view class="iconfont icon-questionnaire" />
        <text>调查问卷</text>
      </view>
      <view class="questionnaire-action">
        <template v-if="!isFold">
          <text @tap="toggleFold(true)">
            折叠
          </text>
        </template>
        <template v-else>
          <text @tap="toggleFold(false)">
            展开
          </text>
          <view
            class="questionnaire-close-icon iconfont icon-close"
            @tap="closeQuesionnaire"
          />
        </template>
      </view>
    </view>
    <view
      class="questionnaire-body"
      :style="!isFold ? undefined : { maxHeight: 0, margin: 0, border: 0 }"
    >
      <view class="default-content" @tap="openQuestionnaire">
        <view>点击卡片参与问卷调查 </view>
        <view>为微精弘的更新迭代提出一份建议吧～</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import "./index.scss";
import Taro from "@tarojs/taro";
import { ref } from "vue";
import store, { systemStore } from "@/store";
import { questionnaireInfo } from "@/constants/updateInfo";

const showQuestionnaire = ref(true);
const isFold = ref(false);
isFold.value = systemStore.questionnaire.state === "fold" ? true : false;

const closeQuesionnaire = () => {
  Taro.showModal({
    content: "您确定要关闭此选项卡吗？",
    cancelText: "仅一次",
    confirmText: "永久关闭",
    success(res) {
      if (res.confirm)
        store.commit("setQuestionnaire", {
          path: systemStore.questionnaire.path,
          state: "close"
        });
      else if (res.cancel) {
        showQuestionnaire.value = false;
      }
    }
  });
};

const toggleFold = (state: boolean) => {
  isFold.value = state;
  store.commit("setQuestionnaire", {
    path: systemStore.questionnaire.path,
    state: state ? "fold" : "open"
  });
};

const openQuestionnaire = () => {
  toggleFold(true);
  Taro.navigateToMiniProgram({
    appId: questionnaireInfo.appId,
    path: questionnaireInfo.path
  });
};

</script>

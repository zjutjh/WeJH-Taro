<template>
  <view
    v-if="showQuestionnaire"
    class="questionnaire"
    icon-name="questionnaire"
  >
    <view class="questionnaire-header">
      <view class="questionnaire-title" @tap="handleOpen">
        <view class="iconfont icon-questionnaire" />
        <text>调查问卷</text>
      </view>
      <view class="questionnaire-action">
        <template v-if="status !== 'fold'">
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
            @tap="handleClose"
          />
        </template>
      </view>
    </view>
    <view
      class="questionnaire-body"
      :style="status != 'fold' ? undefined : { maxHeight: 0, margin: 0, border: 0 }"
    >
      <view class="default-content" @tap="handleOpen">
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
import { questionnaireInfo } from "@/constants/updateInfo";
import useQuestionnaireStore from "@/store/service/questionnaire";
import { storeToRefs } from "pinia";

const { status } = storeToRefs(useQuestionnaireStore());
const showQuestionnaire = ref(true);

function handleClose() {
  Taro.showModal({
    content: "您确定要关闭此选项卡吗？",
    cancelText: "仅一次",
    confirmText: "永久关闭",
    success(res) {
      if (res.confirm) status.value = "close";
      else if (res.cancel) showQuestionnaire.value = false;
    }
  });
};

const toggleFold = (value: boolean) => {
  status.value = value ? "fold" : "open";
};

const handleOpen = async () => {
  await Taro.navigateToMiniProgram({
    appId: questionnaireInfo.appId,
    path: questionnaireInfo.path
  });
  toggleFold(true);
};

</script>

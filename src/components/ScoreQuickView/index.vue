<template>
  <quick-view @tap="nav2Score" title="成绩查询" icon-name="score" class="score-quick-view" help
    @handle-tap-help="handleTapHelp">
    <text class="sub-text">最新成绩 ({{ scoreUpdateTimeString }})</text>
    <view class="default-content" v-if="!todayScoreList || todayScoreList.length === 0 || checkAllRead">
      今日没有出新成绩哦～</view>
    <view v-else>
      <template v-for="(item, index) in todayScoreList" :key="item.lessonID">
        <card class="score-card" :style="{backgroundColor: 'var(--wjh-color-blue-light)'}" v-if="!item.checkRead">
          <view>
            <text class="score-title">{{ item.lessonName }}</text>
          </view>
          <view class="score-res">
            <text v-if="item.scorePeriod">{{item.scorePeriod}}</text>
            <text v-else>期末</text>
            <text>{{ ScoreServiceStore.state.checkReadinStore[index+1].val }}</text>
          </view>
        </card>
      </template>
    </view>
  </quick-view>
</template>

<script setup lang="ts">
import Card from "../Card/index.vue";
import QuickView from "../QuickView/index.vue";
import Taro from "@tarojs/taro";
import { ZFService } from "@/services";
import dayjs from "dayjs";
import { computed,  ref,  Ref,  } from "vue";
import { systemStore } from "@/store";
import { ScoreServiceStore } from "../../store/service/score"
import "./index.scss";
import "../../style/theme.scss";

let timer: Ref<ReturnType<typeof setInterval> | null> = ref(null);

//将帮助提示信息传到Home，点击帮助按钮显示该信息
const emit = defineEmits(["showHelp"]);
function handleTapHelp() {
  emit("showHelp", "score-card");
}

//展示成绩列表
const showSorted = ref(false);
const selectTerm = ref({
  year: systemStore.generalInfo.termYear,
  term: systemStore.generalInfo.term
});

const todayScoreList = computed(() =>
  showSorted.value
    ? [...ZFService.getScoreInfo(selectTerm.value).data].sort((a, b) => {
      let scoreA = a.scorePoint,
        scoreB = b.scorePoint;
      return parseFloat(scoreB) - parseFloat(scoreA);
    })
    : ZFService.getScoreInfo(selectTerm.value).data
);

//最新成绩的更新时间（几天前）
const scoreUpdateTimeString = computed(() => {
  if (!updateTime.value) return "更新失败";
  return dayjs(updateTime.value).fromNow();
});

const  updateTime = computed(() => {
  let updateTime: Date | null = null;
  try {
    updateTime =
      ZFService.getScoreInfo(selectTerm.value)?.updateTime;
    if (updateTime) return updateTime;
    else return undefined;
  } catch (e) {
    return undefined;
  }
});

//检查当前成绩是否全部已读，是返回True，否则返回False

const checkAllRead= computed(() => {
  for(var i in todayScoreList.value) {
    ScoreServiceStore.mutations.setCheckReadinStoreL( ScoreServiceStore.state , todayScoreList.value[i] );
  }
  return ScoreServiceStore.mutations.tryCheckReadinStore( ScoreServiceStore.state );
})

// @tap="nav2Score" 点击卡片，跳转到成绩查询详细页面
function nav2Score() {
  ScoreServiceStore.mutations.changeCheckReadinStore(ScoreServiceStore.state);
  Taro.navigateTo({ url: "/pages/score/index" });
}

</script>

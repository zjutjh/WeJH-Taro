<template>
  <theme-config>
    <title-bar title="考试安排" :back-button="true" />
    <scroll-view :scroll-y="true">
      <view :class="styles.headerView">
        <image src="@/assets/photos/exam.svg" />
        <view :class="styles.extra" @tap="handleAnnouncementTap">
          <view :class="styles.iconWrapper">
            <view :class="[styles.extraIcon, 'iconfont', 'icon-announcement']" />
          </view>
          <view :class="styles.label">公告</view>
        </view>
      </view>
      <view class="flex-column">
        <card v-if="isEmpty(examInfoData)" :class="styles.emptyCard">
          <view>无记录</view>
        </card>
        <template v-else>
          <exam-info-card
            v-for="item in examInfoData"
            :key="`${item.id}-${item.examTime}-${item.lessonPlace}-${item.seatNum}`"
            size="small"
            :data="item"
          />
        </template>
      </view>
    </scroll-view>
    <bottom-panel :class="styles.examBottomPanel">
      <view :class="styles.col" />
      <view :class="styles.col">
        <term-picker
          :year="selectYear"
          :term="selectTerm"
          :selectflag="0"
          @changed="handleTermChange"
        />
      </view>
      <view :class="styles.col">
        <refresh-button :is-refreshing="isExamInfoFetching" @refresh="refreshExamInfoData" />
      </view>
    </bottom-panel>
    <w-modal v-model:show="isAnnouncementVisible" title="公告" :content="helpText.exam" />
  </theme-config>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { isEmpty } from "lodash-es";
import { ref } from "vue";

import {
  BottomPanel,
  Card,
  RefreshButton,
  TermPicker,
  ThemeConfig,
  TitleBar,
  WModal
} from "@/components";
import { helpText } from "@/constants/copywriting";
import { zfServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { systemStore } from "@/store";

import ExamInfoCard from "./_components/exam-info-card/index.vue";
import styles from "./index.module.scss";

/** 所选学年 */
const selectYear = ref(systemStore.generalInfo.termYear);
/** 所选学期 */
const selectTerm = ref(systemStore.generalInfo.term);

// 获取考试安排列表
const {
  data: examInfoData,
  isFetching: isExamInfoFetching,
  refetch: refreshExamInfoData
} = useQuery({
  queryKey: [QUERY_KEY.ZF_EXAM, selectYear, selectTerm] as const,
  queryFn: ({ queryKey }) => zfServiceNext.QueryExamInfo({ year: queryKey[1], term: queryKey[2] })
});

/** 所选学期变更 */
const handleTermChange = (e: { year: string; term: "上" | "下" | "短" }) => {
  selectYear.value = e.year;
  selectTerm.value = e.term;
};

/** 公告弹窗是否可见 */
const isAnnouncementVisible = ref(false);
/** 点击显示公告按钮 */
const handleAnnouncementTap = () => {
  isAnnouncementVisible.value = true;
};
</script>

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
      <view :class="styles.contentView">
        <view v-if="isEmpty(examInfoData)" :class="styles.cardList">
          <card :class="styles.emptyCard">
            <view v-if="isExamInfoFetching">加载中...</view>
            <view v-else>无记录</view>
          </card>
        </view>
        <template v-else>
          <view :class="styles.categoryTitleWrapper">
            <view :class="styles.categoryTag">待考</view>
          </view>
          <view :class="styles.cardList">
            <exam-info-card
              v-for="item in examInfoList.notFinished"
              :key="`${item.id}-${item.examTime}-${item.lessonPlace}-${item.seatNum}`"
              size="small"
              :data="item"
              :now="refNow"
            />
          </view>
          <view :class="styles.divider" />
          <view :class="styles.categoryTitleWrapper">
            <view :class="styles.categoryTag">已考</view>
          </view>
          <view :class="styles.cardList">
            <exam-info-card
              v-for="item in examInfoList.finished"
              :key="`${item.id}-${item.examTime}-${item.lessonPlace}-${item.seatNum}`"
              size="small"
              :data="item"
              :now="refNow"
            />
          </view>
        </template>
      </view>
    </scroll-view>
    <bottom-panel :class="styles.examBottomPanel">
      <view :class="styles.col" />
      <view :class="styles.col">
        <term-picker
          v-model:year="selectedYear"
          v-model:term="selectedTerm"
          :term-year="Number(systemStore.generalInfo.termYear)"
          :selectflag="0"
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
import { useNow } from "@vueuse/core";
import { defaultTo, filter, isEmpty, map, sortBy } from "lodash-es";
import { computed, ref } from "vue";

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
import { ExamInfoExtended } from "@/types/exam";
import { diffTime, parseZfExamTime } from "@/utils";

import ExamInfoCard from "./_components/exam-info-card/index.vue";
import styles from "./index.module.scss";

/** 所选学年 */
const selectedYear = ref(systemStore.generalInfo.termYear);
/** 所选学期 */
const selectedTerm = ref(systemStore.generalInfo.term);

// 获取考试安排列表
const {
  data: examInfoData,
  isFetching: isExamInfoFetching,
  refetch: refreshExamInfoData
} = useQuery({
  queryKey: [QUERY_KEY.ZF_EXAM, selectedYear, selectedTerm] as const,
  queryFn: ({ queryKey }) => zfServiceNext.QueryExamInfo({ year: queryKey[1], term: queryKey[2] })
});

const refNow = useNow({ interval: 1000 * 10 });

/** 划分后的考试安排列表 */
const examInfoList = computed(() => {
  // 字段拓展
  const extendedList: ExamInfoExtended[] = map(examInfoData.value, (exam) => {
    // 解析考试时间
    const { startAt, endAt } = parseZfExamTime(exam.examTime);

    /** 考试开始时间距今 */
    const startAtDiff = diffTime(startAt, {
      baseTime: refNow.value
    });

    return {
      ...exam,
      meta: {
        startAt,
        endAt,
        startAtDiff
      }
    };
  });

  /** 待考列表 */
  let notFinishedList = filter(
    extendedList,
    (exam) => exam.meta.startAtDiff.diffType !== "earlier"
  );
  // 从近到远排序，无效时间排在最后
  notFinishedList = sortBy(notFinishedList, (exam) =>
    defaultTo(exam.meta.startAtDiff.abs.valueOf(), Infinity)
  );

  /** 已考列表 */
  let finishedList = filter(extendedList, (exam) => exam.meta.startAtDiff.diffType === "earlier");
  // 从近到远排序
  finishedList = sortBy(finishedList, (exam) => exam.meta.startAtDiff.abs.valueOf());

  return {
    finished: finishedList,
    notFinished: notFinishedList
  };
});

/** 公告弹窗是否可见 */
const isAnnouncementVisible = ref(false);
/** 点击显示公告按钮 */
const handleAnnouncementTap = () => {
  isAnnouncementVisible.value = true;
};
</script>

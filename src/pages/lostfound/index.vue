<template>
  <theme-config :show-bg-image="false">
    <title-bar title="失物寻物" :back-button="true" />
    <view class="campus-selector">
      <view class="container">
        <view
          v-for="item in campusList"
          :key="item"
          :class="['campus', lastOpenCampus === item ? 'active' : undefined]"
          @tap="handleSelectCampus(item)"
        >
          <text>{{ item }}</text>
        </view>
      </view>
    </view>
    <view class="kind-selector flex-column">
      <view class="scroll-view">
        <text
          v-for="item in mainList"
          :key="item"
          :class="lastOpenMain === item ? 'active' : undefined"
          @tap="handleSelectMain(item)"
        >
          {{ item || "全部" }}
        </text>
      </view>
      <view class="scroll-view">
        <text
          v-for="item in kindList"
          :key="item"
          :class="selectKind === item ? 'active' : undefined"
          @tap="handleSelectKind(item)"
        >
          {{ item || "全部" }}
        </text>
      </view>
    </view>
    <scroll-view
      lower-threshold="100"
      :scroll-y="true"
      class="list-wrapper"
      @scrolltolower="handleScrollToBottom"
    >
      <view class="record-list">
        <preview-card v-for="item in recordList" :key="item.id" :source="item" />
        <w-skeleton v-if="isFetching" :style="{ borderRadius: '8Px' }" />
        <card v-else-if="!recordList?.length"><text>该分类下暂无失物寻物记录</text></card>
      </view>
    </scroll-view>
    <contact-me :data="contactMsg.data" :message="contactMsg.message" @show-help="setHelp" />
    <w-modal v-model:show="isShowHelp" :content="`&emsp;&emsp;${helpContent}`" />
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";

import { useInfiniteQuery, useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import { ref } from "vue";

import { Campus, Main } from "@/api/types/lostfound";
import { Card, ContactMe, ThemeConfig, TitleBar, WSkeleton } from "@/components";
import { helpText } from "@/constants/copywriting";
import { contactMsg } from "@/constants/lostfound";
import { lostfoundServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { useLostfoundStore } from "@/store/service/lostfound";

import WModal from "../../components/Modal/index.vue";
import PreviewCard from "./PreviewCard/index.vue";

const campusList = ref(["屏峰", "朝晖", "莫干山"] as const);
const mainList = ref(["", "失物", "寻物"] as const);
const { lastOpenCampus, lastOpenMain } = storeToRefs(useLostfoundStore());
const selectKind = ref("");
const helpContent = ref(helpText.lostfound);
const isShowHelp = ref(false);

const { data: kindList } = useQuery({
  queryKey: [QUERY_KEY.LOSTFOUND_KIND],
  queryFn: () => lostfoundServiceNext.QueryKindList(),
  select: (res) => ["", ...res.map((item) => item.kind_name)],
  meta: { persist: false }
});

const {
  data: recordList,
  fetchNextPage,
  hasNextPage,
  isFetching
} = useInfiniteQuery({
  queryKey: [QUERY_KEY.LOSTFOUND_RECORD, lastOpenCampus, selectKind, lastOpenMain] as const,
  queryFn: ({ queryKey, pageParam }) =>
    lostfoundServiceNext.QueryLostRecords({
      campus: queryKey[1],
      kind: queryKey[2],
      lost_or_found: queryKey[3],
      page_num: pageParam,
      page_size: 10
    }),
  initialPageParam: 1,
  getNextPageParam: (lastPage, pages) =>
    lastPage.total_page_num > pages.length ? pages.length + 1 : undefined,
  select: (res) => res.pages.map((page) => page.data).flat(1),
  refetchOnMount: "always",
  meta: { persist: false }
});

const handleSelectCampus = (campus: Campus) => (lastOpenCampus.value = campus);
const handleSelectMain = (main: Main) => (lastOpenMain.value = main);
const handleSelectKind = (kind: string) => (selectKind.value = kind);

const handleScrollToBottom = () => {
  if (isFetching.value || !hasNextPage.value) return;
  fetchNextPage();
};

const setHelp = () => (isShowHelp.value = true);
</script>

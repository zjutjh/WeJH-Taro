<template>
  <theme-config :show-bg-image="false">
    <title-bar title="失物寻物" :back-button="true" />
    <view class="campus-selector">
      <view class="container">
        <view
          v-for="{ label, value } in CAMPUS_OPTION_LIST"
          :key="label"
          :class="['campus', lastOpenCampus === value ? 'active' : undefined]"
          @tap="handleSelectCampus(value)"
        >
          <text>{{ label }}</text>
        </view>
      </view>
    </view>
    <view class="kind-selector flex-column">
      <view class="scroll-view">
        <text
          v-for="{ label, value } in LOST_OR_FOUND_OPTION_LIST"
          :key="label"
          :class="lastOpenMain === value ? 'active' : undefined"
          @tap="handleSelectMain(value)"
        >
          {{ label }}
        </text>
      </view>
      <view class="scroll-view">
        <text
          v-for="{ label, value } in kindList"
          :key="label"
          :class="selectedKind === value ? 'active' : undefined"
          @tap="handleSelectKind(value)"
        >
          {{ label }}
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
        <w-skeleton v-if="debouncedLoading" :style="{ borderRadius: '8Px' }" />
        <card v-else-if="!recordList?.length"><text>该分类下暂无失物寻物记录</text></card>
      </view>
    </scroll-view>
    <contact-me :data="CONTACT_ME_DATA" :message="CONTACT_ME_MSG" @show-help="showHelp" />
    <w-modal v-model:show="isShowHelp" :content="`&emsp;&emsp;${helpContent}`" />
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";

import { useInfiniteQuery, useQuery } from "@tanstack/vue-query";
import { refDebounced } from "@vueuse/core";
import { first } from "lodash-es";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

import { CampusOption, LostOrFoundOption } from "@/api/types/lostfound";
import { Card, ContactMe, ThemeConfig, TitleBar, WSkeleton } from "@/components";
import { helpText } from "@/constants/copywriting";
import { CONTACT_ME_DATA, CONTACT_ME_MSG } from "@/constants/lostfound";
import { lostfoundServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import {
  CAMPUS_OPTION_LIST,
  LOST_OR_FOUND_OPTION_LIST,
  Option,
  useLostfoundStore
} from "@/store/service/lostfound";

import WModal from "../../components/Modal/index.vue";
import PreviewCard from "./PreviewCard/index.vue";

const { lastOpenCampus, lastOpenMain } = storeToRefs(useLostfoundStore());

const helpContent = ref(helpText.lostfound);
const isShowHelp = ref(false);

const { data: kindList } = useQuery({
  queryKey: [QUERY_KEY.LOSTFOUND_KIND],
  queryFn: () => lostfoundServiceNext.QueryKindList(),
  select: (res): Option[] => [
    { label: "全部", value: "" },
    ...res.map((item): Option => ({ label: item.kind_name, value: item.kind_name }))
  ]
});

const selectedKind = ref(first(kindList.value)?.value ?? "");

const {
  data: recordList,
  fetchNextPage,
  hasNextPage,
  isFetching
} = useInfiniteQuery({
  queryKey: [QUERY_KEY.LOSTFOUND_RECORD, lastOpenCampus, selectedKind, lastOpenMain] as const,
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
  refetchOnMount: "always"
});

const delay = computed(() => (isFetching.value ? 300 : 0));
const debouncedLoading = refDebounced(isFetching, delay);

const handleSelectCampus = (campus: CampusOption) => (lastOpenCampus.value = campus);
const handleSelectMain = (main: LostOrFoundOption) => (lastOpenMain.value = main);
const handleSelectKind = (kind: string) => (selectedKind.value = kind);

const handleScrollToBottom = () => {
  if (isFetching.value || !hasNextPage.value) return;
  fetchNextPage();
};

const showHelp = () => (isShowHelp.value = true);
</script>

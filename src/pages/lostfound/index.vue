<template>
  <theme-config :show-bg-image="false">
    <title-bar title="失物寻物" :back-button="true" />
    <view class="campus-selector">
      <view class="container">
        <view
          v-for="item in campusList"
          :key="item"
          :class="['campus', selectCampus === item ? 'active' : undefined]"
          @tap="() => handleSelectCampus(item)"
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
          :class="selectMain === item ? 'active' : undefined"
          @tap="() => handleSelectMain(item)"
        >
          {{ item || "全部" }}
        </text>
      </view>
      <view class="scroll-view">
        <text
          v-for="item in kindList"
          :key="item"
          :class="selectKind === item ? 'active' : undefined"
          @tap="() => handleSelectKind(item)"
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
        <card v-else-if="!recordList.length && isEmpty">
          <text>该分类下暂无失物寻物记录</text>
        </card>
      </view>
    </scroll-view>
    <contact-me :data="contactMsg.data" :message="contactMsg.message" @show-help="setHelp" />
    <w-modal v-model:show="isShowHelp" :content="`&emsp;&emsp;${helpContent}`" />
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";

import { useQuery } from "@tanstack/vue-query";
import { computed, ref, watch } from "vue";

import { Card, ContactMe, ThemeConfig, TitleBar, WSkeleton } from "@/components";
import { helpText } from "@/constants/copywriting";
import { contactMsg } from "@/constants/lostfound";
import { lostfoundServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import store, { serviceStore } from "@/store";
import { LostfoundRecord } from "@/types/Lostfound";

import WModal from "../../components/Modal/index.vue";
import PreviewCard from "./PreviewCard/index.vue";

const currentPage = ref(0);
const maxPage = computed(() => data.value?.total_page_num ?? 0);
const recordList = ref<LostfoundRecord[]>([]);
const campusList = ref(["屏峰", "朝晖", "莫干山"]);
const selectKind = ref("");
const selectCampus = ref(serviceStore.lostfound.lastOpenCampus ?? "屏峰");
const mainList = ref(["", "失物", "寻物"]);
const selectMain = ref(serviceStore.lostfound.lastOpenMain ?? "");
const isEmpty = computed(() => recordList.value.length === 0);
const helpContent = ref(helpText.lostfound);
const isShowHelp = ref(false);

const { data: getKindsResponse } = useQuery({
  queryKey: [QUERY_KEY.LOSTFOUND_KIND],
  queryFn: () => lostfoundServiceNext.QueryKindList()
});

const { data, fetchStatus, isFetching, refetch } = useQuery({
  queryKey: [QUERY_KEY.LOSTFOUND_RECORD, selectCampus, selectKind, selectMain] as const,
  queryFn: ({ queryKey }) =>
    lostfoundServiceNext.QueryLostRecords(
      {
        campus: queryKey[1],
        kind: queryKey[2],
        lostOrFound: queryKey[3],
        pageNum: currentPage.value + 1,
        pageSize: 10
      },
      { snake: true }
    ),
  refetchOnMount: "always"
});

watch(fetchStatus, (value) => {
  if (value === "idle") {
    currentPage.value++;
    recordList.value = recordList.value.concat(data.value?.data ?? []);
  }
});

const kindList = computed(() => [
  "",
  ...(getKindsResponse.value ?? []).map((item) => item.kind_name)
]);

const handleSelectCampus = (campus: string) => {
  if (selectCampus.value === campus) return;
  selectCampus.value = campus;
  store.commit("setLastOpenCampus", campus);
  resetList();
  refetch();
};

const handleSelectMain = (main: string) => {
  if (selectMain.value === main) return;
  selectMain.value = main;
  store.commit("setLastOpenMain", main);
  resetList();
  refetch();
};

const handleSelectKind = (kind: string) => {
  if (selectKind.value === kind) return;
  selectKind.value = kind;
  resetList();
  refetch();
};

const resetList = () => {
  currentPage.value = 0;
  recordList.value = [];
};

const handleScrollToBottom = () => {
  if (isFetching.value || maxPage.value <= currentPage.value) return;
  refetch();
};

const setHelp = () => {
  isShowHelp.value = true;
};
</script>

<template>
  <theme-config>
    <title-bar title="校车公告" :back-button="true" />
    <scroll-view :scroll-y="true" @scrolltolower="handleScrollToBottom">
      <view :class="styles['announce-list']">
        <bus-announce-card
          v-for="item in announcements"
          :key="item.title"
          :item="item"
          @tap="handleCardClick(item)"
        />
      </view>
    </scroll-view>
    <bus-announce-modal
      v-if="selectedAnnounce"
      v-model:show="showModal"
      :announce="selectedAnnounce"
    />
  </theme-config>
</template>

<script lang="ts" setup>
import { useInfiniteQuery } from "@tanstack/vue-query";
import { ScrollView } from "@tarojs/components";
import { ref } from "vue";

import { QueryBusAnnounceResponse } from "@/api/types/yxy";
import { ThemeConfig, TitleBar } from "@/components";
import { yxyServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";

import BusAnnounceCard from "./_components/bus-announce-card/index.vue";
import BusAnnounceModal from "./_components/bus-announce-modal/index.vue";
import styles from "./index.module.scss";

const showModal = ref(false);
const selectedAnnounce = ref<QueryBusAnnounceResponse["list"][number]>();

const handleCardClick = (item: QueryBusAnnounceResponse["list"][number]) => {
  selectedAnnounce.value = item;
  showModal.value = true;
};

const {
  data: announcements,
  fetchNextPage: loadMore,
  hasNextPage,
  isFetching
} = useInfiniteQuery({
  queryKey: [QUERY_KEY.SCHOOL_BUS_ANNOUNCE] as const,
  queryFn: ({ pageParam }) =>
    yxyServiceNext.QueryBusAnnounce({ page: pageParam.toString(), page_size: "10" }),
  initialPageParam: 1,
  getNextPageParam: (lastPage, pages) => {
    if (lastPage.list.length === 0) {
      return undefined;
    }
    return pages.length + 1;
  },
  select: ({ pages }) => pages.flatMap((page) => page.list)
});

const handleScrollToBottom = () => {
  if (isFetching.value || !hasNextPage.value) return;
  loadMore();
};
</script>

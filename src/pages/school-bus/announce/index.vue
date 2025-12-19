<template>
  <theme-config>
    <title-bar title="校车公告" :back-button="true" />
    <scroll-view
      :scroll-y="true"
      :class="styles['announce-list']"
      @scrolltolower="handleScrollToBottom"
    >
      <bus-announce-card
        v-for="(item, index) in announcements"
        :key="`${index}-${item.abstract}`"
        :item="item"
        @tap="handleCardClick(item)"
      />
    </scroll-view>
    <bus-announce-modal v-model:show="showModal" :announce="selectedAnnounce" />
  </theme-config>
</template>

<script lang="ts" setup>
import { useInfiniteQuery } from "@tanstack/vue-query";
import { ScrollView } from "@tarojs/components";
import { computed, ref } from "vue";

import { BusAnnounceCard, BusAnnounceModal, ThemeConfig, TitleBar } from "@/components";
import { yxyServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { BusAnnounceItem } from "@/types/school-bus";

import styles from "./index.module.scss";

const showModal = ref(false);
const selectedAnnounce = ref<BusAnnounceItem>();

const handleCardClick = (item: BusAnnounceItem) => {
  selectedAnnounce.value = item;
  showModal.value = true;
};

const {
  data,
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
  }
});

const announcements = computed<BusAnnounceItem[]>(() => {
  if (!data.value) return [];
  return data.value.pages.flatMap((page) =>
    page.list.map((item) => ({
      title: item.title,
      author: item.author,
      publishedAt: item.published_at,
      content: item.content,
      abstract: item.abstract
    }))
  );
});

const handleScrollToBottom = () => {
  if (isFetching.value || !hasNextPage.value) return;
  loadMore();
};
</script>

<template>
  <theme-config :show-bg-image="false">
    <title-bar title="缴费记录" :back-button="true" />
    <card class="record-card">
      <scroll-view :scroll-y="true">
        <view class="container">
          <card v-if="!isFetching && !data?.length"> 无缴费记录 </card>
          <template v-else>
            <list v-for="(item, index) in data" :key="index">
              <list-item class="record-list-item">
                <view class="text-wrapper">
                  <text> {{ item.datetime }} </text>
                  <text> 充值金额：{{ item.money }} </text>
                </view>
              </list-item>
            </list>
          </template>
          <text v-if="isFetching" class="load"> 正在加载中... </text>
          <template v-else>
            <text v-if="hasNextPage" class="load" @tap="loadMore"> 加载更多... </text>
            <text v-else class="load"> 没有更多记录 </text>
          </template>
        </view>
      </scroll-view>
    </card>
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";

import { useInfiniteQuery } from "@tanstack/vue-query";
import dayjs from "dayjs";
import { last, uniqBy } from "lodash-es";
import { storeToRefs } from "pinia";

import { Card, ThemeConfig, TitleBar } from "@/components";
import List from "@/components/List/List.vue";
import ListItem from "@/components/List/ListItem.vue";
import { yxyServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { useElectricityStore } from "@/store/service/electricity";

const { campus } = storeToRefs(useElectricityStore());

/**
 * 这里的数据直接来自提供方，后端没有做处理，已知问题有：第一页为 0-base，没有返回总页数，且超出最后一页时仍返回最后一页数据
 * TODO: 与后端沟通协商优化方案
 */

const {
  data,
  fetchNextPage: loadMore,
  hasNextPage,
  isFetching
} = useInfiniteQuery({
  queryKey: [QUERY_KEY.ELECTRICITY_CHARGE_RECORD, campus] as const,
  queryFn: ({ queryKey, pageParam }) =>
    yxyServiceNext.QueryChargeRecord({ page: pageParam.toString(), campus: queryKey[1] }),
  initialPageParam: 0,
  getNextPageParam: (lastPage, pages) => {
    if (pages.length > 1) {
      const prevPage = pages.at(-2);
      if (prevPage && last(prevPage)?.datetime === last(lastPage)?.datetime) return undefined;
    }
    return pages.length;
  },
  select: (res) =>
    // 最后两页会数据重复，这里直接全部去重
    uniqBy(
      res.pages.flatMap((page) =>
        page.map((item) => ({ ...item, datetime: dayjs(item.datetime).format("YYYY.MM.DD HH:mm") }))
      ),
      "datetime"
    )
});
</script>

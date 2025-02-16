<template>
  <theme-config>
    <title-bar title="缴费记录" back-button />
    <card class="record-card">
      <scroll-view :scroll-y="true">
        <view class="container">
          <card v-if="!isFetching && !recordList?.length">
            无缴费记录
          </card>
          <template v-else>
            <w-list v-for="item in recordList" :key="item.datetime" class="record-list">
              <w-list-item class="record-list-item">
                <view class="text-wrapper">
                  <text> {{ item.datetime }} </text>
                  <text> 充值金额：{{ item.money }} </text>
                </view>
              </w-list-item>
            </w-list>
          </template>
          <text v-if="isFetching" class="load">
            正在加载中...
          </text>
          <template v-else>
            <text v-if="hasNextPage" class="load" @tap="fetchNextPage">
              加载更多...
            </text>
            <text v-else class="load">
              没有更多记录
            </text>
          </template>
        </view>
      </scroll-view>
    </card>
  </theme-config>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { Card, ThemeConfig, TitleBar, WList, WListItem } from "@/components";
import { YxyService } from "@/services";
import { useInfiniteQuery } from "@tanstack/vue-query";
import useElectricityQueryOption from "@/hooks/electricity/useElectricityQueryOption";
import "./index.scss";

const queryOptions = useElectricityQueryOption();
const {
  data: recordList,
  hasNextPage,
  fetchNextPage,
  isFetching
} = useInfiniteQuery({
  queryKey: ["electricity/payment", queryOptions.campus] as const,
  queryFn: ({ queryKey, pageParam }) => YxyService.queryRecord({
    campus: queryKey[1],
    page: pageParam.toString()
  }),
  initialPageParam: 1,
  getNextPageParam: (lastPage, pages) => {
    /**
     * FIXME: 请求虽然需要分页参数，但是响应结果不管哪页的数据都一样。这里用响
     * 应数据的最后一项，和已经加载出来的最后一项比较，如果日期相同，那就代表所
     * 有分页加载完了
     */
    const newLastItem = lastPage.slice(-1)[0];
    const oldLastItem = pages.flat(1).slice(-1)[0];
    if (dayjs(newLastItem.datetime).isSame(dayjs(oldLastItem.datetime))) {
      return undefined;
    }
    return pages.length + 1;
  },
  select: raw => raw.pages.flat(1)
});
</script>

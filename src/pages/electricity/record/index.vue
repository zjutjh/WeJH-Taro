<template>
  <theme-config>
    <title-bar title="缴费记录" back-button />
    <card class="record-card">
      <scroll-view :scroll-y="true">
        <view class="container">
          <card v-if="!loading && !recordList.length">
            无缴费记录
          </card>
          <template v-else>
            <list v-for="(item, index) in recordList" :key="index">
              <list-item class="record-list-item">
                <view class="text-wrapper">
                  <text> {{ item.datetime }} </text>
                  <text> 充值金额：{{ item.money }}元 </text>
                </view>
              </list-item>
            </list>
          </template>
          <text v-if="loading" class="load">
            正在加载中...
          </text>
          <template v-else>
            <text v-if="!isLastPage" class="load" @tap="handleLoadNext">
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
import "./index.scss";
import { Card, ThemeConfig, TitleBar } from "@/components";
import { YxyService } from "@/services";
import { ref } from "vue";
import List from "../../../components/List/List.vue";
import ListItem from "../../../components/List/ListItem.vue";
import dayjs from "dayjs";
import { useOffsetPagination } from "@vueuse/core";
import { useRequestNext } from "@/hooks";
import { RequestError } from "@/utils";
import Taro from "@tarojs/taro";

const recordList = ref<Awaited<ReturnType<typeof YxyService.queryRecord>>>([]);
const isLastPage = ref(false);

const { run: fetchRecord, loading } = useRequestNext(
  YxyService.queryRecord, {
    initialData: [],
    defaultParams: {
      page: "1"
    },
    onSuccess: (list) => {
      /**
       * FIXME: 请求虽然需要分页参数，但是响应结果不管哪页都一样。这里用响应数据的最后一
       * 项，和已经加载出来的最后一项比较，如果日期相同，那就代表所有分页加载完了
       */
      const lastDate = dayjs(list[list.length - 1].datetime).format("YYYY.MM.DD HH:mm");
      if (lastDate === recordList.value[recordList.value.length - 1]?.datetime) {
        isLastPage.value = true;
        return;
      }
      const transformed = list.map(item => ({
        ...item,
        datetime: dayjs(item.datetime).format("YYYY.MM.DD HH:mm")
      }));
      recordList.value.push(...transformed);
    },
    onError: (e) => {
      if (e instanceof RequestError)
        Taro.showToast({ title: `查询充值记录失败: ${e.message}`, icon: "none" });
    }
  }
);

// size 为多少？
const { next: handleLoadNext } = useOffsetPagination({
  onPageChange: ({ currentPage }) => fetchRecord({ page: `${currentPage}` })
});

</script>

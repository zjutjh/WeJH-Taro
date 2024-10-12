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
            <text v-if="currentPage !== -1" class="load" @tap="loadMore">
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
import { useRequest } from "@/hooks";
import { YxyService } from "@/services";
import { ref } from "vue";
import List from "../../../components/List/List.vue";
import ListItem from "../../../components/List/ListItem.vue";
import dayjs from "dayjs";

type recordType = {
  buy_type: string;
  datetime: string;
  is_send: string;
  money: string;
  room_dm: string;
  using_type: string;
};

const currentPage = ref(0);
const recordList = ref<Array<recordType>>([]);

const {
  run: getRecord,
  loading
} = useRequest(YxyService.queryRecord, {
  defaultParams: {
    page: currentPage.value.toString()
  },
  onSuccess: (response) => {
    if (response.data.code === 1) {
      const list = response.data.data;
      // 检查请求结果是否重复
      if (recordList.value.length !== 0
        && dayjs(list[list.length - 1].datetime).format("YYYY.MM.DD HH:mm")
        === recordList.value[recordList.value.length - 1].datetime
      ) {
        currentPage.value = -1;
        return;
      }
      currentPage.value++;
      recordList.value = recordList.value.concat(
        list.map(item => ({
          ...item,
          datetime: dayjs(item.datetime).format("YYYY.MM.DD HH:mm")
        }))
      );
    } else {
      throw new Error(response.data.msg);
    }
  },
  onError: (error) => {
    if (error instanceof Error)
      return error.message;
    else
      return `获取缴费记录失败\r\n${error.errMsg}`;
  }
});

const loadMore = () => {
  getRecord({ page: currentPage.value.toString() });
};

</script>

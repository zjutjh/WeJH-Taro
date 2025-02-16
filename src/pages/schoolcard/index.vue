<template>
  <theme-config>
    <title-bar title="校园卡" back-button />
    <scroll-view :scroll-y="true">
      <view class="school-card">
        <taro-image mode="aspectFit" :src="SchoolCardCoverImage" />
        <text class="balance">
          ¥ {{ balanceInfo?.balance ?? "-" }}
        </text>
      </view>
      <card class="consume-card">
        <template #header>
          <view class="col" />
          <view class="col">
            <date-picker v-model="fieldDate" />
          </view>
          <view class="col">
            <refresh-button
              :is-refreshing="isFetching"
              @tap="refetch"
            />
          </view>
        </template>
        <view class="flex-column">
          <card v-if="consumeList?.length === 0" style="text-align: center">
            <view> 无消费记录 </view>
          </card>
          <template v-else>
            <view> 该日消费: {{ totalConsume.toFixed(2) }} </view>
            <card
              v-for="(item, index) in consumeList"
              :key="index"
              class="consume-item-card"
              size="small"
              :class="{
                'consume-item-positive': parseFloat(item.money) >= 0,
                'consume-item-negative': parseFloat(item.money) < 0
              }"
            >
              <view class="content-wrapper">
                <view class="col">
                  <text class="transactions">
                    ¥ {{ Math.abs(parseFloat(item.money)).toFixed(1) }}
                  </text>
                </view>
                <view class="col">
                  <view>地点： {{ item.address }}</view>
                  <view>
                    时间： {{ item.time.split(' ')[0] }}
                    &nbsp;
                    {{ item.time.split(' ')[1] }}
                  </view>
                </view>
              </view>
            </card>
          </template>
        </view>
      </card>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { Card, RefreshButton, ThemeConfig, TitleBar } from "@/components";
import dayjs from "dayjs";
import { YxyService } from "@/services";
import { Image as TaroImage } from "@tarojs/components";
import Taro from "@tarojs/taro";
import useSchoolCardBalanceQuery from "@/store/service/cardBalance";
import { RequestError } from "@/utils";
import SchoolCardCoverImage from "@/assets/photos/card.svg";
import { useQuery } from "@tanstack/vue-query";
import DatePicker from "./components/date-picker.vue";
import "./index.scss";

const fieldDate = ref(dayjs().format("YYYYMMDD"));
const { data: balanceInfo, error: balanceError } = useSchoolCardBalanceQuery();

const { data: consumeList, isFetching, error, refetch } = useQuery({
  queryKey: ["schoolCard/record", fieldDate] as const,
  queryFn: ({ queryKey }) => YxyService.querySchoolCardRecord({
    queryTime: queryKey[1]
  }),
  select: raw => raw?.filter(item => parseFloat(item.money) !== 0) ?? []
});

const totalConsume = computed(() => {
  return consumeList.value?.reduce((prev, curr) => {
    const value = +curr.money;
    if (value < 0) return prev + Math.abs(value);
    return prev;
  }, 0) ?? 0;
});

watchEffect(() => {
  const error = balanceError.value;
  if (error instanceof RequestError && error.code === 200514) {
    Taro.showModal({
      title: "查询余额失败",
      content: error.message,
      confirmText: "重新绑定",
      success: (res) => {
        if (res.confirm)
          Taro.navigateTo({ url: "/pages/bind/index" });
      }
    });
  } else if (error instanceof Error) {
    Taro.showToast({ title: `查询余额失败：${error.message}`, icon: "none" });
  }
});

watchEffect(() => {
  if (error.value instanceof Error) {
    Taro.showToast({ title: `查询消费记录失败：${error.value.message}`, icon: "none" });
  }
});
</script>

<template>
  <theme-config :show-bg-image="false">
    <title-bar title="校园卡" :back-button="true" />
    <scroll-view :scroll-y="true">
      <view class="school-card">
        <image mode="aspectFit" src="@/assets/photos/card.svg" />
        <text class="balance"> ¥ {{ serviceStore.card.balance || 0 }} </text>
      </view>
      <card class="consume-card">
        <template #header>
          <view class="col" />
          <view class="col">
            <picker
              mode="date"
              :value="selectedDate"
              :start="dayjs().subtract(69, 'day').format('YYYY-MM-DD')"
              :end="dayjs().format('YYYY-MM-DD')"
              @change="handleChangeDate"
            >
              <w-button> {{ selectedDate }} </w-button>
            </picker>
          </view>
          <view class="col"><refresh-button :is-refreshing="loading" @tap="updateData" /></view>
        </template>
        <view class="flex-column">
          <card v-if="consumeList.length === 0" style="text-align: center">
            <view> 无消费记录 </view>
          </card>
          <template v-else>
            <view> 该日消费: {{ totalConsume.toFixed(2) }} </view>
            <card
              v-for="(item, index) in consumeList"
              :key="index"
              class="consume-item-card"
              size="small"
              :class="item.moneyValue >= 0 ? 'consume-item-positive' : 'consume-item-negative'"
            >
              <view class="content-wrapper">
                <view class="col">
                  <text class="transactions"> ¥ {{ Math.abs(round(item.moneyValue, 2)) }} </text>
                </view>
                <view class="col">
                  <view>地点：{{ item.address }}</view>
                  <view>
                    时间：{{ item.time.split(" ")[0] }}
                    &nbsp;
                    {{ item.time.split(" ")[1] }}
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
import "./index.scss";

import { Picker } from "@tarojs/components";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { round } from "lodash-es";
import { computed, ref } from "vue";

import { Card, RefreshButton, ThemeConfig, TitleBar, WButton } from "@/components";
import { useRequest } from "@/hooks";
import { YxyService } from "@/services";
import store, { serviceStore } from "@/store";
import { CardConsume } from "@/types/CardConsume";

const selectedDate = ref(dayjs().format("YYYY-MM-DD")); // YYYY-MM-DD
const records = ref<CardConsume[]>([]);

useRequest(YxyService.querySchoolCardBalance, {
  onSuccess: (res) => {
    if (res.data.code === 1) {
      if (!Number.isFinite(parseFloat(res.data.data))) throw new Error("无效余额值");
      store.commit("setCardBalance", res.data.data);
    } else if (res.data.code === 200514) {
      Taro.showModal({
        title: "查询余额失败",
        content: res.data.msg,
        confirmText: "重新登录",
        success: (r) => {
          if (r.confirm) Taro.navigateTo({ url: "/pages/bind/index" });
        }
      });
    } else throw new Error(res.data.msg);
  },
  onError: (error) =>
    error instanceof Error
      ? `查询校园卡余额\r\n${error.message}`
      : `查询校园卡余额\r\n${error.errMsg}`
});

const { run: queryRecord, loading } = useRequest(YxyService.querySchoolCardRecord, {
  defaultParams: { queryTime: dayjs().format("YYYYMMDD") },
  onSuccess: (response) => {
    if (response.data.code !== 1) throw new Error(response.data.msg);
    records.value = response.data.data ?? [];
    store.commit("setCardToday", records.value);
  },
  onError: (e) => {
    if (e instanceof Error) return e.message;
  }
});

const consumeList = computed(() =>
  records.value
    .map((item) => ({ ...item, moneyValue: parseFloat(item.money) }))
    .filter((item) => item.moneyValue !== 0)
);

const totalConsume = computed(() =>
  consumeList.value.reduce((acc, cur) => {
    if (cur.moneyValue < 0) acc += Math.abs(cur.moneyValue);
    return acc;
  }, 0)
);

const updateData = () => queryRecord({ queryTime: selectedDate.value.split("-").join("") });

const handleChangeDate = (e) => {
  selectedDate.value = e.detail.value;
  queryRecord({ queryTime: selectedDate.value.split("-").join("") });
};
</script>

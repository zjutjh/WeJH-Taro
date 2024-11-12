<template>
  <theme-config>
    <title-bar title="校园卡" back-button />
    <scroll-view :scroll-y="true">
      <view class="school-card">
        <taro-image mode="aspectFit" :src="SchoolCardCoverImage" />
        <text class="balance">
          ¥ {{ cardBalanceStore.balance }}
        </text>
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
              <w-button>{{ selectedDate }}</w-button>
            </picker>
          </view>
          <view class="col">
            <refresh-button
              :is-refreshing="loading"
              @tap="updateData"
            />
          </view>
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
import { Card, RefreshButton, ThemeConfig, TitleBar, WButton } from "@/components";
import dayjs from "dayjs";
import "./index.scss";
import { YxyService } from "@/services";
import { Picker, Image as TaroImage } from "@tarojs/components";
import Taro from "@tarojs/taro";
import useCardBalanceStore from "@/store/service/cardBalance";
import { RequestError } from "@/utils";
import { useRequestNext } from "@/hooks";
import SchoolCardCoverImage from "@/assets/photos/card.svg";

const cardBalanceStore = useCardBalanceStore();
const selectedDate = ref(dayjs().format("YYYY-MM-DD")); // YYYY-MM-DD

watchEffect(() => {
  const error = cardBalanceStore.error;
  if (error instanceof RequestError && error.code === 200514) {
    Taro.showModal({
      title: "查询余额失败",
      content: error.message,
      confirmText: "重新登录",
      success: (res) => {
        if (res.confirm)
          Taro.navigateTo({ url: "/pages/bind/index" });
      }
    });
  }
});

const { data: records, run: queryRecord, loading } = useRequestNext(
  YxyService.querySchoolCardRecord, {
    defaultParams: { queryTime: dayjs().format("YYYYMMDD") },
    initialData: [],
    onError: (e) => {
      if (e instanceof RequestError)
        Taro.showToast({ title: `查询消费记录失败：${e.message}`, icon: "none" });
    }
  }
);

const consumeList = computed(() => {
  return records.value.filter((item) => parseFloat(item.money) !== 0);
});

const totalConsume = computed(() => {
  return records.value.reduce((prev, curr) => {
    const value = +curr.money;
    if (value < 0) return prev + Math.abs(value);
    return prev;
  }, 0);
});

async function updateData() {
  queryRecord({ queryTime: selectedDate.value.split("-").join("") });
}

const handleChangeDate = (e) => {
  selectedDate.value = e.detail.value;
  queryRecord({ queryTime: selectedDate.value.split("-").join("") });
};

</script>

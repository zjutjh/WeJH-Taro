<template>
  <theme-config>
    <title-bar title="寝室电量查询" :back-button="true" />
    <scroll-view :scroll-y="true">
      <view :class="styles['header-view']"><image src="@/assets/photos/electricity.svg" /></view>
      <view :class="[styles['flex-column']]">
        <card :class="styles['info-card']">
          <view :class="styles['dormitory-info']">
            <view :class="styles['icon-wrapper']"><view class="iconfont icon-electricity" /></view>
            <view :class="styles['text-wrapper']">
              <text>{{ data?.display_room_name || "未知" }}</text>
            </view>
          </view>
        </card>

        <w-list>
          <w-list-item :class="styles['electricity-list-item']">
            <view :class="styles['text-wrapper']">
              <text> 剩余总电量 </text>
              <text :class="[isUrgent ? styles.dangerous : styles.normal, styles['rest-number']]">
                {{ data?.soc ?? "" }}
              </text>
              <text> 度 </text>
            </view>
          </w-list-item>
        </w-list>
        <text v-if="isUrgent" :class="styles.dangerous" style="font-size: 0.8rem">
          温馨提示: 电量已不足20度，请及时充电
        </text>

        <w-list @tap="nav2Consumption">
          <w-list-item arrow="right" :class="styles['electricity-list-item']">
            <view :class="styles['text-wrapper']" style="justify-content: space-between">
              <text> 每日用电记录 </text>
              <text v-if="consumptionLoading" :class="styles.today"> 正在加载... </text>
              <text v-else-if="consumption" :class="styles.today">
                昨日使用: {{ consumption }}
              </text>
            </view>
          </w-list-item>
        </w-list>

        <w-list @tap="nav2Record">
          <w-list-item arrow="right" :class="styles['electricity-list-item']">
            <view :class="styles['text-wrapper']"><text> 缴费记录 </text></view>
          </w-list-item>
        </w-list>

        <w-list @tap="nav2Subscribe">
          <w-list-item arrow="right" :class="styles['electricity-list-item']">
            <view :class="styles['text-wrapper']"><text> 低电提醒消息订阅 </text></view>
          </w-list-item>
        </w-list>
      </view>
    </scroll-view>
    <bottom-panel>
      <picker
        mode="selector"
        :range="CAMPUS_OPTION"
        range-key="label"
        :value="selectIndex"
        :class="styles['picker-wrapper']"
        @change="onPickerChange"
      >
        <w-button :class="styles.selector"> {{ CAMPUS_OPTION.at(selectIndex)?.label }} </w-button>
      </picker>
    </bottom-panel>
  </theme-config>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import Taro from "@tarojs/taro";
import { first } from "lodash-es";
import { storeToRefs } from "pinia";
import { computed, watch, watchEffect } from "vue";

import { BottomPanel, Card, ThemeConfig, TitleBar, WButton, WList, WListItem } from "@/components";
import { yxyServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { CAMPUS_OPTION, useElectricityStore } from "@/store/service/electricity";
import { ServiceErrorCode } from "@/utils/request-error";

import styles from "./index.module.scss";

const { campus, selectIndex } = storeToRefs(useElectricityStore());

const onPickerChange = (event: { detail: { value: number } }) => {
  selectIndex.value = event.detail.value;
  campus.value = CAMPUS_OPTION[selectIndex.value].value;
};

const { data, isFetching } = useQuery({
  queryKey: [QUERY_KEY.ELECTRICITY_BALANCE, campus] as const,
  queryFn: ({ queryKey }) => yxyServiceNext.QueryElectricityBalance({ campus: queryKey[1] })
});

watchEffect(() =>
  isFetching.value ? Taro.showLoading({ title: "正在加载" }) : Taro.hideLoading()
);

const {
  data: consumption,
  error,
  isFetching: consumptionLoading
} = useQuery({
  queryKey: [QUERY_KEY.ELECTRICITY_CONSUMPTION, campus] as const,
  queryFn: ({ queryKey }) =>
    yxyServiceNext.QueryElectricityConsumptionRecord({ campus: queryKey[1] }),
  select: (res) => first(res)?.used
});

watch(error, (value) => {
  if (value?.code === ServiceErrorCode.CAMPUS_MISMATCH) {
    selectIndex.value = 0;
    campus.value = "zhpf";
  }
});

const isUrgent = computed(() => (data.value ? data.value.soc < 20 : false));

const nav2Record = () => Taro.navigateTo({ url: "/pages/electricity/record/index" });
const nav2Consumption = () => Taro.navigateTo({ url: "/pages/electricity/consumption/index" });
const nav2Subscribe = () => Taro.navigateTo({ url: "/pages/electricity/subscribe/index" });
</script>

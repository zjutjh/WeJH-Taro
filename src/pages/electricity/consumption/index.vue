<template>
  <theme-config :show-bg-image="false">
    <title-bar title="用电记录" :back-button="true" />
    <card class="consumption-card">
      <scroll-view :scroll-y="true">
        <view class="container">
          <card v-if="!isFetching && !data?.length" class="no-item"> 无用电记录 </card>
          <template v-else>
            <list v-for="consumption in data" :key="consumption.room_dm">
              <list-item class="consumption-list-item">
                <view class="text-wrapper">
                  <text> {{ consumption.datetime }} </text><text> {{ consumption.used }} </text>
                </view>
              </list-item>
            </list>
          </template>
          <text v-if="isFetching" class="load"> 正在加载中... </text>
        </view>
      </scroll-view>
    </card>
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";

import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";

import { Card, ThemeConfig, TitleBar } from "@/components";
import List from "@/components/List/List.vue";
import ListItem from "@/components/List/ListItem.vue";
import { yxyServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { useElectricityStore } from "@/store/service/electricity";

const { campus } = storeToRefs(useElectricityStore());
const { data, isFetching } = useQuery({
  queryKey: [QUERY_KEY.ELECTRICITY_CONSUMPTION, campus] as const,
  queryFn: ({ queryKey }) => yxyServiceNext.QueryConsumptionRecord({ campus: queryKey[1] })
});
</script>

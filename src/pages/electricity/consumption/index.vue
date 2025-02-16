<template>
  <theme-config>
    <title-bar title="用电记录" back-button />
    <card class="consumption-card">
      <scroll-view :scroll-y="true">
        <view class="container">
          <card v-if="!isFetching && !records?.length" class="no-item">
            无用电记录
          </card>
          <template v-else>
            <w-list
              v-for="consumption in records"
              :key="consumption.room_dm"
              class="consumption-list"
            >
              <w-list-item class="consumption-list-item">
                <view class="text-wrapper">
                  <text> {{ consumption.datetime }} </text>
                  <text> {{ consumption.used }} </text>
                </view>
              </w-list-item>
            </w-list>
          </template>
          <text v-if="isFetching" class="load">
            正在加载中...
          </text>
        </view>
      </scroll-view>
    </card>
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";
import { Card, ThemeConfig, TitleBar, WList, WListItem } from "@/components";
import { YxyService } from "@/services";
import useElectricityQueryOption from "@/hooks/electricity/useElectricityQueryOption";
import { useQuery } from "@tanstack/vue-query";

const queryOptions = useElectricityQueryOption();
const { data: records, isFetching } = useQuery({
  queryKey: ["electricity/consumption", queryOptions.campus] as const,
  queryFn: ({ queryKey }) => YxyService.queryConsumption({ campus: queryKey[1] })
});
</script>

<template>
  <theme-config>
    <title-bar title="用电记录" back-button />
    <card class="consumption-card">
      <scroll-view :scroll-y="true">
        <view class="container">
          <card v-if="!loading && !records.length" class="no-item">
            无用电记录
          </card>
          <template v-else>
            <list
              v-for="consumption in records"
              :key="consumption.room_dm"
            >
              <list-item class="consumption-list-item">
                <view class="text-wrapper">
                  <text> {{ consumption.datetime }} </text>
                  <text> {{ consumption.used }}度 </text>
                </view>
              </list-item>
            </list>
          </template>
          <text v-if="loading" class="load">
            正在加载中...
          </text>
        </view>
      </scroll-view>
    </card>
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";
import { Card, ThemeConfig, TitleBar } from "@/components";
import List from "../../../components/List/List.vue";
import ListItem from "../../../components/List/ListItem.vue";
import { YxyService } from "@/services";
import { useRequestNext } from "@/hooks";

// TODO: support read cached promise from entrance
const { loading, data: records } = useRequestNext(
  YxyService.queryConsumption, {
    initialData: []
  }
);

</script>

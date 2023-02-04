<template>
  <view class="background">
    <title-bar title="用电记录" back-button />
    <card class="consumption-card">
      <scroll-view :scrollY="true">
        <view class="container">
          <card v-if="!consumptionList?.data.length" class="no-item">无用电记录</card>
          <template v-else>
            <list v-for="consumption in consumptionList?.data">
              <list-item class="consumption-list-item">
                <view class="text-wrapper">
                  <text> {{ consumption.datetime }} </text>
                  <text> {{ consumption.used }}度 </text>
                </view>
              </list-item>
            </list>
          </template>
          <text v-if="loading" class="load">正在加载中...</text>
        </view>
      </scroll-view>
    </card>
  </view>
</template>

<script setup lang="ts">
import "./index.scss";
import { Card, TitleBar } from "@/components";
import { useRequest } from "@/hooks";
import { YxyService } from "@/services";
import Taro from "@tarojs/taro"
import List from "../../../components/List/List.vue";
import ListItem from "../../../components/List/ListItem.vue";

const {
  data: consumptionList,
  loading
} = useRequest(YxyService.queryConsumption, {
  onSuccess: (response) => {
    if (response.data.code !== 1) {
      throw new Error(response.data.msg || response.errMsg)
    }
  },
  onError: (error) => {
    Taro.showToast({ title: error.message, icon: "none" })
  }
});

</script>

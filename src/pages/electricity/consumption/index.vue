<template>
  <view class="background">
    <title-bar title="用电记录" back-button />
    <scroll-view :scrollY="true">
      <view>
        <view class="flex-column">
          <card v-if="!consumptionList" class="no-item">正在加载</card>
          <list
                class="text"
                :style="{'background': '#F7E9C3'}"
                v-for="consumption in consumptionList"
          >
            <view class="record">
              <text>
                {{consumption.datetime}}
              </text>
            </view>
            <view class="record">
              <text>
                {{consumption.used}}度
              </text>
            </view>
          </list>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import "./index.scss";
import { Card, TitleBar, WButton } from "@/components";
import {useRequest} from "@/hooks";
import {YxyService} from "@/services";
import {onMounted, ref} from "vue";
import List from "../../../components/List/List.vue";

const consumptionList = ref();
const {
  run: getConsumption,
} = useRequest(YxyService.queryConsumption,{
  manual: true,
  onSuccess: (response) => {
    console.log(response.data);
    consumptionList.value = response.data.data;
  }
});


onMounted(() => {
  getConsumption();
});

</script>

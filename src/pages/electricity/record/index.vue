<template>
  <view class="background">
    <title-bar title="缴费记录" back-button />
    <scroll-view :scrollY="true">
      <view class="slot"/>
      <view class="slot"/>
      <view class="header">
          <view class="col">
            <view class="swicher">
              <w-button
                :class="{ 'button-not-active': !isMy }"
                @tap="isMy = !isMy"
              >
                我的缴费
              </w-button>
            </view>
            <view class="swicher">
              <w-button
                :class="{ 'button-not-active': isMy }"
                @tap="isMy = !isMy"
              >
                房间缴费
              </w-button>
            </view>
          </view>
      </view>
      <view class="slot"/>
      <view style="border:0.2px solid #D8D8D8"></view>
      <view class="slot"/>
      <view class="text">
        <view class="top">
          <text>
            {{isMy? "我的" : "房间"}}缴费总金额
          </text>
        </view>
        <view class="top">
          <text>
            共{{total}}元
          </text>
        </view>
      </view>
      <view>
          <view class="flex-column">
            <card v-if="!recordList" class="no-item">无缴费记录</card>
            <list v-if="!isMy"
                  class="text"
                  :style="{'background': '#F7E9C3'}"
                  v-for="record in recordList"
            >
              <view class="record">
                <text>
                  {{record.datetime}}
                </text>
              </view>
              <view class="record">
                <text>
                  {{record.money}}
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

const isMy = ref<Boolean>(false);
const recordList = ref();
const total = ref<number>(0);
const {
  run: getRecord,
} = useRequest(YxyService.queryRecord,{
  manual: true,
  onSuccess: (response) => {
    console.log(response.data);
    if(response.data.msg === "OK") {
      recordList.value = response.data.data;
      console.log(recordList.value);
      for(let i in recordList.value) {
        total.value += parseInt(recordList.value[i].money);
      }
    }
    else
      recordList.value = undefined;
  }
});

onMounted(() => {
  getRecord({
    "page": "3"
  });
  // TODO: page不管是多少都是一样,可能是页面的意思,但是不知道怎么判断是否到头,目前只能读取第一页的数据
});
</script>

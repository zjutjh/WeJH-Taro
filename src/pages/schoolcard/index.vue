<template>
  <view class="background">
    <title-bar title="校园卡" back-button />
    <scroll-view :scrollY="true">
      <view class="school-card">
        <image mode="aspectFit" src="@/assets/photos/card.svg"></image>
        <text class="balance"> ¥ {{ balance }}</text>
      </view>
      <card class="consume-card">
        <template #header>
          <view class="col"> </view>
          <view class="col">
            <view class="swicher">
              <w-button
                :class="{ 'button-not-active': !isSelectToday }"
                @tap="todayClick"
              >
                今日
              </w-button>
              <w-button
                :class="{ 'button-not-active': isSelectToday }"
                @tap="historyClick"
                shape="rounded"
              >
                历史
              </w-button>
            </view>
          </view>
          <view class="col">
            <refresh-button
              @tap="updateData"
              :is-refreshing="isRefreshing"
            ></refresh-button>
          </view>
        </template>
        <view class="flex-column">
          <card v-if="consumeList.length === 0" style="text-align: center">
            <view> 无消费记录 </view>
          </card>
          <template v-else>
            <view>
              {{ `${isSelectToday ? '今日' : '该月'}` }}消费：
              {{ totalConsume.toFixed(2) }}</view
            >
            <card
              class="consume-item-card"
              v-for="item in consumeList"
              :key="item.id"
              size="small"
              :class="{
                'consume-item-positive': parseFloat(item.transactions) >= 0,
                'consume-item-negative': parseFloat(item.transactions) < 0
              }"
            >
              <view class="content-wrapper">
                <view class="col">
                  <text class="transactions">
                    ¥ {{ Math.abs(parseFloat(item.transactions)) }}
                  </text>
                </view>
                <view class="col">
                  <view>地点： {{ item.shopPlace }}</view>
                  <view
                    >时间： {{ item.time.split(' ')[0] }}
                    &nbsp;
                    {{ item.time.split(' ')[1] }}</view
                  >
                </view>
              </view>
            </card>
          </template>
        </view>
      </card>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import Card from "@/components/Card/index.vue";
import { WButton, } from "@/components/button";
import TitleBar from "@/components/TitleBar/index.vue";
import RefreshButton from "@/components/RefreshButton/index.vue";
import { CardService } from "@/services";
import dayjs from "dayjs";
import { CardConsume } from "@/types/CardConsume";
import { serviceStore } from "@/store";

import "./index.scss";

const isRefreshing = ref(false);
let dateSel = ref(dayjs().format("YYYY-MM"));

onMounted(() => {
  CardService.updateCardBalance();
  CardService.updateCardToday();
  CardService.updateCardHistory({
    year: parseInt(dateSel.value.split("-")[0]),
    month: parseInt(dateSel.value.split("-")[1])
  });
});

let isSelectToday = ref(true);

let balance = computed(() => serviceStore.card.balance || 0);
let today = computed(() => [...serviceStore.card.today].reverse() || []);
let history = computed(() => [...serviceStore.card.history].reverse() || []);

const totalConsume = ref(0);
const consumeList = computed(() => {
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  totalConsume.value = 0;
  let tmp: CardConsume[];
  if (isSelectToday.value) tmp = today.value;
  else tmp = history.value;
  return (
    tmp.filter((item) => {
      if (parseFloat(item.transactions) < 0)
        totalConsume.value += Math.abs(parseFloat(item.transactions));
      return parseFloat(item.transactions) !== 0;
    }) || []
  );
});

async function updateData() {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  if (isSelectToday.value) await CardService.updateCardToday();
  else
    await CardService.updateCardHistory({
      year: parseInt(dateSel.value.split("-")[0]),
      month: parseInt(dateSel.value.split("-")[1])
    });
  isRefreshing.value = false;
}

async function historyClick() {
  isSelectToday.value = false;
}

function todayClick() {
  isSelectToday.value = true;
}

</script>

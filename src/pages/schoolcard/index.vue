<template>
  <view class="background">
    <title-bar title="校园卡"></title-bar>
    <scroll-view :scrollY="true">
      <view class="school-card">
        <view class="school-card-background">
          <view style="background: var(--wjh-color-yellow)"></view>
          <view style="background: var(--wjh-color-orange)"></view>
          <view style="background: var(--wjh-color-green)"></view>
          <view style="background: var(--wjh-color-cyan)"></view>
          <view style="background: var(--wjh-color-blue)"></view>
        </view>
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
            <reflesh-button
              @tap="updateData"
              :is-refleshing="isRefleshing"
            ></reflesh-button>
          </view>
        </template>
        <view v-if="isSelectToday" class="flex-column">
          <view v-if="!isSelectToday" class="flex-column">
            <text>历史消费</text>
            <view
              style="
                display: inline;
                font-size: 80%;
                font-weight: normal;
                margin-left: 1rem;
              "
            >
              <picker
                mode="date"
                fields="month"
                style="display: inline-block"
                @change="onDateChange"
              >
                <text class="picker"> {{ dateSel }}👋</text>
              </picker>
            </view>
          </view>
          <view v-if="!consumeList.length" style="text-align: center">
            <view> 无消费记录</view>
          </view>
          <view
            v-else
            class="item card"
            v-for="item in consumeList"
            :key="item.ID"
          >
            <view class="cicle" v-if="item.transactionType">
              {{ item.transactionType[0] }}
            </view>
            <view class="item-text">
              <view v-if="item.shop && item.shop !== ' '">
                {{ item.shop }}</view
              >
              <view> {{ item.shopPlace }}</view>
              <view>{{ item.id }}</view>
              <view>{{ item.transactionType }}</view>
              <view> {{ item.time }}</view>
            </view>
            <text class="transactions"> {{ item.transactions }}</text>
          </view>
        </view>
      </card>
    </scroll-view>
  </view>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import Card from '@/components/Card/index.vue';
  import { WButton } from '@/components/button';
  import TitleBar from '@/components/TitleBar/index.vue';
  import RefleshButton from '@/components/RefleshButton/index.vue';
  import { CardService } from '@/services';
  import dayjs from 'dayjs';
  import { serviceStore } from '@/store';

  import './index.scss';
  export default defineComponent({
    components: { Card, WButton, TitleBar, RefleshButton },
    setup() {
      const isRefleshing = ref(false);
      let dateSel = ref(dayjs().format('YYYY-MM'));

      let showPop = ref(false);
      let isSelectToday = ref(true);

      let balance = computed(() => serviceStore.card.balance || 0);
      let today = computed(() => serviceStore.card.today || []);
      let history = computed(() => serviceStore.card.history || []);
      const consumeList: any = computed(() => {
        if (isSelectToday.value) return today;
        else if (!isSelectToday.value) return history;
        return [];
      });

      async function updateData() {
        if (isRefleshing.value) return;
        isRefleshing.value = true;
        if (isSelectToday.value) await CardService.updateCardToday();
        else
          await CardService.updateCardHistory({
            year: parseInt(dateSel.value.split('-')[0]),
            month: parseInt(dateSel.value.split('-')[1])
          });
        isRefleshing.value = false;
      }

      async function historyClick() {
        isSelectToday.value = false;
      }
      function todayClick() {
        isSelectToday.value = true;
      }

      async function onDateChange(e) {
        dateSel.value = e.detail.value;
      }

      CardService.updateCardBalance();
      CardService.updateCardToday();
      CardService.updateCardHistory();

      return {
        isRefleshing,
        dateSel,
        onDateChange,
        isSelectToday,
        historyClick,
        todayClick,
        consumeList,
        balance,
        today,
        history,
        updateData,
        showPop,
        dayjs
      };
    }
  });
</script>

<template>
  <view class="background">
    <title-bar title="校园卡"></title-bar>
    <scroll-view :scrollY="true">
      <view class="school-card" @tap="getCardBalance">
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
                :class="{ 'button-not-active': !isSelectHistory }"
                @tap="historyClick"
                shape="rounded"
              >
                历史
              </w-button>
            </view>
          </view>
          <view class="col"><reflesh-button></reflesh-button></view>
        </template>
        <view v-if="isSelectToday" class="flex-column">
          <card v-for="index in 20" :key="index">今日消费</card>

          <view v-if="isSelectHistory" class="flex-column">
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
          <view v-if="!itemList" style="text-align: center">
            <view> 无消费记录</view>
          </view>
          <view
            class="item card"
            v-for="item in itemList"
            :key="item.ID"
            @tap="pop(item)"
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
    computed: {
      itemList(): Array<any> {
        if (this.isSelectToday) return this.today;
        else if (this.isSelectHistory) return this?.history?.data;
        return [];
      },
      updateTime() {
        if (this.isSelectToday) return serviceStore.card.updateTime;
        else if (this.isSelectHistory) return this?.history?.updateTime;
        return '';
      }
    },
    setup() {
      let dateSel = ref(dayjs().format('YYYY-MM'));
      let balance = computed(() => serviceStore.card.balance || 0);
      let today = computed(() => serviceStore.card.today);
      let history = computed(() =>
        CardService.getCardHistory({
          year: parseInt(dateSel.value.split('-')[0]),
          month: parseInt(dateSel.value.split('-')[1])
        })
      );
      let getCardBalance = CardService.updateCardBalance;
      let getCardToday = CardService.updateCardToday;
      let getCardHistory = CardService.updateCardHistory;

      let obj: any | undefined;
      let selectedItem = ref(obj);
      let showPop = ref(false);
      let isSelectToday = ref(true);
      let isSelectHistory = ref(false);

      function pop(item) {
        selectedItem.value = item;
        showPop.value = true;
      }
      async function historyClick() {
        isSelectToday.value = false;
        isSelectHistory.value = true;
        await getCardHistory({
          year: parseInt(dateSel.value.split('-')[0]),
          month: parseInt(dateSel.value.split('-')[1])
        });
      }
      function todayClick() {
        isSelectToday.value = true;
        isSelectHistory.value = false;
        getCardToday();
      }

      async function onDateChange(e) {
        dateSel.value = e.detail.value;
        await getCardHistory({
          year: parseInt(dateSel.value.split('-')[0]),
          month: parseInt(dateSel.value.split('-')[1])
        });
      }
      return {
        dateSel,
        onDateChange,
        isSelectToday,
        isSelectHistory,
        historyClick,
        todayClick,
        selectedItem,
        balance,
        today,
        history,
        getCardBalance,
        getCardToday,
        getCardHistory,
        pop,
        showPop,
        dayjs
      };
    },
    mounted() {
      this.getCardBalance();
      this.getCardToday();
    }
  });
</script>

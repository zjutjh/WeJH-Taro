<template>
  <view class="background">
    <title-bar title="借阅信息"></title-bar>
    <scroll-view :scrollY="true">
      <view class="header-view">
        <image src="@/assets/photos/library.svg"></image>
        <view class="summary">
          <view>
            借阅：
            <text>{{ currentCount }}</text>
            本
          </view>
          <view>
            超期：
            <text>
              {{ currentExtendedCount }}
            </text>
            本
          </view>
        </view>
      </view>
      <card class="borrow-card">
        <template #header>
          <view class="col"></view>
          <view class="col">
            <view class="swicher">
              <w-button
                :class="{ 'button-not-active': !isSelectToday }"
                @tap="todayClick"
              >
                当前
              </w-button>
              <w-button
                :class="{ 'button-not-active': !isSelectHistory }"
                @tap="historyClick"
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
        <view>
          <view v-if="isSelectToday" class="flex-column">
            <card v-if="!borrowList" class="no-item">无借阅记录</card>
          </view>
          <view v-if="isSelectHistory" class="flex-column">
            <card v-if="!borrowList" class="no-item">无借阅记录</card>
            <card
              class="book-card"
              v-for="(item, index) in borrowList"
              :key="item.id"
              :style="
                index % 2
                  ? 'background-color: var(--wjh-color-yellow-light)'
                  : 'background-color: var(--wjh-color-green-light)'
              "
            >
              <view class="book-name"> {{ item.name }}</view>
              <view>{{
                `借阅日期：${item.time.split(' ')[0]} | ${
                  item.time.split(' ')[1]
                }`
              }}</view>
              <view v-if="item.returnTime">
                {{
                  `归还日期：${item.returnTime.split(' ')[0]} | ${
                    item.returnTime.split(' ')[1]
                  }`
                }}
              </view>
              <view v-if="item.isExtended < 0">
                {{ Math.abs(item.isExtended) }}天
              </view>
              <view v-if="item.isExtended > 0">
                {{ Math.abs(item.isExtended) }}天
              </view>
              <view
                class="book-index"
                :style="
                  index % 2
                    ? 'color: var(--wjh-color-orange)'
                    : 'color: var(--wjh-color-cyan)'
                "
              >
                {{ index + 1 }}
              </view>
            </card>
          </view>
        </view>
      </card>
    </scroll-view>
  </view>
</template>

<script lang="ts">
  import './index.scss';
  import { computed, defineComponent } from 'vue';
  import Card from '@/components/Card/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import RefleshButton from '@/components/RefleshButton/index.vue';
  import { WButton } from '@/components/button';
  import { LibraryService } from '@/services';
  import dayjs from 'dayjs';
  import { serviceStore } from '@/store';
  import { throttle } from '@/utils/tools';

  export default defineComponent({
    components: { Card, TitleBar, WButton, RefleshButton },
    setup() {
      const updateTime = computed(() => serviceStore.library.updateTime);
      const todayUpdateTime = computed(() =>
        dayjs(updateTime.value.current).format('MM-DD HH:mm')
      );
      const historyUpdateTime = computed(() =>
        dayjs(updateTime.value.history).format('MM-DD HH:mm')
      );
      return {
        updateTime,
        todayUpdateTime,
        historyUpdateTime
      };
    },
    mounted() {
      this.getLibraryCurrent();
    },
    computed: {
      borrowList(): Array<any> {
        if (this.isSelectToday) return this.current;
        else if (this.isSelectHistory) return this.history;
        return [];
      },
      history() {
        return serviceStore.library.history;
      },
      current() {
        return serviceStore.library.current;
      },
      currentCount() {
        return this.current ? this.current.length : 0;
      },
      currentExtendedCount() {
        return this.current
          ? this.current.filter((item) => item.IsExtended > 0).length
          : 0;
      }
    },
    data() {
      return {
        isSelectToday: true,
        isSelectHistory: false,
        isRefleshing: false
      };
    },
    methods: {
      async updateData() {
        this.isRefleshing = true;
        if (this.isSelectToday) await LibraryService.getLibraryCurrent();
        else await LibraryService.getLibraryHistory();
        this.isRefleshing = false;
      },
      getLibraryCurrent() {
        throttle(LibraryService.getLibraryCurrent);
      },
      getLibraryHistory() {
        throttle(LibraryService.getLibraryHistory);
      },
      onDateChange(e) {
        this.dateSel = e.detail.value;
        this.getLibraryHistory();
      },
      historyClick() {
        this.isSelectToday = false;
        this.isSelectHistory = true;
        this.getLibraryHistory();
      },
      todayClick() {
        this.isSelectToday = true;
        this.isSelectHistory = false;
        this.getLibraryCurrent();
      }
    }
  });
</script>

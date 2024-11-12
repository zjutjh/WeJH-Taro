<template>
  <theme-config>
    <title-bar title="借阅信息" back-button />
    <scroll-view :scroll-y="true">
      <view class="header-view">
        <taro-image :src="LibraryCoverImage" />
        <view class="summary">
          <view>
            借阅：
            <text>{{ libraryStore.borrowing.length }}</text>
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
          <view class="col" />
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
            <refresh-button :is-refreshing="isRefreshing" @tap="updateData" />
          </view>
        </template>
        <view>
          <view class="flex-column">
            <card v-if="!borrowList" class="no-item">
              无借阅记录
            </card>
            <card
              v-for="(item, index) in borrowList"
              :key="index"
              class="book-card"
              :style="{
                backgroundColor:
                  index % 2
                    ? 'var(--wjh-color-yellow-500)'
                    : 'var(--wjh-color-green-500)',
              }"
            >
              <view class="book-name">
                {{ item.name }}
              </view>
              <view>
                {{ `借阅日期：${item.time.split(" ")[0]} | ${item.time.split(" ")[1] }` }}
              </view>
              <view v-if="item.returnTime">
                {{ `归还日期：${item.returnTime.split(" ")[0]}` }}
              </view>
              <view
                class="book-index"
                :style="{
                  color:
                    index % 2
                      ? 'var(--wjh-color-orange-600)'
                      : 'var(--wjh-color-green-700)',
                }"
              >
                {{ index + 1 }}
              </view>
            </card>
          </view>
        </view>
      </card>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import "./index.scss";
import { computed, ref } from "vue";
import { Card, RefreshButton, ThemeConfig, TitleBar, WButton } from "@/components";
import { LibraryService } from "@/services";
import { BorrowBooksInfo } from "@/types/BorrowBooksInfo";
import useLibraryStore from "@/store/service/library";
import { useRequestNext } from "@/hooks";
import { Image as TaroImage } from "@tarojs/components";
import LibraryCoverImage from "@/assets/photos/library.svg";

const libraryStore = useLibraryStore();
const isSelectToday = ref(true);
const isSelectHistory = ref(false);
const isRefreshing = ref(false);

const { data: history } = useRequestNext(
  LibraryService.getLibraryHistory, {
    initialData: []
  }
);

const borrowList = computed((): BorrowBooksInfo[] => {
  if (isSelectToday.value) return libraryStore.borrowing;
  else if (isSelectHistory.value) return history.value;
  return [];
});

/** 超期本数 */
const currentExtendedCount = computed(() => {
  return libraryStore.borrowing.filter((item) => {
    return parseInt(item.overdueTime) > 0;
  }).length;
});

async function updateData() {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  if (isSelectToday.value) await LibraryService.getLibraryCurrent();
  else await LibraryService.getLibraryHistory();
  isRefreshing.value = false;
}

function historyClick() {
  isSelectToday.value = false;
  isSelectHistory.value = true;
}

function todayClick() {
  isSelectToday.value = true;
  isSelectHistory.value = false;
}
</script>

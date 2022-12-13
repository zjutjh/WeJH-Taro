<template>
  <view class="background">
    <title-bar title="借阅信息" back-button />
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
            <refresh-button
              @tap="updateData"
              :is-refreshing="isRefreshing"
            ></refresh-button>
          </view>
        </template>
        <view>
          <view class="flex-column">
            <card v-if="!borrowList" class="no-item">无借阅记录</card>
            <card
              class="book-card"
              v-for="(item, index) in borrowList"
              :key="index"
              :style="{
                backgroundColor: index % 2
                  ? 'var(--wjh-color-yellow-light)'
                  : 'var(--wjh-color-green-light)'
              }"
            >
              <view class="book-name"> {{ item.name }}</view>
              <view>{{
                `借阅日期：${item.time.split(' ')[0]} | ${
                  item.time.split(' ')[1]
                }`
              }}</view>
              <view v-if="item.returnTime">
                {{ `归还日期：${item.returnTime.split(' ')[0]}` }}
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

<script setup lang="ts">
import "./index.scss";
import { computed, ref, onMounted } from "vue";
import Card from "@/components/Card/index.vue";
import TitleBar from "@/components/TitleBar/index.vue";
import RefreshButton from "@/components/RefreshButton/index.vue";
import { WButton } from "@/components/button";
import { LibraryService } from "@/services";
import { serviceStore } from "@/store";
import { BorrowBooksInfo } from "@/types/BorrowBooksInfo";

const isSelectToday = ref(true);
const isSelectHistory = ref(false);
const isRefreshing = ref(false);

onMounted(() => {
  LibraryService.getLibraryCurrent();
  LibraryService.getLibraryHistory();
});

const borrowList = computed((): BorrowBooksInfo[] => {
  if (isSelectToday.value) return current.value;
  else if (isSelectHistory.value) return history.value;
  return [];
});

const history = computed(() => {
  return serviceStore.library.history;
});

const current = computed(() => {
  return serviceStore.library.current;
});

const currentCount = computed(() => {
  return current.value ? current.value.length : 0;
});

/**
 * 超期本书
 */
const currentExtendedCount = computed(() => {
  // FIXME: 缺数据，判断条件待完善
  return current.value
    ? current.value.filter((item) => item.overdueTime).length
    : 0;
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

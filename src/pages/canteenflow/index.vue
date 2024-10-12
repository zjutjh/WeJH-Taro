<template>
  <theme-config>
    <title-bar title="食堂流量" back-button />
    <scroll-view :scroll-y="true">
      <view class="header-view">
        <image src="@/assets/photos/canteenflow.svg" />
        <view class="extra" @tap="showHelp">
          <view class="icon-wrapper">
            <view class="extra-icon iconfont icon-announcement" />
          </view>
          <view class="label">
            公告
          </view>
        </view>
      </view>
      <view class="flex-column">
        <card v-if="!flow">
          无食堂流量信息
        </card>
        <card
          v-for="item in flow"
          :key="item.restaurantName"
          class="canteen-flow-item-card"
        >
          <view class="canteen-flow-list">
            <view class="col">
              <view
                v-if="item.restaurantName"
                class="name-wrapper"
                :style="nameColorMap(item.restaurantName[0])"
              >
                {{ item.restaurantName[0] }}
              </view>
            </view>
            <view class="col">
              <view> {{ item.restaurantName }}</view>
              <view>流量指数： {{ item.dealCount }}</view>
            </view>
            <view class="col">
              <view
                v-if="item.dealCount < 50"
                style="color: var(--wjh-color-green-600)"
              >
                空闲
              </view>
              <view v-else-if="item.dealCount < 100" style="color: var(--wjh-color-yellow-600)">
                适中
              </view>
              <view
                v-else
                style="color: var(--wjh-color-orange-600)"
              >
                忙碌
              </view>
            </view>
          </view>
        </card>
      </view>
    </scroll-view>
    <w-modal
      v-model:show="showModal"
      title="公告"
      :content="helpContent"
    />
  </theme-config>
</template>

<script setup lang="ts">
import { CanteenService } from "@/services";
import { Card, ThemeConfig, TitleBar, WModal } from "@/components";
import { computed, onMounted, ref } from "vue";
import { serviceStore } from "@/store";
import { helpText } from "@/constants/copywriting";
import "./index.scss";

const showModal = ref(false);
const helpContent = helpText.canteenflow;

const flow = computed(() => {
  if (serviceStore.canteen.flow?.data)
    return [...serviceStore.canteen.flow.data].reverse();
  else return [];
});

function nameColorMap(char: string) {
  const colorMap = {
    家: "blue",
    养: "blue",
    精: "green",
    毓: "green",
    博: "green"
  };
  return { backgroundColor: `var(--wjh-color-${colorMap[char]}-600)` };
}

function showHelp() {
  showModal.value = true;
}

onMounted(() => {
  CanteenService.getCanteenFlow();
});

</script>

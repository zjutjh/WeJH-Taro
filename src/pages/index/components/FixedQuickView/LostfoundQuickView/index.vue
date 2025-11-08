<template>
  <view class="quick-view-container" @tap="handleClick">
    <view class="header">
      <view class="title">
        失物寻物
      </view>
    </view>
    <view v-if="randomContent" class="content flex-column ">
      <text
        v-show="!randomContent?.type && randomContent?.item_name"
        class="text"
      >
        物品名称  {{ randomContent?.item_name }}
      </text>
      <text
        v-show="!randomContent?.type && randomContent?.lost_or_found_place"
        class="text"
        style="margin-top: -10px;"
      >
        遗失地点  {{ randomContent?.lost_or_found_place }}
      </text>
      <text
        v-show="!randomContent?.type && randomContent?.lost_or_found_time"
        class="text"
        style="margin-top: -10px;"
      >
        遗失时间  {{ randomContent?.lost_or_found_time }}
      </text>
      <text
        v-show="randomContent?.type && randomContent?.item_name"
        class="text"
      >
        物品名称  {{ randomContent?.item_name }}
      </text>
      <text
        v-show="randomContent?.type && randomContent?.lost_or_found_place"
        class="text"
        style="margin-top: -10px;"
      >
        拾得地点  {{ randomContent?.lost_or_found_place }}
      </text>
      <text
        v-show="randomContent?.type && randomContent?.lost_or_found_time"
        class="text"
        style="margin-top: -10px;"
      >
        拾得时间  {{ randomContent?.lost_or_found_time }}
      </text>
    </view>
    <view v-else :class="['content', 'empty']">
      <text class="campus">
        {{ defaultCampus }}
      </text>
      <text> 校区暂时没有失物寻物信息 </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useRequest } from "@/hooks";
import { LostfoundService } from "@/services";
import { computed, watch } from "vue";
import Taro from "@tarojs/taro";
import { serviceStore } from "@/store";
import "./index.scss";

const defaultCampus = computed(() => {
  return serviceStore.lostfound.lastOpenCampus;
});

watch([defaultCampus], ([newValue]) => {
  getRecords({
    campus: newValue,
    page_num: 1,
    page_size: 5
  });
});

const { data, run: getRecords } = useRequest(LostfoundService.getRecords, {
  defaultParams: {
    campus: defaultCampus.value,
    page_num: 1,
    page_size: 5
  }
});

const handleClick = () => {
  Taro.navigateTo({
    url: "/pages/lostfound/index"
  });
};

const randomContent = computed(() => {
  const list = data.value?.data.data;
  const realLength = list?.length || 0;
  return list?.length
    ? list[Math.floor(Math.random() * realLength)]
    : "";
});
</script>

<template>
  <quick-view
    title="失物寻物"
    icon-name="schoolcard"
    @tap="handleClick"
  >
    <view v-if="randomContent" :class="styles.container">
      <text> {{ randomContent }}</text>
    </view>
    <view v-else :class="[styles.container, styles.empty]">
      <text> 暂时没有失物寻物信息 </text>
    </view>
  </quick-view>
</template>

<script setup lang="ts">
import { useRequest } from "@/hooks";
import { LostfoundService } from "@/services";
import { computed } from "vue";
import { QuickView } from "..";
import styles from "./index.module.scss";
import Taro from "@tarojs/taro";

const { data } = useRequest(LostfoundService.getRecords, {
  defaultParams: {
    page_num: 1,
    page_size: 5,
  }
});

const handleClick = () => {
  Taro.navigateTo({
    url: "/pages/lostfound/index",
  });
};

const randomContent = computed(() => {
  const list = data.value?.data.data;
  const realLength = list?.length || 0;
  console.log(realLength);
  return list
    ? list[Math.floor(Math.random() * realLength)].content
    : "";
});

</script>

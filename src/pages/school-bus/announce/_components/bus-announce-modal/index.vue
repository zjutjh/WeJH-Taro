<template>
  <w-modal v-model:show="show" :class="styles.modal">
    <template #header>
      <text>{{ announce.title }}</text>
      <view :class="styles['publish-time']">
        <text>{{ publishTime }}</text>
      </view>
    </template>
    <view :class="styles['modal-content']">
      <view :class="styles['section-title']">公告摘要：</view>
      <view :class="[styles['article-content'], styles['abstract']]">
        {{ announce.abstract }}
      </view>

      <view :class="styles['section-title']">公告正文：</view>
      <view :class="styles['article-content']">
        <view v-for="line in announce.content" :key="line">{{ line }}</view>
      </view>
    </view>
  </w-modal>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import { computed } from "vue";

import { QueryBusAnnounceResponse } from "@/api/types/yxy";
import { WModal } from "@/components";

import styles from "./index.module.scss";

const props = defineProps<{
  announce: QueryBusAnnounceResponse["list"][number];
}>();

const show = defineModel<boolean>("show", {
  default: false
});

const publishTime = computed(() => {
  const time = props.announce.published_at;

  return dayjs(time).format("YYYY-MM-DD HH:mm");
});
</script>

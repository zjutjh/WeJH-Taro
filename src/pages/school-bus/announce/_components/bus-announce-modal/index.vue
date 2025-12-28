<template>
  <w-modal
    v-model:show="show"
    :title="props.announce?.title || ''"
    :class="styles['modal-container']"
  >
    <template #header>
      <view :class="styles['close-icon']" @tap="handleClose">
        <view class="at-icon at-icon-close"></view>
      </view>
    </template>

    <view :class="styles['modal-content']">
      <view :class="styles['meta-info']">
        <text>{{ publishTime }}</text>
      </view>
      <view :class="styles['divider']"></view>

      <view :class="styles['section-title']">公告摘要：</view>
      <view :class="[styles['article-content'], styles['abstract']]">
        {{ props.announce?.abstract }}
      </view>

      <view :class="styles['section-title']" :style="{ marginTop: '16px' }">公告正文：</view>
      <view :class="styles['article-content']">
        {{ props.announce?.content }}
      </view>
    </view>
  </w-modal>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import { computed } from "vue";

import { WModal } from "@/components";
import { BusAnnounceItem } from "@/pages/school-bus/_types";

import styles from "./index.module.scss";

const props = defineProps<{
  announce?: BusAnnounceItem;
}>();

const show = defineModel<boolean>("show", {
  default: false
});

const handleClose = () => {
  show.value = false;
};

const publishTime = computed(() => {
  const time = props.announce?.publishedAt;
  if (!time) {
    return "";
  }
  return dayjs(time).format("YYYY-MM-DD HH:mm");
});
</script>

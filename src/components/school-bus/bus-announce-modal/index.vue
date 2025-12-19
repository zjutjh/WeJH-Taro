<template>
  <w-modal
    :show="props.show"
    :mask="true"
    :title="props.announce?.title || ''"
    content=""
    :class="styles['modal-container']"
    @update:show="emit('update:show', $event)"
  >
    <template #header>
      <view :class="styles['close-icon']" @tap="handleClose">
        <view class="at-icon at-icon-close"></view>
      </view>
    </template>

    <view :class="styles['modal-content']">
      <view :class="styles['meta-info']">
        <text>{{ props.announce?.author }}</text>
        <text>{{ timeFormat(props.announce?.publishedAt) }}</text>
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

import { WModal } from "@/components";
import { BusAnnounceItem } from "@/types/school-bus";

import styles from "./index.module.scss";

const props = defineProps<{
  show: boolean;
  announce?: BusAnnounceItem;
}>();

const emit = defineEmits(["update:show"]);

const handleClose = () => {
  emit("update:show", false);
};

const timeFormat = (time?: string) => {
  if (!time) return "";
  return dayjs(time).format("YYYY-MM-DD HH:mm");
};
</script>

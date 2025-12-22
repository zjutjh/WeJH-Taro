<template>
  <card :title="props.item.title" :class="styles['bus-announce-card']">
    <view>
      {{ props.item.abstract }}
    </view>
    <template #footer>
      <view :class="styles['time-wrapper']">
        <view> {{ timeFormat(props.item.publishedAt) }}</view>
      </view>
    </template>
  </card>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";

import { Card } from "@/components";
import { BusAnnounceItem } from "@/types/school-bus";

import styles from "./index.module.scss";

const props = defineProps<{
  item: BusAnnounceItem;
}>();

const timeFormat = (time: string) => {
  return dayjs(time).format("YYYY.MM.DD");
};
</script>

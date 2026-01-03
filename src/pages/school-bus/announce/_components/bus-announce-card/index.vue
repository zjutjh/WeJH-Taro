<template>
  <card :title="props.item.title" :class="styles['bus-announce-card']">
    <view>
      {{ props.item.abstract }}
    </view>
    <template #footer>
      <view :class="styles['time-wrapper']">
        <view> {{ timeFormat(props.item.published_at) }}</view>
      </view>
    </template>
  </card>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";

import { QueryBusAnnounceResponse } from "@/api/types/yxy";
import { Card } from "@/components";

import styles from "./index.module.scss";

const props = defineProps<{
  item: QueryBusAnnounceResponse["list"][number];
}>();

const timeFormat = (time: string) => {
  return dayjs(time).format("YYYY.MM.DD");
};
</script>

<template>
  <view :class="styles.container">
    <template v-for="item in QUICK_FILTER_ITEMS" :key="item.id">
      <w-tag
        v-if="!item.shouldHide || !item.shouldHide(list)"
        :label="item.label"
        :active="modelValue.some((v) => v.id === item.id)"
        @click="handleToggle(item)"
      />
    </template>
  </view>
</template>

<script setup lang="ts">
import { WTag } from "@/components";

import { ParsedBusSchedule } from "../../_types";
import { QUICK_FILTER_ITEMS, QuickFilterItem } from "./constants";
import styles from "./index.module.scss";

defineProps<{
  list: ParsedBusSchedule[];
}>();

const modelValue = defineModel<QuickFilterItem[]>({ default: [] });

const handleToggle = (item: QuickFilterItem) => {
  const index = modelValue.value.findIndex((v) => v.id === item.id);
  if (index > -1) {
    modelValue.value.splice(index, 1);
  } else {
    modelValue.value.push(item);
  }
};
</script>

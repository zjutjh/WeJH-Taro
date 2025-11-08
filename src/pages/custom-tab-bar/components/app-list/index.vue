<template>
  <view v-if="applist" class="applist">
    <app-list-item
      v-for="(item, index) in applist"
      :key="index"
      :label="item.title"
      :url="item.route"
      :icon="item.route.split('/')[2]"
      :bg="item.backgroundColor"
      :require="item.require"
    />
  </view>
  <card v-else> 无可用服务 </card>
</template>

<script setup lang="ts">
import "./index.scss";

import { computed } from "vue";

import { Card } from "@/components";
import { serviceStore } from "@/store";

import AppListItem from "../app-list-item/index.vue";

const applist = computed(() => {
  return serviceStore.appList;
});
</script>

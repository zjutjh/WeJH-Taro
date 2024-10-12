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
  <card v-else>
    无可用服务
  </card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppListItem from "./AppListItem/index.vue";
import Card from "../Card/index.vue";
import { serviceStore } from "@/store";
import "./index.scss";

const applist = computed(() => {
  return serviceStore.appList;
});

</script>

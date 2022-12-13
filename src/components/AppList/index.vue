<template>
  <view class="applist" v-if="applist">
    <app-list-item
      v-for="(item, index) in applist"
      :key="index"
      :label="item.title"
      :url="item.route"
      :icon-url="getIconPath(item.route)"
      :bg="item.backgroundColor"
      :require="item.require"
    />
  </view>
  <card v-else> 无可用服务 </card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppListItem  from "./AppListItem/index.vue";
import { Card } from "@/components/index";
import { serviceStore } from "@/store";
import "./index.scss";

const applist = computed(() => {
  return serviceStore.appList;
});

const getIconPath = (route: string) => {
  const alias = route.split("/")[2];
  return `${alias}.svg`;
};

</script>

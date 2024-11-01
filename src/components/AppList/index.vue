<template>
  <view v-if="appListStore.list.length" class="applist">
    <app-list-item
      v-for="(item, index) in appListStore.list"
      :key="index"
      :label="item.title"
      :url="item.route"
      :bg="item.backgroundColor"
      :disabled="item.disabled"
      :icon="item.route.split('/')[2]"
    />
  </view>
  <card v-else>
    无可用服务
  </card>
</template>

<script setup lang="ts">
import AppListItem from "./AppListItem/index.vue";
import Card from "../Card/index.vue";
import "./index.scss";
import useAppListStore from "@/store/service/appList";

const appListStore = useAppListStore();

</script>

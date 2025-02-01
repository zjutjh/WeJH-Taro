<template>
  <view v-if="list.length" class="applist">
    <app-list-item
      v-for="(item, index) in list"
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
import useAppList from "@/store/service/appList";

const { list } = useAppList();

</script>

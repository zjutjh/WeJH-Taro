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

<script lang="ts">
  import AppListItem from './AppListItem/index.vue';
  import { defineComponent } from 'vue';
  import { AppListItem as item } from '@/types/AppList';
  import Card from '@/components/Card/index.vue';
  import { serviceStore } from '@/store';
  import './index.scss';

  export default defineComponent({
    components: { AppListItem, Card },
    computed: {
      applist(): item[] | undefined {
        return serviceStore.appList;
      }
    },
    methods: {
      getIconPath(route: string): string {
        const alias = route.split('/')[2];
        return `${alias}.svg`;
      }
    }
  });
</script>

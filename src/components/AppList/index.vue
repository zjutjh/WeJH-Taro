<template>
  <view class="applist">
    <app-list-item
      v-for="(item, index) in applist"
      :key="index"
      :label="item.title"
      :url="item.route"
      :app-id="item.appId"
      :icon-url="getIconPath(item.route)"
      :bg="item.backgroundColor"
    />
  </view>
</template>

<script lang="ts">
  import AppListItem from './AppListItem/index.vue';
  import { defineComponent } from 'vue';
  import { AppListItem as item } from '@/types/AppList';
  import { serviceStore } from '@/store';
  import './index.scss';

  export default defineComponent({
    components: { AppListItem },
    computed: {
      applist(): item[] {
        return serviceStore.appList || [];
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

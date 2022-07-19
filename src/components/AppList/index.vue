<template>
	<card class="applist">
		<app-list-item v-for="(item, index) in applist" :key="index" :label="item.title" :url="item.route" :app-id="item.appId" :icon-url="item.icon" :bg="item.backgroundColor" />
	</card>
</template>
<script lang="ts">
	import AppListItem from './AppListItem/index.vue';
	import Card from '@/components/Card/index.vue';
	import { defineComponent } from 'vue';
	import { AppListItem as item } from '@/types/AppList';
	import { serviceStore } from '@/store';
	import './index.scss';

	export default defineComponent({
		components: { AppListItem, Card },
		computed: {
			applist(): item[] {
				return serviceStore.appList || [];
			}
		}
	});
</script>

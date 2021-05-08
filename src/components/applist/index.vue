<template>
	<view class="applist">
		<app-list-item v-for="(item, index) in applist" :key="index" :label="item.title" :url="item.route" :icon-url="item.icon" :bg="item.backgroundColor"></app-list-item>
	</view>
</template>
<script lang="ts">
	import { defineComponent } from 'vue';
	import { systemStore } from '@/store';
	import AppListItem from './applistItem/index.vue';
	import { AppListItem as item } from '@/interface/AppList';
	import './index.scss';

	export default defineComponent({
		components: { AppListItem },
		computed: {
			applist(): Array<item> {
				return systemStore.appList;
			}
		}
	});
</script>

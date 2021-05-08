<template>
	<header-tab-view title="通知" :show-tab="false">
		<template v-slot:prefix>
			<text class="iconfont icon-notification-badge-line"></text>
		</template>
		<template v-slot:content>
			<view v-if="!announcement" style="text-align: center">
				<image src="@/assets/g/noData.svg"></image>
				<view>无通知</view>
			</view>
			<view class="item" v-for="item in announcement" :key="item.id" @tap="pop(item)">
				<view class="cicle" v-if="item.title">
					{{ item.title[0] }}
				</view>
				<view class="item-text">
					<view> {{ item.title }}</view>
					<view> {{ cutString(item.content, 30) }}</view>
					<view>更新： {{ item.publishTime }}</view>
				</view>
			</view>
		</template>
	</header-tab-view>
	<pop-view v-model:show="showPop">
		<card class="pop-card">
			<scroll-view v-if="selectedItem">
				<view class="title">{{ selectedItem.title }}</view>
				<view>{{ selectedItem.content }}</view>
			</scroll-view>
		</card>
	</pop-view>
</template>

<script lang="ts">
	import { computed, defineComponent, Ref, ref } from 'vue';
	import { serviceStore, systemStore } from '@/store';
	import { SystemService } from '@/services';
	import Card from '@/components/card/index.vue';
	import PopView from '@/components/popView/index.vue';
	import HeaderTabView from '@/components/headerTabView/index.vue';
	import './index.scss';
	import { Announcement } from '@/interface/Announcement';

	export default defineComponent({
		components: { Card, HeaderTabView, PopView },
		setup() {
			function reflesh() {
				SystemService.getAnnouncement();
			}
			const announcement = computed(() => systemStore.announcement.announcements);
			let itemIpm: Announcement | undefined;
			let selectedItem = ref(itemIpm);
			let showPop = ref(false);
			function pop(item: Announcement) {
				selectedItem.value = item;
				showPop.value = true;
			}
			return {
				reflesh,
				announcement,
				pop,
				showPop,
				selectedItem,
				cutString: (str: string, n) => {
					if (str.length > n) return str.substring(0, 30) + '...';
					return str;
				}
			};
		},
		mounted() {
			this.reflesh();
		}
	});
</script>

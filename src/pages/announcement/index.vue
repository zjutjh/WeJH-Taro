<template>
	<header-tab-view title="通知" :show-tab="false" :img="require('@/assets/notice/notice.svg')">
		<template v-slot:prefix>
			<text class="iconfont icon-notification-badge-line"></text>
		</template>
		<template v-slot:content>
			<view v-if="!announcement" style="text-align: center">
				<view>无通知</view>
			</view>
			<card class="item" v-for="item in announcement" :key="item.id" @tap="pop(item)">
				<view class="cicle" v-if="item.title">
					{{ item.title[0] }}
				</view>
				<view class="item-text">
					<view> {{ item.title }}</view>
					<view> {{ cutString(item.content, 30) }}</view>
					<view>发布于：{{ timeFotmat(item.publishTime) }}</view>
				</view>
			</card>
		</template>
	</header-tab-view>
	<pop-view v-model:show="showPop">
		<card class="pop-card">
			<scroll-view v-if="selectedItem">
				<view class="title">{{ selectedItem.title }}</view>
				<view class="center">{{ timeFotmat(selectedItem.publishTime) }}</view>
				<view>{{ selectedItem.content }}</view>
			</scroll-view>
		</card>
	</pop-view>
</template>

<script lang="ts">
	import { computed, defineComponent, ref } from 'vue';
	import { Announcement } from '@/types/Announcement';
	import Card from '@/components/Card/index.vue';
	import HeaderTabView from '@/components/HeaderTabView/index.vue';
	import PopView from '@/components/PopView/index.vue';
	import { SystemService } from '@/services';
	import dayjs from 'dayjs';
	import { serviceStore } from '@/store';

	import './index.scss';
	export default defineComponent({
		components: { Card, HeaderTabView, PopView },
		setup() {
			function reflesh() {
				SystemService.getAnnouncement();
			}
			const announcement = computed(() => serviceStore.announcement.announcements);
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
				},
				timeFotmat: (time: string) => {
					return dayjs(time).format('MM月DD日 HH:mm');
				}
			};
		},
		mounted() {
			this.reflesh();
		}
	});
</script>

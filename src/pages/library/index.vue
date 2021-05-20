<template>
	<header-tab-view title="图书馆" :show-tab="true" :img="require('@/assets/library/library.svg')">
		<template v-slot:tab>
			<view>
				<text> 借阅 {{ currentCount }} 本 </text>
				<text> 超期 {{ currentExtendedCount }} 本 </text>
			</view>
			<view class="tabs">
				<button :class="{ 'button-active': isSelectToday }" @tap="todayClick">当前</button>
				<button :class="{ 'button-active': isSelectHistory }" @tap="historyClick">历史</button>
			</view>
		</template>
		<template v-slot:content>
			<view>
				<view v-if="isSelectToday" class="title">
					<text>当前借阅</text>
				</view>

				<view v-if="isSelectHistory" class="title">
					<text>历史借阅</text>
				</view>
				<view v-if="!itemList" class="no-item">
					<image src="@/assets/g/noData.svg"></image>
					<view> 无借阅记录 </view>
				</view>
				<card class="item" v-for="item in itemList" :key="item.id">
					<view class="cicle" v-if="item.name">
						<text>
							{{ item.name[0] }}
						</text>
					</view>
					<view class="item-text">
						<view :class="{ tirm: item.isExtended }"> {{ item.name }}</view>
						<view>{{ item.libraryID }}</view>
						<view>借阅日期：{{ item.time }}</view>
						<view v-if="item.returnTime">归还日期：{{ item.returnTime }}</view>
						<view class="ext" v-if="item.isExtended < 0">{{ Math.abs(item.isExtended) }}天</view>
						<view class="ext red" v-if="item.isExtended > 0">{{ Math.abs(item.isExtended) }}天</view>
					</view>
				</card>
			</view>
		</template>
	</header-tab-view>
</template>

<script lang="ts">
	import './index.scss';
	import { defineComponent, computed } from 'vue';
	import { serviceStore } from '@/store';
	import { throttle } from '@/utils/tools';
	import { LibraryService } from '@/services';
	import headerTabView from '@/components/headerTabView/index.vue';
	import Card from '@/components/card/index.vue';
	import dayjs from 'dayjs';
	export default defineComponent({
		components: { headerTabView, Card },
		setup() {
			let updateTime = computed(() => serviceStore.library.updateTime);
			let todayUpdateTime = computed(() => dayjs(updateTime.value.current).format('MM-DD HH:mm'));
			let historyUpdateTime = computed(() => dayjs(updateTime.value.history).format('MM-DD HH:mm'));
			return {
				updateTime,
				todayUpdateTime,
				historyUpdateTime
			};
		},
		mounted() {
			LibraryService.getLibraryCurrent();
		},
		computed: {
			itemList(): Array<any> {
				if (this.isSelectToday) return this.current;
				else if (this.isSelectHistory) return this.history;
				return [];
			},
			history() {
				return serviceStore.library.history;
			},
			current() {
				return serviceStore.library.current;
			},
			currentCount() {
				return this.current ? this.current.length : 0;
			},
			currentExtendedCount() {
				return this.current ? this.current.filter((item) => item.IsExtended > 0).length : 0;
			}
		},
		data() {
			return {
				isSelectToday: true,
				isSelectHistory: false,
				showImage: true,
				imageStyle: {
					height: '400rpx',
					margin: '0rpx'
				}
			};
		},
		methods: {
			getLibraryCurrent: throttle(LibraryService.getLibraryCurrent),
			getLibraryHistory: throttle(LibraryService.getLibraryHistory),
			onDateChange: function (e) {
				this.dateSel = e.detail.value;
				this.getLibraryHistory();
			},
			historyClick() {
				this.isSelectToday = false;
				this.isSelectHistory = true;
				this.getLibraryHistory();
			},
			todayClick() {
				this.isSelectToday = true;
				this.isSelectHistory = false;
				this.getLibraryCurrent();
			}
		}
	});
</script>

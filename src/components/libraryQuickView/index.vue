<template>
	<card @tap="nav">
		<view class="title">
			<text class="iconfont icon-book-fill"></text>
			<text>图书馆</text>
		</view>
		<view class="div-line"></view>
		<text class="sub-text">当前借阅({{ dayjs(updateTime.current).fromNow() }})</text>
		<view v-if="!current" class="no-data-text">当前无借阅图书</view>
		<view v-for="item in current" :key="item.id">
			<view class="lesson">{{ item }} </view>
		</view>
	</card>
</template>
<script lang="ts">
	import Card from '../Card/index.vue';
	import { LibraryService } from '@/services';
	import Taro from '@tarojs/taro';
	import dayjs from 'dayjs';
	import { defineComponent } from 'vue';
	import { serviceStore } from '@/store';
	import { throttle } from '@/utils/tools';
	export default defineComponent({
		components: { Card },
		setup() {
			return {
				dayjs
			};
		},
		mounted() {
			this.getLibraryToday();
		},
		computed: {
			current() {
				return serviceStore.library.current;
			},
			updateTime() {
				return serviceStore.library.updateTime;
			},
			currentCount() {
				return this.current ? this.current.length : 0;
			},
			currentExtendedCount() {
				return this.current ? this.current.filter((item) => item.IsExtended > 0).length : 0;
			}
		},
		methods: {
			getLibraryToday: throttle(LibraryService.getLibraryCurrent),
			nav() {
				Taro.navigateTo({ url: '/pages/library/index' });
			}
		}
	});
</script>
<style>
	.balance {
		font-size: 3rem;
		font-weight: bolder;
		margin: 0.5rem;
	}

	.div-line {
		background: #e0e3da;
		width: 100%;
		height: 5px;
	}
	.no-data-text {
		font-size: 1rem;
		padding: 1rem;
		text-align: center;
	}
</style>

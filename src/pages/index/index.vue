<template>
	<title-bar title="微精弘">
		<text class="iconfont icon-notification-badge-line" @tap="nav2announcement"></text>
	</title-bar>

	<view class="quick-card-view" v-if="isActive">
		<lesson-table-quick-view v-if="isBindZf" :hide="pageHide"></lesson-table-quick-view>
		<school-card-quick-view v-if="isBindCard"></school-card-quick-view>
		<library-quick-view v-if="isBindLibrary"></library-quick-view>
	</view>
	<view class="no-active" v-else>
		<card>
			<view class="title">激活微精弘</view>
			<image mode="aspectFit" style="width: 100%" :src="require('@/assets/g/welcome.png')"></image>
			<button class="active" @tap="nav2activation">激活</button>
		</card>
	</view>
	<pop-view v-model:show="showPop">
		<view class="app-list-card card">
			<app-list></app-list>
		</view>
	</pop-view>
	<nav-bar @plusClick="plusClick" :show-plus="isActive"></nav-bar>
</template>
<script lang="ts">
	import Taro from '@tarojs/taro';
	import { defineComponent } from 'vue';
	import { serviceStore } from '@/store';

	import AppList from '@/components/applist/index.vue';
	import Card from '@/components/card/index.vue';
	import NavBar from '@/components/navBar/index.vue';
	import LessonTableQuickView from '@/components/lessonsTableQuickView/index.vue';
	import LibraryQuickView from '@/components/libraryQuickView/index.vue';
	import PopView from '@/components/popView/index.vue';
	import SchoolCardQuickView from '@/components/schoolCardQuickView/index.vue';
	import TitleBar from '@/components/titleBar/index.vue';
	import { ZFService } from '@/services';
	import './index.scss';
	export default defineComponent({
		components: {
			NavBar,
			AppList,
			SchoolCardQuickView,
			LibraryQuickView,
			LessonTableQuickView,
			PopView,
			TitleBar,
			Card
		},
		data() {
			return {
				show: false,
				showPop: false,
				pageHide: false
			};
		},
		onHide() {
			this.pageHide = true;
		},
		onShow() {
			this.pageHide = false;
		},
		computed: {
			isActive() {
				return serviceStore.user.isActive;
			},
			isBindZf() {
				return serviceStore.user.isBindZF;
			},
			isBindCard() {
				return serviceStore.user.isBindCard;
			},
			isBindLibrary() {
				return serviceStore.user.isBindLibrary;
			}
		},
		methods: {
			plusClick() {
				this.showPop = true;
			},
			nav2announcement() {
				Taro.navigateTo({ url: '/pages/announcement/index' });
			},
			nav2activation() {
				Taro.navigateTo({
					url: '/pages/activation/index'
				});
			}
		},
		setup() {
			ZFService.getTodayLessonTable();
		}
	});
</script>

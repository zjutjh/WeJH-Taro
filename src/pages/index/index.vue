<template>
	<title-bar title="微精弘">
		<text class="iconfont icon-notification-badge-line" @tap="nav2announcement"></text>
	</title-bar>
	<scroll-view v-if="isActive" :scrollY="true">
		<view class="quick-card-view">
			<lesson-table-quick-view v-if="isBindZf" :hide="pageHide"></lesson-table-quick-view>
			<school-card-quick-view v-if="isBindCard"></school-card-quick-view>
			<library-quick-view v-if="isBindLibrary"></library-quick-view>
		</view>
	</scroll-view>
	<scroll-view v-else :scrollY="true">
		<view class="no-active">
			<card>
				<view class="title">激活微精弘</view>
				<button class="active" @tap="nav2activation">激活</button>
			</card>
		</view>
	</scroll-view>
	<pop-view v-model:show="showPop">
		<view class="app-list-card card">
			<app-list></app-list>
		</view>
	</pop-view>
	<nav-bar @plusClick="plusClick" :show-plus="isActive"></nav-bar>
</template>
<script lang="ts">
	import AppList from '@/components/AppList/index.vue';
	import Card from '@/components/Card/index.vue';
	import LessonTableQuickView from '@/components/LessonsTableQuickView/index.vue';
	import LibraryQuickView from '@/components/LibraryQuickView/index.vue';
	import NavBar from '@/components/NavBar/index.vue';
	import PopView from '@/components/PopView/index.vue';
	import SchoolCardQuickView from '@/components/SchoolCardQuickView/index.vue';
	import Taro from '@tarojs/taro';
	import TitleBar from '@/components/TitleBar/index.vue';
	import { ZFService } from '@/services';
	import { defineComponent } from 'vue';
	import { serviceStore } from '@/store';
	import './index.scss';
	export default defineComponent({
		components: {
			AppList,
			NavBar,
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

<template>
	<scroll-view :scrollY="true">
		<title-bar title="我的"></title-bar>
		<card class="my-header">
			<view class="avatar">
				<open-data type="userAvatarUrl" />
			</view>
			<view>
				<open-data class="name" type="userNickName" />
				<view class="sub-text" v-if="userInfo">{{ userInfo.studentID }}</view>

				<button class="active" v-if="!isActive" @tap="nav2activation">激活</button>
				<view v-else class="sub-text"
					>微精弘 <nut-tag round type="primary">{{ buildTag }}</nut-tag></view
				>
			</view>
		</card>

		<view class="flex" v-if="isActive">
			<card class="item" v-for="item in items" :key="item.title" @tap="nav2url(item.url)">
				<image v-if="item.icon" mode="heightFix" :src="item.icon"></image>
				<text>{{ item.title }}</text>
			</card>
		</view>
		<view v-else>
			<text class="sub-text centet">激活享受更多精彩</text>
		</view>
		<nav-bar :show-plus="false"></nav-bar>
	</scroll-view>
</template>

<script lang="ts">
	import { serviceStore, systemStore } from '@/store';
	import Card from '@/components/Card/index.vue';
	import NavBar from '@/components/NavBar/index.vue';
	import { Tag as NutTag } from '@nutui/nutui-taro';
	import Taro from '@tarojs/taro';
	import TitleBar from '@/components/TitleBar/index.vue';
	import { UserService } from '@/services';
	import { defineComponent } from 'vue';

	import './index.scss';
	export default defineComponent({
		components: { NavBar, TitleBar, Card, NutTag },
		data() {
			return {
				items: [
					{
						icon: require('@/assets/icons/bind.svg'),
						title: '绑定',
						url: '/pages/bind/index'
					},
					{
						icon: require('@/assets/icons/lab.svg'),
						title: '实验室',
						url: '/pages/lab/index'
					},
					{
						icon: require('@/assets/icons/feedback.svg'),
						title: '反馈',
						url: '/pages/connect/index'
					},
					{
						icon: require('@/assets/icons/setting.svg'),
						title: '设置',
						url: '/pages/setting/index'
					},
					{
						icon: require('@/assets/icons/about.svg'),
						title: '关于',
						url: '/pages/about/index'
					}
				]
			};
		},
		methods: {
			nav2activation() {
				Taro.navigateTo({
					url: '/pages/activation/index'
				});
			},
			nav2url(url: string | undefined) {
				if (url)
					Taro.navigateTo({
						url: url
					});
			}
		},
		computed: {
			userInfo() {
				return serviceStore.user.info;
			},
			isActive() {
				return serviceStore.user.isActive;
			},
			buildTag() {
				return process.env.TAG;
			}
		},
		mounted() {
			UserService.getUserInfo();
			console.log(systemStore);
		}
	});
</script>

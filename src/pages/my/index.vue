<template>
	<view>
		<title-bar title="我的"></title-bar>

		<card class="my-header">
			<view class="avatar">
				<open-data type="userAvatarUrl" />
			</view>
			<view>
				<text class="name" v-if="userInfo">
					{{ userInfo.username }}
				</text>
				<open-data v-else class="name" type="userNickName" />
				<text class="sub-text" v-if="userInfo">{{ userInfo.studentID }}</text>

				<button v-if="!isActive" @tap="nav2activation">激活</button>
				<text v-else class="sub-text">微精弘—Dev</text>
			</view>
		</card>

		<view class="flex" v-if="isActive">
			<view class="item" v-for="item in items" :key="item.title" @tap="nav2url(item.url)">
				<image v-if="item.icon" mode="heightFix" :src="item.icon"></image>
				<text>{{ item.title }}</text>
			</view>
		</view>
		<view v-else>
			<text class="sub-text">激活享受更多精彩</text>
		</view>
		<nav-bar></nav-bar>
	</view>
</template>

<script lang="ts">
	import NavBar from '@/components/navBar/index.vue';
	import Card from '@/components/card/index.vue';
	import TitleBar from '@/components/titleBar/index.vue';

	import { defineComponent } from 'vue';

	import { UserService } from '@/services';
	import Taro from '@tarojs/taro';
	import { serviceStore } from '@/store';
	import './index.scss';
	export default defineComponent({
		components: { NavBar, TitleBar, Card },
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
						title: '反馈'
					},
					{
						icon: require('@/assets/icons/about.svg'),
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
			}
		},
		mounted() {
			UserService.getUserInfo();
		}
	});
</script>

<template>
	<view class="title-bar" :style="titleStyle" :class="{ background: showBackground }">
		<view class="bg-default" v-if="loading"></view>
		<view :style="justTitleStyle">
			<text v-if="showBackButton" class="back-button iconfont icon-arrow-left-s-line" @tap="goBack"></text>
			<slot name="prefix"></slot>
			<text class="back-button">{{ title }}</text>
			<slot> </slot>
		</view>
	</view>
</template>
<script lang="ts">
	import Taro from '@tarojs/taro';
	import { defineComponent } from 'vue';
	import { systemStore } from '@/store';
	import './index.scss';
	export default defineComponent({
		props: {
			title: String,
			showBackButton: Boolean,
			showBackground: Boolean
		},
		computed: {
			loading() {
				return systemStore.loading;
			},
			titleStyle() {
				if (process.env.TARO_ENV != 'weapp')
					return {
						height: '20px'
					};

				let MenuRect = Taro.getMenuButtonBoundingClientRect();
				let statusBarHeight = Taro.getSystemInfoSync().statusBarHeight;
				return {
					height: MenuRect.top + MenuRect.height + MenuRect.top - statusBarHeight + 'px'
				};
			},
			justTitleStyle() {
				if (process.env.TARO_ENV != 'weapp')
					return {
						height: '20px',
						marginTop: '10px',
						display: 'flex',
						fontSize: '1.5rem',
						lineHeight: '20px'
					};

				let MenuRect = Taro.getMenuButtonBoundingClientRect();
				return {
					height: MenuRect.height + 'px',
					marginTop: MenuRect.top + 'px',
					display: 'flex',
					fontSize: '1.5rem',
					lineHeight: MenuRect.height + 'px'
				};
			}
		},
		methods: {
			goBack() {
				Taro.navigateBack();
			}
		}
	});
</script>

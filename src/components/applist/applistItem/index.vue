<template>
	<view class="applist-item" @tap="appTaped">
		<view class="applist-bg" :style="itemBackgroundStyle" data-test="bg">
			<image class="applist-item-icon" :src="iconUrl" />
		</view>
		<text data-test="label">{{ label }}</text>
	</view>
</template>
<script lang="ts">
	import { defineComponent } from 'vue';
	import './index.scss';
	import Taro from '@tarojs/taro';

	export default defineComponent({
		props: {
			label: String,
			iconUrl: String,
			url: String,
			bg: {
				default: 'red',
				type: String
			}
		},
		computed: {
			itemBackgroundStyle() {
				return {
					backgroundColor: this.bg
				};
			}
		},
		methods: {
			async appTaped() {
				if (this.url) await Taro.navigateTo({ url: this.url });
			}
		}
	});
</script>

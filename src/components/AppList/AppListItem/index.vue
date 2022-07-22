<template>
	<view class="applist-item" @tap="appTaped">
		<card class="applist-bg" :color="getColorNumber" data-test="bg" inner>
			<image class="applist-item-icon" :src="require('@/assets/icons/applist/' + iconUrl)"></image>
		</card>
		<text class="label" data-test="label">{{ label }}</text>
	</view>
</template>
<script lang="ts">
	import Taro from '@tarojs/taro';
	import Card from '@/components/Card/index.vue';
	import { defineComponent } from 'vue';
	import './appListiItem.scss';

	const colorSetMap = { green: 0, blue: 1, cyan: 2, orange: 3, yellow: 4 };
	export default defineComponent({
		name: 'AppListItem',
		components: {
			card: Card
		},
		props: {
			label: String,
			iconUrl: String,
			url: String,
			appId: { type: String },
			bg: {
				default: 'red',
				type: String
			}
		},
		computed: {
			getColorNumber() {
				return colorSetMap[this.bg];
			}
		},
		methods: {
			async appTaped() {
				if (this.appId) await Taro.navigateToMiniProgram({ appId: this.appId, path: this.url });
				else if (this.url) await Taro.navigateTo({ url: this.url });
			},
			getRequireWrapper() {
				let tmp = require('@/assets/icons/bind.svg');
				console.log(tmp);
				tmp = '/assets/icons/bind.svg';
				return tmp;
			}
		}
	});
</script>

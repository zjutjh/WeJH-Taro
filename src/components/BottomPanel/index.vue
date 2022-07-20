<template>
	<view class="bottom-bar" :class="{ 'bottom-bar-ios': isNewIPhone }">
		<slot></slot>
	</view>
</template>
<script lang="ts">
	import Taro from '@tarojs/taro';
	import { defineComponent } from 'vue';
	import './style/index.scss';

	export default defineComponent({
		computed: {
			isNewIPhone(): boolean {
				let info = Taro.getSystemInfoSync();
				if (!info.model) return false;
				console.log(info.model.toString());
				let isNewIphone = info.model.match('(iPhone X|iPhone XS|iPhone 11|iPhone 12|iPhone 13|iPhone14)')?.length;
				return isNewIphone !== undefined && isNewIphone > 0;
			}
		}
	});
</script>

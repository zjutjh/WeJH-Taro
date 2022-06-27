<template>
	<nut-fixed-nav :position="{ bottom: '100px' }" v-model:visible="visible" :nav-list="navList" @selected="navSelected" />
	<pop-view v-model:show="showPop">
		<view class="app-list-card card">
			<app-list></app-list>
		</view>
	</pop-view>
</template>

<script lang="ts">
	import { reactive, ref } from 'vue';
	import AppList from '@/components/AppList/index.vue';
	import { FixedNav as NutFixedNav } from '@nutui/nutui-taro';
	import PopView from '@/components/PopView/index.vue';
	import Taro from '@tarojs/taro';
	import { defineComponent } from 'vue';
	import './index.scss';

	export default defineComponent({
		components: {
			NutFixedNav,
			PopView,
			AppList
		},
		setup() {
			const visible = ref(false);
			const showPop = ref(false);
			const navList = reactive([
				{
					id: 1,
					text: '首页',
					icon: 'https://img11.360buyimg.com/imagetools/jfs/t1/117646/2/11112/1297/5ef83e95E81d77f05/daf8e3b1c81e3c98.png',
					action: () => {
						Taro.navigateTo({
							url: '/pages/index/index'
						});
					}
				},
				{
					id: 2,
					text: '分类',
					icon: 'https://img12.360buyimg.com/imagetools/jfs/t1/119490/8/9568/1798/5ef83e95E968c69a6/dd029326f7d5042e.png',
					action: () => {
						showPop.value = true;
					}
				},
				{
					id: 3,
					text: '我的',
					icon: 'https://img12.360buyimg.com/imagetools/jfs/t1/147573/29/1603/1721/5ef83e94E1393a678/5ddf1695ec989373.png',
					action: () => {
						Taro.navigateTo({
							url: '/pages/my/index'
						});
					}
				}
			]);
			function navSelected({ item }) {
				console.log(item, item.action);
				item.action();
			}
			return {
				navSelected,
				showPop,
				visible,
				navList
			};
		}
	});
</script>

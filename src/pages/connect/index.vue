<template>
	<title-bar style="position: fixed" :show-background="true" title="反馈和帮助" :showBackButton="true"></title-bar>
	<scroll-view :scrollY="true">
		<view class="feedback-view">
			<image mode="aspectFit" :src="require('@/assets/feedback/feedback.svg')" style="height: 40vh; width: 100%; margin: auto; display: block"></image>
			<cell-group title="反馈和帮助">
				<cell class="cell-button" title="常见问题" is-link @tap="nav2FAQ" />
				<cell class="cell-button" title="加入交流群" @tap="showGroups" />
			</cell-group>
		</view>
	</scroll-view>
</template>

<script lang="ts">
	import { Cell, CellGroup } from '@nutui/nutui-taro';
	import Taro from '@tarojs/taro';
	import TitleBar from '@/components/TitleBar/index.vue';
	import './index.scss';

	const groupInfo = [
		{
			name: '一群',
			id: '462530805'
		},
		{
			name: '二群',
			id: '282402782'
		}
	];
	export default {
		components: {
			TitleBar,
			Cell,
			CellGroup
		},
		methods: {
			nav2FAQ(e) {
				Taro.navigateTo({
					url: '/pages/connect/faq/index'
				});
			},
			showGroups() {
				Taro.showActionSheet({
					itemList: groupInfo.map((item) => `${item.name}(${item.id})`),
					success({ tapIndex }) {
						Taro.setClipboardData({
							data: groupInfo[tapIndex].id
						});
					}
				});
			}
		}
	};
</script>

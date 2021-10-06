<template>
	<title-bar style="position: fixed" :show-background="true" title="反馈和帮助" :showBackButton="true"></title-bar>
	<scroll-view :scrollY="true">
		<view class="feedback-view">
			<cell-group title="反馈和帮助">
				<cell title="常见问题" is-link @click="nav2FAQ" />
				<button class="cell-button" open-type="contact">联系我们</button>
				<button class="cell-button" open-type="feedback">反馈问题</button>
				<cell title="加入交流群" @click="showGroups" />
			</cell-group>
		</view>
	</scroll-view>
</template>

<script>
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
			nav2FAQ() {
				Taro.navigateTo({
					url: '/pages/connect/qna/index'
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

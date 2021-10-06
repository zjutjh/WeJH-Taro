<template>
	<title-bar style="position: fixed" :show-background="true" title="FAQ" :showBackButton="true"></title-bar>
	<scroll-view :scrollY="true">
		<view class="collapse-view">
			<collapse v-model:active="activeName" :accordion="true" icon="down-arrow">
				<collapse-item v-for="item in data" :key="item.id" :title="item.title" :name="item.id">
					<view>
						<image v-if="item.img" :style="{ height: item.img.height, width: '100%' }" :src="item.img.url" /><text>{{ item.content }}</text>
					</view></collapse-item
				>
			</collapse>
		</view>
	</scroll-view>
</template>

<script>
	import { Collapse, CollapseItem } from '@nutui/nutui-taro';
	import Data from './data.json';
	import TitleBar from '@/components/TitleBar/index.vue';
	import { ref } from 'vue';
	import './index.scss';
	export default {
		components: {
			TitleBar,
			Collapse,
			CollapseItem
		},
		setup() {
			const activeName = ref(1);
			return {
				data: Data,
				activeName
			};
		}
	};
</script>

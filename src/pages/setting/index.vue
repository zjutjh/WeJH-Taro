<template>
	<title-bar title="设置" :showBackButton="true"></title-bar>
	<view class="background"></view>
	<scroll-view :scrollY="true">
		<card class="card-view">
			<view>
				<text>当前没有可设置功能，尽情期待！😚</text>
			</view>
		</card>
	</scroll-view>
</template>

<script lang="ts">
	import Card from '@/components/Card/index.vue';
	import TitleBar from '@/components/TitleBar/index.vue';
	import './index.scss';
	export default {
		components: {
			TitleBar,
			Card
		}
	};
</script>

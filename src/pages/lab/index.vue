<template>
	<title-bar title="实验室" :showBackButton="true"></title-bar>
	<card>
		<view>
			<text>当前没有实验功能，尽情期待！😚</text>
		</view>
	</card>
	<card>
		<view class="info-p"> 精弘网络@2021 </view>
	</card>
</template>

<script>
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

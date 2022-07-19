<template>
	<quick-view @tap="nev2Card">
		<view class="title">
			<text class="iconfont icon-wallet-3-fill"></text>
			<view class="title-split"></view>
			<text>校园卡</text>
		</view>
		<view class="div-line"></view>
		<text class="sub-text"> 当前余额({{ balanceUpdateTimeString }}) </text>
		<view class="quickcard-balance">
			<text> {{ balance }} </text>
		</view>
	</quick-view>
</template>
<script lang="ts">
	import QuickView from '../QuickView/index.vue';
	import { CardService } from '@/services';
	import Taro from '@tarojs/taro';
	import dayjs from 'dayjs';
	import { defineComponent } from 'vue';
	import { serviceStore } from '@/store';

	export default defineComponent({
		components: { 'quick-view': QuickView },
		async mounted() {
			await CardService.updateCardBalance();
		},
		computed: {
			balanceUpdateTimeString() {
				return dayjs(this.updateTime.balance).fromNow();
			},
			updateTime() {
				return serviceStore.card.updateTime;
			},
			balance() {
				return serviceStore.card.balance;
			}
		},
		methods: {
			nev2Card() {
				Taro.navigateTo({ url: '/pages/schoolcard/index' });
			}
		}
	});
</script>
<style>
	.quickcard-balance {
		font-size: 3rem;
		margin-top: 1rem;
		font-weight: bolder;
		text-align: center;
	}
	.quickcard-balance::before {
		content: '¥';
	}
	.div-line {
		background: #e0e3da;
		width: 100%;
		height: 5px;
	}
</style>

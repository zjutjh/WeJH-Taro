<template>
	<card @tap="nev2Card">
		<view class="title">
			<text class="iconfont icon-wallet-3-fill"></text>
			<text>校园卡</text>
		</view>
		<view class="div-line"></view>
		<text class="sub-text"> 当前余额({{ balanceUpdateTimeString }}) </text>
		<view class="quickcard-balance">
			<text> {{ balance }} </text>
		</view>
	</card>
</template>
<script lang="ts">
	import Taro from '@tarojs/taro';
	import { defineComponent } from 'vue';
	import { serviceStore } from '@/store';
	import dateformat from 'dateformat';
	import { CardService } from '@/services';
	import Card from '../card/index.vue';
	import dayjs from 'dayjs';

	export default defineComponent({
		components: { Card },
		mounted() {
			CardService.getCardBalance();
		},
		computed: {
			balanceUpdateTimeString() {
				return dayjs(this.updateTime.balance).format('HH:MM');
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

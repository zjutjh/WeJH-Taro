<template>
	<header-tab-view title="校园卡" :show-tab="true">
		<template v-slot:prefix>
			<text class="iconfont icon-wallet-3-fill"></text>
		</template>
		<template v-slot:image>
			<view class="schoolcard" @tap="getCardBalance">
				<image mode="aspectFit" src="@/assets/schoolcard/card.png" style="height: 100%"></image>
				<text class="balance"> ¥{{ balance }}</text>
			</view>
		</template>
		<template v-slot:tab>
			<view class="tabs">
				<button :class="{ 'button-active': isSelectToday }" @tap="todayClick">今日</button>
				<button :class="{ 'button-active': isSelectHistory }" @tap="historyClick">历史</button>
			</view>
		</template>
		<template v-slot:content>
			<view>
				<view v-if="isSelectToday" class="title">
					<text>今日消费</text>
				</view>

				<view v-if="isSelectHistory" class="title">
					<text>历史消费</text>
					<view style="display: inline; font-size: 80%; font-weight: normal; margin-left: 1rem">
						<picker mode="date" fields="month" style="display: inline-block" @change="onDateChange">
							<text class="picker"> {{ dateSel }}👋</text>
						</picker>
					</view>
				</view>
				<view v-if="!itemList" style="text-align: center">
					<view> 无消费记录</view>
				</view>
				<view class="item card" v-for="item in itemList" :key="item.ID" @tap="pop(item)">
					<view class="cicle" v-if="item.transactionType">
						{{ item.transactionType[0] }}
					</view>
					<view class="item-text">
						<view v-if="item.shop && item.shop !== ' '"> {{ item.shop }}</view>
						<view> {{ item.shopPlace }}</view>
						<view>{{ item.id }}</view>
						<view>{{ item.transactionType }}</view>
						<view> {{ item.time }}</view>
					</view>
					<text class="transactions"> {{ item.transactions }}</text>
				</view>
			</view>
		</template>
	</header-tab-view>
	<pop-view v-model:show="showPop">
		<card v-if="selectedItem">
			<view v-if="selectedItem.shop && selectedItem.shop !== ' '" class="title"> {{ selectedItem.shop }}</view>
			<view> {{ selectedItem.shopPlace }}</view>
			<view>{{ selectedItem.id }}</view>
			<text> {{ selectedItem.transactions }}</text>
			<view>{{ selectedItem.transactionType }}</view>
			<view> {{ selectedItem.time }}</view>
		</card>
	</pop-view>
</template>

<script lang="ts">
	import { computed, defineComponent, ref } from 'vue';
	import Card from '@/components/Card/index.vue';
	import { CardService } from '@/services';
	import HeaderTabView from '@/components/HeaderTabView/index.vue';
	import PopView from '@/components/PopView/index.vue';
	import dayjs from 'dayjs';
	import { serviceStore } from '@/store';

	import './index.scss';
	export default defineComponent({
		components: { HeaderTabView, PopView, Card },
		computed: {
			itemList(): Array<any> {
				if (this.isSelectToday) return this.today;
				else if (this.isSelectHistory) return this?.history?.data;
				return [];
			},
			updateTime() {
				if (this.isSelectToday) return serviceStore.card.updateTime;
				else if (this.isSelectHistory) return this?.history?.updateTime;
				return '';
			}
		},
		setup() {
			let dateSel = ref(dayjs().format('YYYY-MM'));
			let balance = computed(() => serviceStore.card.balance);
			let today = computed(() => serviceStore.card.today);
			let history = computed(() =>
				CardService.getCardHistory({
					year: parseInt(dateSel.value.split('-')[0]),
					month: parseInt(dateSel.value.split('-')[1])
				})
			);
			let getCardBalance = CardService.updateCardBalance;
			let getCardToday = CardService.updateCardToday;
			let getCardHistory = CardService.updateCardHistory;

			let obj: any | undefined;
			let selectedItem = ref(obj);
			let showPop = ref(false);
			let isSelectToday = ref(true);
			let isSelectHistory = ref(false);

			function pop(item) {
				selectedItem.value = item;
				showPop.value = true;
			}
			async function historyClick() {
				isSelectToday.value = false;
				isSelectHistory.value = true;
				await getCardHistory({
					year: parseInt(this.dateSel.split('-')[0]),
					month: parseInt(this.dateSel.split('-')[1])
				});
			}
			function todayClick() {
				isSelectToday.value = true;
				isSelectHistory.value = false;
				getCardToday();
			}

			async function onDateChange(e) {
				dateSel.value = e.detail.value;
				await getCardHistory({
					year: parseInt(dateSel.value.split('-')[0]),
					month: parseInt(dateSel.value.split('-')[1])
				});
			}
			return {
				dateSel,
				onDateChange,
				isSelectToday,
				isSelectHistory,
				historyClick,
				todayClick,
				selectedItem,
				balance,
				today,
				history,
				getCardBalance,
				getCardToday,
				getCardHistory,
				pop,
				showPop,
				dayjs
			};
		},
		mounted() {
			this.getCardBalance();
			this.getCardToday();
		}
	});
</script>

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
					<text class="sub-text"> 更新于 {{ dayjs(updateTime.today).format('MM-DD HH:mm') }} </text>
				</view>

				<view v-if="isSelectHistory" class="title">
					<text>历史消费</text>
					<view style="display: inline; font-size: 80%; font-weight: normal; margin-left: 1rem">
						<picker mode="date" fields="month" style="display: inline-block" @change="onDateChange">
							<text class="picker"> {{ dateSel }}👋</text>
						</picker>
					</view>
					<text class="sub-text">
						更新于
						{{ dayjs(updateTime.history).format('MM-DD HH:mm') }}
					</text>
				</view>
				<view v-if="!itemList" style="text-align: center">
					<image src="@/assets/g/noData.svg"></image>
					<view> 无消费记录</view>
				</view>
				<view class="item" v-for="item in itemList" :key="item.ID" @tap="pop(item)">
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
			<view v-if="selectedItem.shop && selectedItem.shop !== ' '"> {{ selectedItem.shop }}</view>
			<view> {{ selectedItem.shopPlace }}</view>
			<view>{{ selectedItem.id }}</view>
			<view>{{ selectedItem.transactionType }}</view>
			<view> {{ selectedItem.time }}</view>
			<text class="transactions"> {{ selectedItem.transactions }}</text>
		</card>
	</pop-view>
</template>

<script lang="ts">
	import { computed, defineComponent, reactive, ref } from 'vue';
	import { CardService } from '@/services';
	import { serviceStore } from '@/store';
	import { throttle } from '@/utils/tools';
	import Card from '@/components/card/index.vue';
	import PopView from '@/components/popView/index.vue';
	import headerTabView from '@/components/headerTabView/index.vue';

	import './index.scss';
	import dayjs from 'dayjs';

	export default defineComponent({
		components: { headerTabView, PopView, Card },
		computed: {
			itemList(): Array<any> {
				if (this.isSelectToday) {
					return this.today;
				} else if (this.isSelectHistory) {
					return this.history;
				}
				return [];
			},
			updateTime() {
				return serviceStore.card.updateTime;
			}
		},
		setup() {
			let balance = computed(() => serviceStore.card.balance);
			let today = computed(() => serviceStore.card.today);
			let history = computed(() => serviceStore.card.history);
			let getCardBalance = throttle(CardService.getCardBalance);
			let getCardToday = throttle(CardService.getCardToday);
			let getCardHistory = throttle(CardService.getCardHistory);

			let obj: any | undefined;
			let selectedItem = ref(obj);
			let showPop = ref(false);

			function pop(item) {
				selectedItem.value = item;
				showPop.value = true;
			}
			let isSelectToday = ref(true);
			let isSelectHistory = ref(false);

			function historyClick() {
				isSelectToday.value = false;
				isSelectHistory.value = true;
				getCardHistory({
					year: parseInt(this.dateSel.split('-')[0]),
					month: parseInt(this.dateSel.split('-')[1])
				});
			}
			function todayClick() {
				isSelectToday.value = true;
				isSelectHistory.value = false;
				getCardToday();
			}

			let dateSel = ref(dayjs().format('YYYY-MM'));

			function onDateChange(e) {
				dateSel.value = e.detail.value;
				getCardHistory({
					year: parseInt(this.dateSel.split('-')[0]),
					month: parseInt(this.dateSel.split('-')[1])
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

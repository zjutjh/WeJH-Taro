<template>
	<header-tab-view title="食堂流量" :img="require('@/assets/canteen/food.png')" :show-tab="false">
		<template v-slot:content>
			<view v-if="!flow" style="text-align: center">
				<image src="@/assets/g/noData.svg"></image>
				<view>无食堂流量信息</view>
			</view>
			<card class="item" v-for="item in flow" :key="item.restaurantName">
				<view class="cicle" v-if="item.restaurantName">
					{{ item.restaurantName[0] }}
				</view>
				<view class="item-text">
					<view> {{ item.restaurantName }}</view>
					<view>流量指数： {{ item.dealCount }}</view>
				</view>
				<view class="ext green" v-if="item.dealCount < 50">空闲</view>
				<view class="ext yellow" v-else-if="item.dealCount < 100">适中</view>
				<view class="ext red" v-else>忙碌</view>
			</card>
		</template>
	</header-tab-view>
</template>

<script lang="ts">
	import { defineComponent } from 'vue';
	import { CanteenService } from '@/services';
	import { serviceStore } from '@/store';
	import Card from '@/components/card/index.vue';
	import HeaderTabView from '@/components/headerTabView/index.vue';

	import './index.scss';

	export default defineComponent({
		components: { HeaderTabView, Card },
		computed: {
			updateTime(): string {
				return serviceStore.canteen.updateTime.flow;
			},
			flow() {
				if (!serviceStore.canteen.flow) return [];
				return serviceStore.canteen.flow.data;
			}
		},
		data() {
			return {
				selectedItem: null,
				showPop: false
			};
		},
		methods: {
			getCanteenFlow: CanteenService.getCanteenFlow,
			reflesh(e) {
				this.getCanteenFlow(e);
			}
		},
		mounted() {
			this.getCanteenFlow();
		}
	});
</script>

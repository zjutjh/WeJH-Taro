<template>
	<header-tab-view title="空教室" :img="require('@/assets/exam/exam.png')" :show-tab="false">
		<template v-slot:content>
			<view v-if="!room" style="text-align: center">
				<view> 无记录</view>
			</view>
			<view v-for="item in room" :key="item.id">
				<view class="build-name" v-if="item[0].buildName">
					{{ item[0].buildName }}
				</view>
				<view class="flex item">
					<card class="room-item" v-for="i in item" :key="i.roomName" @tap="pop(i)">
						<view> {{ i.roomName }}</view>
						<view> {{ i.roomSeats }}</view>
					</card>
				</view>
			</view>
		</template>
	</header-tab-view>
	<bottom-panel>
		<button class="button"></button>
		<room-picker class="picker" @changed="roomChanged"></room-picker>
		<button class="button"></button>
	</bottom-panel>
	<pop-view v-model:show="showPop">
		<card v-if="selectedItem"> </card>
	</pop-view>
</template>

<script lang="ts">
	import { computed, defineComponent } from 'vue';
	import { serviceStore } from '@/store';
	import BottomPanel from '@/components/bottomPanel/index.vue';
	import Card from '@/components/Card/index.vue';
	import HeaderTabView from '@/components/HeaderTabView/index.vue';
	import PopView from '@/components/PopView/index.vue';
	import RoomPicker from '@/components/RoomPicker/index.vue';
	import { ZFService } from '@/services';
	import { groupBy } from '@/utils/tools';

	import './index.scss';
	export default defineComponent({
		components: { HeaderTabView, PopView, Card, RoomPicker, BottomPanel },
		setup() {
			function roomChanged(e) {
				ZFService.getFreeRoomInfo(e);
			}
			// function reflesh() {
			//   ZFService.getExamInfo(selectTerm);
			// }
			const room = computed(() => {
				let res = groupBy(serviceStore.zf.room, (item) => [item.buildName]);
				return res;
			});
			return {
				room,
				roomChanged

				// reflesh
			};
		},
		mounted() {},
		data() {
			return {
				selectedItem: null,
				showPop: false
			};
		},
		methods: {
			pop(item) {
				this.selectedItem = item;
				this.showPop = true;
			}
		}
	});
</script>

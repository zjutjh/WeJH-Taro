<template>
	<header-tab-view title="成绩" :img="require('@/assets/exam/exam.png')" :show-tab="false">
		<template v-slot:content>
			<view v-if="!score" style="text-align: center">
				<image src="@/assets/g/noData.svg"></image>
				<view> 无当前学期成绩信息</view>
			</view>
			<view class="item" v-for="item in score" :key="item.lessonID" @tap="pop(item)">
				<view class="cicle" v-if="item.lessonName">
					{{ item.lessonName[0] }}
				</view>
				<view class="item-text">
					<view> {{ item.lessonName }}-{{ item.lessonID }}</view>
					<view> {{ item.teacherName }}</view>
					<view> {{ item.submitTime }}</view>
				</view>
				<view class="score"> {{ item.score }}</view>
			</view>
		</template>
	</header-tab-view>
	<view class="bottom-panel">
		<button class="button"></button>
		<term-picker class="picker" @changed="termChanged"></term-picker>
		<button class="button"></button>
	</view>
	<pop-view v-model:show="showPop">
		<card v-if="selectedItem"> </card>
	</pop-view>
</template>

<script lang="ts">
	import { computed, defineComponent } from 'vue';
	import { ZFService } from '@/services';
	import { serviceStore, systemStore } from '@/store';
	import { throttle } from '@/utils/tools';
	import Card from '@/components/card/index.vue';
	import PopView from '@/components/popView/index.vue';
	import termPicker from '@/components/termPicker/index.vue';
	import headerTabView from '@/components/headerTabView/index.vue';

	import './index.scss';

	export default defineComponent({
		components: { headerTabView, PopView, Card, termPicker },
		setup() {
			let selectTerm = {
				year: systemStore.generalInfo.termYear,
				term: systemStore.generalInfo.term
			};
			if (serviceStore.user.isBindZF) if (!serviceStore.zf.examInfo) ZFService.getScoreInfo(selectTerm);

			function termChanged(e) {
				selectTerm = e;
				ZFService.getScoreInfo(e);
			}
			function reflesh() {
				ZFService.getScoreInfo(selectTerm);
			}
			const score = computed(() => serviceStore.zf.scoreInfo);
			return {
				score,
				termChanged,
				reflesh
			};
		},
		computed: {
			updateTime(): string {
				return serviceStore.zf.updateTime.lessonsTable;
			}
		},
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

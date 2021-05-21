<template>
	<header-tab-view title="成绩" :img="require('@/assets/exam/exam.png')" :show-tab="false">
		<template v-slot:content>
			<view v-if="!score" style="text-align: center">
				<image src="@/assets/g/noData.svg"></image>
				<view> 无当前学期成绩信息</view>
			</view>
			<view class="item card" v-for="item in score" :key="item.lessonID" @tap="pop(item)">
				<view class="cicle" v-if="item.lessonName">
					{{ item.lessonName[0] }}
				</view>
				<view class="item-text">
					<view> {{ item.lessonName }}-{{ item.lessonID }}</view>
					<view> <text class="iconfont icon-laoshi"></text>{{ item.teacherName }}</view>
					<view> {{ item.submitTime }}</view>
				</view>
				<view class="score"> {{ item.score }}</view>
			</view>
		</template>
	</header-tab-view>
	<bottom-panel>
		<reflesh-button @reflesh="reflesh" :is-refleshing="isRefleshing"></reflesh-button>
		<term-picker class="picker" @changed="termChanged"></term-picker>
		<reflesh-button @reflesh="reflesh" :is-refleshing="isRefleshing"></reflesh-button>
	</bottom-panel>
	<pop-view v-model:show="showPop">
		<card v-if="selectedItem">
			<view class="title">{{ selectedItem.lessonName }}</view>
			<view>{{ selectedItem.lessonType }}</view>
			<view>{{ selectedItem.lessonID }}</view>
			<view><text class="iconfont icon-laoshi"></text>{{ selectedItem.teacherName }}</view>
			<view>{{ selectedItem.score }}</view>
		</card>
	</pop-view>
</template>

<script lang="ts">
	import { computed, defineComponent, onMounted, Ref, ref } from 'vue';
	import { ZFService } from '@/services';
	import { serviceStore, systemStore } from '@/store';
	import RefleshButton from '@/components/refleshButton/index.vue';
	import Card from '@/components/card/index.vue';
	import BottomPanel from '@/components/bottomPanel/index.vue';

	import PopView from '@/components/popView/index.vue';
	import TermPicker from '@/components/termPicker/index.vue';

	import HeaderTabView from '@/components/headerTabView/index.vue';

	import './index.scss';
	import { Score } from '@/interface/Score';

	export default defineComponent({
		components: { HeaderTabView, PopView, Card, TermPicker, BottomPanel, RefleshButton },
		setup() {
			let selectTerm = ref({
				year: systemStore.generalInfo.termYear,
				term: systemStore.generalInfo.term
			});
			const selectedItem: Ref<null | Score> = ref(null);
			const score = computed(() => ZFService.getScoreInfo(selectTerm.value).data);
			const isRefleshing = ref(false);

			async function termChanged(e) {
				isRefleshing.value = true;
				selectTerm.value = e;
				await ZFService.updateScoreInfo(e);
				isRefleshing.value = false;
			}
			async function reflesh() {
				isRefleshing.value = true;
				await ZFService.updateScoreInfo(selectTerm.value);
				isRefleshing.value = false;
			}

			onMounted(async () => {
				if (serviceStore.user.isBindZF) await reflesh();
			});
			return {
				score,
				termChanged,
				reflesh,
				isRefleshing,
				selectedItem
			};
		},
		data() {
			return {
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
<style>
	@keyframes rote {
		from {
			transform: rotate(0);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.reflesh-running {
		animation: rote 1s alternate infinite;
	}
</style>

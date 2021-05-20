<template>
	<header-tab-view title="考试信息" :img="require('@/assets/exam/exam.png')" :show-tab="false">
		<template v-slot:content>
			<view v-if="!exam" style="text-align: center">
				<image src="@/assets/g/noData.svg"></image>
				<view> 无记录</view>
			</view>
			<view class="item card" v-for="item in exam" :key="item.id" @tap="pop(item)">
				<view class="cicle" v-if="item.lessonName">
					{{ item.lessonName[0] }}
				</view>
				<view class="item-text">
					<view> {{ item.lessonName }}-{{ item.id }}</view>
					<view> <text class="iconfont icon-laoshi"></text>{{ item.teacherName }}</view>
					<view> {{ item.examTime }}</view>
					<view>{{ calcDayLeft(item.examTime) }}</view>
				</view>
				<view class="ext">{{ item.examPlace }}</view>
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
			<view><text class="iconfont icon-laoshi"></text>{{ selectedItem.teacherName }}</view>
			<view>{{ selectedItem.lessonPlace }}</view>
			<view>{{ selectedItem.className }}</view>
			<view>{{ selectedItem.credits }}</view>
			<view>{{ selectedItem.campus }}-{{ selectedItem.examPlace }}</view>
			<view>{{ selectedItem.examTime }}</view>
			<button class="active" v-if="isWechat" @tap="selectedItem && addToCalendar(selectedItem)">添加到日历</button>
		</card>
	</pop-view>
</template>

<script lang="ts">
	import RefleshButton from '@/components/refleshButton/index.vue';
	import BottomPanel from '@/components/bottomPanel/index.vue';
	import Card from '@/components/card/index.vue';

	import PopView from '@/components/popView/index.vue';
	import TermPicker from '@/components/termPicker/index.vue';
	import HeaderTabView from '@/components/headerTabView/index.vue';
	import './index.scss';
	import { computed, defineComponent, onMounted, Ref, ref } from 'vue';
	import { ZFService } from '@/services';
	import { serviceStore, systemStore } from '@/store';
	import dayjs from 'dayjs';
	import { Exam } from '@/interface/Exam';
	import { env } from '@tarojs/taro';
	export default defineComponent({
		components: { HeaderTabView, PopView, Card, TermPicker, BottomPanel, RefleshButton },
		computed: {
			isWechat() {
				return process.env.TARO_ENV === 'weapp';
			}
		},
		setup() {
			let selectTerm = ref({
				year: systemStore.generalInfo.termYear,
				term: systemStore.generalInfo.term
			});
			const isRefleshing = ref(false);
			const selectedItem: Ref<null | Exam> = ref(null);
			const exam = computed(() => {
				return ZFService.getExamInfo(selectTerm.value)?.data;
			});

			async function termChanged(e) {
				isRefleshing.value = true;
				selectTerm.value = e;
				await ZFService.updateExamInfo(e);
				isRefleshing.value = false;
			}
			async function reflesh() {
				isRefleshing.value = true;
				await ZFService.updateExamInfo(selectTerm.value);
				isRefleshing.value = false;
			}

			onMounted(async () => {
				if (serviceStore.user.isBindZF) {
					await reflesh();
				}
			});
			return {
				exam,
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
			calcDayLeft(dayString: string) {
				const dd = dayjs(dayString, 'YYYY-MM-DD(HH:mm)');
				return dayjs(dayString, 'YYYY-MM-DD(HH:mm)').fromNow();
			},
			pop(item) {
				this.selectedItem = item;
				this.showPop = true;
			},
			addToCalendar(item: Exam) {
				if (process.env.TARO_ENV === 'weapp')
					wx?.addPhoneCalendar({
						title: item.lessonName + '考试',
						startTime: dayjs(item.examTime, 'YYYY-MM-DD(HH:mm)').unix(),
						endTime: dayjs(item.examTime, 'YYYY-MM-DD(HH:mm-HH:mm)').unix(),
						location: item.examPlace,
						alarmOffset: 3600
					});
			}
		}
	});
</script>

<template>
	<title-bar title="课程表" :show-back-button="true" :show-background="true">
		<template v-slot:prefix>
			<text class="iconfont icon-calendar-event-fill" />
		</template>
	</title-bar>
	<lessons-table v-show="showLessonType" @longpress="switchLessonType" class="index" :class="{ 'index-ios': isNewIPhone }" :lessons="showLessonType ? lessonsTable : lessonsTableWeek" @classClick="ClassClick" />

	<scroll-view :scrollY="true" v-if="!showLessonType">
		<view class="practice-lessons-list" @longpress="switchLessonType">
			<view class="prectice-title">实践课程</view>
			<view v-for="item in practiceLessons" :key="item.lessonName">
				<card>
					<view class="lesson-title">
						{{ item.lessonName }}
					</view>
					<view> <b>教师：</b>{{ item.teacherName }} </view>
					<view> <b>时间：</b>{{ item.className }} </view>
				</card>
			</view>
		</view>
	</scroll-view>
	<FixedNav />
	<bottom-panel>
		<reflesh-button @reflesh="reflesh" :is-refleshing="isRefleshing"></reflesh-button>
		<week-picker v-if="showWeekPicker" class="picker" :week="selectWeek" @changed="weekChanged" />
		<term-picker v-else class="picker" @changed="termChanged"></term-picker>
		<button class="circle" @click="pickerModeSwitch"><view class="iconfont icon-stack-fill" /></button>
	</bottom-panel>
	<popup position="bottom" v-model:visible="show" round :style="{ height: '40%' }">
		<view v-if="selection" class="popup-lesson">
			<view class="lesson-title">
				{{ selection.lessonName }}
			</view>
			<view> <b>上课地点：</b>{{ selection.campus }}-{{ selection.lessonPlace }} </view>
			<view> <b>班级：</b>{{ selection.className }} </view>
			<view> <b>教师：</b>{{ selection.teacherName }} </view>
			<view> <b>上课时间: </b>{{ selection.week }} - {{ selection.weekday }} （{{ selection.sections }}） </view>
			<view> <b>学分：</b>{{ selection.credits }} </view>
		</view>
	</popup>
</template>

<script lang="ts">
	import { computed, onMounted, ref } from 'vue';
	import { serviceStore, systemStore } from '@/store';
	import BottomPanel from '@/components/BottomPanel/index.vue';
	import Card from '@/components/Card/index.vue';
	import FixedNav from '@/components/FixedNav/index.vue';
	import { Lesson } from '@/types/Lesson';
	import LessonsTable from '@/components/LessonsTable/index.vue';
	import { Popup } from '@nutui/nutui-taro';
	import RefleshButton from '@/components/RefleshButton/index.vue';
	import Taro from '@tarojs/taro';
	import TermPicker from '@/components/TermPicker/index.vue';
	import TitleBar from '@/components/TitleBar/index.vue';
	import WeekPicker from '@/components/WeekPicker/index.vue';
	import { ZFService } from '@/services';

	import './index.scss';
	export default {
		components: { LessonsTable, TermPicker, TitleBar, BottomPanel, RefleshButton, FixedNav, Popup, WeekPicker, Card },
		setup() {
			const selectTerm = ref({
				year: systemStore.generalInfo.termYear,
				term: systemStore.generalInfo.term
			});

			const lessonsTable = computed(() => {
				return ZFService.getLessonTable(selectTerm.value);
			});

			const practiceLessons = computed(() => {
				return ZFService.getPracticeLessonsTable(selectTerm.value);
			});
			const selectWeek = ref(systemStore.generalInfo.week);
			const lessonsTableWeek = computed(() => {
				return lessonsTable.value.filter((item) => {
					let v = item.week.split('-');
					let st = parseInt(v[0]);
					let ed = parseInt(v[1]);

					let isOddWeek = item.week.includes('单');
					let isEvenWeek = item.week.includes('双');

					if (isOddWeek && selectWeek.value % 2 === 0) return false;
					if (isEvenWeek && selectWeek.value % 2 === 1) return false;

					return selectWeek.value <= ed && selectWeek.value >= st;
				});
			});

			const isNewIPhone = computed(() => {
				let info = Taro.getSystemInfoSync();
				if (!info.model) return false;
				console.log(info.model.toString());
				let isNewIphone = info.model.match('(iPhone X|iPhone XS|iPhone 11|iPhone 12|iPhone 13|iPhone14)')?.length;
				return isNewIphone !== undefined && isNewIphone > 0;
			});
			const isRefleshing = ref(false);
			async function reflesh() {
				isRefleshing.value = true;
				await ZFService.updateLessonTable(selectTerm.value);
				isRefleshing.value = false;
			}
			async function termChanged(e) {
				isRefleshing.value = true;
				selectTerm.value = e;
				await ZFService.updateLessonTable(e);
				isRefleshing.value = false;
			}

			async function weekChanged({ week }) {
				console.log(week);
				selectWeek.value = week;
			}

			const show = ref(false);
			const selection = ref<Lesson>();
			async function ClassClick(theClass: Lesson) {
				selection.value = theClass;
				show.value = true;
			}

			onMounted(async () => {
				if (serviceStore.user.isBindZF) {
					await reflesh();
				}
			});

			const showWeekPicker = ref(true);
			function pickerModeSwitch() {
				showWeekPicker.value = !showWeekPicker.value;
			}

			const showLessonType = ref(true);
			function switchLessonType() {
				showLessonType.value = !showLessonType.value;
			}

			return {
				showLessonType,
				practiceLessons,
				switchLessonType,
				showWeekPicker,
				selectWeek,
				pickerModeSwitch,
				weekChanged,
				isNewIPhone,
				lessonsTable,
				selectTerm,
				termChanged,
				reflesh,
				ClassClick,
				isRefleshing,
				selection,
				show,
				lessonsTableWeek
			};
		}
	};
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

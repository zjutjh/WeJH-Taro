<template>
	<card @tap="nev2Lesson" class="crd">
		<view class="title">
			<text class="iconfont icon-calendar-event-fill"></text>
			<text>课程表</text>
		</view>
		<view class="div-line"></view>
		<text class="sub-text">今日课表({{ balanceUpdateTimeString }})</text>
		<view v-for="item in todayLessonTable" :key="item.lessonName">
			<view class="lesson">
				<view class="col">
					<text class="name">{{ item.lessonName }}</text>
					<text class="teacher">
						<text class="iconfont icon-laoshi"></text>
						{{ item.teacherName }}</text
					>
					<text v-if="item.detMin > 30"> <text class="iconfont icon-timer-flash-line"></text>还有 {{ item.detTime }}上课 </text>
					<text v-if="item.detMin <= 30 && item.detMin >= 0"> <text class="iconfont icon-run-fill red"></text>还有 {{ item.detTime.split(':')[1] }}分钟上课 </text>
				</view>
				<view class="col right">
					<text class="bolder">{{ item.lessonPlace }}</text>
					<text>{{ item.sections }}</text>
					<text> ({{ sectionsTimeString(item.sections) }}) </text>
				</view>
			</view>
		</view>
	</card>
</template>
<script lang="ts">
	import Taro from '@tarojs/taro';
	import { defineComponent } from 'vue';
	import { serviceStore } from '@/store';
	import dateformat from 'dateformat';
	import dayjs from 'dayjs';
	import Card from '../card/index.vue';
	import { ZFService } from '@/services';
	import { section2time, section2endtime } from '@/utils/lessonstable';
	import './index.scss';
	let timer: NodeJS.Timeout | undefined = undefined;
	export default defineComponent({
		components: { Card },
		props: {
			hide: Boolean
		},
		data() {
			return {
				todayLessonTable: this.getTodayLessonTable()
			};
		},
		computed: {
			balanceUpdateTimeString() {
				return dayjs(this.updateTime.balance).format('HH:MM');
			},
			updateTime() {
				return serviceStore.card.updateTime;
			}
		},
		watch: {
			hide: {
				immediate: true,
				handler(val) {
					if (val == true) {
						if (timer) clearInterval(timer);
					} else {
						if (!serviceStore.zf.lessonsTable) ZFService.getLessonTable();
						this.getTodayLessonTable();
						timer = setInterval(this.getTodayLessonTable, 30000);
					}
				}
			}
		},
		methods: {
			nev2Lesson() {
				Taro.navigateTo({ url: '/pages/lessonstable/index' });
			},
			sectionsTimeString(sections: string) {
				let arr = sections.split('-');
				return section2time(arr[0]) + '-' + section2endtime(arr[1]);
			},
			goLessonAlert(sections: string) {
				let arr = sections.split('-');
				let det = dayjs(section2time(arr[0]), 'HH:mm').valueOf() - dayjs().valueOf();
				if (det > 0)
					return dayjs(det)
						.utc()
						.format('HH:mm');
				return null;
			},
			goLessonAlertEm(sections: string) {
				let arr = sections.split('-');
				let detMin = dayjs(section2time(arr[0]), 'HH:mm').diff(dayjs(), 'minute', true);
				return detMin;
			},
			getTodayLessonTable() {
				let table = ZFService.getTodayLessonTable();
				table.forEach((item) => {
					item['detMin'] = this.goLessonAlertEm(item.sections);
					item['detTime'] = this.goLessonAlert(item.sections);
				});
				this.todayLessonTable = table;
			}
		}
	});
</script>

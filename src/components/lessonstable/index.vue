<template>
	<view class="warp">
		<view class="jc-index-panel index-panel" :style="jcStyle">
			<view v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]" :key="i">
				<view class="num-index">
					{{ i }}
				</view>
			</view>
		</view>
		<view class="weekday-index-panel index-panel">
			<view v-for="i in [1, 2, 3, 4, 5, 6, 7]" :key="i">
				<view class="num-index">
					{{ i }}
				</view>
			</view>
		</view>
		<view class="now-index" :style="nowStyle" />
		<view class="now-week-index" :style="nowWeekStyle" />
		<view class="table table-box" v-if="lessonsTable">
			<view class="flex class" v-for="cl in lessonsTable" :key="cl.id + cl.week + cl.weekday" :style="getStyle(cl)">
				<card class="class-card" :style="getColorStyle(cl)" @click="classCardClick(cl)">
					<view class="title">{{ cl.lessonPlace }}</view>
					<text class="item-content">{{ cl.lessonName }}</text>
				</card>
			</view>
		</view>
	</view>
</template>
<script lang="ts">
	import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro';
	import Card from '@/components/Card/index.vue';
	import { Lesson } from '@/types/Lesson';
	import { defineComponent } from 'vue';
	import './index.scss';
	const colorSet = ['ef8d6c', '58cc9d', '68a9df', 'fad65f', 'f7ac83'];
	export default defineComponent({
		components: { Card },
		props: {
			lessons: {
				type: Array
			}
		},
		computed: {
			lessonsTable(): Lesson[] {
				return this.MarkConflictLesson(this.lessons);
			},
			jcStyle() {
				return `height: ${this.Height}px; top: ${this.Top}px;`;
			},
			nowWeekStyle() {
				const now = new Date();
				const weekday = now.getDay();
				const left = 'calc(' + ((weekday - 1) * 92) / 5 + '% + 2rem)';
				return `left: ${left};`;
			},
			nowStyle() {
				const now = new Date();
				const hour = now.getHours();
				const min = now.getMinutes();
				const rate = (hour * 60 + min) / ((21 - 8) * 60 + 5);
				return `top: ${rate * this.Height}px;`;
			}
		},
		data() {
			return {
				Height: Number,
				Width: Number,
				Top: Number
			};
		},
		mounted() {
			eventCenter.on(getCurrentInstance()?.router?.onReady || 'onReady', () => {
				console.log('onReady');
				const query = Taro.createSelectorQuery();
				query.select('.table-box').boundingClientRect();
				query.exec((res) => {
					if (typeof res[0].height === 'number') this.Height = Number(res[0].height);
					if (typeof res[0].top === 'number') this.Top = Number(res[0].top);
				});
			});
		},
		methods: {
			MarkConflictLesson(lessons: Lesson[]) {
				if (lessons)
					for (let i = 0; i < lessons.length; i++) {
						for (let j = i + 1; j < lessons.length; j++) {
							const item = lessons[i],
								item2 = lessons[j];
							if (item.weekday !== item2.weekday) continue;
							const from1 = parseInt(item.sections.split('-')[0]);
							const to1 = parseInt(item.sections.split('-')[1]);
							const from2 = parseInt(item2.sections.split('-')[0]);
							const to2 = parseInt(item2.sections.split('-')[1]);

							if (!(to1 < from2 || to2 < from1)) {
								lessons[i]['mark'] = true;
								lessons[j]['mark'] = true;
							}
						}
					}
				return lessons;
			},
			getColorStyle(theClass) {
				return `background-color: #${colorSet[parseInt(theClass.classID, 16) % colorSet.length]};`;
			},
			classCardClick(theClass) {
				this.$emit('classClick', theClass);
			},
			getStyle(theClass) {
				const begin = parseInt(theClass.sections.split('-')[0]);
				const end = parseInt(theClass.sections.split('-')[1]);
				const weekday = parseInt(theClass.weekday);
				const FontSize = Math.min(12, (end - begin + 2) * 4) + 'px';
				const Height = ((end - begin + 1) * 100) / 12 + '%';
				const Top = 'calc(' + ((begin - 1) * 100) / 12 + '%)';
				const Left = 'calc(' + ((weekday - 1) * 90) / 5 + '%)';
				return `top: ${Top};
				      				left: ${Left};
				      				height: ${Height};
				      				font-size: ${FontSize};`;
			}
		}
	});
</script>

<template>
	<view class="warp" ref="table">
		<view class="jc-index-panel index-panel">
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
		<view class="table" v-if="lessonsTable">
			<view class="flex class" v-for="cl in lessonsTable" :key="cl.id + cl.week + cl.weekday" :style="getStyle(cl)">
				<card class="class-card">
					<view class="title">{{ cl.lessonPlace }}</view>
					<text class="item-content">{{ cl.lessonName }}</text>
					<text v-if="cl.mark">Mark</text>
				</card>
			</view>
		</view>
	</view>
</template>
<script lang="ts">
	import { defineComponent } from 'vue';
	import Card from '@/components/card/index.vue';
	import './index.scss';
	import { Lesson } from '@/interface/Lesson';

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
			}
		},
		data() {
			return {
				offsetWidth: 0,
				offsetHeight: 0
			};
		},
		mounted() {
			this.offsetWidth = this.$refs.table.offsetWidth;
			this.offsetHeight = this.$refs.table.offsetHeight;
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
			getStyle(theClass) {
				const begin = parseInt(theClass.sections.split('-')[0]);
				const end = parseInt(theClass.sections.split('-')[1]);
				const weekday = parseInt(theClass.weekday);
				const FontSize = this.offsetWidth ? Math.min(this.offsetWidth / 5 / 5, ((this.offsetHeight / 12) * (end - begin + 1)) / 5) / 1.5 + 'px' : (end - begin + 2) * 4 + 'px';
				const Height = ((end - begin + 1) * 100) / 12 + '%';
				const Top = 'calc(' + ((begin - 1) * 100) / 12 + '%)';
				const Left = 'calc(' + ((weekday - 1) * 90) / 5 + '%)';
				return `top: ${Top};
	      left: ${Left};
	      height: ${Height};
	      font-size: ${FontSize};
	      `;
			}
		}
	});
</script>

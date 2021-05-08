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
			<view class="class" v-for="cl in lessonsTable" :key="cl.id" :style="getStyle(cl)">
				<view class="title">{{ cl.lessonPlace }}</view>
				<view class="item-content">{{ cl.lessonName }}</view>
			</view>
		</view>
	</view>
</template>
<script lang="ts">
	import { defineComponent } from 'vue';
	import './index.scss';

	export default defineComponent({
		props: {
			lessonsTable: {
				type: Array
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
			getStyle(theClass) {
				const begin = parseInt(theClass.sections.split('-')[0]);
				const end = parseInt(theClass.sections.split('-')[1]);
				const weekday = parseInt(theClass.weekday);
				const FontSize = this.offsetWidth ? Math.min(this.offsetWidth / 5 / 5, ((this.offsetHeight / 12) * (end - begin + 1)) / 5) / 1.5 + 'px' : (end - begin + 2) * 3.5 + 'px';
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

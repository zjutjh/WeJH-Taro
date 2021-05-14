<template>
	<title-bar title="课程表" :show-back-button="true"></title-bar>

	<lessons-table class="class-table index" :lessons-table="lessonsTable"></lessons-table>

	<view class="bottom-panel">
		<button class="button" @tap="reflesh">刷新</button>
		<term-picker class="picker" @changed="termChanged"></term-picker>
		<button class="button"></button>
	</view>
</template>

<script lang="ts">
	import { computed, ref } from 'vue';
	import lessonsTable from '@/components/lessonstable/index.vue';
	import termPicker from '@/components/termPicker/index.vue';
	import TitleBar from '@/components/titleBar/index.vue';
	import { ZFService } from '@/services';
	import { serviceStore, systemStore } from '@/store';
	import './index.scss';
	export default {
		components: { lessonsTable, termPicker, TitleBar },
		setup() {
			let selectTerm = {
				year: systemStore.generalInfo.termYear,
				term: systemStore.generalInfo.term
			};
			if (serviceStore.user.isBindZF) {
				if (!serviceStore.zf.lessonsTable) ZFService.getLessonTable(selectTerm);
			}
			function termChanged(e) {
				selectTerm = e;
				ZFService.getLessonTable(e);
			}
			function reflesh() {
				ZFService.getLessonTable(selectTerm);
			}
			const lessonsTable = computed(() => serviceStore.zf.lessonsTable);
			return {
				lessonsTable,
				termChanged,
				reflesh
			};
		}
	};
</script>

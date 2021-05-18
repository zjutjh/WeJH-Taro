<template>
	<title-bar title="课程表" :show-back-button="true"></title-bar>

	<lessons-table class="class-table index" :lessons-table="lessonsTable"></lessons-table>

	<bottom-panel>
		<button class="button" @tap="reflesh">刷新</button>
		<term-picker class="picker" @changed="termChanged"></term-picker>
		<button class="button"></button>
	</bottom-panel>
</template>

<script lang="ts">
	import { computed, ref } from 'vue';
	import BottomPanel from '@/components/bottomPanel/index.vue';
	import lessonsTable from '@/components/lessonstable/index.vue';
	import TermPicker from '@/components/termPicker/index.vue';
	import TitleBar from '@/components/titleBar/index.vue';

	import { ZFService } from '@/services';
	import { serviceStore, systemStore } from '@/store';
	import './index.scss';
	export default {
		components: { lessonsTable, TermPicker, TitleBar, BottomPanel },
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

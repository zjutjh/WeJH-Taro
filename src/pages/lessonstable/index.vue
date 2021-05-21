<template>
	<title-bar title="课程表" :show-back-button="true"></title-bar>

	<lessons-table class="index" :lessons="lessonsTable"></lessons-table>

	<bottom-panel>
		<reflesh-button @reflesh="reflesh" :is-refleshing="isRefleshing"></reflesh-button>
		<term-picker class="picker" @changed="termChanged"></term-picker>
		<reflesh-button @reflesh="reflesh" :is-refleshing="isRefleshing"></reflesh-button>
	</bottom-panel>
</template>

<script lang="ts">
	import { computed, onMounted, ref, Ref } from 'vue';
	import RefleshButton from '@/components/refleshButton/index.vue';
	import lessonsTable from '@/components/lessonstable/index.vue';
	import BottomPanel from '@/components/bottomPanel/index.vue';
	import TermPicker from '@/components/termPicker/index.vue';
	import TitleBar from '@/components/titleBar/index.vue';

	import { ZFService } from '@/services';
	import { serviceStore, systemStore } from '@/store';
	import './index.scss';
	export default {
		components: { lessonsTable, TermPicker, TitleBar, BottomPanel, RefleshButton },
		setup() {
			let selectTerm = ref({
				year: systemStore.generalInfo.termYear,
				term: systemStore.generalInfo.term
			});
			const isRefleshing = ref(false);
			const lessonsTable = computed(() => {
				return ZFService.getLessonTable(selectTerm.value);
			});

			async function termChanged(e) {
				isRefleshing.value = true;
				selectTerm.value = e;
				await ZFService.updateLessonTable(e);
				isRefleshing.value = false;
			}

			async function reflesh() {
				isRefleshing.value = true;
				await ZFService.updateLessonTable(selectTerm.value);
				isRefleshing.value = false;
			}
			onMounted(async () => {
				if (serviceStore.user.isBindZF) {
					await reflesh();
				}
			});
			return {
				lessonsTable,
				selectTerm,
				termChanged,
				reflesh,
				isRefleshing
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

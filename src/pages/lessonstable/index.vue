<template>
	<title-bar title="课程表" :show-back-button="true">
		<template v-slot:prefix>
			<text class="iconfont icon-calendar-event-fill" />
		</template>
	</title-bar>
	<lessons-table class="index" :class="{ 'index-ios': isNewIPhone }" :lessons="lessonsTable" @classClick="ClassClick" />
	<FixedNav />
	<bottom-panel>
		<reflesh-button @reflesh="reflesh" :is-refleshing="isRefleshing"></reflesh-button>
		<term-picker class="picker" @changed="termChanged"></term-picker>
		<reflesh-button @reflesh="reflesh" :is-refleshing="isRefleshing"></reflesh-button>
	</bottom-panel>
	<popup position="bottom" v-model:visible="show" round :style="{ height: '40%' }">
		{{ selection }}
	</popup>
</template>

<script lang="ts">
	import { computed, onMounted, ref } from 'vue';
	import { serviceStore, systemStore } from '@/store';
	import BottomPanel from '@/components/bottomPanel/index.vue';
	import FixedNav from '@/components/FixedNav/index.vue';
	import { Popup } from '@nutui/nutui-taro';
	import RefleshButton from '@/components/RefleshButton/index.vue';
	import Taro from '@tarojs/taro';
	import TermPicker from '@/components/TermPicker/index.vue';
	import TitleBar from '@/components/TitleBar/index.vue';
	import { ZFService } from '@/services';
	import lessonsTable from '@/components/Lessonstable/index.vue';

	import './index.scss';
	export default {
		components: { lessonsTable, TermPicker, TitleBar, BottomPanel, RefleshButton, FixedNav, Popup },
		setup() {
			const selectTerm = ref({
				year: systemStore.generalInfo.termYear,
				term: systemStore.generalInfo.term
			});

			const lessonsTable = computed(() => {
				return ZFService.getLessonTable(selectTerm.value);
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

			const show = ref(false);
			const selection = ref({});
			async function ClassClick(theClass) {
				selection.value = theClass;
				show.value = true;
			}

			onMounted(async () => {
				if (serviceStore.user.isBindZF) {
					await reflesh();
				}
			});
			return {
				isNewIPhone,
				lessonsTable,
				selectTerm,
				termChanged,
				reflesh,
				ClassClick,
				isRefleshing,
				selection,
				show
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

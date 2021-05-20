<template>
	<picker mode="multiSelector" :range="selector" @change="onChange" :value="selectorValue">
		<button class="term-selector">
			<view class="picker">{{ selectorChecked[0] }}/{{ parseInt(selectorChecked[0]) + 1 }}({{ selectorChecked[1] }})</view>
		</button>
	</picker>
</template>

<script lang="ts">
	import { systemStore } from '@/store';
	import { defineComponent, ref, reactive } from 'vue';
	export default defineComponent({
		setup() {
			let year = parseInt(systemStore?.generalInfo?.termYear ? systemStore?.generalInfo?.termYear : new Date().getFullYear());
			const selector = reactive([['上', '下', '短']]);
			let years: string[] = [];
			for (let i = 0; i < 4; i++) years.push(`${year - i}/${year - i + 1}`);
			selector.unshift(years);
			const selectorValue = reactive([0, selector[1].indexOf(systemStore?.generalInfo?.term)]);
			console.log(selectorValue);
			return {
				selector,
				selectorValue
			};
		},
		data() {
			return {
				selectorChecked: [systemStore.generalInfo.termYear, systemStore.generalInfo.term]
			};
		},
		methods: {
			onChange: function (e) {
				this.selectorChecked = this.selector.map((ex, index) => ex[e.detail.value[index]]);
				this.selectorChecked[0] = this.selectorChecked[0].split('/')[0];
				this.$emit('changed', {
					year: this.selectorChecked[0],
					term: this.selectorChecked[1]
				});
			}
		}
	});
</script>
<style>
	.term-selector {
		border-radius: 1rem;
		text-align: center;
	}
</style>

<template>
	<view class="term-selector"
		><picker mode="multiSelector" :range="selector" @change="onChange"
			><view class="picker">{{ selectorChecked[0] }}/{{ parseInt(selectorChecked[0]) + 1 }}({{ selectorChecked[1] }})</view></picker
		></view
	>
</template>

<script lang="ts">
	import { systemStore } from '@/store';
	import { defineComponent } from 'vue';
	export default defineComponent({
		setup() {},
		data() {
			return {
				selector: [
					['2020', '2019', '2018'],
					['上', '下', '短']
				],
				selectorChecked: [systemStore.generalInfo.termYear, systemStore.generalInfo.term]
			};
		},
		methods: {
			onChange: function (e) {
				this.selectorChecked = this.selector.map((ex, index) => ex[e.detail.value[index]]);
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
		padding: 0.5rem 1rem 0.5rem 1rem;
		border-radius: 1rem;
		text-align: center;
		background-color: rgba(218, 218, 218, 0.7);
	}
</style>

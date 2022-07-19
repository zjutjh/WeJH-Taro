<template>
	<view class="card" :style="getStyle()">
		<slot></slot>
	</view>
</template>
<script lang="ts">
	import { defineComponent } from 'vue';
	import './style/index.scss';
	const colorSetDefault = ['#62e4c7', '#72d0fe', '#22caca', '#fdc362', '#ffcf4d'];
	const colorSetLight = ['#ffedcd', '#fff6c9'];
	export default defineComponent({
		props: {
			color: Number,
			inner: Boolean,
			colormode: String
		},
		computed: {
			innerStyle() {
				if (this.inner) return `margin: 0; padding: 0;`;
				return undefined;
			},
			randColorStyle() {
				if (this.color === undefined) return undefined;
				let colorSet = colorSetDefault;
				if (this.colormode === 'light') colorSet = colorSetLight;
				const number = this.color % colorSet.length;
				return `background-color: ${colorSet[number]};`;
			}
		},
		methods: {
			getStyle() {
				const styleList = [this.randColorStyle, this.innerStyle];
				return styleList.join(' ');
			}
		}
	});
</script>

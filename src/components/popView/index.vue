<template>
	<view class="pop-view" :class="{ 'un-show': !show }" @tap="close">
		<slot></slot>
	</view>
</template>
<script lang="ts">
	import { defineComponent } from 'vue';
	import './index.scss';

	export default defineComponent({
		props: {
			show: {
				default: false,
				type: Boolean
			}
		},
		methods: {
			close() {
				this.$emit('update:show', false);
			}
		}
	});
</script>

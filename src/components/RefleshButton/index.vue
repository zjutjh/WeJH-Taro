<template>
	<button class="circle" @tap="reflesh"><view class="iconfont icon-shuaxin" :class="{ 'reflesh-running': isRefleshing }" /></button>
</template>

<script lang="ts">
	export default {
		props: {
			isRefleshing: Boolean
		},
		methods: {
			reflesh() {
				this.$emit('reflesh');
			}
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

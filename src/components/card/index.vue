<template>
	<view class="card">
		<slot></slot>
	</view>
</template>
<script lang="ts">
	import { defineComponent } from 'vue';
	import './index.scss';
	export default defineComponent({
		props: {}
	});
</script>

<template>
	<header-tab-view :title="校车">
		<template v-slot:content>
			<web-view src="https://mp.weixin.qq.com/s/Xq-golNPMVQGnXxbeMagtg" />
		</template>
		<template v-slot:image> <text /></template>
	</header-tab-view>
</template>
<script lang="ts">
	import HeaderTabView from '@/components/HeaderTabView/index.vue';
	import { defineComponent } from 'vue';
	import './index.scss';

	export default defineComponent({
		components: { HeaderTabView }
	});
</script>

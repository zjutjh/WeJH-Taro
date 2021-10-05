<template>
	<header-tab-view>
		<template v-slot:image>
			<image mode="aspectFit" src="@/assets/schoolbus/schoolbus.svg"></image>
		</template>
		<template v-slot:content>
			<view class="bus-card" v-for="bus in busList" :key="bus.id">
				<view class="line-no">
					{{ bus.LineNo }}
					<text>即将发车</text>
				</view>
				<view> {{ bus.From }}->{{ bus.To }}</view>
				<view> 开点：{{ bus.Time }}</view>
			</view>
		</template>
	</header-tab-view>
</template>
<script lang="ts">
	import HeaderTabView from '@/components/HeaderTabView/index.vue';
	import { defineComponent } from 'vue';
	import { serviceStore } from '@/store';
	import './index.scss';

	export default defineComponent({
		components: { HeaderTabView },
		computed: {
			busList() {
				return serviceStore.schoolBus;
			}
		}
	});
</script>

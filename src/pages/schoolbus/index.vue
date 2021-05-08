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
	import { reactive, ref } from 'vue';
	import './index.scss';
	import Taro from '@tarojs/taro';
	import { defineComponent } from 'vue';
	import headerTabView from '@/components/headerTabView/index.vue';
	import { serviceStore } from '@/store';

	export default defineComponent({
		components: { headerTabView },
		computed: {
			busList() {
				return serviceStore.schoolBus;
			}
		}
	});
</script>

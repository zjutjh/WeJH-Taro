<template>
	<bottom-panel>
		<view @tap="nev('/pages/index/index')">
			<view class="iconfont icon-home-heart-line large"></view>
		</view>
		<view @tap="nev('/pages/my/index')">
			<view class="iconfont icon-user-3-line large"></view>
		</view>
		<button v-if="showPlus" class="finder" @tap="plusClick">
			<view class="iconfont icon-apps-2-fill" />
		</button>
	</bottom-panel>
</template>
<script lang="ts">
	import BottomPanel from '@/components/BottomPanel/index.vue';
	import Taro from '@tarojs/taro';
	import { defineComponent } from 'vue';
	export default defineComponent({
		setup(props, { emit }) {
			const pages = Taro.getCurrentPages();
			const currentPage = pages[pages.length - 1];
			return {
				nev: (url: string) => {
					if (currentPage.route !== url && !url.includes(currentPage.route)) Taro.redirectTo({ url: url });
				},
				plusClick: () => {
					emit('plusClick');
				}
			};
		},
		components: { BottomPanel },
		props: {
			showPlus: {
				default: true,
				type: Boolean
			}
		}
	});
</script>

<style lang="scss">
	.finder {
		border-radius: 100vh;
		font-size: 1rem;
		position: absolute;
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		transform: rotate(45deg);
		margin: auto;
	}
</style>

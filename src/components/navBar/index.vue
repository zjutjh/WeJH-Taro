<template>
	<bottom-panel>
		<view @tap="nevHome">
			<view class="iconfont icon-home-heart-line large"></view>
		</view>
		<view @tap="nev">
			<view class="iconfont icon-user-3-line large"></view>
		</view>
		<button v-if="showPlus" class="finder" @tap="plusClick">
			<view class="iconfont icon-apps-2-fill" />
		</button>
	</bottom-panel>
</template>
<script lang="ts">
	import { defineComponent } from 'vue';
	import Taro from '@tarojs/taro';
	import BottomPanel from '@/components/bottomPanel/index.vue';
	export default defineComponent({
		components: { BottomPanel },
		props: {
			showPlus: {
				default: true,
				type: Boolean
			}
		},
		methods: {
			nev() {
				Taro.redirectTo({
					url: '/pages/my/index'
				});
			},
			nevHome() {
				Taro.redirectTo({
					url: '/pages/index/index'
				});
			},
			plusClick() {
				this.$emit('plusClick');
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

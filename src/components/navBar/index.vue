<template>
	<view class="nav-bar" :class="{ 'nav-bar-ios': isNewIPhone }">
		<view @tap="nevHome">
			<view class="iconfont icon-home-heart-line large"></view>
		</view>
		<view @tap="nev">
			<view class="iconfont icon-user-3-line large"></view>
		</view>
		<view v-if="showPlus" class="finder" @tap="plusClick">
			<view class="iconfont icon-apps-2-fill large" />
		</view>
	</view>
</template>
<script lang="ts">
	import { defineComponent } from 'vue';
	import Taro from '@tarojs/taro';

	export default defineComponent({
		props: {
			showPlus: {
				default: true,
				type: Boolean
			}
		},
		computed: {
			isNewIPhone(): boolean {
				let info = Taro.getSystemInfoSync();
				if (!info.model) return false;
				let isNewIphone = info.model.match('(iPhone X|iPhone XS|iPhone 11|iPhone 12|iPhone 12S)')?.length;
				return isNewIphone !== undefined && isNewIphone > 0;
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
	.nav-bar-ios {
		padding-bottom: 1rem;
	}
	.nav-bar {
		background-color: rgba($color: #fff, $alpha: 0.7);
		backdrop-filter: blur(10px);
		height: 3rem;
		position: fixed;
		display: flex;
		justify-content: space-around;
		bottom: 0;
		align-items: center;
		width: 100vw;
		box-shadow: 0.3em 0.3em 1em rgba(0, 0, 0, 0.3);
	}

	.finder {
		border-radius: 100vh;
		background-color: white;
		position: absolute;
		box-shadow: 0.3em 0.3em 1em rgba(0, 0, 0, 0.3);
		width: 4rem;
		height: 4rem;
		display: flex;
		justify-content: center;
		align-items: center;
		transform: translateY(-50%);
		margin: auto;
	}
</style>

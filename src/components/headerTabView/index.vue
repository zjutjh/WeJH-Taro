<template>
	<scroll-view class="page" @scroll="scrollPage" scrollY="true" @scrolltoupper="upper">
		<view>
			<view class="header">
				<title-bar :title="title" :showBackButton="true">
					<template v-slot:prefix>
						<slot name="prefix"></slot>
					</template>
				</title-bar>
				<view class="image" :style="imageStyle">
					<slot name="image">
						<image mode="aspectFit" :src="img" style="height: 100%"></image>
					</slot>
				</view>
				<view class="keep-header" v-if="showTab">
					<slot name="tab"></slot>
				</view>
			</view>
			<view class="content">
				<view>
					<slot name="content"></slot>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script lang="ts">
	import { defineComponent } from 'vue';
	import Taro from '@tarojs/taro';
	import './index.scss';
	import TitleBar from '@/components/titleBar/index.vue';

	export default defineComponent({
		components: { TitleBar },
		props: {
			img: {
				default: require('@/assets/library/library.svg'),
				type: String
			},
			showTab: {
				type: Boolean,
				defture: true
			},
			title: String
		},
		data() {
			return {
				imageStyle: {
					transform: 'scale(1)',
					opacity: '1',
					height: '300rpx',
					margin: '1rem'
				},
				topStyle: {
					marginTop: '0'
				}
			};
		},
		methods: {
			goBack() {
				Taro.navigateBack();
			},
			upper() {
				this.imageStyle.height = '300rpx';
				this.imageStyle.transform = 'scale(1)';
				this.imageStyle.opacity = '1';
				this.imageStyle.margin = '1rem';
			},
			scrollPage(e) {
				if (e.detail.scrollTop - e.detail.deltaY < 10) {
					this.imageStyle.height = '300rpx';
					this.imageStyle.transform = 'scale(1)';
					this.imageStyle.opacity = '1';
					this.imageStyle.margin = '1rem';
					return;
				}
				if (Math.abs(e.detail.deltaY) > 10) {
					if (e.detail.scrollTop - e.detail.deltaY < 80) {
						this.imageStyle.height = '300rpx';
						this.imageStyle.transform = 'scale(1)';
						this.imageStyle.opacity = '1';
						this.imageStyle.margin = '1rem';
						return;
					}
					if (e.detail.scrollTop > 100 && e.detail.scrollTop < 200) {
						this.imageStyle.height = 300 - e.detail.scrollTop + 'rpx';
						this.imageStyle.transform = `scale(${1 - e.detail.scrollTop / 300})`;
						this.imageStyle.opacity = '1';
						this.imageStyle.margin = '1rem';
					}

					if (e.detail.scrollTop > 200) {
						this.imageStyle.height = '0rpx';
						this.imageStyle.opacity = '0';
						this.imageStyle.margin = '0';
					}
				}
			}
		}
	});
</script>

<template>
	<view class="index">
		<view class="header">
			<image src="@/assets/g/logo.jpg" mode="aspectFill" />
		</view>
		<card>
			<view>
				<view class="large">账号激活</view>
				<text>用户名</text>
				<input type="text" placeholder="输入精弘通行证用户名" v-model="username" />
				<text>密码</text>
				<input type="password" placeholder="输入密码" v-model="password" />
				<view class="act-action">
					<button class="active" @tap="activeClick">登录</button>
				</view>
			</view>
		</card>
	</view>
</template>

<script lang="ts">
	import { ref } from 'vue';
	import Card from '@/components/card/index.vue';
	import { UserService } from '@/services';
	import Taro from '@tarojs/taro';
	import './index.scss';

	export default {
		components: {
			Card
		},
		data() {
			return {
				username: '',
				studentid: '',
				password: ''
			};
		},
		methods: {
			async loginClick() {
				let res = await AuthS({
					username: this.username,
					studentID: this.studentid,
					password: this.password,
					idCardNumber: this.idcard
				});
				if (res) {
					await Taro.navigateTo({
						url: '/pages/my/index'
					});
				}
			}
		}
	};
</script>

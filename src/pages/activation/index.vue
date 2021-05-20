<template>
	<view class="index">
		<view class="header">
			<image src="@/assets/g/logo.jpg" mode="aspectFill" />
		</view>
		<card>
			<view>
				<view class="large">账号激活</view>
				<text>用户名</text>
				<input type="text" placeholder="输入学号" v-model="username" />
				<text>学号</text>
				<input type="text" placeholder="输入学号" v-model="studentid" />
				<text>密码</text>
				<input type="password" placeholder="输入密码" v-model="password" />
				<text>身份证</text>
				<input type="idcard" placeholder="身份证号" v-model="idcard" />
				<text>邮箱</text>
				<input type="email" placeholder="邮箱" v-model="email" />
				<view class="act-action">
					<button class="active" @tap="activeClick">激活/绑定通行证</button>
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
				password: '',
				idcard: '',
				email: ''
			};
		},
		methods: {
			async activeClick() {
				let res = await UserService.createUserApp({
					username: this.username,
					studentID: this.studentid,
					password: this.password,
					idCardNumber: this.idcard,
					email: this.email
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

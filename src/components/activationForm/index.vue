<template>
	<view class="act-form">
		<view class="large">账号激活</view>
		<text>用户名</text>
		<input type="text" placeholder="输入精弘通行证用户名" v-model="username" />
		<text>学号</text>
		<input type="text" placeholder="输入学号" v-model="studentid" />
		<text>密码</text>
		<input type="password" placeholder="输入密码" v-model="password" />
		<text>身份证</text>
		<input type="idcard" placeholder="身份证号" v-model="idcard" />
		<view class="act-action">
			<button @tap="activeClick">激活/绑定通行证</button>
		</view>
	</view>
</template>

<script lang="ts">
	import { ref } from 'vue';
	import { UserService } from '@/services';
	import Taro from '@tarojs/taro';

	export default {
		data() {
			return {
				username: '',
				studentid: '',
				password: '',
				idcard: ''
			};
		},
		methods: {
			async activeClick() {
				let res = await UserService.createUserApp({
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

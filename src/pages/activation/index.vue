<template>
	<view class="index">
		<view class="steps">
			<steps current="1">
				<step title="账号激活">1</step>
				<step title="账号绑定">2</step>
			</steps>
		</view>
		<card class="card">
			<view>
				<view class="large">账号激活</view>
				<text>学号</text>
				<input type="text" placeholder="输入学号" v-model="studentid" />
				<text>密码</text>
				<input type="password" placeholder="输入密码" v-model="password" />
				<text>身份证</text>
				<input type="idcard" placeholder="身份证号" v-model="idcard" />
				<text>邮箱</text>
				<input type="email" placeholder="邮箱" v-model="email" />
			</view>
		</card>
		<view class="act-action">
			<button class="active" @tap="activeClick">绑定通行证</button>
		</view>
	</view>
</template>

<script lang="ts">
	import { Step, Steps } from '@nutui/nutui-taro';
	import Card from '@/components/Card/index.vue';
	import Taro from '@tarojs/taro';
	import { UserService } from '@/services';
	import './index.scss';

	export default {
		components: {
			Card,
			Steps,
			Step
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
				const res = await UserService.createUserApp({
					username: this.studentid,
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

<template>
	<title-bar style="position: fixed" :show-back-button="true"></title-bar>
	<view>
		<view class="header">
			<image src="@/assets/g/logo.jpg" mode="aspectFill" />
		</view>
		<view class="act-form">
			<view>
				<text class="title">密码绑定</text>
			</view>

			<text>正方教务系统密码</text>
			<view>
				<input v-if="!user.isBindZF" type="password" placeholder="输入正方教务系统密码" v-model="zfpass" />
				<input v-else type="password" placeholder="*******" v-model="zfpass" />
				<button @tap="bindZFClick" :disabled="zfpass === ''">
					<text v-if="!user.isBindZF">绑定</text>
					<text v-else>修改</text>
				</button>
			</view>
			<text>校园卡密码</text>
			<view>
				<input v-if="!user.isBindCard" type="password" placeholder="输入校园卡密码" v-model="cardpass" />
				<input v-else type="password" placeholder="********" v-model="cardpass" />
				<button @tap="bindCardClick" :disabled="cardpass === ''">
					<text v-if="!user.isBindCard"> 绑定 </text>
					<text v-else> 修改 </text>
				</button>
			</view>
			<text>图书馆密码</text>
			<view>
				<input v-if="!user.isBindLibrary" type="password" placeholder="输入图书馆密码" v-model="libpass" />
				<input v-else type="password" placeholder="********" v-model="libpass" />
				<button @tap="bindLibClick" :disabled="libpass === ''">
					<text v-if="!user.isBindLibrary"> 绑定 </text>
					<text v-else> 修改 </text>
				</button>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import { ref } from 'vue';
	import { UserService } from '@/services';
	import Taro from '@tarojs/taro';
	import TitleBar from '@/components/titleBar/index.vue';
	import './index.scss';
	import { serviceStore } from '@/store';

	export default {
		components: {
			TitleBar
		},
		computed: {
			user() {
				return serviceStore.user;
			}
		},
		data() {
			return {
				zfpass: '',
				libpass: '',
				cardpass: ''
			};
		},
		methods: {
			async bindZFClick() {
				let res = await UserService.bindZF({ password: this.zfpass }, false);
				await this.popModal(res.code);
			},
			async bindLibClick() {
				let res = await UserService.bindLibrary({ password: this.libpass }, false);
				await this.popModal(res.code);
			},
			async bindCardClick() {
				let res = await UserService.bindSchoolCard({ password: this.cardpass }, false);
				await this.popModal(res.code);
			},
			async popModal(code) {
				if (code !== 1) {
					await Taro.showModal({
						title: '出错了',
						content: '请再试一次'
					});
				} else {
					await Taro.showToast({
						title: '绑定成功'
					});
				}
			}
		}
	};
</script>

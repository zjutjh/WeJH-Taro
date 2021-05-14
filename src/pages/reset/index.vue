<template>
	<view class="index">
		<view class="header">
			<image src="@/assets/g/logo.jpg" mode="aspectFill" />
		</view>
		<card>
			<activation-form></activation-form>
		</card>
	</view>
</template>

<script lang="ts">
	import { ref } from 'vue';
	import ActivationForm from '@/components/activationForm/index.vue';
	import Card from '@/components/card/index.vue';
	import { UserService } from '@/services';
	import Taro from '@tarojs/taro';
	import './index.scss';

	export default {
		components: {
			ActivationForm,
			Card
		}
	};
</script>

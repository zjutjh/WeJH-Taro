import Taro from '@tarojs/taro';
import store from '@/store';
import fetch from '@/utils/fetch';
import { api } from '../api/apiList';
import { updateDateStateWithSession } from '../utils/updateDateState';

export default class UserService {
	static async bindLibrary(data?: { password: string }, showModal = true) {
		return updateDateStateWithSession(api.user.bind.library, data, 'setBindLibrary', null, (res) => res.data.code === 1, showModal);
	}

	static async bindZF(data?: { password: string }, showModal = true) {
		return updateDateStateWithSession(api.user.bind.zf, data, 'setBindZF', null, (res) => res.data.code === 1, showModal);
	}

	static async bindSchoolCard(data?: { password: string }, showModal = true): Promise<any> {
		return updateDateStateWithSession(api.user.bind.schoolCard, data, 'setBindSchoolCard', null, (res) => res.data.code === 1, showModal);
	}

	static async getUserInfo(autoLogin = true): Promise<any> {
		return await updateDateStateWithSession(
			api.user.info,
			null,
			'setUserInfo',
			'clearUserInfo',
			function(res) {
				return res.data.data.user;
			},
			autoLogin
		);
	}

	static async createUserApp(userForm: { username: string; password: string; studentID: string; idCardNumber: string; email?: string;code?: string }) {
		if (!userForm.code) {
			let res = await Taro.login({ timeout: 3000 });
			if (res.code) userForm.code = res.code;
			else return false;
		}

		let res = await fetch.post(api.user.create.wechat, userForm);
		if (res.statusCode === 200) {
			if (res.cookies && res.cookies.length > 0) {
				store.commit('setSession', res.cookies[0]);
				UserService.getUserInfo();
			}
			return true;
		}

		return false;
	}

	static async createUserH5(userForm: { username: string; password: string; studentID: string; idCardNumber: string }) {
		let res = await fetch.post(api.user.create.h5, userForm);
		if (res.statusCode === 200) {
			if (res.cookies && res.cookies.length > 0) {
				store.commit('setSession', res.cookies[0]);
				UserService.getUserInfo();
			}
			return true;
		}

		return false;
	}
}

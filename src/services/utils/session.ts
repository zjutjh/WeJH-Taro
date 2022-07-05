import { ejectCookies } from '@/utils/cookie/cookie';
import store, { serviceStore } from '@/store';
import fetch, { FetchResult } from '@/utils/fetch';
import UserService from '../services/userService';
import { LoginByTaro } from '../services/authService';
import { ServerCode } from '../api/codes';

// comment: 一般通过 updateDateStateWithSession 调用
async function postWithSession(url: string, data?: undefined | object, autoLogin = true): Promise<FetchResult | null> {
	let res: FetchResult | null = null;
	let hasSession = checkSession();
	// comment: 有 session
	if (hasSession && serviceStore.sessionID) {
		res = await fetch.post(url, data, ejectCookies([serviceStore.sessionID]));
	}

	// comment: 如果刚才发出了请求，并且有结果，就直接返回结果
	// TODO: NotLogin
	if (res !== null && hasSession && res?.data.code !== ServerCode.NotLogin) return res;

	// !hasSession 非自动登录，就直接取消继续获取 session
	// 如testSession 就不用再获取 session
	if (!autoLogin) return null;

	// comment: 没有 session 才会到这一步，先获取 session，再请求
	let success = await LoginByTaro();
	if (success && serviceStore.sessionID) {
		return await fetch.post(url, data, ejectCookies([serviceStore.sessionID]));
	}
	return null;
}

function checkSession(): boolean {
	// comment: 检查有无 session
	return (serviceStore.sessionID && serviceStore.sessionID !== '') || false;
}

async function testSession(): Promise<boolean> {
	if (checkSession()) {
		const res = await UserService.getUserInfo(false);
		if (res && !serviceStore.user.isActive && res.data?.code === ServerCode.OK) {
			store.commit('setUserInfo', res.data.user);
			return true;
		}
	}
	return false;
}

export { testSession, postWithSession };

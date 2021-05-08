import Taro from '@tarojs/taro';
import fetch, { FetchResult } from '@/utils/fetch';
import { api } from '../api/apiList';
import { serviceStore } from '@/store';
import store from '@/store';
import { testSession } from '../utils/session';
import { throttle2 } from '@/utils/tools';
import errCodeHandler from '../utils/errHandler';
import { ServerCode } from '../api/codes';

async function LoginByTaroImpl(): Promise<Boolean> {
	if ((serviceStore.sessionID && serviceStore.sessionID !== '') || process.env.TARO_ENV === 'h5') if (await testSession()) return true;

	store.commit('clearSession');
	let fet: FetchResult | undefined;
	if (process.env.TARO_ENV !== 'h5') {
		let res = await Taro.login({ timeout: 3000 });
		let code = res.code;
		if (!code) return false;
		fet = await fetch.post(api.user.login.wechat, { code: res.code });
	} else
		fet = await fetch.post(api.user.login.password, {
			username: '',
			password: ''
		});
	if (fet.data.code === ServerCode.OK)
		if (process.env.TARO_ENV !== 'h5') {
			if (fet.cookies && fet.cookies.length > 0) {
				store.commit('setSession', fet.cookies[0]);
				store.commit('setUserInfo', fet.data.data.user);
				return true;
			}
		} else {
			store.commit('setUserInfo', fet.data.data.user);
			return true;
		}
	errCodeHandler(fet.data.code);
	return false;
}

const LoginByTaro = throttle2(LoginByTaroImpl);

export { LoginByTaro };

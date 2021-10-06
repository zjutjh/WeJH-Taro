import { ejectCookies } from '@/utils/cookie/cookie';
import { serviceStore } from '@/store';
import fetch, { FetchResult } from '@/utils/fetch';
import UserService from '../services/userService';
import { LoginByTaro } from '../services/authService';
import { ServerCode } from '../api/codes';

async function postWithSession(url: string, data?: undefined | object, autoLogin = true): Promise<FetchResult | null> {
	let res: FetchResult | null = null;
	let hasSession = checkSession();
	if (hasSession && serviceStore.sessionID) {
		res = await fetch.post(url, data, ejectCookies([serviceStore.sessionID]));
	}

	if (res !== null && hasSession && res?.data.code !== ServerCode.NotLogin) return res;
	if (!autoLogin) return null;
	let success = await LoginByTaro();
	if (success && serviceStore.sessionID) {
		return await fetch.post(url, data, ejectCookies([serviceStore.sessionID]));
	}
	return null;
}

function checkSession(): boolean {
	return serviceStore.sessionID && serviceStore.sessionID !== '' || false;
}

async function testSession(): Promise<boolean> {
	if (checkSession()) {
		return UserService.getUserInfo(false);
	}
	return false;
}

export { testSession, postWithSession };

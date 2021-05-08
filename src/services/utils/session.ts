import { ejectCookies } from '@/utils/cookie/cookie';
import { serviceStore } from '@/store';
import fetch, { FetchResult } from '@/utils/fetch';
import UserService from '../services/userService';
import { LoginByTaro } from '../services/authService';

async function postWithSession(url: string, data?: undefined | object, autoLogin = true): Promise<FetchResult | null> {
	let res: FetchResult | null = null;
	let hasSession = checkSession();
	if (hasSession) res = await fetch.post(url, data, ejectCookies([serviceStore.sessionID]));

	if (res !== null && res?.statusCode === 200) return res;

	if (res !== null && hasSession && res?.data.code !== -401) return res;
	if (!autoLogin) return null;
	let success = await LoginByTaro();
	if (success) return await fetch.post(url, data, ejectCookies([serviceStore.sessionID]));

	return null;
}

function checkSession(): boolean {
	return serviceStore.sessionID && serviceStore.sessionID !== '';
}

async function testSession(): Promise<boolean> {
	if (checkSession()) {
		return UserService.getUserInfo(false);
	}
	return false;
}

export { testSession, postWithSession };

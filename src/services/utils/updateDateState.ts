import fetch, { FetchResult } from '@/utils/fetch';
import store from '@/store';
import { postWithSession } from './session';
import { ServerCode } from '../api/codes';
import Taro from '@tarojs/taro';
import errCodeHandler from './errHandler';
async function updateDateState(api: string, data, commitName: string, clearCommitName: string | null, showModal = true) {
	store.commit('startLoading');
	let res = await fetch.post(api, data);
	if (clearCommitName) store.commit(clearCommitName);
	if (res.statusCode === 200 && res.data) {
		if (res.data.code === ServerCode.OK) store.commit(commitName, res.data.data);
		else errCodeHandler(res.data.code, showModal);
	} else errCodeHandler(res.data.code, showModal);
	store.commit('stopLoading');
	return res.data;
}

async function updateDateStateWithSession(api: string, data, commitName: string, clearCommitName: string | null, commitData: Function = (res: FetchResult) => res.data.data, autoLogin = true, showModal = true) {
	store.commit('startLoading');
	let res = await postWithSession(api, data, autoLogin);
	if (clearCommitName && clearCommitName !== '') store.commit(clearCommitName);
	if (res?.statusCode === 200 && res.data) {
		if (res.data.code === ServerCode.OK) store.commit(commitName, commitData(res));
		else errCodeHandler(res.data.code, showModal);
	} else errCodeHandler(res?.data.code, showModal);
	store.commit('stopLoading');
	return res?.data;
}

export { updateDateState, updateDateStateWithSession };

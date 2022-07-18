import fetch, { FetchResult } from '@/utils/fetch';
import store from '@/store';
import { postWithSession } from './session';
import { ServerCode } from '../api/codes';
import errCodeHandler from './errHandler';

// comment: 无 session 请求更新全局状态，系统请求专用
async function updateDateState(api: string, data, commitName: string, clearCommitName: string | null, showModal = true) {
	store.commit('startLoading');
	// comment: 更新数据前发送请求
	let res = await fetch.post(api, data);
	if (clearCommitName) store.commit(clearCommitName);
	if (res.statusCode === 200 && res.data) {
		if (res.data.code === ServerCode.OK) store.commit(commitName, res.data.data);
		else errCodeHandler(res.data.code, showModal);
	} else errCodeHandler(res.data.code, showModal);
	store.commit('stopLoading');
	return res.data;
}

// comment: 带 session 发送请求，并更新状态
async function updateDateStateWithSession(api: string, data, commitName: string, commitData: Function = (res: FetchResult) => res.data.data, autoLogin = true, showModal = true) {
	store.commit('startLoading');
	let res = await postWithSession(api, data, autoLogin);
	if (res?.statusCode === 200 && res.data) {
		// comment: 为啥默认给绑定值true
		if (res.data.code === ServerCode.OK) store.commit(commitName, commitData(res));
		else errCodeHandler(res.data.code, showModal);
	} else errCodeHandler(res?.data.code, showModal);
	store.commit('stopLoading');
	return res?.data;
}

export { updateDateState, updateDateStateWithSession };

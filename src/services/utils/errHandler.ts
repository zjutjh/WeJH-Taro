import { ServerCode } from '../api/codes';
import Taro from '@tarojs/taro';
export default async function errCodeHandler(code, showModal = true) {
	if (showModal)
		switch (code) {
			case ServerCode.NoThatPasswordORWrong:
				await Taro.showModal({
					title: '错误',
					content: '密码变更或未初始化，请重新绑定服务账号，获取信息',
					success: (res) => {
						if (res.confirm) {
							Taro.navigateTo({ url: '/pages/bind/index' });
						}
					}
				});
				break;
			case ServerCode.UserNotFind:
				await Taro.showModal({
					title: '提示',
					content: '当前账号未激活',
					confirmText: '激活',
					success: (res) => {
						if (res.confirm) {
							Taro.navigateTo({ url: '/pages/activation/index' });
						}
					}
				});
				break;
			case ServerCode.UserCenterNotMatch:
				await Taro.showModal({
					title: '提示',
					content: '当前信息不匹配',
					confirmText: '确定'
				});
				break;
			case ServerCode.UserCenterNotFind:
				await Taro.showModal({
					title: '提示',
					content: '当前信息不存在',
					confirmText: '确定'
				});
				break;
			case ServerCode.ParamError:
				await Taro.showModal({
					title: '提示',
					content: '当前输入信息不匹配',
					confirmText: '确定'
				});
				break;
		}
}

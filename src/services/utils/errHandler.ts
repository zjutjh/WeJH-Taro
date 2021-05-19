import { ServerCode } from '../api/codes';
import Taro from '@tarojs/taro';
export default function errCodeHandler(code, showModal = true) {
	if (code === ServerCode.NoThatPasswordORWrong) {
		if (showModal)
			Taro.showModal({
				title: '错误',
				content: '密码变更或为初始化，请重新绑定服务账号',
				success: (res) => {
					if (res.confirm) {
						Taro.navigateTo({ url: '/pages/bind/index' });
					}
				}
			});
	} else if (code == ServerCode.UserNotFind)
		if (showModal)
			Taro.showModal({
				title: '提示',
				content: '当前账号未激活',
				confirmText: '激活',
				success: (res) => {
					if (res.confirm) {
						Taro.navigateTo({ url: '/pages/activation/index' });
					}
				}
			});
}

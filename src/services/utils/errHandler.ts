import { ServerCode } from '../api/codes';
import Taro from '@tarojs/taro';
import store, { serviceStore } from '@/store';

// comment: 微信相关登录异常处理
export default async function errCodeHandler(code: number, showModal = true) {
  console.log('Error code', code);
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
      case ServerCode.UserNotFound:
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
      case ServerCode.UserCenterNotFound:
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
      case ServerCode.UsernamePasswordUnmatched:
        await Taro.showToast({
          icon: 'none',
          title: '密码错误'
        });
        break;
      case ServerCode.UserNotLogin:
        if (serviceStore.user.isActive) {
          store.commit('clearUserInfo');
          await Taro.showModal({
            title: '错误',
            content: '未登录'
          });
        }
        break;
      case ServerCode.SystemError:
        await Taro.showToast({
          icon: 'none',
          title: '系统异常'
        });
        break;

      case ServerCode.UserAlreadyExisted:
        await Taro.showModal({
          title: '提示',
          content: '用户已存在',
          confirmText: '去登录',
          success: (res) => {
            console.log('res', res);
          }
        });
        break;
      case ServerCode.activation.passportExisted:
        await Taro.showToast({
          icon: 'none',
          title: '通行证已存在'
        });
        break;
      case ServerCode.activation.schoolIdOrIdNotExistNotMatch:
        await Taro.showToast({
          icon: 'none',
          title: '学号或身份证号不存在或者不匹配'
        });
        break;
      case ServerCode.activation.passwordLenghtError:
        await Taro.showToast({
          icon: 'none',
          title: '密码长度请在6~20位之间'
        });
        break;
      case ServerCode.bind.schoolCardServerError:
        await Taro.showToast({
          icon: 'none',
          title: '服务器暂不可用'
        });
        break;
      default:
        if (process.env.NODE_ENV === 'development')
          await Taro.showToast({
            icon: 'none',
            title: `${code}`
          });
        break;
    }
}

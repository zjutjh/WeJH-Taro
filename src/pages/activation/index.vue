<template>
  <view class="background">
    <title-bar
      title="通行证激活"
      :back-button="step === 1 ? true : false"
    ></title-bar>
    <scroll-view :scrollY="true">
      <view class="flex-column">
        <card title="账号注册" class="activation-card" v-if="step === 1">
          <view class="activation-form">
            <view>
              <text>学号</text>
              <input type="text" placeholder="输入学号" v-model="studentid" />
              <view class="prompt" v-show="studentid?.length === 0"
                >请输入学号</view
              >
            </view>
            <view>
              <text>密码</text>
              <input
                type="password"
                placeholder="请输入密码"
                v-model="password"
              />
              <view class="prompt" v-show="password?.length === 0"
                >请输入密码</view
              >
            </view>
            <view>
              <text>确认密码</text>
              <input
                type="password"
                placeholder="请再次输入密码"
                v-model="comfirmPassword"
              />
              <view class="prompt" v-show="comfirmPassword != password"
                >两次密码不匹配</view
              >
            </view>
            <view>
              <text>身份证号</text>
              <input
                type="idcard"
                placeholder="仅做验证学生身份用"
                v-model="idcard"
              />
              <view class="prompt" v-show="idcard?.length === 0"
                >请输入本人身份证号</view
              >
            </view>
            <view>
              <text>邮箱</text>
              <input
                type="email"
                placeholder="请输入邮箱地址"
                v-model="email"
              />
              <view class="prompt" v-show="email?.length === 0"
                >请输入邮箱地址</view
              >
            </view>
          </view>
          <template #footer>
            <w-button block class="active" @tap="activeClick">
              绑定通行证
            </w-button>
            <w-steps :total="2" :current="step"></w-steps>
          </template>
        </card>
        <card title="完成" v-if="step === 2" class="success-card">
          <view class="success">
            <view class="success-content">
              <view class="iconfont icon-success"></view>
              <view>恭喜你已成功完成注册！</view>
            </view>
          </view>
          <template #footer>
            <w-button block @tap="nav2bind"> 去绑定校园账号 </w-button>
            <w-steps :total="2" :current="step"></w-steps>
          </template>
        </card>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
  import Card from '@/components/Card/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import { WButton } from '@/components/button';
  import { WSteps } from '@/components/steps';
  import Taro from '@tarojs/taro';
  import { UserService } from '@/services';
  import './index.scss';
  import store from '@/store';

  export default {
    components: {
      Card,
      TitleBar,
      WButton,
      WSteps
    },
    data() {
      return {
        username: '',
        studentid: undefined,
        password: undefined,
        comfirmPassword: undefined,
        idcard: undefined,
        email: undefined,
        step: 1
      };
    },
    methods: {
      async activeClick() {
        if (!this.checkFrom()) return;
        Taro.showLoading({ title: '正在绑定通行证', mask: true });

        const res = await UserService.createUserApp({
          username: this.studentid,
          studentID: this.studentid,
          password: this.password,
          idCardNumber: this.idcard,
          email: this.email
        });

        if (res) {
          Taro.hideLoading();
          this.step++;
        }
      },
      async nav2bind() {
        Taro.showLoading();
        await Taro.getUserProfile({
          desc: '用于获取头像和昵称',
          success: (res: any) => {
            const { avatarUrl, nickName } = res.userInfo;
            store.commit('setUserWXProfile', { avatarUrl, nickName });
          },
          complete: (res) => {
            console.log(res);
          }
        });
        Taro.hideLoading();
        await Taro.redirectTo({
          url: '/pages/bind/index'
        });
        await Taro.showToast({
          icon: 'none',
          title: '自动导航至绑定页面'
        });
      },

      checkFrom() {
        if (
          this.studentid &&
          this.password &&
          this.comfirmPassword === this.password &&
          this.idcard &&
          this.email
        )
          return true;
        if (!this.studentid) this.studentid = '';
        if (!this.password) this.password = '';
        if (!this.comfirmPassword) this.comfirmPassword = '';
        if (!this.idcard) this.idcard = '';
        if (!this.email) this.email = '';
        return false;
      }
      // TODO: 手动登录
      /* 			async loginByHand() {
  		Taro.showLoading({ title: 'loading', mask: true });
  		let fet: FetchResult | undefined;
  		fet = await fetch.post(api.user.login.password, { username: '202103340221', password: '11111111' });
  		console.log(fet);

  		if (fet.cookies && fet.cookies.length > 0) {
  			store.commit('setSession', fet.cookies[0]);
  			store.commit('setUserInfo', fet.data.data.user);
  			await Taro.navigateTo({
  				url: '/pages/my/index'
  			});
  		}
  		Taro.hideLoading();
  	} */
    }
  };
</script>

<template>
  <view class="index">
    <view class="steps">
      <steps current="1">
        <step title="账号激活">1</step>
        <step title="账号绑定">2</step>
      </steps>
   </view>
    <card class="card">
      <view>
        <view class="large">账号激活</view>
        <text>学号</text>
        <input type="text" placeholder="输入学号" v-model="studentid" />
        <text>密码</text>
        <input type="password" placeholder="输入密码" v-model="password" />
        <text>身份证</text>
        <input type="idcard" placeholder="身份证号" v-model="idcard" />
        <text>邮箱</text>
        <input type="email" placeholder="邮箱" v-model="email" />
      </view>
    </card>
    <view class="act-action">
      <button class="active" @tap="activeClick">绑定通行证</button>
    </view>
  </view>
</template>

<script lang="ts">
  import { Step, Steps } from '@nutui/nutui-taro';
  import Card from '@/components/Card/index.vue';
  import Taro from '@tarojs/taro';
  import { UserService } from '@/services';
  import './index.scss';

  export default {
    components: {
      Card,
      Steps,
      Step
    },
    data() {
      return {
        username: '',
        studentid: '',
        password: '',
        idcard: '',
        email: ''
      };
    },
    methods: {
      async activeClick() {
        Taro.showLoading({ title: '正在绑定通行证', mask: true });
        const res = await UserService.createUserApp({
          username: this.studentid,
          studentID: this.studentid,
          password: this.password,
          idCardNumber: this.idcard,
          email: this.email
        });
        Taro.hideLoading();
        if (res) {
          await Taro.redirectTo({
            url: '/pages/bind/index'
          });
          await Taro.showToast({
            icon: 'none',
            title: '自动导航至绑定页面'
          });
        }
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

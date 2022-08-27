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
              <view
                class="prompt"
                v-show="studentid?.length && invalidStudentId"
                >学号格式错误</view
              >
            </view>
            <view>
              <text>设置密码</text>
              <input
                type="password"
                placeholder="请输入密码"
                v-model="password"
              />
              <view class="prompt" v-show="password?.length === 0"
                >请输入密码</view
              >
              <view class="prompt" v-show="password?.length && invalidPassword"
                >密码长度应在6～20位之间</view
              >
            </view>
            <view>
              <text>确认密码</text>
              <input
                type="password"
                placeholder="请再次输入密码"
                v-model="comfirmPassword"
              />
              <view
                class="prompt"
                v-show="
                  comfirmPassword !== undefined && comfirmPassword != password
                "
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
              <view class="prompt" v-show="idcard?.length && invalidIdCard"
                >身份证号格式错误</view
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
        <card v-if="step === 1">
          <view class="activation-help"> {{ helpContent }}</view>
        </card>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
  import Card from '@/components/Card/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import { WButton } from '@/components/button';
  import { WSteps } from '@/components/steps';
  import Taro from '@tarojs/taro';
  import { UserService } from '@/services';
  import './index.scss';
  import store from '@/store';
  import { helpText } from '@/constants/copywriting';
  import { computed, ref } from 'vue';

  const studentid = ref<string | undefined>(undefined);
  const password = ref<string | undefined>(undefined);
  const comfirmPassword = ref<string | undefined>(undefined);
  const idcard = ref<string | undefined>(undefined);
  const email = ref<string | undefined>(undefined);
  const step = ref(1);
  const invalidStudentId = ref(false);
  const invalidPassword = ref(false);
  const invalidIdCard = ref(false);

  const helpContent = computed(() => {
    return helpText.activtion;
  });

  async function activeClick() {
    if (!checkForm()) return;
    Taro.showLoading({ title: '正在绑定通行证', mask: true });

    const res = await UserService.createUserApp({
      username: studentid.value!,
      studentID: studentid.value!,
      password: password.value!,
      idCardNumber: idcard.value!,
      email: email.value!
    });

    if (res) {
      Taro.hideLoading();
      step.value++;
    }
    resetForm();
  }
  async function nav2bind() {
    Taro.showLoading({
      title: '加载中'
    });
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
  }
  function checkStudentId() {
    if (!studentid.value) return false;
    return /^\d{12}$/.test(studentid.value);
  }
  function checkPassword() {
    if (!password.value) return false;
    return password.value.length >= 6;
  }
  function checkIdCard() {
    if (!idcard.value) return false;
    return /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
      idcard.value
    );
  }

  function resetForm() {
    if (!studentid.value) studentid.value = '';
    else if (!checkStudentId()) invalidStudentId.value = true;
    else invalidStudentId.value = false;

    if (!password.value) password.value = '';
    else if (!checkPassword()) invalidPassword.value = true;
    else invalidPassword.value = false;

    if (!comfirmPassword.value) comfirmPassword.value = '';

    if (!idcard.value) idcard.value = '';
    else if (!checkIdCard()) invalidIdCard.value = true;
    else invalidIdCard.value = false;

    if (!email.value) email.value = '';
  }
  function checkForm() {
    if (
      studentid.value &&
      password.value &&
      comfirmPassword.value === password.value &&
      idcard.value &&
      email.value &&
      checkStudentId() &&
      checkPassword() &&
      checkIdCard()
    )
      return true;
    resetForm();
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
</script>

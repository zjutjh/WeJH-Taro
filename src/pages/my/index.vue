<template>
  <title-bar title="我的" :back-button="false"></title-bar>
  <view class="background"></view>
  <view>
    <card class="profile-card">
      <view class="avatar-wrapper">
        <image
          v-if="userWXProfile"
          class="avatar"
          :src="userWXProfile.avatarUrl"
        ></image>
      </view>
      <view class="profile-split"></view>
      <view class="info-wrapper">
        <view>
          <view v-if="userWXProfile" class="name">{{
            userWXProfile.nickName
          }}</view>
          <view v-else class="name" @tap="getUserWXInfo">点击获取头像昵称</view>
          <view class="sub-text">微精弘</view>
        </view>
        <view class="sub-text" style="bottom: 0" v-if="userInfo">{{
          userInfo.studentID
        }}</view>
      </view>
    </card>

    <card v-if="!isActive">
      <button class="active" v-if="!isActive" @tap="nav2activation">
        激活
      </button>
      <view v-else class="sub-text"> 微精弘 </view>
    </card>
    <view class="flex" v-if="isActive">
      <card
        class="item"
        v-for="item in options"
        :key="item.title"
        @tap="nav2url(item.url)"
      >
        <image v-if="item.icon" mode="heightFix" :src="item.icon"></image>
        <text>{{ item.title }}</text>
      </card>
    </view>
    <view v-else>
      <text class="sub-text centet">激活享受更多精彩</text>
    </view>
    <pop-view v-model:show="showPop">
      <app-list></app-list>
    </pop-view>
    <nav-bar
      :show-plus="false"
      page-name="my"
      @plusClick="plusClick"
      :showPop="showPop"
    ></nav-bar>
  </view>
</template>

<script lang="ts">
  import { serviceStore, systemStore } from '@/store';
  import AppList from '@/components/AppList/index.vue';
  import Card from '@/components/Card/index.vue';
  import NavBar from '@/components/NavBar/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import PopView from '@/components/PopView/index.vue';
  import Taro from '@tarojs/taro';
  import { UserService } from '@/services';
  import { defineComponent } from 'vue';
  import store from '@/store';

  import './index.scss';
  export default defineComponent({
    components: { NavBar, TitleBar, Card, PopView, AppList },
    data() {
      return {
        options: [
          {
            icon: require('@/assets/icons/bind.svg'),
            title: '绑定',
            url: '/pages/bind/index'
          },
          {
            icon: require('@/assets/icons/lab.svg'),
            title: '实验室',
            url: '/pages/lab/index'
          },
          {
            icon: require('@/assets/icons/feedback.svg'),
            title: '反馈',
            url: '/pages/connect/index'
          },
          {
            icon: require('@/assets/icons/setting.svg'),
            title: '设置',
            url: '/pages/setting/index'
          },
          {
            icon: require('@/assets/icons/about.svg'),
            title: '关于',
            url: '/pages/about/index'
          }
        ],
        showPop: false
      };
    },
    methods: {
      nav2activation() {
        Taro.navigateTo({
          url: '/pages/activation/index'
        });
      },
      nav2url(url: string | undefined) {
        if (url)
          Taro.navigateTo({
            url: url
          });
      },
      getUserWXInfo() {
        if (!serviceStore.user.wxProfile)
          Taro.getUserProfile({
            desc: '用于获取头像和昵称',
            success: (res: any) => {
              const { avatarUrl, nickName } = res.userInfo;
              store.commit('setUserWXProfile', { avatarUrl, nickName });
            },
            complete: (res) => {
              console.log(res);
            }
          });
      },
      plusClick() {
        console.log('123');
        this.showPop = !this.showPop;
      }
    },
    computed: {
      userInfo() {
        return serviceStore.user.info;
      },
      userWXProfile() {
        console.log(serviceStore.user.wxProfile);
        return serviceStore.user.wxProfile;
      },
      isActive() {
        return serviceStore.user.isActive;
      }
      /* 			buildTag() {
				return process.env.TAG;
			} */
    },
    mounted() {
      UserService.getUserInfo();
      console.log(systemStore);
    }
  });
</script>

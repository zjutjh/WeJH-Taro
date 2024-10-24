<template>
  <title-bar title="我的" :back-button="false" />
  <scroll-view :scroll-y="true">
    <view class="flex-column">
      <card v-if="userInfo?.isActive" class="profile-card">
        <view class="avatar-wrapper">
          <image
            v-if="userInfo?.wxProfile"
            class="avatar"
            :src="userInfo?.wxProfile.avatarUrl"
          />
        </view>
        <view v-if="userInfo?.wxProfile" class="profile-split" />
        <view class="info-wrapper">
          <view>
            <view v-if="userInfo?.wxProfile" class="name">
              {{ userInfo?.wxProfile.nickName }}
            </view>
            <view v-else class="name" @tap="getUserWXInfo">
              点击获取头像昵称
            </view>
            <view class="sub-text">
              微精弘
            </view>
          </view>
          <view v-if="userInfo" class="sub-text" style="bottom: 0">
            {{ userInfo.info?.studentID }}
          </view>
        </view>
      </card>

      <card v-else title="未激活，激活享受更多精彩">
        <w-button
          v-if="!userInfo?.isActive"
          block
          class="active"
          @tap="nav2activation"
        >
          激活
        </w-button>
      </card>

      <view v-if="userInfo?.isActive" class="operate">
        <w-list
          v-for="(column, index) in options"
          :key="index"
          class="operate-list"
        >
          <w-list-item
            v-for="item in column"
            :key="item.title"
            @tap="nav2url(item.url)"
          >
            <view class="wrapper">
              <text>{{ item.title }}</text>
              <w-badge v-if="item.badge" :content="item.badge!" />
            </view>
          </w-list-item>
        </w-list>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import store, { serviceStore } from "@/store";
import Card from "../Card/index.vue";
import TitleBar from "../TitleBar/index.vue";
import WList from "../List/List.vue";
import WListItem from "../List/ListItem.vue";
import WButton from "../Button/index.vue";
import WBadge from "../Badge/index.vue";
import Taro from "@tarojs/taro";
import { UserService } from "@/services";
import { computed, onMounted, ref } from "vue";
import "./index.scss";
import { UserType } from "src/store/service/user";

const options = computed(() => {
  const notificationState = serviceStore.notification.state;
  const data = [
    [
      { title: "绑定", url: "/pages/bind/index", badge: notificationState.my.bind },
      { title: "主题", url: "/pages/theme/index" }
    ],
    [
      { title: "反馈", url: "/pages/connect/index" },
      { title: "关于", url: "/pages/about/index" }
    ],
    [
      { title: "设置", url: "/pages/setting/index" }
    ]
  ];
  return data;
});

const userInfo = ref<UserType | null>(null);

function nav2activation() {
  Taro.navigateTo({
    url: "/pages/activation/index"
  });
}

function nav2url(url: string | undefined) {
  if (url)
    Taro.navigateTo({
      url: url
    });
}

function getUserWXInfo() {
  Taro.getUserProfile({
    desc: "用于获取头像和昵称",
    success: (res: any) => {
      const { avatarUrl, nickName } = res.userInfo;
      store.commit("setUserWXProfile", { avatarUrl, nickName });
    }
  });
}

function getUserInfo() {
  userInfo.value = serviceStore.user;
}

onMounted(() => {
  if (serviceStore.user.isActive && !serviceStore.user.info)
    UserService.getUserInfo();
});

getUserInfo();

</script>

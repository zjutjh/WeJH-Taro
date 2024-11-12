<template>
  <title-bar title="我的" :back-button="false" />
  <scroll-view :scroll-y="true">
    <view class="flex-column">
      <card v-if="isActive" class="profile-card">
        <view class="avatar-wrapper">
          <taro-image
            v-if="wxProfile"
            class="avatar"
            :src="wxProfile.avatarUrl"
          />
        </view>
        <view v-if="wxProfile" class="profile-split" />
        <view class="info-wrapper">
          <view>
            <view v-if="wxProfile" class="name">
              {{ wxProfile.nickName }}
            </view>
            <view v-else class="name" @tap="getWXProfile">
              点击获取头像昵称
            </view>
            <view class="sub-text">
              微精弘
            </view>
          </view>
          <view v-if="userInfo" class="sub-text" style="bottom: 0">
            {{ userInfo.studentID }}
          </view>
        </view>
      </card>

      <card v-else title="未激活，激活享受更多精彩">
        <w-button
          v-if="!isActive"
          block
          class="active"
          @tap="nav2activation"
        >
          激活
        </w-button>
      </card>

      <view v-if="isActive" class="operate">
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
              <w-badge v-if="item.badge">
                <text>{{ item.badge }}</text>
              </w-badge>
            </view>
          </w-list-item>
        </w-list>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import Card from "../Card/index.vue";
import TitleBar from "../TitleBar/index.vue";
import WList from "../List/List.vue";
import WListItem from "../List/ListItem.vue";
import WButton from "../Button/index.vue";
import WBadge from "../Badge/index.vue";
import Taro from "@tarojs/taro";
import { computed } from "vue";
import "./index.scss";
import { storeToRefs } from "pinia";
import useNewFeatureStore from "@/store/service/newFeature";
import useUserStore from "@/store/service/user";
import { Image as TaroImage } from "@tarojs/components";

const userStore = useUserStore();
const newFeatureStore = useNewFeatureStore();
const { getWXProfile } = userStore;
const { isActive, wxProfile, info: userInfo } = storeToRefs(userStore);

const options = computed(() => {
  const data = [
    [
      // TODO: 修复类型问题
      { title: "绑定", url: "/pages/bind/index", badge: newFeatureStore.tree?.my?.bind },
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

</script>

<template>
  <view class="background">
    <title-bar title="关于"></title-bar>
    <scroll-view :scrollY="true" style="flex: 1">
      <view class="flex-column">
        <card>
          <image
            mode="aspectFit"
            :src="require('@/assets/jh-logo.png')"
            style="height: 20vh; width: 70%; display: block; margin: auto"
          ></image>
        </card>
        <card title="微精弘2.0" class="description-card">
          <view class="description">
            <view
              v-for="item in description"
              :key="item"
              class="description-item"
            >
              <text>| </text>
              <text>{{ item }}</text>
            </view>
          </view>
        </card>
        <card title="测试信息" v-if="!isDevelopment">
          <view> Hash:{{ commitHash.slice(0, 6) }} </view>
          <view>
            版本：<nut-tag round type="primary">{{ commitTag }}</nut-tag>
          </view>
          <view> 编译时间：{{ buildTime }} </view>
          <view>精弘网络@{{ currentYear }}</view>
        </card>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
  import Card from '@/components/Card/index.vue';
  import { Tag as NutTag } from '@nutui/nutui-taro';
  import TitleBar from '@/components/TitleBar/index.vue';
  import { about } from '@/utils/copywriting';
  import { scrollViewHeight } from '@/utils/effects';
  import './index.scss';

  export default {
    components: {
      TitleBar,
      Card,
      NutTag
    },
    computed: {
      isDevelopment() {
        if (process.env.NODE_ENV === 'development') return true;
        return false;
      },
      commitHash() {
        return process.env.COMMIT_HASH;
      },
      commitTag() {
        return process.env.TAG;
      },
      buildTime() {
        return process.env.BUILD_TIME;
      },
      currentYear() {
        return new Date().getFullYear();
      },
      description() {
        return about.description;
      }
    },
    methods: {
      scrollViewHeight
    }
  };
</script>

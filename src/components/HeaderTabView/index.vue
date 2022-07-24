<template>
  <scroll-view
    class="page"
    @scroll="scrollPage"
    :scrollY="true"
    @scrolltoupper="upper"
  >
    <view>
      <view class="header">
        <title-bar :title="title"></title-bar>
        <view class="image" :style="imageStyle">
          <slot name="image">
            <image :src="imageUrl" style="height: 100%"></image>
          </slot>
        </view>
        <view class="keep-header" v-if="showTab">
          <slot name="tab"></slot>
        </view>
      </view>
      <view class="content">
        <view>
          <slot name="content"></slot>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script lang="ts">
  import Taro from '@tarojs/taro';
  import TitleBar from '@/components/TitleBar/index.vue';
  import { defineComponent } from 'vue';

  import './index.scss';
  export default defineComponent({
    components: { TitleBar },
    props: {
      imgName: {
        default: 'library.svg',
        type: String
      },
      showTab: {
        type: Boolean,
        defture: true
      },
      title: String
    },
    data() {
      return {
        imageStyle: {
          transform: 'scale(1)',
          opacity: '1',
          height: '300rpx',
          margin: '1rem'
        },
        topStyle: {
          marginTop: '0'
        },
        imageUrl: require('@/assets/photos/' + this.imgName)
      };
    },
    methods: {
      goBack() {
        Taro.navigateBack();
      },
      upper() {
        this.imageStyle.height = '300rpx';
        this.imageStyle.transform = 'scale(1)';
        this.imageStyle.opacity = '1';
        this.imageStyle.margin = '1rem';
      },
      scrollPage(e) {
        if (e.detail.scrollTop > 300) {
          this.imageStyle.height = '0rpx';
          this.imageStyle.transform = 'scale(0)';
          this.imageStyle.opacity = '0';
          this.imageStyle.margin = '0rem';
          return;
        }
      }
    }
  });
</script>

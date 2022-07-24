<template>
  <view class="applist-item" @tap="appTaped">
    <view
      class="applist-bg"
      data-test="bg"
      :style="`background: var(--wjh-color-${bg})`"
    >
      <image
        class="applist-item-icon"
        :src="require('@/assets/icons/applist/' + iconUrl)"
      ></image>
    </view>
    <text class="label" data-test="label">{{ label }}</text>
  </view>
</template>
<script lang="ts">
  import Taro from '@tarojs/taro';
  import { defineComponent } from 'vue';
  import './index.scss';

  const colorSetMap = { green: 0, blue: 1, cyan: 2, orange: 3, yellow: 4 };
  export default defineComponent({
    name: 'AppListItem',
    props: {
      label: String,
      iconUrl: String,
      url: String,
      appId: { type: String },
      bg: {
        default: 'green',
        type: String
      }
    },
    methods: {
      async appTaped() {
        if (this.appId)
          await Taro.navigateToMiniProgram({
            appId: this.appId,
            path: this.url
          });
        else if (this.url) await Taro.navigateTo({ url: this.url });
      },
      getRequireWrapper() {
        let tmp = require('@/assets/icons/bind.svg');
        console.log(tmp);
        tmp = '/assets/icons/bind.svg';
        return tmp;
      }
    }
  });
</script>

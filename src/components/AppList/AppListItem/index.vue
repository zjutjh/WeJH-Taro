<template>
  <view class="applist-item" @tap="appTaped">
    <view class="applist-bg" data-test="bg" :style="backgroundColor">
      <image
        class="applist-item-icon"
        :src="require('@/assets/icons/applist/' + iconUrl)"
      ></image>
    </view>
    <text class="label" data-test="label">{{ label }}</text>
  </view>
</template>
<script lang="ts">
  import { serviceStore } from '@/store';
  import Taro from '@tarojs/taro';
  import { computed, defineComponent, ref } from 'vue';
  import './index.scss';

  export default defineComponent({
    name: 'AppListItem',
    props: {
      label: String,
      iconUrl: String,
      url: String,
      bg: {
        default: 'green',
        type: String
      },
      require: String
    },
    setup(props) {
      let isDisabled = ref(false);
      if (props.require === 'zf' && !serviceStore.user.isBindZF)
        isDisabled.value = true;
      if (props.require === 'card' && !serviceStore.user.isBindCard)
        isDisabled.value = true;
      if (props.require === 'library' && !serviceStore.user.isBindLibrary)
        isDisabled.value = true;

      async function appTaped() {
        if (isDisabled.value) {
          await Taro.navigateTo({ url: '/pages/bind/index' });
          Taro.showToast({
            icon: 'none',
            title: '请绑定相关账号'
          });
        } else if (this.url) await Taro.navigateTo({ url: this.url });
      }
      const backgroundColor = computed(() => {
        if (isDisabled.value)
          return { backgroundColor: 'var(--wjh-color-light)' };
        else return { backgroundColor: `var(--wjh-color-${props.bg})` };
      });
      return {
        isDisabled,
        appTaped,
        backgroundColor
      };
    }
  });
</script>

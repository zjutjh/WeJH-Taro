<template>
  <view
    class="pop-view"
    :class="{
      hidden: !show
    }"
  >
    <view v-if="showMask" class="mask" @tap="close"></view>
    <view
      class="pop-view-body"
      :class="positionClass"
      :style="
        isNewIPhone && positionClass === 'bottom' ? 'margin-bottom: 2rem' : ''
      "
    >
      <slot></slot>
    </view>
  </view>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Taro from '@tarojs/taro';
  import './index.scss';

  export default defineComponent({
    props: {
      show: {
        default: false,
        type: Boolean
      },
      position: {
        default: 'bottom'
      },
      mask: {
        default: true,
        type: Boolean
      }
    },
    computed: {
      isNewIPhone(): boolean {
        let info = Taro.getSystemInfoSync();
        if (!info.model) return false;
        console.log(info.model.toString());
        let isNewIphone = info.model.match(
          '(iPhone X|iPhone XS|iPhone 11|iPhone 12|iPhone 13|iPhone14)'
        )?.length;
        return isNewIphone !== undefined && isNewIphone > 0;
      },
      positionClass(): 'bottom' | 'top' | 'left' | 'right' {
        return this.position;
      },
      showMask(): boolean {
        return this.mask;
      }
    },
    methods: {
      close() {
        this.$emit('update:show', false);
      }
    }
  });
</script>

<template>
  <view class="pop-view" :class="{ hidden: !show }">
    <view v-if="showMask" class="mask" @tap="close"></view>
    <view class="pop-view-body" :class="positionClass">
      <slot></slot>
    </view>
  </view>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
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

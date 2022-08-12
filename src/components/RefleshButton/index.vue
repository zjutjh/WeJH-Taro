<template>
  <w-button shape="circle" @tap="reflesh" size="large" class="reflesh-button">
    <view
      class="iconfont icon-refresh"
      :class="{ 'reflesh-running': isRefleshing }"
    />
  </w-button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { WButton } from '../button';
  import './index.scss';

  export default defineComponent({
    components: {
      WButton
    },
    props: {
      isRefleshing: Boolean
    },
    methods: {
      reflesh() {
        this.$emit('reflesh');
      }
    }
  });
</script>

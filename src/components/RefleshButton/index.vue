<template>
  <w-button shape="circle" @tap="reflesh">
    <view
      class="iconfont icon-refresh"
      :class="{ 'reflesh-running': isRefleshing }"
    />
  </w-button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { WButton } from '../button';
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
<style>
  @keyframes rote {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .reflesh-running {
    animation: rote 1s alternate infinite;
  }
</style>

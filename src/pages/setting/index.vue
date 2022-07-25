<template>
  <view class="background">
    <title-bar title="设置"></title-bar>
    <scroll-view :scrollY="true" style="flex: 1">
      <view class="flex-column">
        <card class="setting-card">
          <text>当前没有可设置功能，尽情期待！😚</text>
          <template v-slot:footer> 精弘网络@2022 </template>
        </card>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
  import Card from '@/components/Card/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import './index.scss';
  export default {
    components: {
      TitleBar,
      Card
    }
  };
</script>

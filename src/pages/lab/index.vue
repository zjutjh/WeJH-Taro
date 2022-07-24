<template>
  <title-bar title="实验室"></title-bar>
  <view class="background"></view>
  <view class="main">
    <card>
      <view>
        <text>当前没有实验功能，尽情期待！😚</text>
      </view>
    </card>
    <card>
      <view class="info-p"> 精弘网络@2021 </view>
    </card>
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

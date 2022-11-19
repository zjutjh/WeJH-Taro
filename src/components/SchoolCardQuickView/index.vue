<template>
  <quick-view
    @tap="nav2Card"
    title="校园卡"
    icon-name="schoolcard"
    help
    @handle-tap-help="handleTapHelp"
  >
    <text class="sub-text"> 当前余额 ({{ balanceUpdateTimeString }}) </text>
    <view class="quickcard-balance">
      <text> ¥ {{ balance || 0 }} </text>
    </view>
  </quick-view>
</template>
<script lang="ts">
  import QuickView from '../QuickView/index.vue';
  import { CardService } from '@/services';
  import Taro from '@tarojs/taro';
  import dayjs from 'dayjs';
  import { defineComponent } from 'vue';
  import { serviceStore } from '@/store';
  import './index.scss';

  export default defineComponent({
    components: { 'quick-view': QuickView },

    computed: {
      balanceUpdateTimeString() {
        const updateTime = serviceStore.card.updateTime;
        if (updateTime?.balance) return dayjs(updateTime.balance).fromNow();
        else return '更新失败';
      },
      balance() {
        return serviceStore.card.balance;
      }
    },

    methods: {
      nav2Card() {
        Taro.navigateTo({ url: '/pages/schoolcard/index' });
      },
      handleTapHelp() {
        this.$emit('showHelp', 'school-card');
      }
    }
  });
</script>

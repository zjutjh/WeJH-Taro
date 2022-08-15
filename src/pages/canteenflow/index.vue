<template>
  <view class="background">
    <title-bar title="食堂流量"></title-bar>
    <scroll-view :scrollY="true">
      <view class="header-view">
        <image src="@/assets/photos/canteenflow.svg"> </image>
        <view class="extra" @tap="showHelp">
          <view class="icon-wrapper">
            <view class="extra-icon iconfont icon-announcement"></view>
          </view>
          <view class="label">公告</view>
        </view>
      </view>
      <view class="flex-column">
        <card v-if="!flow"> 无食堂流量信息 </card>
        <card
          class="canteen-flow-item-card"
          v-for="item in flow"
          :key="item.restaurantName"
        >
          <view class="canteen-flow-list">
            <view class="col">
              <view
                class="name-wrapper"
                v-if="item.restaurantName"
                :style="nameMapColor(item.restaurantName[0])"
              >
                {{ item.restaurantName[0] }}
              </view>
            </view>
            <view class="col">
              <view> {{ item.restaurantName }}</view>
              <view>流量指数： {{ item.dealCount }}</view>
            </view>
            <view class="col">
              <view
                style="color: var(--wjh-color-green)"
                v-if="item.dealCount < 50"
              >
                空闲
              </view>
              <view
                style="color: var(--wjh-color-yellow)"
                v-else-if="item.dealCount < 100"
              >
                适中
              </view>
              <view style="color: var(--wjh-color-orange)" v-else>忙碌</view>
            </view>
          </view>
        </card>
      </view>
    </scroll-view>
  </view>
  <w-modal
    title="公告"
    v-model:show="showModal"
    :content="helpContent"
  ></w-modal>
</template>

<script lang="ts">
  import { CanteenService } from '@/services';
  import Card from '@/components/Card/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import { defineComponent } from 'vue';
  import { serviceStore } from '@/store';
  import { helpText } from '@/constants/copywriting';
  import { WModal } from '@/components/modal';
  import './index.scss';

  export default defineComponent({
    components: { Card, TitleBar, WModal },
    computed: {
      updateTime(): string {
        return serviceStore.canteen.updateTime.flow;
      },
      flow() {
        if (serviceStore.canteen.flow?.data)
          return [...serviceStore.canteen.flow.data].reverse();
        else return [];
      }
    },
    data() {
      return {
        showModal: false,
        helpContent: helpText.canteenflow
      };
    },
    methods: {
      getCanteenFlow: CanteenService.getCanteenFlow,
      nameMapColor(char: string) {
        const colorMap = {
          家: 'blue',
          养: 'blue',
          精: 'green',
          毓: 'green',
          博: 'green'
        };
        return { backgroundColor: `var(--wjh-color-${colorMap[char]})` };
      },
      showHelp() {
        this.showModal = true;
      }
    },
    mounted() {
      this.getCanteenFlow();
    }
  });
</script>

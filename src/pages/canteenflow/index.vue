<template>
  <view class="background">
    <title-bar title="食堂流量"></title-bar>
    <scroll-view :scrollY="true">
      <view class="header-view">
        <image src="@/assets/photos/canteenflow.svg"> </image>
        <view class="extra">
          <w-button shape="circle" class="extra-button">
            <view class="extra-icon iconfont icon-announce"> </view>
          </w-button>
          <view class="extra-text">排序</view>
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
              <view class="name-wrapper" v-if="item.restaurantName">
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
</template>

<script lang="ts">
  import { CanteenService } from '@/services';
  import Card from '@/components/Card/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import { WButton } from '@/components/button';
  import { defineComponent } from 'vue';
  import { serviceStore } from '@/store';
  import './index.scss';

  export default defineComponent({
    components: { Card, TitleBar, WButton },
    computed: {
      updateTime(): string {
        return serviceStore.canteen.updateTime.flow;
      },
      flow() {
        if (!serviceStore.canteen.flow) return [];
        return serviceStore.canteen.flow.data;
      }
    },
    data() {
      return {
        selectedItem: null,
        showPop: false
      };
    },
    methods: {
      getCanteenFlow: CanteenService.getCanteenFlow,
      reflesh() {
        this.getCanteenFlow();
      }
    },
    mounted() {
      this.getCanteenFlow();
    }
  });
</script>

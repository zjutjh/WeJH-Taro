<template>
  <view class="connect-view background">
    <title-bar title="反馈"></title-bar>
    <scroll-view :scrollY="true">
      <view class="flex-column">
        <card>
          <template #header>
            <view class="header-text">反馈和帮助</view>
          </template>
          <w-list>
            <w-list-item>
              <image
                :src="require('@/assets/photos/feedback.svg')"
                style="margin: 8px 0"
              ></image>
            </w-list-item>
            <w-list-item @tap="nav2FAQ">常见问题</w-list-item>
            <w-list-item @tap="showGroups">加入交流群</w-list-item>
          </w-list>
        </card>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
  import Taro from '@tarojs/taro';
  import { WList, WListItem } from '@/components/list';
  import TitleBar from '@/components/TitleBar/index.vue';
  import Card from '@/components/Card/index.vue';
  import './index.scss';
  import { defineComponent } from 'vue';

  const groupInfo = [
    {
      name: '一群',
      id: '462530805'
    },
    {
      name: '二群',
      id: '282402782'
    }
  ];
  export default defineComponent({
    components: {
      TitleBar,
      WList,
      WListItem,
      Card
    },
    methods: {
      nav2FAQ(e) {
        Taro.navigateTo({
          url: '/pages/connect/faq/index'
        });
      },
      showGroups() {
        Taro.showActionSheet({
          itemList: groupInfo.map((item) => `${item.name}(${item.id})`),
          success({ tapIndex }) {
            Taro.setClipboardData({
              data: groupInfo[tapIndex].id
            });
          }
        });
      }
    }
  });
</script>

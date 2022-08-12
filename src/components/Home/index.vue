<template>
  <title-bar title="微精弘" :back-button="false">
    <alarm
      v-if="isActive"
      @tap="nav2announcement"
      :counter="announcementsCounter"
    ></alarm>
  </title-bar>
  <scroll-view :scrollY="true">
    <view class="flex-column" v-if="isActive">
      <lesson-table-quick-view
        v-if="isBindZf"
        :hide="pageHide"
        @show-help="showHelp"
      ></lesson-table-quick-view>
      <school-card-quick-view
        v-if="isBindCard"
        @show-help="showHelp"
      ></school-card-quick-view>
      <library-quick-view v-if="isBindLibrary"></library-quick-view>
      <card v-if="!(isBindZf || isBindCard || isBindLibrary)" title="提示">
        还没有绑定任何服务，请到我的页面绑定
      </card>
    </view>
    <view v-else class="flex-column">
      <card title="未激活">
        <w-button block class="active" @tap="nav2activation"> 激活 </w-button>
      </card>
    </view>
  </scroll-view>
  <w-modal
    v-model:show="isShowHelp"
    :content="`&emsp;&emsp;${helpContent}`"
  ></w-modal>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { serviceStore } from '@/store';
  import LessonTableQuickView from '@/components/LessonsTableQuickView/index.vue';
  import SchoolCardQuickView from '@/components/SchoolCardQuickView/index.vue';
  import LibraryQuickView from '@/components/LibraryQuickView/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import { WButton } from '@/components/button';
  import Card from '@/components/Card/index.vue';
  import Alarm from '@/components/Alarm/index.vue';
  import { WModal } from '../modal';
  import { helpText } from '@/constants/copywriting';
  import Taro from '@tarojs/taro';
  import { SystemService } from '@/services';

  export default defineComponent({
    components: {
      LessonTableQuickView,
      SchoolCardQuickView,
      LibraryQuickView,
      TitleBar,
      Card,
      WButton,
      WModal,
      Alarm
    },
    data() {
      return {
        pageHide: false,
        isShowHelp: false,
        helpContent: undefined,
        announcementsCounter: 0
      };
    },
    computed: {
      isActive() {
        return serviceStore.user.isActive;
      },
      isBindZf() {
        return serviceStore.user.isBindZF;
      },
      isBindCard() {
        return serviceStore.user.isBindCard;
      },
      isBindLibrary() {
        return serviceStore.user.isBindLibrary;
      }
    },
    methods: {
      nav2activation() {
        Taro.navigateTo({
          url: '/pages/activation/index'
        });
      },
      nav2announcement() {
        this.announcementsCounter = 0;
        Taro.navigateTo({
          url: '/pages/announcement/index'
        });
      },
      showHelp(prop: 'lessons-table' | 'school-card') {
        this.isShowHelp = true;
        if (prop === 'lessons-table') this.helpContent = helpText.lessonsTable;
        else if (prop === 'school-card') this.helpContent = helpText.schoolCard;
      },

      // 计算更新条数
      // FIXME: 只对比了请求前后的公告数量
      async diffAnnouncement() {
        const oldListLength = serviceStore.announcement.announcements.length;
        await SystemService.getAnnouncement();
        const newListLength: any =
          serviceStore.announcement.announcements.length;
        return newListLength - oldListLength;
      }
    },
    async mounted() {
      this.announcementsCounter = await this.diffAnnouncement();
    }
  });
</script>

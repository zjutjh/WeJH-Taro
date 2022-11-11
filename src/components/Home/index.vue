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
      <questionnaire v-if="isNeverShowQuestionnaire" />
      <lesson-table-quick-view
        v-if="isBindZf"
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
  import { computed, defineComponent, ref } from 'vue';
  import store, { serviceStore, systemStore } from '@/store';
  import LessonTableQuickView from '@/components/LessonsTableQuickView/index.vue';
  import SchoolCardQuickView from '@/components/SchoolCardQuickView/index.vue';
  import LibraryQuickView from '@/components/LibraryQuickView/index.vue';
  import Questionnaire from '@/components/Questionnaire/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import { WButton } from '@/components/button';
  import Card from '@/components/Card/index.vue';
  import Alarm from '@/components/Alarm/index.vue';
  import { WModal } from '../modal';
  import { helpText } from '@/constants/copywriting';
  import Taro from '@tarojs/taro';
  import { SystemService } from '@/services';
  import { questionnaireInfo } from '@/constants/updateInfo';

  export default defineComponent({
    components: {
      Questionnaire,
      LessonTableQuickView,
      SchoolCardQuickView,
      LibraryQuickView,
      TitleBar,
      Card,
      WButton,
      WModal,
      Alarm
    },
    setup() {
      const isShowHelp = ref(false);
      const helpContent = ref<string | undefined>(undefined);
      const questionnairePath = questionnaireInfo.path;

      if (questionnairePath != systemStore.questionnaire.path) {
        store.commit('setQuestionnaire', {
          path: questionnairePath,
          state: 'open'
        });
      }

      SystemService.getAnnouncement();
      const isActive = computed(() => {
        return serviceStore.user.isActive;
      });
      const isNeverShowQuestionnaire = computed(() => {
        if (systemStore.questionnaire.state === 'close') {
          return false;
        } else return true;
      });
      const isBindZf = computed(() => {
        return serviceStore.user.isBindZF;
      });
      const isBindCard = computed(() => {
        return serviceStore.user.isBindCard;
      });
      const isBindLibrary = computed(() => {
        return serviceStore.user.isBindLibrary;
      });
      const announcementsCounter = computed(() => {
        return serviceStore.announcement.updateCounter;
      });

      function nav2activation() {
        Taro.navigateTo({
          url: '/pages/activation/index'
        });
      }
      function nav2announcement() {
        store.commit('clearAnnouncementsUpdateCounter');
        Taro.navigateTo({
          url: '/pages/announcement/index'
        });
      }
      function showHelp(prop: 'lessons-table' | 'school-card') {
        isShowHelp.value = true;
        if (prop === 'lessons-table') helpContent.value = helpText.lessonsTable;
        else if (prop === 'school-card')
          helpContent.value = helpText.schoolCard;
      }

      return {
        isShowHelp,
        helpContent,
        isActive,
        isBindZf,
        isBindCard,
        isBindLibrary,
        isNeverShowQuestionnaire,
        announcementsCounter,
        nav2activation,
        nav2announcement,
        showHelp
      };
    }
  });
</script>

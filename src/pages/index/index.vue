<template>
  <view class="background">
    <home v-if="pageName === 'home'"></home>
    <my v-if="pageName === 'my'"></my>
    <pop-view v-model:show="showPop">
      <app-list v-if="showPop"></app-list>
    </pop-view>
    <nav-bar
      @plusClick="plusClick"
      :show-plus="isActive"
      v-model:page-name="pageName"
      v-model:showPop="showPop"
    ></nav-bar>
  </view>
  <w-modal
    :title="updateInfo.title"
    :content="updateInfo.content"
    v-model:show="showUpdateInfo"
  ></w-modal>
</template>

<script setup lang="ts">
  import AppList from '@/components/AppList/index.vue';
  import NavBar from '@/components/NavBar/index.vue';
  import PopView from '@/components/PopView/index.vue';
  import Home from '@/components/Home/index.vue';
  import My from '@/components/My/index.vue';
  import Taro from '@tarojs/taro';
  import { WModal } from '@/components/modal';
  import { ZFService } from '@/services';
  import { computed, ref } from 'vue';
  import store, { serviceStore, systemStore } from '@/store';
  import { updateInfo } from '@/constants/index';
  import './index.scss';

  const showPop = ref(false);
  const pageName = ref('home');
  const showUpdateInfo = ref(false);

  ZFService.getTodayLessonTable();

  const updateManager = Taro.getUpdateManager();

  updateManager.onUpdateReady(function () {
    Taro.showModal({
      title: '微精弘更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success: function (res) {
        if (res.confirm) {
          updateManager.applyUpdate();
        }
      }
    });
  });

  const newVersion = updateInfo.version;
  if (newVersion && systemStore.version !== newVersion) {
    store.commit('setVersion', newVersion);
    showUpdateInfo.value = true;
  }

  function plusClick() {
    showPop.value = !showPop.value;
  }

  const isActive = computed(() => {
    return serviceStore.user.isActive;
  });
</script>

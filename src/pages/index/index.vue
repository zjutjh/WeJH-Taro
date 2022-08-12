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
</template>
<script lang="ts">
  import AppList from '@/components/AppList/index.vue';
  import NavBar from '@/components/NavBar/index.vue';
  import PopView from '@/components/PopView/index.vue';
  import Home from '@/components/Home/index.vue';
  import My from '@/components/My/index.vue';
  import Taro from '@tarojs/taro';
  import { ZFService } from '@/services';
  import { computed, defineComponent, ref } from 'vue';
  import { serviceStore } from '@/store';
  import './index.scss';
  export default defineComponent({
    components: {
      AppList,
      NavBar,
      PopView,
      Home,
      My
    },
    setup() {
      const showPop = ref(false);
      const pageHide = ref(false);
      const pageName = ref('home');
      ZFService.getTodayLessonTable();

      function plusClick() {
        showPop.value = !showPop.value;
      }
      function nav2activation() {
        Taro.navigateTo({
          url: '/pages/activation/index'
        });
      }
      const isActive = computed(() => {
        return serviceStore.user.isActive;
      });
      return {
        showPop,
        pageHide,
        pageName,
        isActive,
        plusClick,
        nav2activation
      };
    }
  });
</script>

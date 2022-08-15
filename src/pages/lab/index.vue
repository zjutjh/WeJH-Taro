<template>
  <view class="lab-view background">
    <title-bar title="实验室"></title-bar>
    <scroll-view :scrollY="true">
      <view class="flex-column">
        <card class="lab-card">
          <view v-if="isEmpty" class="empty">{{ emptyText }}</view>
          <template #footer>
            <view class="footer-text">{{ getCopyRight() }}</view>
          </template>
        </card>
      </view>
    </scroll-view>
    <image
      v-if="isEmpty"
      src="@/assets/photos/lab.svg"
      style="margin: 0 auto"
    ></image>
  </view>
</template>

<script lang="ts">
  import Card from '@/components/Card/index.vue';
  import TitleBar from '@/components/TitleBar/index.vue';
  import { labText } from '@/constants/copywriting';
  import { getCopyRight } from '@/utils/effects';
  import { defineComponent } from 'vue';
  import './index.scss';
  export default defineComponent({
    data() {
      return {
        isEmpty: true
      };
    },
    components: {
      TitleBar,
      Card
    },
    computed: {
      emptyText() {
        return labText.empty;
      }
    },
    methods: {
      getCopyRight
    }
  });
</script>

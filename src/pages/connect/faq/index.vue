<template>
  <view class="connect-view background">
    <title-bar title="常见问题"></title-bar>
    <scroll-view :scrollY="true">
      <view class="flex-column">
        <card
          v-for="(item, index) in data"
          :key="index"
          :title="item.title"
          class="qa-card"
        >
          <image
            v-if="item.img"
            :style="{ height: item.img?.height, width: '100%' }"
            :src="item.img.url"
          />
          <view
            v-for="str in item.content?.split('\n')"
            class="answer-text"
            :key="str"
            >{{ str }}</view
          >
        </card>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
  import TitleBar from '@/components/TitleBar/index.vue';
  import Card from '@/components/Card/index.vue';
  import { faqText } from '@/constants/copywriting';
  import { defineComponent, ref } from 'vue';
  import './index.scss';
  export default defineComponent({
    components: {
      TitleBar,
      Card
    },
    setup() {
      const activeName = ref(1);
      return {
        data: faqText.qa,
        activeName
      };
    }
  });
</script>

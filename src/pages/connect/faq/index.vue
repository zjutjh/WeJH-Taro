<template>
  <view class="faq-view background">
    <title-bar title="常见问题"></title-bar>
    <scroll-view :scrollY="true">
      <view class="flex-column">
        <card v-for="(item, index) in data" :key="index" size="small">
          <w-collapse>
            <w-collapse-panel :title="item.title" arrow>
              <view class="answer-wrapper">
                <text
                  v-for="str in item.content.split('\n')"
                  class="answer-text"
                  :key="str"
                >
                  {{ str }}
                </text>
              </view>
            </w-collapse-panel>
          </w-collapse>
        </card>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
  import TitleBar from '@/components/TitleBar/index.vue';
  import Card from '@/components/Card/index.vue';
  import { WCollapse, WCollapsePanel } from '@/components/collapse';
  import { faqText } from '@/constants/copywriting';
  import { defineComponent, ref } from 'vue';
  import './index.scss';

  export default defineComponent({
    components: {
      TitleBar,
      Card,
      WCollapse,
      WCollapsePanel
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

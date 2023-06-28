<template>
  <view class="faq-view background">
    <title-bar title="常见问题" back-button/>
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card
          v-for="(item, index) in data"
          :key="index"
          size="small"
        >
          <w-collapse>
            <w-collapse-panel
              :title="item.title"
              arrow
            >
              <view class="answer-wrapper">
                <text
                  v-for="str in item.content.split('\n')"
                  :key="str"
                  class="answer-text"
                  :userSelect="true"
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

<script setup lang="ts">
import { TitleBar, Card, WCollapsePanel, WCollapse } from "@/components";
import { faqText } from "@/constants/copywriting";
import "./index.scss";

const data = faqText.qa;

</script>

<template>
  <theme-config>
    <title-bar title="借用须知" back-button />
    <scroll-view :scrollY="true">
      <view :class="style.header">
        <image src="@/assets/photos/faq.svg"></image>
      </view>

      <view :class="style.flexColumn">
        <Card title="如何借用正装物资?" style="font-weight: bold; font-size: 22px">
          <view :class="style.text">
            <text >{{faqText[0]}}</text>
            <text >{{faqText[1]}}</text>
            <text >{{faqText[2]}}</text>
            <text>{{faqText[3]}}</text>
          </view>
        </Card>
      </view>
    </scroll-view>

    <contact-me @show-help="setHelp"/>
    <w-modal
      v-model:show="isShowHelp"
      :content="`&emsp;&emsp;${helpContent}`"
    ></w-modal>
  </theme-config>
</template>

<script setup lang="ts">
import style from "./index.module.scss";
import {
  Card,
  TitleBar,
  ThemeConfig
} from "@/components";
import {faqText} from "@/constants/suitFaq";
import ContactMe from "../ContactMe/index.vue";
import WModal from "../../../components/Modal/index.vue";

import {ref} from "vue";
import {helpText} from "@/constants/copywriting";
const helpContent = ref(helpText.suit);
const isShowHelp = ref(false);

const setHelp = () => {
  isShowHelp.value = true;
};
</script>

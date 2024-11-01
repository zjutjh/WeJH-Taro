<template>
  <theme-config>
    <title-bar title="关于" back-button />
    <scroll-view :scroll-y="true" style="flex: 1">
      <view class="flex-column">
        <card>
          <image
            mode="aspectFit"
            src="@/assets/jh-logo.png"
            style="height: 20vh; width: 70%; display: block; margin: auto"
          />
        </card>
        <card
          title="微精弘2.0"
          class="description-card"
        >
          <view class="description">
            <view
              v-for="item in description"
              :key="item"
              class="description-item"
            >
              <text>| </text>
              <text>{{ item }}</text>
            </view>
          </view>
        </card>
        <card v-if="isDevelopment">
          <view>{{ copyright }}</view>
        </card>
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import { Card, ThemeConfig, TitleBar } from "@/components";
import { aboutText } from "@/constants/copywriting";
import { getCopyRight } from "@/utils";
import "./index.scss";

const isDevelopment = Boolean(import.meta.env.DEV);

const description = aboutText.description;

const copyright = getCopyRight();

</script>

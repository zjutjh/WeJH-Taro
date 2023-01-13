<template>
  <view class="background">
    <title-bar title="设置" back-button />
    <scroll-view
      :scroll-y="true"
      style="flex: 1"
    >
      <view
        class="flex-column"
        :style="isEmpty ? 'justify-content: space-between' : undefined"
      >
        <!--卡片主体-->
        <card class="setting-card">
          <view
            v-if="isEmpty"
            class="empty"
          >
            {{ emptyText }}
          </view>
          <template #footer>
            <view class="footer-text">
              {{ copyright }}
            </view>
          </template>
        </card>
      </view>
    </scroll-view>
    <image
      v-if="isEmpty"
      src="@/assets/photos/setting.svg"
      style="margin: 0 auto"
    />
  </view>
</template>

<script setup lang="ts">
import { Card, TitleBar } from "@/components";
import { settingText } from "@/constants/copywriting";
import { getCopyRight } from "@/utils";
import { ref } from "vue";
import "./index.scss";

const isEmpty = ref(true);
const emptyText = settingText.empty;
const copyright = getCopyRight();

</script>

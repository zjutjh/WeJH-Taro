<template>
  <theme-config class="lab-view background">
    <title-bar title="实验室" back-button />
    <scroll-view :scroll-y="true">
      <view class="flex-column">
        <card class="lab-card">
          <view
            v-if="isEmpty"
            class="empty"
          >
            {{ emptyText }}
          </view>
          <template #footer>
            <view class="footer-text">
              {{ getCopyRight() }}
            </view>
          </template>
        </card>
      </view>
    </scroll-view>
    <image
      v-if="isEmpty"
      src="@/assets/photos/lab.svg"
      style="margin: 0 auto"
    />
  </theme-config>
</template>

<script setup lang="ts">
import { Card, TitleBar, ThemeConfig } from "@/components";
import { labText } from "@/constants/copywriting";
import { getCopyRight } from "@/utils";
import { ref, computed } from "vue";
import "./index.scss";

const isEmpty = ref(true);

const emptyText = computed(() => {
  return labText.empty;
});

</script>

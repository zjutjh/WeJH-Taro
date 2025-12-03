<template>
  <theme-config>
    <title-bar title="班车详情" :back-button="true" />
    <scroll-view :scroll-y="true" :class="styles['bus-detail-container']">
      <bus-detail-card :class="styles['bus-detail-card']" />
    </scroll-view>

    <bus-detail-bottom-panel />
  </theme-config>
</template>

<script setup lang="ts">
import { ScrollView } from "@tarojs/components";

import { BusDetailCard, ThemeConfig, TitleBar } from "@/components";
import BusDetailBottomPanel from "@/components/schoolbus/bus-detail-card/bus-detail-bottom-panel/index.vue";

import styles from "./index.module.scss";
</script>

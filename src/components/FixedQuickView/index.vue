<script setup lang="ts">
import "./index.scss";

import InformationQuickView from "./InformationQuickView/index.vue";
import LostfoundQuickView from "./LostfoundQuickView/index.vue";
</script>

<template>
  <view class="fixed-quick-view-container">
    <information-quick-view />
    <lostfound-quick-view />
  </view>
</template>

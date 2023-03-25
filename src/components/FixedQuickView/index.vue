<script setup lang="ts">
import LostfoundQuickView from "./LostfoundQuickView/index.vue";
import InformationQuickView from "./InformationQuickView/index.vue";
import "./index.scss";
</script>

<template>
  <view class="fixed-quick-view-container">
    <information-quick-view />
    <lostfound-quick-view />
  </view>
</template>

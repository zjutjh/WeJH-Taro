<template>
  <view class="wjh-collapse">
    <w-list size="small" inner>
      <slot></slot>
    </w-list>
  </view>
</template>

<script setup lang="ts">
import WList from "../List/List.vue";
import "./index.scss";
</script>

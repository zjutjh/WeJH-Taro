<template>
  <web-view :src="schoolBusUrl" />
</template>
<script setup lang="ts">
  import { systemStore } from '@/store';
  import './index.scss';
  const schoolBusUrl = systemStore.generalInfo.schoolBusUrl;
</script>

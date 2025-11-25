<template>
  <theme-config>
    <title-bar title="校车详情" :back-button="true" />
    {{ route.params.id }}
  </theme-config>
</template>

<script setup lang="ts">
import { useRouter } from "@tarojs/taro";

import { ThemeConfig, TitleBar } from "@/components";

const route = useRouter();
</script>

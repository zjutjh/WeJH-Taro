<template>
  <view
    :class="{
      'wjh-pop-view__hidden': !show,
      'wjh-pop-view': true
    }"
  >
    <view v-if="showMask" class="wjh-pop-view-mask" @tap="handleClose" />
    <view class="wjh-pop-view-body" :class="positionClass">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import "./index.scss";

import { computed, toRefs } from "vue";

interface PopViewProps {
  position?: "bottom" | "top";
  mask?: boolean;
}

const show = defineModel<boolean>("show", {
  default: false
});

const props = defineProps<PopViewProps>();
const { position, mask } = toRefs(props);

const positionClass = computed(() => {
  if (position.value === "top") {
    return "wjh-pop-view__top";
  }
  return "wjh-pop-view__bottom";
});

const showMask = computed((): boolean => {
  return mask.value || true;
});

function handleClose() {
  show.value = false;
}
</script>

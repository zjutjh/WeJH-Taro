<template>
  <view :class="styles.alarm">
    <view :class="[styles['alarm-icon'], 'iconfont', 'icon-alarm']" />

    <view :class="styles['badge-wrapper']" v-if="counter != 0">
      <w-badge :content="counter.toString()" size="small" />
    </view>

  </view>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { WBadge } from "..";
import styles from "./index.module.scss";

const props = defineProps<{ counter: number }>();
const { counter } = toRefs(props);

</script>

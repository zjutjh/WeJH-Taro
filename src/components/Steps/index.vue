<template>
  <view class="wjh-steps">
    <view
      v-for="(num, index) in arr"
      :key="num"
      :class="[
        `wjh-steps-item`,
        index === props.current - 1
          ? `wjh-steps-item-active`
          : undefined
      ]"
    >
      {{ index === props.current - 1 ? `0${props.current}` : "" }}
    </view>
  </view>
</template>

<script setup lang="ts">
import "./index.scss";

type PropsType = {
  total: number;
  current: number
};
const props = defineProps<PropsType>();

const arr = new Array<number>(props.total)
  .fill(0)
  .map((_, index) => index + 1);

</script>

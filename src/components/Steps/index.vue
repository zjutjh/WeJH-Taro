<template>
  <view class="wjh-steps">
    <view
      v-for="(item, index) in arr"
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
}
const props = defineProps<PropsType>();

const arr = new Array<number>(props.total)
  .fill(0)
  .map((item, index) => index + 1);

</script>

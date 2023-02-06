<template>
  <view class="wjh-list-item">
    <view class="wjh-list-item-content">
      <view class="wjh-list-item-content-main">
        <slot></slot>
      </view>
      <template v-if="props.arrow">
        <view
          :style="rotateDegree"
          :class="`wjh-list-item-content-arrow iconfont icon-arrow-right`"
        />
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { CSSProperties } from "vue";
import "./index.scss";

type PropsType = {
  arrow?: "right" | "down";
}
const props = defineProps<PropsType>();

const degrees = {
  right: "rotate(0)",
  down: "rotate(90deg)"
}

const rotateDegree: CSSProperties | undefined = props.arrow ? {
  transform: degrees[props.arrow]
}: undefined

</script>

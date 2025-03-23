<template>
  <view class="wjh-list-item">
    <view class="wjh-list-item-content">
      <view
        :class="[
          `wjh-list-item-content-main`,
          isSelected ? `wjh-list-item-content-main-unselected line-through` : undefined
        ]"
      >
        <slot />
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
import { CSSProperties, ref } from "vue";
import "./index.scss";

type PropsType = {
  arrow?: "right" | "down";
  selected?: boolean;
};
const props = defineProps<PropsType>();

const isSelected = ref(props.selected);

const degrees = {
  right: "rotate(0)",
  down: "rotate(90deg)"
};

const rotateDegree: CSSProperties | undefined = props.arrow ? {
  transform: degrees[props.arrow]
} : undefined;

</script>

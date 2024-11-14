<template>
  <taro-button
    :style="{ backgroundColor: `var(--wjh-color-${props.color})` }"
    :class="[
      `wjh-button`,
      disable && 'wjh-button-disable',
      sizeClass,
      blockClass,
      shapeClass
    ]"
    @tap="handleTap"
  >
    <slot />
  </taro-button>
</template>

<script setup lang="ts">
import "./index.scss";
import { computed } from "vue";
import { Button as TaroButton } from "@tarojs/components";

type PropsType = {
  size?: "small" | "middle" | "large",
  shape?: "circle" | "rounded" | "default",
  block?: boolean,
  color?: "primary" | "yellow" | "blue" | "cyan" | "green",
  disable?: boolean
};

const emit = defineEmits<{
  tap: []
}>();

const props = withDefaults(defineProps<PropsType>(), {
  size: "middle",
  shape: "default",
  block: false,
  color: "primary",
  disable: false
});

const sizeClass = computed(() =>
  `wjh-button-${props.size}`
);

const blockClass = computed(() =>
  props.block ? "wjh-button-block" : undefined
);

const shapeClass = computed(() =>
  `wjh-button-shape-${props.shape}`
);

function handleTap() {
  if (!props.disable) emit("tap");
}

</script>

<template>
  <button :style="{ backgroundColor: `var(--wjh-color-${props.color})` }" :class="[`wjh-button`,
    disable && 'wjh-button-disable',
    sizeClass,
    blockClass,
    shapeClass]">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import "./index.scss";
import { computed } from "vue";

type PropsType = {
  size?: "small" | "middle" | "large",
  shape?: "circle" | "rounded" | "default",
  block?: boolean,
  color?: "green" | "yellow" | "blue" | "cyan",
  disable: boolean
}

const props = withDefaults(defineProps<PropsType>(), {
  size: "middle",
  shape: "default",
  block: false,
  color: "green",
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

</script>

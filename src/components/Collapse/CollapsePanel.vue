<template>
  <w-list-item
    :selected="props.selected"
    :class="[
      `wjh-collapse-panel-header`,
      isActive ? `wjh-collapse-panel-header-active` : undefined
    ]"
    :arrow="props.arrow ? 'down' : undefined"
    @tap="handleClick"
  >
    {{ props.title }}
    <slot name="header" />
  </w-list-item>
  <view
    :class="[
      `wjh-collapse-panel-content`,
      isActive ? `wjh-collapse-panel-content-active` : undefined
    ]"
    :style="{ maxHeight: isActive ? props.maxHeight : `0` }"
  >
    <w-list-item>
      <slot />
    </w-list-item>
  </view>
</template>

<script setup lang="ts">
import "./index.scss";

import { ref } from "vue";

import WListItem from "../List/ListItem.vue";

type PropsType = {
  title?: string;
  defaltActive?: boolean;
  maxHeight?: string;
  arrow?: boolean;
  selected?: boolean;
};

const props = withDefaults(defineProps<PropsType>(), {
  title: undefined,
  defaltActive: false,
  maxHeight: "500px",
  arrow: false,
  selected: false
});

const isActive = ref(props.defaltActive);

const handleClick = () => {
  isActive.value = !isActive.value;
};
</script>

<template>
  <w-list-item
    :class="[
      `wjh-collapse-panel-header`,
      isActive ? `wjh-collapse-panel-header-active` : undefined
    ]"
    :onTap="handleClick"
    :clickable="props.arrow"
  >
    {{ props.title }}
    <slot name="header"></slot>
  </w-list-item>
  <view
    :class="[
        `wjh-collapse-panel-content`,
      isActive ? `wjh-collapse-panel-content-active` : undefined
    ]"
    :style="{ maxHeight: isActive ? props.maxHeight : `0` }"
  >
    <w-list-item>
      <slot></slot>
    </w-list-item>
  </view>
</template>

<script setup lang="ts">
import { ref, withDefaults } from "vue";
import WListItem from "../List/ListItem.vue";
import "./index.scss";

type PropsType = {
  title: string;
  defaltActive?: boolean
  maxHeight?: string;
  arrow?: boolean
}

const props = withDefaults(defineProps<PropsType>(), {
  defaltActive: false,
  maxHeight: "500px",
  arrow: false
});

const isActive = ref(props.defaltActive);

const handleClick = () => {
  isActive.value = !isActive.value;
};

</script>

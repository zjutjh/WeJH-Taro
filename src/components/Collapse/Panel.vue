<template>
  <w-list-item
    class="wjh-collapse-panel-header"
    :arrow="props.arrow ? 'down' : undefined"
    @tap="handleClick"
  >
    {{ props.title }}
    <slot name="header" />
  </w-list-item>
  <view
    class="wjh-collapse-panel-content"
    :style="{ maxHeight: isActive ? props.maxHeight : `0` }"
  >
    <w-list-item>
      <slot />
    </w-list-item>
  </view>
</template>

<script setup lang="ts">
import { ref, withDefaults } from "vue";
import WListItem from "../List/ListItem.vue";
import "./index.scss";

  type PropsType = {
    title?: string;
    defaltActive?: boolean
    maxHeight?: string;
    arrow?: boolean
  };

const props = withDefaults(defineProps<PropsType>(), {
  title: undefined,
  defaltActive: false,
  maxHeight: "500px",
  arrow: false
});

const isActive = ref(props.defaltActive);

const handleClick = () => {
  isActive.value = !isActive.value;
};

</script>

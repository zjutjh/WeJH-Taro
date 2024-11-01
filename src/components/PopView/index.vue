<template>
  <view class="wjh-pop-view" :class="{ hidden: !show }">
    <view v-if="showMask" class="mask" @tap="close" />
    <view
      class="wjh-pop-view-body"
      :class="positionClass"
      :style="positionClass === 'bottom' && 'padding-bottom: env(safe-area-inset-bottom)'"
    >
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import "./index.scss";
import { computed, toRefs } from "vue";

interface PropsType {
  show: boolean;
  position?: "bottom" | "top" | "left" | "right";
  mask?: boolean
}

const props = defineProps<PropsType>();
const {
  show,
  position,
  mask
} = toRefs(props);

const emit = defineEmits(["update:show"]);

const positionClass = computed((): "bottom" | "top" | "left" | "right" => {
  return position?.value || "bottom";
});

const showMask = computed((): boolean => {
  return mask?.value || true;
});

function close() {
  emit("update:show", false);
}

</script>

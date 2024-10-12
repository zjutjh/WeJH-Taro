<template>
  <view class="wjh-pop-view" :class="{ hidden: !show }">
    <view v-if="showMask" class="mask" @tap="close" />
    <view
      class="wjh-pop-view-body"
      :class="positionClass"
      :style="isNewIPhone()
        && positionClass === 'bottom'
        ? 'padding-bottom: 2rem' : '' "
    >
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { isNewIPhone } from "@/utils";
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

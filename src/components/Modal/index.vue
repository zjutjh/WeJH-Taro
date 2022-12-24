<template>
  <view :class="[`wjh-modal`, !props.show ? `hidden` : undefined]">
    <view class="wjh-modal-container">
      <view class="wjh-modal-header">
        {{ props.title }}
        <slot name="header"></slot>
      </view>
      <view class="wjh-modal-body">
        {{ props.content }}
        <slot></slot>
      </view>
      <view v-if="slots.footer" class="wjh-modal-footer">
        <slot name="footer"></slot>
      </view>
    </view>
    <view v-if="props.mask" class="wjh-modal-mask" :onTap="closeModal"></view>
  </view>
</template>

<script setup lang="ts">
import { withDefaults, useSlots } from "vue";
import "./index.scss";

type PropsType = {
  title?: string;
  mask?: boolean;
  show: boolean;
  content: string;
}
const props = withDefaults(defineProps<PropsType>(), {
  title: "帮助",
  mask: true
});

const emit = defineEmits(["update:show"]);

const slots = useSlots();

const closeModal = () => {
  emit("update:show", false);
};

</script>

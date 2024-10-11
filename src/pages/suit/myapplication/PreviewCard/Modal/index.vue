<template>
  <view :class="[`wjh-modal`, !props.show ? `hidden` : undefined]">
    <view class="wjh-modal-container">
      <view class="wjh-modal-header">
        {{ props.title }}
        <slot name="header" />
      </view>
      <view class="wjh-modal-body">
        {{ props.content }}
        <slot />
      </view>
      <view v-if="slots.footer" class="wjh-modal-footer">
        <slot name="footer" />
      </view>
      <view v-if="actions" class="actions">
        <view style="display: flex; text-align: center;">
          <view class="button" @tap="handleCancel">
            <text>{{ actions?.cancel.label }}</text>
          </view>
          <view class="button" @tap="handleConfirm">
            <text>{{ actions?.confirm.label }}</text>
          </view>
        </view>
      </view>
    </view>
    <view
      v-if="props.mask"
      class="wjh-modal-mask"
      :on-tap="closeModal"
    />
  </view>
</template>

<script setup lang="ts">
import { useSlots, withDefaults } from "vue";
import "./index.scss";

type PropsType = {
  title?: string;
  mask?: boolean;
  show: boolean;
  content: string;
  actions?: {
    cancel: {
      label: string;
      callback?: () => void;
    },
    confirm: {
      label: string;
      callback?: () => void;
    }
  }
};

const props = withDefaults(defineProps<PropsType>(), {
  title: "帮助",
  mask: true,
  actions: undefined
});

const emit = defineEmits(["update:show"]);

const slots = useSlots();

const handleConfirm = () => {
  closeModal();
  props.actions?.confirm.callback?.();
};

const handleCancel = () => {
  closeModal();
  props.actions?.cancel.callback?.();
};

const closeModal = () => {
  emit("update:show", false);
};

</script>

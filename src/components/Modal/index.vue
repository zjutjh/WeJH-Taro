<template>
  <view
    :class="{
      'wjh-modal': true,
      'wjh-modal__hidden': !show
    }"
  >
    <view class="wjh-modal-container">
      <view class="wjh-modal-header">
        <text v-if="!isEmpty(title)">{{ title }}</text>
        <slot name="header" />
      </view>
      <view class="wjh-modal-body">
        <text v-if="!isEmpty(content)">{{ content }}</text>
        <slot />
      </view>
      <view v-if="slots.footer" class="wjh-modal-footer">
        <slot name="footer" />
      </view>
      <view v-if="actions" class="wjh-modal-actions">
        <view style="display: flex; text-align: center">
          <view class="button" @tap="handleCancel">
            <text>{{ actions?.cancel.label }}</text>
          </view>
          <view class="button" @tap="handleConfirm">
            <text>{{ actions?.confirm.label }}</text>
          </view>
        </view>
      </view>
    </view>
    <view v-if="mask" class="wjh-modal-mask" @tap="handleClose" />
  </view>
</template>

<script setup lang="ts">
import "./index.scss";

import { isEmpty } from "lodash-es";
import { useSlots } from "vue";

type ModelPropsType = {
  title?: string;
  mask?: boolean;
  content?: string;
  actions?: {
    cancel: {
      label: string;
      callback?: () => void;
    };
    confirm: {
      label: string;
      callback?: () => void;
    };
  };
};

const props = withDefaults(defineProps<ModelPropsType>(), {
  title: "帮助",
  mask: true,
  actions: undefined,
  content: undefined
});

const show = defineModel<boolean>("show", {
  default: false
});

const slots = useSlots();

const handleConfirm = () => {
  handleClose();
  props.actions?.confirm.callback?.();
};

const handleCancel = () => {
  handleClose();
  props.actions?.cancel.callback?.();
};

const handleClose = () => {
  show.value = false;
};
</script>

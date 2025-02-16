<template>
  <view :class="styles['amount-counter']">
    <view :class="styles['number-symbol']" @tap="handleMinus">
      -
    </view>
    <view :class="styles['number-num']">
      {{ field }}
    </view>
    <view :class="styles['number-symbol']" @tap="handleAdd">
      +
    </view>
  </view>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";

const props = defineProps<{ max: number | undefined }>();

const field = defineModel<number>({
  default: 1
});

function handleAdd() {
  if (!props.max) {
    return;
  }
  if (field.value < props.max) {
    field.value++;
  }
};

function handleMinus() {
  if (field.value > 1) {
    field.value--;
  }
};
</script>

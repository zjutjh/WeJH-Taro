<template>
  <view :class="[styles['rent-status-selector'],'flex-column']">
    <view :class="styles['scroll-view']">
      <text>
        状态  |
      </text>
      <text
        v-for="item in OPTIONS"
        :key="item.value"
        :class="field === item.value ? styles['active'] : undefined"
        @tap="() => handleSelect(item.value)"
      >
        {{ item.label }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
import { RentStatusEnum } from "../../types";

const OPTIONS = [
  { label: "待处理", value: RentStatusEnum.PENDING },
  { label: "借用中", value: RentStatusEnum.BORROWING },
  { label: "已完成", value: RentStatusEnum.COMPLETED }
] as const;

const field = defineModel<RentStatusEnum>();

function handleSelect(value: RentStatusEnum) {
  field.value = value;
}
</script>

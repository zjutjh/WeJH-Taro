<template>
  <view :class="styles['campus-selector']">
    <view :class="styles.container">
      <view
        v-for="item in OPTIONS"
        :key="item.value"
        :class="[styles.campus, field === item.value ? styles.active : undefined]"
        @tap="() => handleSelect(item)"
      >
        <text>{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { CampusCodeEnum } from "../../types";
import styles from "./index.module.scss";

const OPTIONS = [
  { label: "朝晖", value: CampusCodeEnum.ZH },
  { label: "屏峰", value: CampusCodeEnum.PF },
  { label: "莫干山", value: CampusCodeEnum.MGS }
] as const;

const field = defineModel<CampusCodeEnum>();

function handleSelect(opt: typeof OPTIONS[number]) {
  field.value = opt.value;
}
</script>

<template>
  <view :class="styles['spec-selector']">
    <view
      v-for="spec in specList"
      :key="spec.id"
      :class="[styles['size-card'], field?.id === spec.id ? styles.active : undefined]"
      @tap="() => handleSelect(spec)"
    >
      <text>{{ spec.spec }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { Spec } from "@/types/Suit";
import styles from "./index.module.scss";

defineProps<{ specList: Spec[] }>();

const field = defineModel<Spec>();

function handleSelect(value: Spec) {
  field.value = value;
}
</script>

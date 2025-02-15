<template>
  <picker
    :range="range"
    mode="selector"
    :value="innerField"
    @change="handleSelect"
  >
    <w-button>{{ renderText }}</w-button>
  </picker>
</template>

<script setup lang="ts">
import { Picker } from "@tarojs/components";
import { WButton } from "@/components";
import { computed } from "vue";

const OPTIONS = [
  { label: "朝晖/屏峰", value: "zhpf" },
  { label: "莫干山", value: "mgs" }
] as const;

const field = defineModel<string>();
const range = computed(() => OPTIONS.map(item => item.label));

const innerField = computed(() => {
  const index = OPTIONS.findIndex(opt => opt.value === field.value);
  return index !== -1 ? index : 0;
});

const renderText = computed(() => {
  return OPTIONS.find(opt => opt.value === field.value)?.label;
});

function handleSelect(e: Taro.MpEvent) {
  const index = e.detail.value as number;
  const newCampus = OPTIONS.at(index)?.value;
  if (newCampus) {
    field.value = newCampus;
  }
}
</script>

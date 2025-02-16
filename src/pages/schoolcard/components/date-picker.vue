<template>
  <picker
    mode="date"
    :value="pickerValue"
    :start="dayjs().subtract(69, 'day').format('YYYY-MM-DD')"
    :end="dayjs().format('YYYY-MM-DD')"
    @change="handleDateChange"
  >
    <w-button>{{ pickerValue }}</w-button>
  </picker>
</template>

<script setup lang="ts">
import { WButton } from "@/components";
import { Picker } from "@tarojs/components";
import dayjs from "dayjs";
import { computed } from "vue";
const field = defineModel<string>();

function handleDateChange(e: TaroGeneral.BaseEventOrig<{ value: string }>) {
  field.value = dayjs(e.detail.value).format("YYYYMMDD");
}

const pickerValue = computed(() => {
  return dayjs(field.value).format("YYYY-MM-DD");
});
</script>

<template>
  <w-button
    class="arrow-button"
    @tap="backwardWeek"
    shape="circle"
    size="large"
    :class="{ disable: week <= 1 }"
  >
    <view class="iconfont icon-arrow-left" />
  </w-button>
  <picker
    mode="selector"
    :range="selector"
    @change="onChange"
    :value="selectorValue"
    class="picker-wrapper"
  >
    <w-button class="week-selector">
      <text v-if="week > 18 || week < 1">放假中</text>
      <view v-else class="picker">{{ currentWeek }}</view>
    </w-button>
  </picker>
  <w-button
    shape="circle"
    class="arrow-button"
    @tap="forwardWeek"
    size="large"
    :class="{ disable: week >= 19 }"
  >
    <view class="iconfont icon-arrow-right" />
  </w-button>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { WButton } from '@/components/button';
  import './index.scss';

  const emit = defineEmits(['update:week']);

  onMounted(() => {
    currentWeek.value = selector[selectorValue.value];
  });

  const props = defineProps<{ week: number }>();

  const selectorValue = ref(props.week - 1 < 0 ? 0 : props.week - 1);
  let selector: string[] = [];
  const currentWeek = ref(selector[selectorValue.value]);

  for (let i = 1; i <= 20; i++) selector.push(`第 ${i} 周`);

  function onChange(e) {
    currentWeek.value = selector[e.detail.value];
    selectorValue.value = parseInt(e.detail.value);
    emit('update:week', parseInt(e.detail.value) + 1);
  }

  function backwardWeek() {
    if (selectorValue.value > 0) {
      selectorValue.value = props.week - 1 - 1;
      if (selectorValue.value < 0) selectorValue.value = 0;
      currentWeek.value = selector[selectorValue.value];
      emit('update:week', props.week - 1);
    }
  }
  function forwardWeek() {
    if (selectorValue.value < 18) {
      selectorValue.value = props.week + 1 - 1;
      if (selectorValue.value < 0) selectorValue.value = 0;
      currentWeek.value = selector[selectorValue.value];
      emit('update:week', props.week + 1);
    }
  }
</script>

<template>
  <view :class="styles['filter-keyword-field']">
    <view
      :class="styles['search-input-container']"
      :style="isEmpty(modelValue) ? { opacity: 0.6 } : {}"
    >
      <view class="iconfont icon-search" :class="styles['search-icon']" />
      <input
        v-model="modelValue"
        type="text"
        :class="styles['search-input']"
        :placeholder="randomSearchPlaceholder"
      />
    </view>
    <view :class="styles['icon-wrapper']" @tap="emit('click-line')">
      <view class="iconfont icon-route" />
      <view :class="styles['description']">路线</view>
    </view>
    <view :class="styles['icon-wrapper']" @tap="emit('click-announce')">
      <view class="iconfont icon-alarm" />
      <view :class="styles['description']">通知</view>
    </view>
    <view :class="styles['icon-wrapper']" @tap="emit('click-tip')">
      <view class="iconfont icon-help" />
      <view :class="styles['description']">提示</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { isEmpty, random } from "lodash-es";
import { computed } from "vue";

import { SCHEDULE_KEYWORDS_MATCH_RULES } from "../../_constants";
import styles from "./index.module.scss";

const modelValue = defineModel<string>({ default: "" });

const emit = defineEmits<{
  (e: "click-line" | "click-announce" | "click-tip"): void;
}>();

const randomSearchPlaceholder = computed(() => {
  const index = random(SCHEDULE_KEYWORDS_MATCH_RULES.length);

  return `试着搜索${SCHEDULE_KEYWORDS_MATCH_RULES[index].propertyName}～`;
});
</script>

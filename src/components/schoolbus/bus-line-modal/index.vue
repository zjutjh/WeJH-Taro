<template>
  <w-modal
    :show="props.show"
    title="全部路线"
    :mask="true"
    content=""
    :class="styles['line-modal']"
    @update:show="handleUpdateShow"
  >
    <template #header>
      <view :class="styles['close-icon']" class="iconfont icon-close-unfilled" @tap="close" />
    </template>

    <view :class="styles['content']">
      <view
        v-for="(lines, groupName) in props.lineList"
        :key="groupName"
        :class="styles['group-section']"
      >
        <view :class="styles['group-title']">
          <view :class="styles['dot']" />
          <text>{{ groupName }}</text>
        </view>

        <view :class="styles['chips-container']">
          <view v-for="line in lines" :key="line" :class="styles['chip']" @tap="handleSelect(line)">
            {{ line }}
          </view>
        </view>
      </view>
    </view>
  </w-modal>
</template>

<script setup lang="ts">
import { WModal } from "@/components";

import styles from "./index.module.scss";

interface BusLinesMap {
  [key: string]: string[];
}

const props = defineProps<{
  show: boolean;
  lineList: BusLinesMap;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "select", line: string): void;
}>();

const close = () => {
  emit("update:show", false);
};

const handleUpdateShow = (val: boolean) => {
  emit("update:show", val);
};

const handleSelect = (line: string) => {
  emit("select", line);
  close();
};
</script>

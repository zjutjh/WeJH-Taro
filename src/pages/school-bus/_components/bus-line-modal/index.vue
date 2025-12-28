<template>
  <w-modal v-model:show="show" title="全部路线" :class="styles['line-modal']">
    <view :class="styles['content']">
      <view
        v-for="(lines, groupName) in props.lineList"
        :key="groupName"
        :class="styles['group-section']"
      >
        <view :class="styles['group-title']">
          <view :class="styles['dot']" />
          <text>{{ groupName === "" ? "其他" : groupName }}</text>
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
  lineList: BusLinesMap;
}>();

const show = defineModel<boolean>("show", {
  default: false
});

const emit = defineEmits<{
  (e: "select", line: string): void;
}>();

const handleSelect = (line: string) => {
  emit("select", line);
  show.value = false;
};
</script>

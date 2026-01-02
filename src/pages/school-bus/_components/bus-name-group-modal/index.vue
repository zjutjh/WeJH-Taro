<template>
  <w-modal v-model:show="show" title="全部路线" :class="styles['line-modal']">
    <view :class="styles['content']">
      <view
        v-for="(busNameList, groupName) in group"
        :key="groupName"
        :class="styles['group-section']"
      >
        <view :class="styles['group-title']">
          <view :class="styles['dot']" />
          <text>{{ groupName === "" ? "其他" : groupName }}</text>
        </view>

        <view :class="styles['chips-container']">
          <view
            v-for="busName in busNameList"
            :key="busName"
            :class="styles['chip']"
            @tap="handleSelect(busName)"
          >
            {{ busName }}
          </view>
        </view>
      </view>
    </view>
  </w-modal>
</template>

<script setup lang="ts">
import { groupBy, mapValues, uniq } from "lodash-es";
import { computed, watch } from "vue";

import { WModal } from "@/components";
import { aegisReportEvent } from "@/plugins/aegis";

import { useBusStaticConfig } from "../../_composables/use-bus-static-config";
import { parseRouteName } from "../../_utils";
import styles from "./index.module.scss";

const show = defineModel<boolean>("show", {
  default: false
});

const { busConfig } = useBusStaticConfig();

const group = computed(() => {
  const _group = groupBy(busConfig.value, (item) => {
    const { startDirection, endDirection } = parseRouteName(item.name);
    return `${[startDirection, endDirection].sort().join("、")} 之间往返`;
  });

  return mapValues(_group, (value) => uniq(value.map((_) => parseRouteName(_.name).busName)));
});

const emit = defineEmits<{
  (e: "select", line: string): void;
}>();

const handleSelect = (busName: string) => {
  emit("select", busName);
  show.value = false;

  aegisReportEvent("WjhFuncClick", {
    moduleName: "校车-班车名分类弹窗",
    funcName: "选择班车名",
    extra: JSON.stringify({
      busName
    })
  });
};

watch(show, (newValue) => {
  if (newValue) {
    aegisReportEvent("WjhFuncView", {
      moduleName: "校车-班车名分类弹窗",
      funcName: "弹窗曝光"
    });
  }
});
</script>

<template>
  <w-button
    shape="circle"
    size="large"
    class="refresh-button"
    @tap="refresh"
  >
    <view
      class="iconfont icon-refresh"
      :class="{ 'refresh-running': isRefreshing }"
    />
  </w-button>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import WButton from "../Button/index.vue";
import "./index.scss";

const props = defineProps<{ isRefreshing: boolean }>();
const { isRefreshing } = toRefs(props);

const emit = defineEmits(["refresh"]);

function refresh() {
  emit("refresh");
}

</script>

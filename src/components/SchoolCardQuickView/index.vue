<template>
  <quick-view
    title="校园卡"
    icon-name="schoolcard"
    help
    @tap="nav2Card"
    @handle-tap-help="handleTapHelp"
  >
    <text class="sub-text">
      当前余额 ({{ balanceUpdateTimeString }})
    </text>
    <view class="quickcard-balance">
      <text> ¥ {{ data?.balance ?? "-" }} </text>
    </view>
  </quick-view>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import { computed } from "vue";
import QuickView from "../QuickView/index.vue";
import useSchoolCardBalanceQuery from "@/store/service/cardBalance";
import "./index.scss";

const { data, error } = useSchoolCardBalanceQuery();
const emit = defineEmits(["showHelp"]);

const balanceUpdateTimeString = computed(() => {
  if (!data.value?._upTime || error.value) {
    return "更新失败";
  }
  return dayjs(data.value?._upTime).fromNow();
});

function nav2Card() {
  Taro.navigateTo({ url: "/pages/schoolcard/index" });
}

function handleTapHelp() {
  emit("showHelp", "school-card");
}
</script>

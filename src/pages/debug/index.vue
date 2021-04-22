<template>
  <view class="index">
    <view v-for="(i, k) in systemInfo" :key="k">
      <text>{{ k }}: </text><text>{{ i }}</text>
    </view>
  </view>
</template>

<script>
import { reactive, ref } from "vue";
import "./index.scss";
import Taro from "@tarojs/taro";
export default {
  setup() {
    let info = { SDKVersion: "0" };
    let systemInfo = reactive(info);
    Taro.getSystemInfo().then((res) => {
      console.log(res);
      Object.assign(systemInfo, res);
    });
    return {
      systemInfo,
    };
  },
  mounted() {},
};
</script>

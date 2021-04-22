<template>
  <view class="index">
    <image class="image" src="../../assets/schoolbus/schoolbus.svg"></image>
    <view class="bus-card" v-for="bus in busList" :key="bus.id">
      <view class="line-no"> {{ bus.LineNo }} <text>即将发车</text> </view>
      <view> {{ bus.From }}->{{ bus.To }} </view>
      <view> 开点：{{ bus.Time }} </view>
    </view>
  </view>
</template>

<script>
import { reactive, ref } from "vue";
import "./index.scss";
import Taro from "@tarojs/taro";
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      busList: [
        {
          id: 1,
          LineNo: "1号线",
          From: "莫干山",
          To: "屏峰",
          Time: "16:30",
          weekend: false,
          notes: "",
        },
        {
          id: 2,
          LineNo: "1号线",
          From: "莫干山",
          To: "屏峰",
          Time: "6:30",
          weekend: false,
          notes: "",
        },
        {
          id: 3,
          LineNo: "1号线",
          From: "莫干山",
          To: "屏峰",
          Time: "18:30",
          weekend: false,
          notes: "",
        },
        {
          id: 3,
          LineNo: "1号线",
          From: "莫干山",
          To: "屏峰",
          Time: "18:30",
          weekend: false,
          notes: "",
        },
      ],
    };
  },
  setup() {},
  mounted() {},
});
</script>
<style scoped>
.bus-card {
  background: blanchedalmond;
  padding: 1rem;
  border-radius: 1rem;
  margin: 1rem;
}
.image {
  display: block;
  margin: auto;
}
.line-no {
  font-size: 70%;
}
</style>

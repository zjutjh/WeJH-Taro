<template>
  <view class="nav-bar">
    <view @tap="nevHome">
      <text>Home</text>
    </view>
    <view @tap="nev">
      <text>My</text>
    </view>

    <view class="finder">+</view>
  </view>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Taro from "@tarojs/taro";
export default defineComponent({
  setup() {},
  methods: {
    nev() {
      Taro.redirectTo({
        url: "/pages/my/index",
      });
    },
    nevHome() {
      Taro.redirectTo({
        url: "/pages/index/index",
      });
    },
  },
});
</script>

<style lang="css">
.nav-bar {
  background: white;
  height: 3rem;
  position: fixed;
  display: flex;
  justify-content: space-around;
  bottom: 0;
  align-items: center;
  width: 100vw;
  box-shadow: 0.3em 0.3em 1em rgba(0, 0, 0, 0.3);
}
.finder {
  border-radius: 100vh;
  background-color: white;
  position: absolute;
  box-shadow: 0.3em 0.3em 1em rgba(0, 0, 0, 0.3);
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-50%);
  margin: auto;
}
</style>

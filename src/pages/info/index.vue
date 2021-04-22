<template>
  <view class="index">
    <view class="header"> </view>
    <view class="quick-card-view">
      <view class="card"> </view>
      <view class="card"> </view>
    </view>

    <nav-bar></nav-bar>
  </view>
</template>

<script>
import { ref } from "vue";
import "./index.scss";
import NavBar from "../../components/navBar/index.vue";
export default {
  components: { NavBar },
  setup() {
    const msg = ref("Hello world");
    return {
      msg,
    };
  },
};
</script>

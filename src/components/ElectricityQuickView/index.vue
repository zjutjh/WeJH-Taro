<template>
 <quick-view
   title="电费查询"
   icon-name="schoolcard"
   @tap="nav2electricity"
 >
   <view class="text-view">
     <text class="sub-text-left">当前电费</text>
     <text class="sub-text-right">温馨提示</text>
   </view>
  <card class="electricity-card">
    <text>寝室剩余电费</text>
  </card>
 </quick-view>
</template>

<script lang="ts" setup>
import {QuickView} from "@/components";
import {Card} from "@/components";
import Taro from "@tarojs/taro";
import "./index.scss";
function nav2electricity(){
  Taro.navigateTo({url: "/pages/electricity/index"});
}
</script>

<style scoped>

</style>

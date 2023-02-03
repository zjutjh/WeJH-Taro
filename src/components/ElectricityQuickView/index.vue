<template>
 <quick-view
   title="电费查询"
   icon-name="exam"
   @tap="nav2electricity"
 >
   <view class="text-view">
     <text class="sub-text-left">当前电费</text>
     <text v-if="isUrgent" class="sub-text-right">温馨提示: 电量较低</text>
   </view>
  <card class="electricity-card">
    <view v-if="balance">寝室剩余电费
       <text>
         <text :style="{'color': fontColor}">&nbsp&nbsp&nbsp{{balance}}&nbsp&nbsp&nbsp&nbsp</text>
       </text>
      度
    </view>
    <text v-else>点击查询</text>
  </card>
 </quick-view>
</template>

<script lang="ts" setup>
import {QuickView} from "@/components";
import {Card} from "@/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import {computed, onMounted, ref} from "vue";
import {serviceStore} from "@/store";
import {YxyService} from "@/services";
import {useRequest} from "@/hooks";

const {
  run: getBalance,
} =  useRequest(YxyService.queryBalance,{
  manual: true,
  onSuccess:   (response) => {
    console.log(response);
    if(response.statusCode !== 200){
      getBalance();
    }
    else {
      balance.value = response.data.data.surplus;
    }
  }
});

function nav2electricity(){
  Taro.navigateTo({url: "/pages/electricity/index"});
}

const balance = ref();
const isUrgent = computed(() => {
  if(balance.value)
    return balance.value < 20;
  else
    return false;
});
const fontColor = computed(() => {
  console.log(isUrgent.value);
  return isUrgent.value? "red" : "#00B7B7";
});

onMounted( () => {
  getBalance();
});
</script>

<style scoped>

</style>

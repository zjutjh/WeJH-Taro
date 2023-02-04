<template>
 <quick-view
   title="电费查询"
   icon-name="exam"
   @tap="nav2electricity"
 >
   <view class="text-view">
     <text class="sub-text-left">当前电费({{updateTimeString}})</text>
     <text v-if="isUrgent" class="sub-text-right">温馨提示: 电量较低</text>
   </view>
  <view class="electricity-card">
    <view v-if="balance">寝室剩余电费
       <text>
         <text :style="{'color': fontColor}">&nbsp&nbsp&nbsp{{balance}}&nbsp&nbsp&nbsp&nbsp</text>
       </text>
      度
    </view>
    <text v-else>正在查询...</text>
  </view>
 </quick-view>
</template>

<script lang="ts" setup>
import {QuickView} from "@/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import {computed, onMounted, ref} from "vue";
import {YxyService} from "@/services";
import {serviceStore} from "@/store";
import dayjs from "dayjs";

//TODO: 这里本来想用vuex存储电量状态的 但是用了就报错...显示serviceStore.electricity 是 undefined

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
  return isUrgent.value? "red" : "#00B7B7";
});

const updateTime = computed( () => {
  if (serviceStore.electricity.updateTime.balance)
    return serviceStore.electricity.updateTime.balance;
  else
    return undefined;
});

const updateTimeString = computed( () => {
  if(updateTime.value !== undefined) return dayjs(updateTime.value).fromNow();
  else return "更新失败!";
});

onMounted( () => {
  YxyService.getBalance().then((res) => {
    balance.value = res;
  });
  console.log(balance.value);
});
</script>

<style scoped>

</style>

<template>
 <view class="background">
   <title-bar title="寝室电费查询" back-button></title-bar>
   <scroll-view :scrollY="true">
     <view class="header-view">
       <image src="@/assets/photos/electricity.svg"></image>
     </view>

       <view v-if="isSuccess">
         <view class="flex-column">
         <card style="position: relative">
           <view class="icon-wrapper">
             <view class="iconfont icon-electricity" :style="`font-size: 3em;`"/>
           </view>
           <view class="text-wrapper">
             <text color="black">{{resData.place[0]}} &nbsp&nbsp&nbsp&nbsp {{resData.place[1]}}</text>
             <text class="week">房间号 &nbsp&nbsp&nbsp&nbsp{{resData.place[2]}}</text>
           </view>
         </card >
          <card style="position: relative">
            <view>剩余总电量<text :style="{'color': fontColor}">&nbsp&nbsp&nbsp{{resData.balance}}&nbsp&nbsp&nbsp&nbsp</text>度</view>
          </card>
          <text v-if="isUrgent" :style="{'color': 'red','position': 'relative','font-size': '0.5em'}">温馨提示: 电量已不足20度，请及时充电</text>

         <card style="position: relative" @tap="nav2Consumption">
           <view>每日用电记录
             <view class="arrow-wrapper">
               <view class="iconfont icon-arrow-right" />
             </view>
           </view>
         </card>
         <card style="position: relative" @tap="nav2Record">
           <view >缴费记录
             <view class="arrow-wrapper">
               <view class="iconfont icon-arrow-right" />
             </view>
           </view>
         </card>
       </view>
       </view>
         <view v-else>
       <card style="text-align: center">
         <view>{{isError? "请求失败,请稍后重试!" : "正在请求中,请稍等..."}}</view>
       </card>
     </view>
   </scroll-view>
 </view>
</template>

<script setup lang="ts">
import "./index.scss";
import {
  Card,
  TitleBar,
} from "@/components";
import {useRequest} from "@/hooks";
import {YxyService} from "@/services";
import {computed, onMounted, ref} from "vue";
import store, {serviceStore} from "@/store";
import Taro from "@tarojs/taro";

const isSuccess = ref<Boolean>(false);
const isError = ref<Boolean>(false);
const resData = ref();

const {
  run: getBalance,
} =  useRequest(YxyService.queryBalance,{
  manual: true,
  onSuccess:   (response) => {
    // console.log(response);
    if(response.statusCode !== 200){
      isError.value = true;
      isSuccess.value = false;
      getBalance();
    }
    else {
      resData.value = getData(response.data.data);
      store.commit("setBalance",resData.value.balance);
      isSuccess.value = true;
    }
  }
});

function getData(res) {
  let place = getPlace(res.display_room_name);
  console.log(place);
  return {
    place: place,
    balance: res.surplus,
  };
}

function getPlace(place: string){
  let tmp = place.split("校区");
  return [
    tmp[0],
    tmp[1].slice(0,tmp[1].indexOf("s")),
    tmp[1].slice(tmp[1].indexOf("s")),
  ];
}

const isUrgent = computed(() => {
  return resData.value.balance < 20;
});
const fontColor = computed(() => {
  console.log(isUrgent.value);
  return isUrgent.value? "red" : "#00B7B7";
});
onMounted(() => {
  getBalance();
});

function nav2Record() {
  Taro.navigateTo({
    url: "/pages/electricity/record/index"
  });
}

function nav2Consumption() {
  Taro.navigateTo({
    url: "/pages/electricity/consumption/index"
  });
}

</script>

<style scoped>

</style>

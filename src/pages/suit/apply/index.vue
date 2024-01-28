<template>
  <theme-config>
    <title-bar title="正装借用" back-button />
    <view class="campus-selector">
      <view class="container">
        <view
          :key="item"
          v-for="item in campusList"
          :class="['campus', selectCampus === item ? 'active' : undefined]"
          @tap="() => handleSelectCampus(item)"
         >
          <text>{{ item }}</text>
        </view>
      </view>
    </view>
    <view class="suit-selector">
      <view :key="i" v-for="i in temNumList" class="suits">
        <view class="suit-name">上衣</view>
      </view>
    </view>
    <view class="suit-panel">
      <view class="container">
        <view class="title">尺码</view>
        <view class="size-scroll">
          <view
            :key="model"
            v-for="model in temNumList"
            :class="['size-card', rentSuitSize === model ? 'active' : undefined]"
            @tap="() => selectSuitSize(model)"
          >{{ model }}</view>
        </view>
        <view class="title">剩余数量</view>
        <view class="remain-suit-num">{{ remainSuitNum }}</view>
        <view class="title">数量</view>
        <view class="rent-suit-number">
          <view class="number-symbal" @tap="minusRentSuitNumber">-</view>
          <view class="number-num">{{ rentSuitNumber }}</view>
          <view class="number-symbal" @tap="addRentSuitNumber">+</view>
        </view>
      </view>
      <view class="confirm">确认提交</view>
    </view>
  </theme-config>
</template>

<script setup lang="ts">
import { ref } from "vue";
import store, { serviceStore } from "@/store";
import "./index.scss";
// import styles from "./index.module.scss";
import {
  TitleBar,
  ThemeConfig,
} from "@/components";

/*后端返回值*/
// const returnValue = {
//   "code": 1,
//   "msg": "ok",
//   "data": [
//     {
//       "name": "上衣",
//       "img": "https://img",
//       "specs": [
//         {
//           "id": 1,
//           "stock": 3,
//           "spec": "M"
//         },{
//           "id": 2,
//           "stock": 0,
//           "spec": "L"
//         }
//       ]
//     },{
//       "name": "裤子",
//       "img": "https://img",
//       "specs": [
//         {
//           "id": 7,
//           "stock": 20,
//           "spec": "180"
//         },{
//           "id": 11,
//           "stock": 9,
//           "spec": "XL"
//         }
//       ]
//     }
//   ]
// };

//unicode


const campusList = ref<string[]>(["屏峰", "朝晖", "莫干山"]);
const selectCampus = ref(serviceStore.suit.lastOpenCampus || "朝晖");

//需要unicode
const temNumList = ["S", "M", "L", "XL", "XXL", "XXXL"];
const remainSuitNum = ref(114514);
const rentSuitNumber = ref(1);
const rentSuitSize = ref("S");



const handleSelectCampus = (campus: string) => {
  if (selectCampus.value === campus) return;
  selectCampus.value = campus;
  store.commit("setLastOpenCampus", campus);
  // resetList();
  // getRecords({
  //   campus: campus,
  //   kind: selectKind.value,
  //   page_num: currentPage.value + 1,
  //   page_size: 10,
  //   lost_or_found: selectMain.value
  // });
};

const selectSuitSize = (size: string) => {
  if(size != rentSuitSize.value){
    rentSuitSize.value = size;
  }
};

const addRentSuitNumber = () => {
  if(rentSuitNumber.value < remainSuitNum.value){
    rentSuitNumber.value++;
    return;
  }
  // alarmBeyondMaxRemainSuit();
};

const minusRentSuitNumber = () => {
  if(rentSuitNumber.value > 1){
    rentSuitNumber.value--;
  }
};

</script>

<script setup lang="ts">
import styles from "./index.module.scss";
import { isNewIPhone } from "@/utils";
import Taro from "@tarojs/taro";

const handleClick = () => {
  Taro.showActionSheet({
    itemList: [
      "ForYou朝晖QQ: 2716709627",
      "ForYou屏峰QQ: 3252819828",
      "ForYou莫干山QQ: 2030219390",
      "事务大厅-朝晖: 综合楼一楼河畔旁",
      "事务大厅-屏峰: 西4和东15楼下",
      "事务大厅-莫干山: 德8德9连廊"
    ]
  });
};

</script>

<template>
  <view
    @tap="handleClick"
    :class="[
      styles.container,
      isNewIPhone()? styles.ios: undefined,
    ]"
  >
    <view :class="styles.arrow" />
    <text :class="styles.text">联系方式：foryou、学生事务大厅</text>
  </view>
</template>

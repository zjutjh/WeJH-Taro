<script setup lang="ts">
import styles from "./index.module.scss";
import Taro from "@tarojs/taro";

const emit = defineEmits(["showHelp"]);
const data: Array<{ content: string; extra?: string }> = [
  {
    content: "学生事务大厅-朝晖: 综合楼一楼河畔旁",
    extra: "学生事务大厅-朝晖\r\n电话: 88320868"
  },
  {
    content: "学生事务大厅-屏峰: 西4和东15楼下",
    extra: "学生事务大厅-屏峰\r\n东15电话: 85290858\r\n西4电话:85290880"
  },
  {
    content: "学生事务大厅-莫干山: 德8德9连廊",
    extra: "学生事务大厅-莫干山\r\n电话: (0571) 8881 3551"
  }
];

const handleClick = () => {
  Taro.showActionSheet({
    itemList: data.map((item) => item.content),
    success: (res) => {
      if (data[res.tapIndex].extra) {
        Taro.showModal({
          title: "详情",
          content: data[res.tapIndex].extra
        });
      }
    }
  });
};

function handleTapHelp() {
  emit("showHelp", "lost-found");
}
</script>

<template>
  <view :class="styles.container">
    <view :class="styles.arrow" @tap="handleClick" />
    <text @tap="handleClick">
      点击查看学生事务大厅的联系方式
    </text>
    <view
      :class="[styles.helpicon]"
      class="iconfont icon-help"
      @tap="handleTapHelp"
    />
  </view>
</template>

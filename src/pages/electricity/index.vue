<template>
 <view class="background">
   <title-bar title="寝室电费查询" back-button></title-bar>
   <scroll-view :scrollY="true">
     <view class="header-view">
       <image src="@/assets/photos/electricity.svg"></image>
     </view>
     <view class="flex-column">
       <card style="text-align: center">
         <view>剩余总电量114514度</view>
       </card>
     </view>
   </scroll-view>
 </view>
</template>

<script setup lang="ts">
import "./index.scss";
import {
    BottomPanel,
    Card,
    RefreshButton,
    TermPicker,
    TitleBar,
    WModal,
    WCollapsePanel,
    WCollapse,
    WDescriptions,
    WDescriptionsItem,
} from "@/components";
</script>

<style scoped>

</style>

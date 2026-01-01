<template>
  <w-modal v-model:show="show" title="提示">
    <view :class="styles['content']">
      <view :class="styles['paragraph']">
        1.预约校车: 请到工大钉、容大后勤服务的"班车预约".
        预约截至于发车前16分钟。购票后会自动从校园卡内扣除相应金额
      </view>
      <view :class="styles['paragraph']">
        2.注意：微精弘仅对校车信息搬运, 方便同学们查询车次, 有关校车的具体问题请咨询学校校车相关人员
      </view>
      <view :class="styles['paragraph']">
        3.功能提示：搜索框可以搜索线路相关信息, 如起终点方向名, 途经站点名, 班车名称，发车情况
      </view>
    </view>
  </w-modal>
</template>

<script setup lang="ts">
import { WModal } from "@/components";

import styles from "./index.module.scss";

const show = defineModel<boolean>("show", {
  default: false
});
</script>

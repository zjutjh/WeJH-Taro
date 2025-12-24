<template>
  <w-modal
    :show="props.show"
    title="提示"
    :mask="true"
    content=""
    :class="styles['tip-modal']"
    @update:show="handleUpdateShow"
  >
    <view :class="styles['content']">
      <view :class="styles['paragraph']">
        1.预约校车: 请到工大钉、容大后勤服务的"班车预约".
        预约截至于发车前16分钟。购票后会自动从校园卡内扣除相应金额
      </view>
      <view :class="styles['paragraph']">
        2.注意：微精弘仅对校车信息搬运, 方便同学们查询车次, 有关校车的具体问题请咨询学校校车相关人员
      </view>
      <view :class="styles['paragraph']">
        3.功能提示：搜索框可以搜索线路相关信息, 如起终点名, 中间点位名, 线路名(如6号线)
      </view>
    </view>
  </w-modal>
</template>

<script setup lang="ts">
import { WModal } from "@/components";

import styles from "./index.module.scss";

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
}>();

const handleUpdateShow = (val: boolean) => {
  emit("update:show", val);
};
</script>

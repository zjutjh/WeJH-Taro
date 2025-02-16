<template>
  <view
    :class="[
      styles.container,
      source.status === 1 || source.status === 2
        ? styles.pend
        : (source.status === 3 ? styles.loan : styles.complete)
    ]"
  >
    <view :class="styles.header">
      <view :class="styles.title">
        我的申请
      </view>
      <template v-if="source.status === RentStatusEnum.PENDING">
        <text :class="styles.time">
          {{ dayjs(source.apply_time).format("YYYY/MM/DD HH:mm") }}
        </text>
      </template>
      <template v-if="source.status == RentStatusEnum.REJECTED">
        <view :class="styles['icon-box']">
          <icon type="warn" color="#f0ad3e" size="15" />
          <text>被驳回</text>
        </view>
        <text :class="styles.time">
          {{ dayjs(source.apply_time).format("YYYY/MM/DD HH:mm") }}
        </text>
      </template>
      <template v-if="source.status === RentStatusEnum.BORROWING">
        <view v-show="isOverTime" :class="styles['icon-box']">
          <icon type="warn" color="#f0ad3e" size="15" />
          <text>超时</text>
        </view>
        <text :class="styles.time">
          借用时间:{{ dayjs(source.borrow_time).format("YYYY/MM/DD HH:mm") }}
        </text>
      </template>
      <template v-if="source.status === RentStatusEnum.COMPLETED">
        <text :class="styles.time">
          归还时间:{{ dayjs(source.return_time).format("YYYY/MM/DD HH:mm") }}
        </text>
      </template>
    </view>

    <view :class="styles['flex-container']">
      <taro-image
        :class="styles.image"
        mode="aspectFill"
        :src="imageUrl"
        @load="handleLoadFinish"
        @tap="() => handlePreviewImages(imageUrl)"
      />
      <view :class="styles.content">
        <text v-show="source.id" space="emsp" :class="styles.text">
          ID  {{ source.id }}
        </text>
        <text v-show="source.kind" space="emsp" :class="styles.text">
          类别  {{ source.kind }}
        </text>
        <text v-show="source.name" space="emsp" :class="styles.text">
          名称  {{ source.name }}
        </text>
        <text v-show="source.spec" space="emsp" :class="styles.text">
          规格  {{ source.spec }}
        </text>
        <text v-show="source.count" space="emsp" :class="styles.text">
          数量  {{ source.count }}
        </text>
        <template v-if="source.status === RentStatusEnum.PENDING">
          <view style="display: flex;">
            <view style="flex: 1" />
            <w-button :class="styles.button" @tap="handleCancel">
              取消申请
            </w-button>
          </view>
        </template>
        <template v-if="source.status === RentStatusEnum.BORROWING">
          <text
            v-if="isOverTime"
            v-show="source.borrow_time"
            space="emsp"
            :class="styles.text"
          >
            {{ isOverTime ? "超时时间" : "剩余时间" }}
            {{ renderTimeDiff }}
          </text>
        </template>
        <template v-if="source.status === RentStatusEnum.COMPLETED">
          <text v-show="source.return_time" space="emsp" :class="styles.text">
            借用时长  {{ renderRentTime }}
          </text>
        </template>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { SuitApplyRecord } from "@/types/Suit";
import { computed, ref } from "vue";
import { Image as TaroImage, Icon } from "@tarojs/components";
import { WButton } from "@/components";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import styles from "./index.module.scss";
import { RentStatusEnum } from "../../types";

const props = defineProps<{
  source: SuitApplyRecord;
}>();

const needFixWidth = ref(false);
const imageUrl = computed(() => {
  return props.source.img || "https://api.cnpatrickstar.com/img/b57036a9-c17c-41af-9e5d-893af1aa7d9a.jpg";
});

const emit = defineEmits<{
  cancel: [id: number]
}>();

const isOverTime = computed(() => {
  const agoTime = dayjs().subtract(7, "day");
  return dayjs(props.source.borrow_time).isBefore(agoTime);
});

const handlePreviewImages = (url: string) => {
  Taro.previewImage({
    current: url,
    urls: [imageUrl.value]
  });
};

const handleCancel = () => {
  emit("cancel", props.source.id);
};

const handleLoadFinish = ({ detail: { height, width } }) => {
  if (height > width) needFixWidth.value = false;
  else needFixWidth.value = true;
};

const renderTimeDiff = computed(() => {
  if (props.source.status !== RentStatusEnum.COMPLETED) {
    return "-";
  }

  let secondDuring = (dayjs(props.source.borrow_time).add(7, "day").unix()) - (dayjs().unix());
  if (isOverTime.value) {
    secondDuring = (dayjs().unix()) - (dayjs(props.source.borrow_time).add(7, "day").unix());
  }
  const setHours = Math.floor(secondDuring / 60 / 60 % 24);
  const setDay = Math.floor(secondDuring / 60 / 60 / 24);
  if (Math.abs(setDay) > 0) {
    return setDay + "天\t";
  } else {
    return setHours + "小时\t";
  }
});

const renderRentTime = computed(() => {
  if (props.source.status !== RentStatusEnum.COMPLETED) {
    return "-";
  }

  const secondDuring = dayjs(props.source.return_time).unix()
   - dayjs(props.source.borrow_time).unix();
  const setHours = Math.floor(secondDuring / 60 / 60 % 24);
  const setDay = Math.floor(secondDuring / 60 / 60 / 24);
  if (Math.abs(setDay) > 0) {
    return setDay + "天\t";
  } else {
    return setHours + "小时\t";
  }
});
</script>

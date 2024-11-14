<template>
  <view
    :class="[
      styles.container,
      source.status === 1 || source.status === 2
        ? styles.pend
        : (source.status === 3 ? styles.loan : styles.complete)
    ]"
  >
    <view
      v-if="source.status === 1 || source.status === 2"
      :class="styles.header"
    >
      <view :class="styles.title">
        我的申请
      </view>
      <view v-show="source.status == 2" :class="styles['icon-box']">
        <icon type="warn" color="#f0ad3e" size="15" />
        <view class="desc">
          <text>被驳回</text>
        </view>
      </view>
      <text :class="styles.time">
        {{ timeFormat(source.apply_time) }}
      </text>
    </view>
    <view v-if="source.status === 3" :class="styles.header">
      <view :class="styles.title">
        我的申请
      </view>
      <view v-show="isOverTime" :class="styles['icon-box']">
        <icon type="warn" color="#f0ad3e" size="15" />
        <view class="desc">
          <text>超时</text>
        </view>
      </view>
      <text :class="styles.time">
        借用时间:{{ timeFormat(source.borrow_time) }}
      </text>
    </view>
    <view v-if="source.status === 4" :class="styles.header">
      <view :class="styles.title">
        我的申请
      </view>
      <text :class="styles.time">
        归还时间:{{ timeFormat(source.return_time) }}
      </text>
    </view>
    <view v-if="source.status === 1 || source.status === 2" :class="styles.body">
      <view
        :class="styles['flex-container']"
        style="display: flex;"
      >
        <view :class="styles['img-list']">
          <view :class="[styles['img-container']]">
            <view
              v-for="item in imageList"
              :key="`${source.id}-${item}`"
              :class="styles['img-wrapper']"
            >
              <taro-image
                :class="styles.image"
                style="width: 125Px ;height: 200Px"
                mode="aspectFill"
                :src="item"
                @load="handleLoadFinish"
                @tap="() => handlePreviewImages(item)"
              />
            </view>
          </view>
        </view>
        <view :class="styles.content" class="flex-column">
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
          <w-button :class="styles.button" @tap="handleClick">
            取消申请
          </w-button>
          <modal
            v-model:show="isShowConfirm"
            title="提示"
            content="请确认是否要取消申请"
            :actions="{
              cancel: {
                label: '取消',
                callback: onCancel
              },
              confirm: {
                label: '确定',
                callback: handleConfirm
              }
            }"
          />
        </view>
      </view>
    </view>
    <view v-if="source.status === 3" :class="styles.body">
      <view :class="styles['flex-container']">
        <view :class="styles['img-list']">
          <view :class="[styles['img-container']]">
            <view
              v-for="item in imageList"
              :key="`${source.id}-${item}`"
              :class="styles['img-wrapper']"
            >
              <taro-image
                :class="styles.image"
                style="width: 125Px ;height: 200Px"
                mode="aspectFill"
                :src="item"
                @load="handleLoadFinish"
                @tap="() => handlePreviewImages(item)"
              />
            </view>
          </view>
        </view>
        <view :class="styles.content" class="flex-column">
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
          <text
            v-if="!isOverTime"
            v-show="source.borrow_time"
            space="emsp"
            :class="styles.text"
          >
            剩余时间  {{ timeCount(source.borrow_time) }}
          </text>
          <text
            v-if="isOverTime"
            v-show="source.borrow_time"
            space="emsp"
            :class="styles.text"
          >
            超时时间  {{ timeCount(source.borrow_time) }}
          </text>
        </view>
      </view>
    </view>
    <view v-if="source.status === 4" :class="styles.body">
      <view :class="styles['flex-container']">
        <view :class="styles['img-list']">
          <view :class="[styles['img-container']]">
            <view
              v-for="item in imageList"
              :key="`${source.id}-${item}`"
              :class="styles['img-wrapper']"
            >
              <taro-image
                :class="styles.image"
                style="width: 125Px ;height: 200Px"
                mode="aspectFill"
                :src="item"
                @load="handleLoadFinish"
                @tap="() => handlePreviewImages(item)"
              />
            </view>
          </view>
        </view>
        <view :class="styles.content" class="flex-column">
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
          <text v-show="source.return_time" space="emsp" :class="styles.text">
            借用时长  {{ timeDuring(source.borrow_time ,source.return_time) }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { SuitApplyRecord } from "@/types/Suit";
import { computed, ref, toRefs } from "vue";
import { Image as TaroImage } from "@tarojs/components";
import { SuitService } from "@/services";
import { WButton } from "@/components";
import Modal from "./Modal/index.vue";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import styles from "./index.module.scss";
import { RequestError } from "@/utils";

const props = defineProps<{
  source: SuitApplyRecord;
}>();
const isShowConfirm = ref(false);
const needFixWidth = ref(false);
const imageList = computed(() => [
  source.value?.img || "https://api.cnpatrickstar.com/img/b57036a9-c17c-41af-9e5d-893af1aa7d9a.jpg"
].filter(item => !!item) as string[]);
const { source } = toRefs(props);

const emit = defineEmits<{
  cancel: []
}>();

const isOverTime = computed(() => {
  const agotime = dayjs().subtract(7, "day");
  return dayjs(source.value.borrow_time).isBefore(agotime);
});

const handlePreviewImages = (url: string) => {
  Taro.previewImage({
    current: url,
    urls: imageList.value
  });
};

const handleClick = () => {
  isShowConfirm.value = true;
};

const onCancel = () => {
  isShowConfirm.value = false;
};

async function handleConfirm() {
  isShowConfirm.value = false;
  try {
    await SuitService.deleteRecords({ borrow_id: source.value.id });
    emit("cancel");
  } catch (e) {
    if (e instanceof RequestError)
      Taro.showToast({ title: `取消申请失败: ${e.message}`, icon: "none" });
  }
};

const handleLoadFinish = ({ detail: { height, width } }) => {
  if (height > width) needFixWidth.value = false;
  else needFixWidth.value = true;
};

const timeFormat = (time: string) => {
  return dayjs(time).format("YYYY/MM/DD HH:mm");
};

const timeCount = (borrow_time: string) => {
  let secondDuring = (dayjs(borrow_time).add(7, "day").unix()) - (dayjs().unix());
  if (isOverTime.value == true) {
    secondDuring = (dayjs().unix()) - (dayjs(borrow_time).add(7, "day").unix());
  }
  const setHours = Math.floor(secondDuring / 60 / 60 % 24);
  const setDay = Math.floor(secondDuring / 60 / 60 / 24);
  if (Math.abs(setDay) > 0) {
    return setDay + "天\t";
  } else {
    return setHours + "小时\t";
  }
};

const timeDuring = (borrow_time: string, return_time: string) => {
  const secondDuring = (dayjs(return_time).unix() - dayjs(borrow_time).unix());
  const setHours = Math.floor(secondDuring / 60 / 60 % 24);
  const setDay = Math.floor(secondDuring / 60 / 60 / 24);
  if (Math.abs(setDay) > 0) {
    return setDay + "天\t";
  } else {
    return setHours + "小时\t";
  }
};
</script>

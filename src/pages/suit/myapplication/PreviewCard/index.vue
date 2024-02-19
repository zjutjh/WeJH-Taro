<template>
  <view :class="[
    styles.container,
    source.status === 1 || source.status === 2 ? styles.pend : (source.status === 3 ? styles.loan : styles.complete)
  ]">
    <view :class="styles.header" v-if="source.status === 1 || source.status === 2">
      <view :class="styles.title">
        我的申请
      </view>
      <view :class="styles['icon-box']" v-show="source.status == 2">
        <icon type="warn" color="#f0ad3e"/>
        <view class="desc"><text>被驳回</text></view>
      </view>
      <text :class="styles.time">
        {{ timeFormat(source.apply_time) }}
      </text>
    </view>
    <view :class="styles.header" v-if="source.status === 3">
      <view :class="styles.title">
        我的申请
      </view>
      <view :class="styles['icon-box']" v-show="isOverTime">
        <icon type="warn" color="#f0ad3e" size="20"/>
        <view class="desc"><text>已超时</text></view>
      </view>
      <text :class="styles.time">
        借用时间:{{ timeFormat(source.borrow_time) }}
      </text>
    </view>
    <view :class="styles.header" v-if="source.status === 4">
      <view :class="styles.title">
        我的申请
      </view>
      <text :class="styles.time">
        借用时间:{{ timeFormat(source.borrow_time) }}
      </text>
    </view>
    <view :class="styles.body"  v-if="source.status === 1 || source.status === 2"  >
      <view :class="styles['flex-container']" style="display: flex;">
        <view :class="styles['img-list']">
          <view :class="[styles['img-container']]">
            <view
              :key="`${source.id}-${item}`"
              v-for="item in imageList"
              :class="styles['img-wrapper']"
            >
              <image
                :class="styles.image"
                style="width: 125Px ;height: 200Px"
                mode="aspectFill"
                :src="item"
                @tap="() => handlePreviewImages(item)"
                :onLoad="handleLoadFinish"
              />
            </view>
          </view>
        </view>
        <view :class="styles.content" class="flex-column">
          <text space="emsp" v-show="source.id" :class="styles.text">
            ID  {{ source.id }}
          </text>
          <text space="emsp" v-show="source.kind" :class="styles.text">
            类别  {{ source.kind }}
          </text>
          <text space="emsp" v-show="source.name" :class="styles.text">
            名称  {{ source.name }}
          </text>
          <text space="emsp" v-show="source.spec" :class="styles.text">
            规格  {{ source.spec }}
          </text>
          <text space="emsp" v-show="source.count" :class="styles.text">
            数量  {{ source.count }}
          </text>
          <WButton :class="styles.button" @tap="() => handleClick()">取消申请</WButton>
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
                  callback: onConfirm
                }
              }"
          ></modal>
        </view>
      </view>
    </view>
    <view :class="styles.body"  v-if="source.status === 3"  >
      <view :class="styles['flex-container']">
        <view :class="styles['img-list']">
          <view :class="[styles['img-container']]">
            <view
              :key="`${source.id}-${item}`"
              v-for="item in imageList"
              :class="styles['img-wrapper']"
            >
              <image
                :class="styles.image"
                style="width: 125Px ;height: 200Px"
                mode="aspectFill"
                :src="item"
                @tap="() => handlePreviewImages(item)"
                :onLoad="handleLoadFinish"
              />
            </view>
          </view>
        </view>
        <view :class="styles.content" class="flex-column">
          <text space="emsp" v-show="source.id" :class="styles.text">
            ID  {{ source.id }}
          </text>
          <text space="emsp" v-show="source.kind" :class="styles.text">
            类别  {{ source.kind }}
          </text>
          <text space="emsp" v-show="source.name" :class="styles.text">
            名称  {{ source.name }}
          </text>
          <text space="emsp" v-show="source.spec" :class="styles.text">
            规格  {{ source.spec }}
          </text>
          <text space="emsp" v-show="source.count" :class="styles.text">
            数量  {{ source.count }}
          </text>
          <text space="emsp" v-show="source.count" :class="styles.text">
            剩余时间  {{ timeCount(source.borrow_time)}}
          </text>
        </view>
      </view>
    </view>
    <view :class="styles.body"  v-if="source.status === 4"  >
      <view :class="styles['flex-container']">
        <view :class="styles['img-list']">
          <view :class="[styles['img-container']]">
            <view
              :key="`${source.id}-${item}`"
              v-for="item in imageList"
              :class="styles['img-wrapper']"
            >
              <image
                :class="styles.image"
                style="width: 135Px ;height: 200Px"
                mode="aspectFill"
                :src="item"
                @tap="() => handlePreviewImages(item)"
                :onLoad="handleLoadFinish"
              />
            </view>
          </view>
        </view>
        <view :class="styles.content" class="flex-column">
          <text space="emsp" v-show="source.id" :class="styles.text">
            ID  {{ source.id }}
          </text>
          <text space="emsp" v-show="source.kind" :class="styles.text">
            类别  {{ source.kind }}
          </text>
          <text space="emsp" v-show="source.name" :class="styles.text">
            名称  {{ source.name }}
          </text>
          <text space="emsp" v-show="source.spec" :class="styles.text">
            规格  {{ source.spec }}
          </text>
          <text space="emsp" v-show="source.count" :class="styles.text">
            数量  {{ source.count }}
          </text>
          <text space="emsp" v-show="source.return_time" :class="styles.text">
            归还时间  {{ timeFormat(source.return_time) }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { SuitApplyRecord } from "@/types/Suit";
import { toRefs,computed,ref } from "vue";
import { useRequest } from "@/hooks";
import { SuitService } from "@/services";
import { WButton } from "@/components";
import  Modal from "./Modal/index.vue";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import styles from "./index.module.scss";

const props =defineProps<{
  source:SuitApplyRecord;
}>();
const isShowConfirm = ref(false);
const needFixWidth = ref(false);
const imageList = computed(() => [
  source.value?.img || "https://api.cnpatrickstar.com/img/2838e4c8-7ab0-4ef6-b2fb-2e88b3732af8.jpg",
].filter(item => !!item) as string[]);
const {source} = toRefs(props);
const emit = defineEmits(["isDelete"]);

const { run } = useRequest(
  SuitService.deleteRecords, {
    defaultParams:{
      borrow_id:source.value.id,
    },
    loadingDelay: 60,
    manual:true,
    onSuccess: (res) => {
      if (res.data.code === 1) {
        emit("isDelete","true");
      }else throw new Error(res.data.msg);
    },
    onError: (e:Error) =>{
      return `加载申请信息失败\r\n${e.message || "网络错误"}`;
    }
  },
);

const isOverTime = computed(() => {
  const agotime = dayjs().subtract(7, "day");
  return dayjs(source.value.borrow_time).isBefore(agotime);
});

const handlePreviewImages = (url:string) => {
  Taro.previewImage({
    current:url,
    urls:imageList.value
  });
};

const handleClick = () => {
  isShowConfirm.value =true;
};

const onCancel = () => {
  isShowConfirm.value =false;
};

const onConfirm = () => {
  isShowConfirm.value =false;
  run();
};

const handleLoadFinish = ({ detail: { height, width }}) => {
  if (height > width) needFixWidth.value = false;
  else needFixWidth.value = true;
};

const timeFormat= (time: string) => {
  return dayjs(time).format("YYYY/MM/DD HH:mm");
};

const timeCount= (borrow_time:string) => {
  const secondDuring =(dayjs(borrow_time).add(7,"day").unix())-(dayjs().unix());
  const setMinutes = (secondDuring%60);
  const setHours = Math.floor(secondDuring/60%60);
  const setDay = Math.floor(secondDuring/60/60%24);
  return setDay+"天"+setHours+"小时"+setMinutes+"分";
};
</script>

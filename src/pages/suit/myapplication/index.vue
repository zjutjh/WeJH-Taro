<template>
  <theme-config>
    <title-bar title="我的申请" back-button />
    <view :class="styles['campus-selector']">
      <view :class="styles['container']">
        <view :key="item" v-for="item in campusList" :class="[styles['campus'], selectCampus === item ? styles['active'] : undefined]"
          @tap="() => handleSelectCampus(item)">
          <text>{{ item }}</text>
        </view>
      </view>
    </view>
    <view :class="[styles['kind-selector'],'flex-column']">
      <view :class="styles['scroll-view']">
        <text>
          状态  |
        </text>
        <text :key="item" v-for="item in statusList"  :class="selectStatus === item ? styles['active'] : undefined"
          @tap="() => handleSelectStatus(item)">
          {{ item }}
        </text>
      </view>
    </view>
    <scroll-view lower-threshold="100" :scrollY="true" :class="styles['list-wrapper']">
      <view :class="styles['record-list']">
        <preview-card v-for="record in recordList" :source="record" :key=record.id @is-delete="needRefresh"/>
        <w-skeleton v-if="loading" :style="{ borderRadius: '8Px' }" />
        <card v-else-if="!recordList.length" && isEmpty>
          <text>该分类下暂无申请记录</text>
        </card>
      </view>
    </scroll-view>
  </theme-config>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
import { TitleBar, ThemeConfig } from "@/components";
import { ref } from "vue";
import { useRequest } from "@/hooks";
import { SuitService } from "@/services";
import { SuitApplyRecord } from "@/types/Suit";
import PreviewCard from "./PreviewCard/index.vue";
import { WSkeleton, Card } from "@/components";
import { omit } from "lodash-es";
import store, { serviceStore } from "@/store";

const recordList = ref<SuitApplyRecord[]>([]);
const campusList = ref<string[]>(["屏峰", "朝晖", "莫干山"]);
const statusList = ref<string[]>(["待处理", "借用中", "已完成"]);
const selectCampus = ref(serviceStore.suit.lastOpenCampus ||"朝晖");
const selectStatus = ref(serviceStore.suit.lastOpenStatus ||"待处理");
const isEmpty = ref(false);
const campusChange = { "朝晖": 1, "屏峰": 2, "莫干山": 3 }, statusChange = { "待处理": 1, "借用中": 3, "已完成": 4 };

const { loading, run } = useRequest(
  SuitService.getRecords, {
    defaultParams: {
      campus: campusChange[selectCampus.value],
      status: statusChange[selectStatus.value]
    },
    loadingDelay: 600,
    onSuccess: (res) => {
      if (res.data.code === 1) {
        recordList.value = recordList.value?.concat(
          res.data.data
        );
        if (recordList.value.length === 0) isEmpty.value = true;
      }else throw new Error(res.data.msg);
    },
    onError: (e:Error) =>{
      return `加载申请信息失败\r\n${e.message || "网络错误"}`;
    }
  }
);

const getRecords = (data: {
  campus?: string;
  status?: string;
}) => {
  isEmpty.value = false;
  run(omit(data, [data.status === "待处理" ? "kind" : null,]));
};

const handleSelectCampus = (campus: string) => {
  if (selectCampus.value === campus) return;
  selectCampus.value = campus;
  store.commit("setLastOpenCampus", campus);
  resetList();
  getRecords({
    campus: campusChange[campus],
    status: statusChange[selectStatus.value],
  });
};
const handleSelectStatus = (status: string) => {
  if (selectStatus.value === status) return;
  selectStatus.value = status;
  store.commit("setLastOpenMain", status);
  resetList();
  getRecords({
    campus: campusChange[selectCampus.value],
    status: statusChange[selectStatus.value],
  });
};
const resetList = () => {
  recordList.value = [];
};

const needRefresh = () =>{
  console.log("1");
  resetList();
  getRecords({
    campus: campusChange[selectCampus.value],
    status: statusChange[selectStatus.value],
  });
};
</script>

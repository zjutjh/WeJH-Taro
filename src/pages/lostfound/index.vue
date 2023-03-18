<template>
  <view class="background">
    <title-bar title="失物寻物" back-button />
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
    <view class="kind-selector">
      <view class="legend">
        <text>分类</text>
      </view>
      <view class="scroll-view">
        <text
          v-for="item in kindList"
          :key="item"
          :class="selectKind === item ? 'active': undefined"
          @tap="() => handleSelectKind(item)"
        >
          {{ item }}
        </text>
      </view>
    </view>
    <scroll-view
      lower-threshold="100"
      :scrollY="true"
      class="list-wrapper"
      :onScrolltolower="handleScrollToBottom"
    >
      <view class="record-list">
        <preview-card
          v-for="item in recordList"
          :source="item"
          :key="item.id"
        />
        <w-skeleton v-if="loading" :style="{borderRadius: '8Px'}"/>
        <card v-else-if="!recordList.length && isEmpty">
          <text>该分类下暂无失物寻物记录</text>
        </card>
      </view>
    </scroll-view>
    <contact-me />
  </view>
</template>

<script setup lang="ts">
import { TitleBar } from "@/components";
import { useRequest } from "@/hooks";
import { LostfoundService } from "@/services";
import { LostfoundRecord } from "@/types/Lostfound";
import { ref, computed } from "vue";
import PreviewCard from "./PreviewCard/index.vue";
import ContactMe from "./ContactMe/index.vue";
import { WSkeleton, Card } from "@/components";
import { omit } from "lodash-es";
import "./index.scss";

const currentPage = ref(0);
const maxPage =ref(0);
const recordList = ref<LostfoundRecord[]>([]);
const campusList = ref<string[]>(["屏峰", "朝晖", "莫干山"]);
const selectKind = ref("全部");
const selectCampus = ref("屏峰");
const isEmpty = ref(false);

const { data: getKindsResponse } = useRequest(
  LostfoundService.getKindList, {
    onSuccess: (res) => {
      if (res.data.code !== 1) throw new Error(res.data.msg);
    },
    onError: (e: Error) => {
      return `获取分类失败\r\n${e.message || "网络错误"}`;
    }
  }
);

const { loading, run } = useRequest(
  LostfoundService.getRecords, {
    defaultParams: {
      campus: selectCampus.value,
      page_num: currentPage.value + 1,
      page_size: 10
    },
    loadingDelay: 300,
    onSuccess: (res) => {
      if (res.data.code === 1) {
        recordList.value = recordList.value?.concat(
          res.data.data.data
        );
        if (recordList.value.length === 0) isEmpty.value = true;
        maxPage.value = res.data.data.total_page_num;
        currentPage.value++;
      } else throw new Error(res.data.msg);
    },
    onError: (e: Error) => {
      return `加载失物寻物信息失败\r\n${e.message || "网络错误"}`;
    }
  }
);

const getRecords = (data: {
  campus?: string;
  kind?: string;
  page_num: number;
  page_size: number;
} ) => {
  isEmpty.value = false;
  run(omit(data, [data.kind === "全部"? "kind": null]));
};

const kindList = computed<string[]>(() => [
  "全部",
  ...(getKindsResponse.value?.data || [])
    .map(item => item.kind_name)
]);

const handleSelectCampus = (campus: string) => {
  if (selectCampus.value === campus) return;
  selectCampus.value = campus;
  resetList();
  getRecords({
    campus: campus,
    kind: selectKind.value,
    page_num: currentPage.value + 1,
    page_size: 10
  });
};

const handleSelectKind = (kind: string) => {
  if (selectKind.value === kind) return;
  selectKind.value = kind;
  resetList();
  getRecords({
    campus: selectCampus.value,
    kind,
    page_num: currentPage.value + 1,
    page_size: 10
  });
};

const resetList = () => {
  currentPage.value = 0;
  recordList.value = [];
};

const handleScrollToBottom = () => {
  if (loading.value || maxPage.value <= currentPage.value) return;
  else getRecords({
    campus: selectCampus.value,
    kind: selectKind.value,
    page_num: currentPage.value + 1,
    page_size: 10
  });
};

</script>

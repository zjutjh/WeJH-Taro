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
    <view class="list">
      <preview-card
        v-for="item in recordList"
        :source="item"
        :key="item.id"
      />
    </view>

  </view>
</template>

<script setup lang="ts">
import { TitleBar } from "@/components";
import { useRequest } from "@/hooks";
import { LostfoundService } from "@/services";
import { LostfoundRecord } from "@/types/Lostfound";
import { ref, computed } from "vue";
import PreviewCard from "./PreviewCard/index.vue";
import { omit } from "lodash-es";
import "./index.scss";

const currentPage = ref(0);
const maxPage =ref(0);
const recordList = ref<LostfoundRecord[]>([]);
const campusList = ref<string[]>(["屏峰", "朝晖", "莫干山"]);
const selectKind = ref("全部");
const selectCampus = ref("屏峰");

const { data: getKindsResponse } = useRequest(
  LostfoundService.getKindList
);

const { loading, run: getRecords } = useRequest(
  LostfoundService.getRecords, {
    defaultParams: {
      campus: selectCampus.value,
      page_num: currentPage.value + 1,
      page_size: 10
    },
    onSuccess: (res) => {
      if (res.data.code === 1) {
        recordList.value = recordList.value?.concat(
          res.data.data.data
        );
        maxPage.value = res.data.data.total_page_num;
      }
    }
  }
);

const kindList = computed<string[]>(() => [
  "全部",
  ...(getKindsResponse.value?.data
    .map(item => item.kind_name) || [])
]);

const handleSelectCampus = (campus: string) => {
  if (selectCampus.value === campus) return;
  selectCampus.value = campus;
  resetList();
  getRecords(omit({
    campus: campus,
    kind: selectKind.value,
    page_num: currentPage.value + 1,
    page_size: 10
  }, [selectKind.value === "全部" ? "kind": null]));
};

const handleSelectKind = (kind: string) => {
  if (selectKind.value === kind) return;
  selectKind.value = kind;
  resetList();
  getRecords(omit({
    campus: selectCampus.value,
    kind,
    page_num: currentPage.value + 1,
    page_size: 10
  }, [kind === "全部" ? "kind": null]));
};

const resetList = () => {
  currentPage.value = 0;
  recordList.value = [];
};

</script>

<template>
  <theme-config :show-bg-image="false">
    <title-bar title="失物寻物" back-button />
    <view class="campus-selector">
      <view class="container">
        <view
          v-for="item in campusList"
          :key="item"
          :class="['campus', selectCampus === item ? 'active' : undefined]"
          @tap="() => handleSelectCampus(item)"
        >
          <text>{{ item }}</text>
        </view>
      </view>
    </view>
    <view class="kind-selector flex-column">
      <view class="scroll-view">
        <text
          v-for="item in mainList"
          :key="item"
          :class="selectMain === item ? 'active': undefined"
          @tap="() => handleSelectMain(item)"
        >
          {{ item }}
        </text>
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
      :scroll-y="true"
      class="list-wrapper"
      @scrolltolower="handleScrollToBottom"
    >
      <view class="record-list">
        <preview-card
          v-for="item in recordList"
          :key="item.id"
          :source="item"
        />
        <w-skeleton v-if="loading" :style="{borderRadius: '8Px'}" />
        <card v-else-if="!recordList.length && isEmpty">
          <text>该分类下暂无失物寻物记录</text>
        </card>
      </view>
    </scroll-view>
    <contact-me :data="contactMsg.data" :message="contactMsg.message" @show-help="setHelp" />
    <w-modal
      v-model:show="isShowHelp"
      :content="`&emsp;&emsp;${helpContent}`"
    />
  </theme-config>
</template>

<script setup lang="ts">
import { ThemeConfig, TitleBar, Card, ContactMe, WSkeleton } from "@/components";
import { useRequest } from "@/hooks";
import { LostfoundService } from "@/services";
import { LostfoundRecord } from "@/types/Lostfound";
import { computed, ref } from "vue";
import PreviewCard from "./PreviewCard/index.vue";
import { omit } from "lodash-es";
import "./index.scss";
import store, { serviceStore } from "@/store";
import WModal from "../../components/Modal/index.vue";
import { helpText } from "@/constants/copywriting";

const currentPage = ref(0);
const maxPage = ref(0);
const recordList = ref<LostfoundRecord[]>([]);
const campusList = ref<string[]>(["屏峰", "朝晖", "莫干山"]);
const selectKind = ref("全部");
const selectCampus = ref(serviceStore.lostfound.lastOpenCampus || "屏峰");
const mainList = ref<string[]>(["全部", "失物", "寻物"]);
const selectMain = ref(serviceStore .lostfound.lastOpenMain || "全部");
const isEmpty = ref(false);
const helpContent = ref(helpText.lostfound);
const isShowHelp = ref(false);

const contactMsg = {
  data: [
    { content: "“For You”工程 朝晖校区 QQ: 2716709627" },
    { content: "“For You”工程 屏峰校区 QQ: 3252819828" },
    { content: "“For You”工程 莫干山校区 QQ: 2030219390" },
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
  ],
  message: "点击查看相关业务服务组织的联系方式"
};

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
      page_size: 10,
      lost_or_found: ""
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
  lost_or_found?: string;
}) => {
  isEmpty.value = false;
  run(omit(data, [data.kind === "全部" ? "kind" : null, data.lost_or_found === "全部" ? "lost_or_found" : ""]));
};

const kindList = computed<string[]>(() => [
  "全部",
  ...(getKindsResponse.value?.data || [])
    .map(item => item.kind_name)
]);

const handleSelectCampus = (campus: string) => {
  if (selectCampus.value === campus) return;
  selectCampus.value = campus;
  store.commit("setLastOpenCampus", campus);
  resetList();
  getRecords({
    campus: campus,
    kind: selectKind.value,
    page_num: currentPage.value + 1,
    page_size: 10,
    lost_or_found: selectMain.value
  });
};

const handleSelectMain = (main: string) => {
  if (selectMain.value === main) return;
  selectMain.value = main;
  store.commit("setLastOpenMain", main);
  resetList();
  getRecords({
    campus: selectCampus.value,
    kind: selectKind.value,
    page_num: currentPage.value + 1,
    page_size: 10,
    lost_or_found: main
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
    page_size: 10,
    lost_or_found: selectMain.value
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
    page_size: 10,
    lost_or_found: selectMain.value
  });
};

const setHelp = () => {
  isShowHelp.value = true;
};
</script>
